import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Place } from '../data/map_places';

export interface WishlistItem {
    id: string;
    name: string;
    region: string;
    category: string;
    image?: string;
}

export const useWishlist = () => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWishlist = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            // 1. Try to load from server if logged in
            if (session && !sessionError) {
                try {
                    const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/wishlist`, {
                        headers: { 
                            'Authorization': `Bearer ${publicAnonKey}`,
                            'x-user-token': session.access_token,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data)) {
                            setWishlist(data);
                            return; 
                        }
                    } else {
                        throw new Error('Server returned ' + res.status);
                    }
                } catch (e) {
                    console.error('Server fetch failed', e);
                    setError('Failed to load wishlist from server');
                    // Do not fallback to local storage for auth users to ensure data consistency
                    return;
                }
            }

            // 2. Guest mode: use local storage
            const localWishlist = localStorage.getItem('kendala_wishlist');
            if (localWishlist) {
                setWishlist(JSON.parse(localWishlist));
            } else {
                setWishlist([]);
            }

        } catch (e) {
            setError('Failed to load wishlist');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleWishlist = async (place: Place, regionId: string) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const isLiked = wishlist.some(item => item.id === place.id);
            let newWishlist = [...wishlist];

            if (isLiked) {
                newWishlist = newWishlist.filter(item => item.id !== place.id);
            } else {
                const newItem: WishlistItem = {
                    id: place.id,
                    name: place.name.en, // Default to EN for now, can be updated to respect locale
                    region: regionId, // Use the region context
                    category: place.type,
                    image: place.image
                };
                newWishlist.push(newItem);
            }

            const { data: { session } } = await supabase.auth.getSession();
            
            // 1. Save to Server if logged in
            if (session) {
                // If removing
                if (isLiked) {
                    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/wishlist/${place.id}`, {
                        method: 'DELETE',
                        headers: { 
                            'Authorization': `Bearer ${publicAnonKey}`,
                            'x-user-token': session.access_token,
                            'Content-Type': 'application/json'
                        }
                    });
                } else {
                    // If adding
                    const newItem = newWishlist.find(item => item.id === place.id);
                    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/wishlist`, {
                        method: 'POST',
                        headers: { 
                            'Authorization': `Bearer ${publicAnonKey}`,
                            'x-user-token': session.access_token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newItem)
                    });
                }
                // For auth users, we update state but do NOT save to local storage
                // to prevent data mismatch.
                setWishlist(newWishlist);
                return !isLiked;
            } 
            
            // 2. Guest Mode: Update local storage
            localStorage.setItem('kendala_wishlist', JSON.stringify(newWishlist));
            setWishlist(newWishlist);
            
            return !isLiked; // Return new state (true = liked, false = unliked)

        } catch (e) {
            setError('Failed to update wishlist');
            console.error(e);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const isLiked = (placeId: string) => {
        return wishlist.some(item => item.id === placeId);
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    return {
        wishlist,
        isLoading,
        error,
        fetchWishlist,
        toggleWishlist,
        isLiked
    };
};
