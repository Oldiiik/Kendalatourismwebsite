export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  activity: string;
  type: 'travel' | 'stay' | 'activity' | 'food';
  cost: number;
  location: string;
  notes?: string;
  image?: string;
}

export interface Trip {
    id: string;
    destination: string;
    region: string;
    startDate: string;
    endDate: string;
    status: string;
    days: number;
    items: ItineraryItem[];
    title: string;
    date_range: string;
    date_created?: string;
}
