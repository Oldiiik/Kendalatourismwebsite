# Kendala - Premium Travel Platform Documentation

## 1. Project Overview
"Kendala" is a premium, trilingual (English, Russian, Kazakh) travel platform designed to promote tourism in Kazakhstan. It features a strict "brutalist" design aesthetic (sharp corners, high contrast) and offers a rich, interactive experience for users to explore the country's culture, nature, and history.

## 2. Tech Stack
- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS v4 (Strict adherence to `rounded-none`)
- **Animation**: Motion (formerly Framer Motion) for page transitions and micro-interactions
- **Backend & Auth**: Supabase (Auth, Edge Functions, Database, Storage)
- **Maps**: Google Maps JavaScript API (with Advanced Markers)
- **Icons**: Lucide React
- **State Management**: React Context API (`SeasonContext`, `LanguageContext`, `TripContext`)

## 3. Project Structure
```
/
├── App.tsx                 # Main application entry point and router
├── data_localized.ts       # Central repository for localized static content
├── components/
│   ├── pages/              # Main page components (views)
│   ├── ui/                 # Reusable UI atoms (Buttons, Cards, etc.)
│   ├── navigation/         # Sidebar and navigation logic
│   ├── effects/            # Visual effects (Particles, overlays)
│   └── data/               # Specific data files (map places, news)
├── contexts/               # React Context Providers
├── hooks/                  # Custom React Hooks
├── utils/                  # Helper functions
└── supabase/
    └── functions/          # Backend Edge Functions
```

## 4. Core Features & Functions

### 4.1 Navigation & Routing (`App.tsx`)
The application uses a custom state-based router instead of `react-router-dom` to ensure seamless transitions and tighter control over the "app-like" feel.
- **`currentPage` state**: Controls which component is rendered.
- **`handleNavigate` function**: Manages page transitions and checks authentication for protected routes.
- **`VerticalSidebar`**: The main navigation component, offering access to all major sections.

### 4.2 Interactive Map (`/components/pages/InteractiveMapPage.tsx`)
A fully immersive Google Maps integration designed for exploration.
- **`MapInner` Component**: The core map logic.
- **Google Maps Config**:
    - Uses `AdvancedMarkerElement` for custom, high-performance markers.
    - Custom map styles (silver/retro) to match the "Golden Steppe" theme.
    - **Street View**: Integrated directly into the UI, allowing users to drop into a location seamlessly.
    - **Filters**: Users can filter places by type (Sacred, Nature, History).
- **Data Source**: `/components/data/map_places.ts` contains the coordinates and metadata for all map markers.

### 4.3 News & Journal (`/components/pages/NewsPage.tsx`)
A dynamic news feed simulating a high-end travel magazine.
- **Data Source**: Uses a hardcoded but realistic dataset of 30 trilingual articles (defined within the component or imported).
- **Localization**: Articles automatically switch title, summary, and content based on the selected language (`en`, `ru`, `kz`).
- **Features**:
    - **"Live" Badge**: Visual indicator of real-time updates (removed in recent updates for a cleaner look).
    - **Article Detail Modal**: A full-screen reading experience with parallax hero images and rich text formatting.
    - **Stats Generator**: `getStatsForArticle` function pseudo-randomly generates view and like counts based on the article ID to simulate engagement.

### 4.4 Localization (`/contexts/LanguageContext.tsx`)
- **`LanguageProvider`**: Wraps the app and provides the current language state (`en`, `ru`, `kz`).
- **`t(key)` function**: A helper function to retrieve localized strings from the dictionary.
- **Content Strategy**: All major content blocks in `data_localized.ts` and `ARTICLES` are objects with keys for each language.

### 4.5 Theming & Seasonality (`/contexts/SeasonContext.tsx`)
The app's visual identity changes based on the "Season" selected by the user.
- **`SeasonProvider`**: Manages the active season (Winter, Spring, Summer, Autumn).
- **Theme Injection**: Updates CSS variables and Tailwind colors dynamically.
- **`SeasonalParticles`**: Renders canvas-based particle effects (snow, blossoms, fireflies, leaves) matching the current season.

### 4.6 Trip Planner (`/components/pages/TripPlannerPage.tsx`)
A tool for users to build itineraries.
- **Drag-and-Drop**: Users can drag locations from the "Wishlist" into a timeline.
- **Storage**: Trips are saved to Supabase (if authenticated) or LocalStorage (for guests).
- **PDF Export**: Generates a PDF summary of the trip.

### 4.7 Authentication (`/components/pages/AuthPage.tsx`)
- Integrated with Supabase Auth.
- Supports Email/Password login.
- **`RitualGuard`**: A component that wraps protected routes, ensuring only authenticated users can access them.

## 5. Data Management

### `data_localized.ts`
The backbone of the app's static content. It exports a `localizedData` object containing:
- **`hero`**: Headlines and subheads for the Home Page.
- **`regions`**: Detailed descriptions of Kazakhstan's regions (Almaty, Astana, etc.).
- **`culture`**: Articles on traditions, food, and music.
- **`ui`**: Common UI labels (buttons, nav items).

### `map_places.ts`
An array of `Place` objects for the map:
```typescript
interface Place {
  id: string;
  name: LocalizedString;
  lat: number;
  lng: number;
  type: 'sacred' | 'nature' | 'history';
  image: string;
  desc: LocalizedString;
  // ...
}
```

## 6. Key Utility Functions

- **`useImagePreconnect`**: Adds `<link rel="preconnect">` tags for Unsplash to speed up image loading.
- **`hq(url)`**: A helper to request high-quality, optimized versions of Unsplash images.
- **`SafeMarkdown`**: A wrapper around `react-markdown` to prevent crashes when rendering rich text content within the Figma environment.

## 7. Backend (Supabase Edge Functions)

The backend logic is minimal, focusing on secure operations and third-party API proxying.
- **`maps-config`**: Securely delivers the Google Maps API key to the frontend without exposing it in the client bundle.
- **`kv_store`**: A simple Key-Value store for persisting user preferences or simple data if a full database table isn't required.

## 8. Design Guidelines (Brutalism)
- **Border Radius**: Strictly `0px` or `rounded-none`. No soft curves.
- **Typography**: Bold, uppercase headings. High contrast.
- **Layout**: Grid-based, distinct separators, "editorial" feel.
- **Colors**: Derived from the `SeasonContext` (e.g., Ice Blue for Winter, Gold for Summer).
