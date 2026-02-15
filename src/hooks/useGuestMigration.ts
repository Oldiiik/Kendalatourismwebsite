import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { Trip } from '../components/pages/plannerTypes';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface MigrationStatus {
  isMigrating: boolean;
  error: Error | null;
}

export const useGuestMigration = (): MigrationStatus => {
  const [status, setStatus] = useState<MigrationStatus>({ 
    isMigrating: false, 
    error: null 
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await migrateGuestData(session.access_token);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const migrateGuestData = async (token: string) => {
    const localData = localStorage.getItem('kendala_trips');
    
    if (!localData) return;

    try {
      const guestTrips: Trip[] = JSON.parse(localData);
      
      if (guestTrips.length === 0) return;
      
      setStatus({ isMigrating: true, error: null });
      console.log(`[Migration] Found ${guestTrips.length} guest trips. Uploading...`);

      const uploadPromises = guestTrips.map(trip => {
        return fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/bookings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'x-user-token': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: trip.title,
            destination: trip.destination,
            date_range: trip.date_range,
            items: trip.items || []
          })
        }).then(res => {
            if (!res.ok) throw new Error(`Failed to upload trip: ${trip.title}`);
            return res.json();
        });
      });

      await Promise.all(uploadPromises);

      localStorage.removeItem('kendala_trips');
      console.log('[Migration] Success. Local storage cleared.');
      
      setStatus({ isMigrating: false, error: null });

    } catch (err) {
      console.error('[Migration] Failed:', err);
      setStatus({ isMigrating: false, error: err as Error });
    }
  };

  return status;
};