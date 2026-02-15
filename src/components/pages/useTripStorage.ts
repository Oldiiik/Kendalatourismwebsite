import { useState, useCallback, useRef } from 'react';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { ItineraryItem, Trip } from './plannerTypes';

export const useTripStorage = () => {
    const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Use ref to always access the latest fetchTrips inside saveTrip/deleteTrip
    const fetchTripsRef = useRef<() => Promise<void>>();

    const fetchTrips = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        let serverTrips: Trip[] | null = null;
        let localTrips: Trip[] = [];
        
        try {
            // Load local storage trips first (always available)
            try {
                const localTripsStr = localStorage.getItem('kendala_trips');
                if (localTripsStr) {
                    localTrips = JSON.parse(localTripsStr);
                }
            } catch (e) {
                console.warn('[TripStorage] Failed to parse local trips:', e);
            }
            
            // Try server if logged in
            try {
                const { data, error: sessionError } = await supabase.auth.getSession();
                const session = data?.session;
                
                if (session?.access_token && !sessionError) {
                    const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/bookings`, {
                        headers: { 
                            'Authorization': `Bearer ${publicAnonKey}`,
                            'x-user-token': session.access_token,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data)) {
                            serverTrips = data;
                            console.log(`[TripStorage] Server returned ${data.length} trips`);
                        }
                    } else {
                        console.warn(`[TripStorage] Server returned ${res.status}, falling back to local`);
                    }
                }
            } catch (e) {
                console.warn('[TripStorage] Server fetch failed, using local:', e);
            }

            // Merge strategy: server trips take priority, but include local-only trips
            if (serverTrips !== null) {
                const serverIds = new Set(serverTrips.map(t => t.id));
                const localOnly = localTrips.filter(t => !serverIds.has(t.id));
                const merged = [...serverTrips, ...localOnly];
                setSavedTrips(merged);
                console.log(`[TripStorage] Merged: ${serverTrips.length} server + ${localOnly.length} local-only = ${merged.length} total`);
            } else {
                // No server access — use local trips
                setSavedTrips(localTrips);
                console.log(`[TripStorage] Using ${localTrips.length} local trips`);
            }

        } catch (e) {
            setError('Failed to load trips');
            console.error('[TripStorage] fetchTrips error:', e);
            // Even on error, try to show local trips
            if (localTrips.length > 0) {
                setSavedTrips(localTrips);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // Keep ref in sync
    fetchTripsRef.current = fetchTrips;

    const saveTrip = useCallback(async (trip: Partial<Trip>, currentId: string | null): Promise<string | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            // Prepare trip object
            const tripData = {
                ...trip,
                items: trip.items || [],
                title: trip.title || 'Untitled Trip',
                destination: trip.destination || '',
                date_range: trip.date_range || '',
            };

            // 1. Save to Server if logged in
            if (session?.access_token) {
                const url = `https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/bookings${currentId ? `/${currentId}` : ''}`;
                const method = currentId ? 'PUT' : 'POST';
                
                const res = await fetch(url, {
                    method,
                    headers: { 
                        'Authorization': `Bearer ${publicAnonKey}`,
                        'x-user-token': session.access_token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(tripData)
                });

                if (res.ok) {
                    const result = await res.json();
                    const newId = result.booking ? result.booking.id : currentId;
                    console.log(`[TripStorage] Saved to server, id: ${newId}`);
                    // Also mirror to localStorage for offline access
                    try {
                        const localTripsStr = localStorage.getItem('kendala_trips');
                        const localTrips: Trip[] = localTripsStr ? JSON.parse(localTripsStr) : [];
                        const fullTrip = { ...tripData, id: newId, date_created: new Date().toISOString(), region: tripData.destination || '', startDate: '', endDate: '', status: 'planned', days: (tripData as any).days || 1 } as Trip;
                        const idx = localTrips.findIndex(t => t.id === newId);
                        if (idx >= 0) localTrips[idx] = fullTrip;
                        else localTrips.push(fullTrip);
                        localStorage.setItem('kendala_trips', JSON.stringify(localTrips));
                    } catch (e) {
                        console.warn('[TripStorage] Failed to mirror to localStorage:', e);
                    }
                    await fetchTripsRef.current?.(); // Refresh list
                    return newId;
                } else {
                    const errText = await res.text().catch(() => 'Unknown error');
                    console.error(`[TripStorage] Server save failed (${res.status}):`, errText);
                    throw new Error('Server save failed');
                }
            } 
            
            // 2. Save to Local Storage (Guest)
            const localTripsStr = localStorage.getItem('kendala_trips');
            const trips: Trip[] = localTripsStr ? JSON.parse(localTripsStr) : [];
            
            const newId = currentId || crypto.randomUUID();
            const fullTrip: Trip = {
                ...tripData,
                id: newId,
                date_created: new Date().toISOString(),
                region: tripData.destination || '',
                startDate: '',
                endDate: '',
                status: 'planned',
                days: (tripData as any).days || 1
            } as Trip;

            const existingIndex = trips.findIndex(t => t.id === newId);
            if (existingIndex >= 0) {
                trips[existingIndex] = { ...trips[existingIndex], ...fullTrip };
            } else {
                trips.push(fullTrip);
            }

            localStorage.setItem('kendala_trips', JSON.stringify(trips));
            setSavedTrips(trips);
            console.log(`[TripStorage] Saved to localStorage, id: ${newId}, total: ${trips.length}`);
            return newId;

        } catch (e) {
            setError('Failed to save trip');
            console.error('[TripStorage] saveTrip error:', e);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteTrip = useCallback(async (id: string) => {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.access_token) {
                await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/bookings/${id}`, {
                    method: 'DELETE',
                    headers: { 
                        'Authorization': `Bearer ${publicAnonKey}`,
                        'x-user-token': session.access_token,
                        'Content-Type': 'application/json'
                    }
                });
            }

            // Always clean up local storage too
            try {
                const localTripsStr = localStorage.getItem('kendala_trips');
                if (localTripsStr) {
                    const trips: Trip[] = JSON.parse(localTripsStr);
                    const filtered = trips.filter(t => t.id !== id);
                    localStorage.setItem('kendala_trips', JSON.stringify(filtered));
                }
            } catch (e) {
                console.warn('[TripStorage] Failed to clean localStorage:', e);
            }
            
            await fetchTripsRef.current?.();
            return true;
        } catch (e) {
            console.error('[TripStorage] deleteTrip error:', e);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        savedTrips,
        isLoading,
        error,
        fetchTrips,
        saveTrip,
        deleteTrip
    };
};
