import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

/**
 * Checks if the current user has admin privileges by calling the admin stats endpoint.
 * Result is cached for the lifetime of the component.
 */
export function useIsAdmin(): boolean {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    let cancelled = false;

    const check = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token || cancelled) return;

        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/admin/stats`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'x-user-token': session.access_token,
            },
          }
        );

        if (!cancelled) {
          setIsAdmin(res.ok);
        }
      } catch {
        if (!cancelled) setIsAdmin(false);
      }
    };

    check();

    return () => { cancelled = true; };
  }, [user]);

  return isAdmin;
}
