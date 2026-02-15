export interface Attraction {
  id: string;
  name: string;
  region: string;
  priceFrom: number;
  rating: number;
  category: "Nature" | "Cities" | "Culture" | "Adventure" | "Lakes" | "Nomadic traditions";
  images: string[];
  shortDescription: string;
  longDescription: string;
  bestMonths: string[];
  coordinates: { lat: number; lng: number };
}

export interface Accommodation {
  id: string;
  name: string;
  type: "Yurt" | "Guesthouse" | "Hotel" | "Eco-lodge" | "Mountain shelter";
  price: number;
  rating: number;
  amenities: string[];
  region: string;
  gallery: string[];
  coordinates: { lat: number; lng: number };
}

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  activity: string;
  type: "travel" | "activity" | "meal" | "stay";
  cost: number;
}

export interface Phrase {
  category: string;
  kazakh: string;
  pronunciation: string;
  english: string;
}
