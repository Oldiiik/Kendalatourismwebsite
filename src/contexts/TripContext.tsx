import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { Trip, ItineraryItem } from '../components/pages/plannerTypes';
import { Tour } from '../components/data/tours_data';
import { useTripStorage } from '../components/pages/useTripStorage';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from './LanguageContext';

interface TripContextType {
    currentTrip: Trip;
    itinerary: ItineraryItem[];
    tripTitle: string;
    destination: string;
    dayCount: number;
    
    setItinerary: React.Dispatch<React.SetStateAction<ItineraryItem[]>>;
    setTripTitle: (title: string) => void;
    setDestination: (dest: string) => void;
    setDayCount: (days: number) => void;
    
    addTourToTrip: (tour: Tour, startDay: number, targetTripId?: string | 'NEW') => void;
    loadTrip: (trip: Trip) => void;
    createNewTrip: () => void;
    saveCurrentTrip: () => Promise<void>;
    
    savedTrips: Trip[];
    isLoading: boolean;
    deleteTrip: (id: string) => Promise<boolean>;
    refreshTrips: () => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
    const { language } = useLanguage();
    const { savedTrips, isLoading, fetchTrips, saveTrip, deleteTrip: storageDeleteTrip } = useTripStorage();

    // Default Empty Trip
    const defaultTrip: Trip = {
        id: '',
        title: '',
        destination: '',
        region: '',
        startDate: '',
        endDate: '',
        status: 'planning',
        days: 1,
        items: [],
        date_range: ''
    };

    const [currentTripId, setCurrentTripId] = useState<string | null>(null);
    const [tripTitle, setTripTitle] = useState('');
    const [destination, setDestination] = useState('');
    const [dayCount, setDayCount] = useState(1);
    const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

    // Refs to always read latest state (fixes stale closure in saveCurrentTrip)
    const stateRef = useRef({ tripTitle, destination, itinerary, dayCount, currentTripId });
    stateRef.current = { tripTitle, destination, itinerary, dayCount, currentTripId };

    // Init fetch
    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    // Construct current trip object for consumers
    const currentTrip: Trip = {
        ...defaultTrip,
        id: currentTripId || '',
        title: tripTitle,
        destination,
        days: dayCount,
        items: itinerary
    };

    const loadTrip = useCallback((trip: Trip) => {
        setCurrentTripId(trip.id);
        setTripTitle(trip.title);
        setDestination(trip.destination);
        setItinerary(trip.items || []);
        
        const maxDay = trip.items && trip.items.length > 0 
            ? Math.max(...trip.items.map(i => i.day)) 
            : 1;
        setDayCount(Math.max(trip.days || 1, maxDay));
    }, []);

    const createNewTrip = useCallback(() => {
        setCurrentTripId(null);
        setTripTitle('');
        setDestination('');
        setItinerary([]);
        setDayCount(1);
    }, []);

    const addTourToTrip = useCallback((tour: Tour, startDay: number, targetTripId?: string | 'NEW') => {
        // Determine which trip state to operate on
        let baseItinerary = stateRef.current.itinerary;
        let baseDayCount = stateRef.current.dayCount;
        
        if (targetTripId === 'NEW') {
            createNewTrip();
            baseItinerary = [];
            baseDayCount = 1;
        } else if (targetTripId && targetTripId !== (stateRef.current.currentTripId || 'current')) {
            const targetTrip = savedTrips.find(t => t.id === targetTripId);
            if (targetTrip) {
                baseItinerary = targetTrip.items || [];
                const maxDay = targetTrip.items && targetTrip.items.length > 0 
                    ? Math.max(...targetTrip.items.map(i => i.day)) 
                    : 1;
                baseDayCount = Math.max(targetTrip.days || 1, maxDay);
                
                setCurrentTripId(targetTrip.id);
                setTripTitle(targetTrip.title);
                setDestination(targetTrip.destination);
            }
        }

        const duration = tour.duration;
        
        const shiftedItinerary = baseItinerary.map(item => {
            if (item.day >= startDay) {
                return { ...item, day: item.day + duration };
            }
            return item;
        });

        const newItems: ItineraryItem[] = tour.itinerary.map(dayItem => ({
            id: crypto.randomUUID(),
            day: startDay + (Number(dayItem.day) - 1),
            time: '09:00',
            activity: dayItem.title[language],
            type: 'activity',
            cost: Math.round(tour.price / tour.duration),
            location: tour.region,
            notes: dayItem.desc[language],
            image: tour.image
        }));

        const finalItinerary = [...shiftedItinerary, ...newItems];
        setItinerary(finalItinerary);

        const newMaxDay = Math.max(...finalItinerary.map(i => i.day), baseDayCount + duration);
        setDayCount(newMaxDay);

        toast.success(`Added ${tour.title[language]} to Day ${startDay}`);
    }, [createNewTrip, savedTrips, language]);

    // saveCurrentTrip reads from ref to avoid stale closures
    const saveCurrentTrip = useCallback(async (silent: boolean = false) => {
        const { tripTitle: title, destination: dest, itinerary: items, dayCount: days, currentTripId: id } = stateRef.current;
        
        const tripData: Partial<Trip> = {
            title: title || 'Untitled Trip',
            destination: dest,
            items,
            days
        };
        
        console.log(`[TripContext] Saving trip: "${tripData.title}" with ${items.length} items, id: ${id || 'NEW'}`);
        
        const newId = await saveTrip(tripData, id);
        if (newId) {
            setCurrentTripId(newId);
            if (!silent) toast.success("Trip saved successfully");
        }
    }, [saveTrip]);

    // Auto-save effect
    useEffect(() => {
        const timer = setTimeout(() => {
            const { currentTripId, tripTitle, itinerary } = stateRef.current;
            if (currentTripId || (tripTitle && itinerary.length > 0)) {
                 saveCurrentTrip(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [tripTitle, destination, itinerary, dayCount, saveCurrentTrip]);

    const deleteTrip = useCallback(async (id: string) => {
        const success = await storageDeleteTrip(id);
        if (success && id === stateRef.current.currentTripId) {
            createNewTrip();
        }
        return success;
    }, [storageDeleteTrip, createNewTrip]);

    const refreshTrips = useCallback(async () => {
        await fetchTrips();
    }, [fetchTrips]);

    return (
        <TripContext.Provider value={{
            currentTrip,
            itinerary,
            tripTitle,
            destination,
            dayCount,
            setItinerary,
            setTripTitle,
            setDestination,
            setDayCount,
            addTourToTrip,
            loadTrip,
            createNewTrip,
            saveCurrentTrip,
            savedTrips,
            isLoading,
            deleteTrip,
            refreshTrips
        }}>
            {children}
        </TripContext.Provider>
    );
};

export const useTrip = () => {
    const context = useContext(TripContext);
    if (!context) {
        throw new Error('useTrip must be used within TripProvider');
    }
    return context;
};