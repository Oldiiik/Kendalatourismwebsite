# KENDALA - Full Platform Documentation

**Last Updated:** February 19, 2026
**Stack:** React 18 + Tailwind CSS v4 + Supabase (Edge Functions + KV Store) + Motion (Framer Motion) + Google Maps API + Gemini AI
**Languages Supported:** English (en), Russian (ru), Kazakh (kz)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [App Boot Sequence](#2-app-boot-sequence)
3. [Context Providers](#3-context-providers)
4. [Pages (All 14)](#4-pages)
5. [Navigation](#5-navigation)
6. [Reusable UI Components](#6-reusable-ui-components)
7. [Visual Effects](#7-visual-effects)
8. [Tools (Sub-Pages inside ToolsPage)](#8-tools)
9. [Data Layer](#9-data-layer)
10. [Hooks](#10-hooks)
11. [Supabase Backend (Edge Functions)](#11-supabase-backend)
12. [State Management (Zustand)](#12-state-management)
13. [Image & Asset Strategy](#13-image--asset-strategy)
14. [Architectural Rules & Conventions](#14-architectural-rules--conventions)
15. [File Tree Reference](#15-file-tree-reference)

---

## 1. Architecture Overview

Kendala is a premium travel platform for Kazakhstan. It is a single-page application (SPA) with no client-side router; navigation is handled by a `currentPage` state variable in `App.tsx` that switches between page components. All data persistence is dual-layer: localStorage for guests, Supabase KV store for authenticated users. The AI features are powered by Gemini 2.5 Flash via Supabase Edge Functions, and the map features use the Google Maps JavaScript API with the key fetched at runtime from a `/maps-config` endpoint.

### Provider Hierarchy (Root `App.tsx`)

```
<LanguageProvider>
  <SeasonProvider>
    <NotificationProvider>
      <TripProvider>
        <AppContent />
      </TripProvider>
    </NotificationProvider>
  </SeasonProvider>
</LanguageProvider>
```

### Authentication Flow

- Uses Supabase Auth (`supabase.auth.signInWithPassword` / admin `createUser`).
- `AppContent` checks for a session on mount via `supabase.auth.getSession()`.
- Listens to `onAuthStateChange` for real-time session updates.
- If the user is not authenticated and tries to access any page other than `home` or `auth`, they are redirected to `AuthPage`.
- On successful auth, the user is redirected to the Trip Planner.

---

## 2. App Boot Sequence

The app goes through a strict "ritual" boot sequence:

1. **GlobalPreloader** - A cinematic loading screen that preloads critical images (season backgrounds, hero images) using a priority manifest. It shows a progress bar and the Kendala branding. Once images are loaded or timeout (8s per image), it calls `onComplete()` and fades out.

2. **LanguageSelection** - Full-screen language picker. Three options: Kazakh, Russian, English. Each option shows a different Kazakhstan landscape background that transitions on hover. The selected language is saved to `localStorage('language')` and set via `useLanguage().setLanguage()`.

3. **SeasonSelection** - Full-screen season picker. Four cards (Winter, Spring, Summer, Autumn) with immersive background images, parallax effects, and seasonal metadata (temperature ranges, descriptions). The selected season determines the entire app's color palette, particle effects, and imagery. Saved to `localStorage('kendala_season')`.

4. **Auth Check** - If the user has a Supabase session, their preferences (language, season, theme variant) are loaded from the server and applied. If no session, they can browse `home` freely but are gated from other pages.

5. **Main App** - Once all three selections are made, the main app renders with the sidebar, page content, toast notifications, and seasonal particles.

---

## 3. Context Providers

### SeasonContext (`/contexts/SeasonContext.tsx`)

**Exports:** `SeasonProvider`, `useSeason()`, types `Season`, `ThemeVariant`, `SeasonTheme`

**State:**
- `season`: `'winter' | 'spring' | 'summer' | 'autumn' | null` - The active season.
- `themeVariant`: `'default' | 'dark' | 'vibrant' | 'monochrome'` - Sub-theme within the season.
- `vfxEnabled`: `boolean` - Toggle for particle effects.

**Theme Object (`SeasonTheme`):**
Each season x variant combination provides: `primary`, `primaryForeground`, `secondary`, `accent`, `background`, `text`, `textLight`, `cardBg`, `overlayBg`, `particles` (type of particle animation).

| Season | Primary Color | Particles |
|--------|--------------|-----------|
| Winter | `#00B4D8` (Cyan) | Snow |
| Spring | `#10B981` (Emerald) | Petals |
| Summer | `#F59E0B` (Amber) | Rain |
| Autumn | `#D97706` (Orange) | Leaves |

**Side Effects:** Sets CSS custom properties on `document.documentElement` (`--background`, `--foreground`, `--primary`, etc.) and toggles the `dark` class for dark mode.

**Persistence:** Reads/writes `kendala_season` and `kendala_theme_variant` to localStorage.

---

### LanguageContext (`/contexts/LanguageContext.tsx`)

**Exports:** `LanguageProvider`, `useLanguage()`, type `Language`

**State:**
- `language`: `'kz' | 'ru' | 'en'` - The active language.

**Functions:**
- `setLanguage(lang)` - Updates language, persists to `localStorage('language')`.
- `t(key)` - Translation lookup function. Takes a string key (e.g., `'home'`, `'places'`, `'select_season'`) and returns the localized string for the current language. Falls back to the key itself if not found.

**Translation Keys:** Contains 100+ keys covering navigation labels, season names/descriptions, page titles, tool labels, UI strings, form labels, etc. All three languages are defined inline in the context file.

---

### NotificationContext (`/contexts/NotificationContext.tsx`)

**Exports:** `NotificationProvider`, `useNotification()`

**Functions:**
- `notify(message, type)` - Shows a toast notification via `sonner`. Types: `'success'`, `'error'`, `'info'`, `'warning'`, `'action'`.
- `removeNotification(id)` - Dismisses a specific toast.

Toast styling is configured in `AppContent` with seasonal colors, custom icons (Leaf for success, Wind for info, Sun for warning, Mountain for error), and a minimalist uppercase aesthetic.

---

### TripContext (`/contexts/TripContext.tsx`)

**Exports:** `TripProvider`, `useTrip()`

**State:**
- `currentTrip` - The currently active trip being edited.
- `itinerary` - Array of `ItineraryItem` objects for the current trip.
- `tripTitle`, `destination`, `dayCount` - Editable fields for the current trip.
- `savedTrips` - All saved trips (from server + local).
- `isLoading` - Loading state for trip operations.

**Functions:**
- `setItinerary(items)` - Update itinerary items.
- `setTripTitle(title)` / `setDestination(dest)` / `setDayCount(days)` - Update trip metadata.
- `addTourToTrip(tour, startDay, targetTripId?)` - Imports a Tour's itinerary into a trip, shifting existing items as needed.
- `loadTrip(trip)` - Loads an existing saved trip for editing.
- `createNewTrip()` - Resets all state for a new blank trip.
- `saveCurrentTrip()` - Saves the current trip to Supabase (if authenticated) or localStorage.
- `deleteTrip(id)` - Deletes a trip.
- `refreshTrips()` - Re-fetches all trips.

**Auto-Save:** A 3-second debounce auto-saves the current trip whenever `tripTitle`, `destination`, `itinerary`, or `dayCount` changes.

---

## 4. Pages

The app has **14 distinct pages**, managed by the `Page` type in `App.tsx`:

```typescript
type Page = 'home' | 'places' | 'tours' | 'map' | 'ai' | 'culture' |
            'history' | 'news' | 'profile' | 'regions' | 'tools' |
            'stays' | 'planner' | 'auth';
```

### 4.1 HomePage (`/components/pages/HomePage.tsx`)

**Route:** `home` (default landing page, accessible without auth)
**Purpose:** Cinematic landing page that introduces Kendala and provides navigation to all major sections.

**Sections:**
- **Hero Section** - Full-viewport seasonal hero image with parallax scrolling, the Kendala brand tagline ("EXPLORE KAZAKHSTAN // NOMADIC HERITAGE"), and a call-to-action. Uses `NatureMagicOverlay` for seasonal ambient effects (frost glow, petal shimmer, etc.).
- **Feature Grid** - Three large cards linking to Places, Interactive Map, and AI Assistant. Each card has a hover-reveal image and description.
- **Nature Gallery** - A horizontal scroll gallery of Kazakhstan landscapes.
- **Tools Kit Preview** - Quick access to the Tools page.
- **Navigation CTAs** - Buttons to explore Regions, Tours, Culture, History, News, and Stays.

**Key Functions:**
- Parallax scrolling via `useScroll()` and `useTransform()` from Motion.
- Scroll-based opacity/position animations for all sections.
- Season-aware imagery and color theming.

---

### 4.2 PlacesPage (`/components/pages/PlacesPage.tsx`)

**Route:** `places` (requires auth)
**Purpose:** Browse and explore sacred sites, natural landmarks, and historical monuments across Kazakhstan.

**Features:**
- **Hero Banner** - Parallax header with the page title.
- **Filter Bar** - Filter places by category: All, Sacred, Nature, History.
- **Place Cards** - Grid of place cards showing image, name, type badge, and a heart/wishlist button.
- **Detail Modal** - Clicking a card opens a full-screen modal with the place's image, trilingual description, coordinates, and an "Add to Trip" button.
- **Wishlist Integration** - Uses `useWishlist()` to like/unlike places. Liked places are synced to Supabase for authenticated users.
- **Add to Trip** - Stores the selected place in `localStorage('kendala_pending_activity')` and can navigate to the Trip Planner.

**Data Source:** `PLACES` array from `/components/data/map_places.ts` (15+ places with trilingual names/descriptions, lat/lng coordinates, type classification, and Unsplash images).

---

### 4.3 RegionsPage (`/components/pages/RegionsPage.tsx`)

**Route:** `regions` (requires auth)
**Purpose:** Explore Kazakhstan by geographic region (North, South, East, West).

**Features:**
- **Region Selector** - Four large region cards, each with a hero image, name, climate data (temperature ranges, wind, humidity), and a curated list of places within that region.
- **Region Detail View** - Clicking a region expands it to show all places in that region as a grid of `PlaceCard` components.
- **Wishlist Integration** - Each place card has a heart button for wishlisting.
- **Climate Data** - Each region shows temperature range, average wind speed, humidity, and sunshine hours.
- **Place Cards** - `React.memo`-wrapped card components with hover effects and like toggling.

**Data Source:** `PLACES` from `map_places.ts`, `REGION_HERO_URLS` from `imageUrls.ts`.

---

### 4.4 ToursPage (`/components/pages/ToursPage.tsx`)

**Route:** `tours` (requires auth)
**Purpose:** Browse curated multi-day tour packages across Kazakhstan, view details, and add them to the Trip Planner.

**Features:**
- **Search & Filter** - Text search + region filter (All, North, South, West, East, Central, Almaty, Astana).
- **Tour Cards** - Each card shows: image, title, region, duration (days), price (USD), difficulty badge (Easy/Medium/Hard/Extreme), rating, and type.
- **Tour Detail Modal** - Full-screen modal with:
  - Hero image and metadata.
  - Long description (trilingual).
  - Day-by-day itinerary with expandable details.
  - "What's Included" and "What to Bring" lists.
  - Contact information (phone, email, website).
  - "Add to Trip" functionality with day selection and target trip picker.
- **Add to Trip Integration** - Uses `useTrip().addTourToTrip()` to merge a tour's itinerary into the active trip, automatically shifting existing items.

**Data Source:** `ALL_TOURS` from `/components/data/tours_data.ts`. Each tour has trilingual title/description/itinerary, pricing, difficulty, region, contacts, inclusions, and what-to-bring lists.

---

### 4.5 InteractiveMapPage (`/components/pages/InteractiveMapPage.tsx`)

**Route:** `map` (requires auth)
**Purpose:** Full-screen Google Maps experience with custom markers for all Kazakhstan landmarks, layer filtering, and Street View.

**Features:**
- **Google Maps Integration** - Uses `@react-google-maps/api` with the API key fetched at runtime from the `/maps-config` Supabase Edge Function (never hardcoded).
- **Custom Markers** - SVG markers for three categories: Sacred (star icon), Nature (mountain icon), History (compass icon). Each marker is color-coded and clickable.
- **Layer Controls** - Toggle visibility of Sacred, Nature, and History layers independently.
- **Sidebar (Desktop)** - Left panel with layer toggles and a scrollable list of all places. Clicking a place pans the map and opens its detail panel.
- **Place Detail Panel** - Shows place image, trilingual name/description, coordinates, and action buttons (Street View, Add to Wishlist, Add to Trip).
- **Street View Overlay** - Full-screen Street View experience with custom header showing place name and coordinates. Handles loading and error states gracefully.
- **Terrain Toggle** - Switch between roadmap and terrain map types.
- **Zoom Controls** - Custom floating zoom in/out/fit-all buttons.
- **Mobile Sidebar** - Slide-in overlay sidebar for mobile with the same functionality.
- **Mobile Bottom Card** - When a place is selected on mobile, a bottom sheet card appears with place info and action buttons.

**Map Styling:** Custom map styles (dark/light depending on theme variant) applied via `styles` prop.

---

### 4.6 AIAssistantPage (`/components/pages/AIAssistantPage.tsx`)

**Route:** `ai` (requires auth)
**Purpose:** AI-powered travel assistant with a chat interface and structured tool cards for specific travel planning tasks.

**Features:**
- **Chat Interface** - Real-time chat with Kendala AI (powered by Gemini 2.5 Flash). Messages are rendered with Markdown support via `react-markdown`.
- **Tool Cards** - Pre-built structured tools with input forms:
  - **Route Planner** - Plan a multi-day route (origin, destination, days, interests, budget).
  - **Culture Brief** - Get cultural etiquette tips for a specific region.
  - **Packing Advisor** - Get a packing list based on season, duration, and activity type.
  - **Safety Intel** - Get safety information and hazard warnings for a specific location.
  - **Budget Calculator** - Estimate trip costs based on destination, duration, style, and group size.
  - **Local Cuisine** - Discover regional dishes and food recommendations.
- **Prompt Templates** - Each tool has a structured prompt template that injects user inputs into a Gemini-optimized prompt.
- **Chat History** - Server-side chat history (last 50 messages) stored per user in KV store.
- **Add to Trip** - AI responses can suggest activities that the user can add directly to their active trip.

**Backend:** Calls `/ai/chat` Supabase Edge Function, which forwards to Gemini 2.5 Flash API.

---

### 4.7 CulturePage (`/components/pages/CulturePage.tsx`)

**Route:** `culture` (requires auth)
**Purpose:** Deep-dive into Kazakh cultural heritage: musical instruments, ancient lore, craftsmanship, cuisine, great historical figures, and national clothing.

**Features:**
- **Section Navigation** - Six sections: Musical Instruments, Ancient Lore, Craftsmanship, National Cuisine, Great Figures, National Clothing. Each section has a unique icon and label.
- **Item Grid** - Each section contains a grid of cultural items. Items show an image, name, and short description.
- **Item Detail Modal** - Full-screen split-layout modal (image left, content right on desktop; stacked on mobile):
  - Specifications table (material, origin, dimensions, etc.).
  - Multi-chapter "In-Depth Exploration" with rich text content.
  - Close button with proper z-indexing and mobile positioning (`mt-16 md:mt-0`).
- **Imported Figma Assets** - Musical instruments (Dombra, Kobyz, Zhetigen, Sherter, Sazsyrnay, Shankobyz, Dauylpaz, Adyrna) use imported PNG assets from Figma via `figma:asset` scheme.

**Data Source:** Trilingual culture data from `/components/data/CultureData.tsx`, which aggregates from `/components/data/culture/{en,ru,kz}.ts`. Images from `/components/data/culture/images.ts` and `unsplash_images.ts`.

---

### 4.8 HistoryPage (`/components/pages/HistoryPage.tsx`)

**Route:** `history` (requires auth)
**Purpose:** Cinematic timeline of Kazakhstan's history, from ancient civilizations to independence.

**Features:**
- **Vertical Timeline** - Scrollable timeline with era cards. Each era shows: year range, title, subtitle, and a hero image.
- **Era Detail Modal** - Clicking an era opens a full-screen modal with:
  - Hero image with overlay.
  - Title and subtitle.
  - Statistics grid (key facts and figures).
  - Multi-chapter content with rich text.
  - Image gallery.
- **Parallax Effects** - Scroll-driven parallax on hero images and timeline elements.
- **Scroll Animations** - Elements reveal on scroll using `useInView` and `useSpring`.

**Eras Covered:** Ancient (800-300 BC), Turkic Khaganate, Mongol Empire, Kazakh Khanate, Russian Empire, Soviet Era, Independence. All trilingual.

---

### 4.9 NewsPage (`/components/pages/NewsPage.tsx`)

**Route:** `news` (requires auth)
**Purpose:** News and editorial content about Kazakhstan travel, nature, and culture.

**Features:**
- **Featured Hero** - Large cinematic hero section with the featured article's image, title, and a "Read" button.
- **Category Filter** - Filter by category tabs (All, Nature, Culture, Travel, etc.).
- **Search** - Text search across article titles and summaries.
- **Article Grid** - Masonry-style grid of article cards with images, titles, dates, read times, and author info.
- **Article Detail Modal** - Full-screen z-[100] modal with:
  - Hero image.
  - Article summary and engagement bar (read time, location).
  - Multi-section article body with headings, text, quotes, statistics grids, and inline images.
  - Image gallery at the bottom.
  - Close button.
- **Load More** - Paginated loading of additional articles.

**Data Source:** `ALL_NEWS` from `/components/data/news_data.ts`. Each article has trilingual title/summary/content/sections, author info, category, date, read time, gallery, quotes, and statistics.

---

### 4.10 StaysPage (`/components/pages/StaysPage.tsx`)

**Route:** `stays` (requires auth)
**Purpose:** Browse and explore accommodations across Kazakhstan (resorts, hotels, yurts, eco-lodges, guesthouses).

**Features:**
- **Filter Bar** - Filter by type (All, Resort, Hotel, Yurt Camp, Eco-Lodge, Guesthouse).
- **Price Range Slider** - Filter by nightly price range.
- **Currency Selector** - Switch between USD, KZT, and RUB with automatic conversion.
- **Stay Cards** - Grid of accommodation cards showing: image, name, type badge, rating, price, region, and a selection of amenities icons.
- **Stay Detail Modal** - Full-screen portal modal with:
  - Hero image gallery.
  - Rating and price.
  - Full trilingual description.
  - Amenities grid with icons (WiFi, Coffee, Sun terrace, Parking, etc.).
  - Specifications (check-in time, altitude, season, etc.).
  - Inclusions list.
  - Contact information (phone, email, website).
  - Booking CTA.

**Data Source:** `localizedData` from `/data_localized.ts`, which contains 50 stays with trilingual names/descriptions, pricing, ratings, contacts, specs, and inclusions.

---

### 4.11 TripPlannerPage (`/components/pages/TripPlannerPage.tsx`)

**Route:** `planner` (requires auth, default post-login page)
**Purpose:** The core trip planning tool. Build day-by-day itineraries with drag-and-drop, budgeting, and 3D flyover visualization.

**Features:**
- **Trip Header** - Editable trip title and destination fields. Seasonal hero background.
- **Saved Trips Panel** - Slide-out panel listing all saved trips with load/delete actions.
- **Day Navigator** - Horizontal day tabs (Day 1, Day 2, ...) with add/remove day controls.
- **Itinerary Builder** - For each day, a list of activities with:
  - Drag-and-drop reordering via `Reorder` from Motion.
  - Time selector.
  - Activity name and location.
  - Type selector (Travel, Stay, Activity, Food) with icons.
  - Cost input.
  - Notes field.
  - Edit and delete buttons.
- **Add Activity Form** - Modal form to add a new activity to a specific day.
- **Budget Summary** - Real-time total cost calculation across all days.
- **Save Trip** - Manual save button (also auto-saves with 3s debounce).
- **Route Flyover** - "Play" button launches the `TripRouteFlyover` component - a 3D Google Maps flyover that animates along the trip's route, flying between locations.
- **Pending Activity Import** - Checks `localStorage('kendala_pending_activity')` for activities added from PlacesPage or ToursPage and auto-imports them.

**Data Types:**
```typescript
interface ItineraryItem {
  id: string; day: number; time: string; activity: string;
  type: 'travel' | 'stay' | 'activity' | 'food';
  cost: number; location: string; notes?: string; image?: string;
}

interface Trip {
  id: string; destination: string; region: string;
  startDate: string; endDate: string; status: string;
  days: number; items: ItineraryItem[];
  title: string; date_range: string; date_created?: string;
}
```

---

### 4.12 ProfilePage (`/components/pages/ProfilePage.tsx`)

**Route:** `profile` (requires auth)
**Purpose:** User profile management, trip history, wishlist, and app settings.

**Tabs:**
1. **Overview** - User info card with name, email, "Explorer Level", and seasonal background. Quick stats (total trips, wishlist count).
2. **Trips** - List of all saved trips with title, destination, date created, and status badges. Click to load in Trip Planner.
3. **Wishlist** - Grid of wishlisted places with images, names, regions, and remove buttons.
4. **Settings** - Configurable preferences:
   - **Profile Fields** - Name, phone, nationality, passport number, emergency contact. Saved to Supabase via `/profile` endpoint.
   - **Language Selector** - Switch between KZ/RU/EN.
   - **Season Selector** - Switch season (with visual preview icons).
   - **Theme Variant** - Switch between Default, Dark, Vibrant, Monochrome.
   - **Sign Out** - Calls `supabase.auth.signOut()`.

**Backend:** Reads/writes profile data via `/profile` endpoint. Reads trips via `/bookings`, wishlist via `/wishlist`.

---

### 4.13 AuthPage (`/components/pages/AuthPage.tsx`)

**Route:** `auth` (accessible without auth)
**Purpose:** Authentication page with seasonal theming and the `AuthTerminal` component.

**Layout:**
- **Left Panel (Desktop) / Top Section (Mobile)** - Cinematic seasonal landscape with brand elements:
  - Rotating season icon.
  - Season tagline (trilingual).
  - Large "Access" / "Вход" / "Кіру" title.
  - Seasonal quote.
  - Info grid (Sacred Records, Eternal Kinship descriptions).
  - "Return to Steppe" back button.
- **Right Panel (Desktop) / Main Section (Mobile)** - The `AuthTerminal` component with glassmorphism backdrop.

### AuthTerminal (`/components/auth/AuthTerminal.tsx`)

**Modes:** Login and Signup (toggle between them).

**Login Flow:**
1. User enters email and password.
2. Calls `supabase.auth.signInWithPassword()`.
3. On success, calls `onAuthSuccess()` which navigates to planner.

**Signup Flow:**
1. User enters name, email, and password.
2. Calls the `/signup` Supabase Edge Function (uses admin API to create user with auto-confirmed email).
3. Then auto-logs in with `signInWithPassword()`.

---

### 4.14 ToolsPage (`/components/pages/ToolsPage.tsx`)

**Route:** `tools` (requires auth)
**Purpose:** A collection of six practical travel tools, presented as a card grid with expandable tool panels.

**Tools Available:**
1. **Nomadic Navigator** (built into ToolsPage directly)
2. **Packing List** (`PackingList.tsx`)
3. **Travel Reality Check** (`TravelRealityCheck.tsx`)
4. **Culture Guide** (`CultureGuide.tsx`)
5. **Road Status** (`RoadStatus.tsx`)
6. **PDF Exporter** (`PdfExporter.tsx`)

*(See Section 8 for detailed tool descriptions)*

---

## 5. Navigation

### VerticalSidebar (`/components/navigation/VerticalSidebar.tsx`)

The main navigation component, visible on all pages except `home`.

**Structure:**
- **Hamburger Button** - Fixed position, toggles the sidebar open/closed.
- **Sidebar Panel** - Slides in from the left. Uses `z-40` (sidebar) / `z-50` (overlay).
- **Menu Items** - Organized into two categories:
  - **Function** (top): Trip Planner, AI Assistant, Interactive Map, Tools, User Guide, Profile/Login.
  - **Content** (bottom): Regions, Places, Tours, Stays, Culture, History, News.
- **Footer Actions:**
  - Season reset button (clears season, returns to season selection).
  - Home button.
  - Current season indicator.
- **Auth-Aware** - Shows "Profile" if logged in, "Login" if not.
- **Active Page Indicator** - Highlights the current page in the menu.

**Responsive Behavior:**
- Mobile: Full-screen overlay sidebar.
- Desktop: Narrower sidebar panel with backdrop.

---

## 6. Reusable UI Components

### GlobalPreloader (`/components/ui/GlobalPreloader.tsx`)
Cinematic app loading screen. Preloads critical images based on a priority manifest (critical > high > medium > low). Shows progress bar and brand animation. Adds `<link rel="preconnect">` hints for Unsplash.

### ResponsiveImage (`/components/ui/ResponsiveImage.tsx`)
Wrapper around `<img>` that provides:
- Automatic `srcSet` generation for Unsplash images (640w through 3840w).
- Lazy loading with IntersectionObserver (unless `priority` is set).
- Fade-in animation on load.
- Cache detection (skips animation if already cached).
- Placeholder color background while loading.

### Typewriter (`/components/ui/Typewriter.tsx`)
Animated text component that types out characters one by one. Props: `text`, `speed` (ms per character), `cursor` (show blinking cursor), `onComplete` callback.

### KendalaLogo (`/components/ui/KendalaLogo.tsx`)
SVG logo and wordmark components for the Kendala brand.

### PageTransition (`/components/ui/PageTransition.tsx`)
Wrapper component that applies entrance animations (fade + slide) to page content.

### Reveal / FadeIn / ScaleIn (`/components/ui/Reveal.tsx`)
Scroll-triggered animation wrappers using `useInView` from Motion. Elements animate in when they enter the viewport.

### UserGuide (`/components/ui/UserGuide.tsx`)
Multi-step onboarding guide modal. Shows a series of slides explaining the app's features (Map, Planner, AI, etc.) with seasonal imagery and navigation arrows.

### ImageWithFallback (`/components/figma/ImageWithFallback.tsx`)
**[PROTECTED - DO NOT MODIFY]** Drop-in replacement for `<img>` that handles loading errors gracefully with a fallback placeholder.

### shadcn/ui Primitives (`/components/ui/*.tsx`)
Full set of shadcn/ui components: Accordion, AlertDialog, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, Dialog, Drawer, DropdownMenu, Form, HoverCard, Input, Label, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toggle, ToggleGroup, Tooltip.

### Icons (`/components/ui/icons.tsx`)
Re-exports from `lucide-react` with some custom icon components.

### Motion (`/components/ui/motion.tsx`)
Motion/Framer Motion utility exports.

---

## 7. Visual Effects

### SeasonalParticles (`/components/effects/SeasonalParticles.tsx`)
Canvas-based particle system that renders season-appropriate particles:
- **Winter** - Falling snowflakes with drift.
- **Spring** - Floating flower petals.
- **Summer** - Firefly-like particles.
- **Autumn** - Falling leaves with spin.

Respects `vfxEnabled` from SeasonContext. Renders on a full-screen canvas with `pointer-events-none`.

### NatureMagicOverlay (`/components/effects/NatureMagicOverlay.tsx`)
Ambient visual overlay per season:
- **Winter** - Radial frost glow + breathing fog at the bottom.
- **Spring** - Green radial glow + pulsing warmth.
- **Summer** - Golden radial shimmer + heat haze.
- **Autumn** - Amber radial glow + mist.

Uses Motion for breathing/pulsing animations. Applied on the HomePage hero section.

---

## 8. Tools (Sub-Pages inside ToolsPage)

### 8.1 Nomadic Navigator (inline in ToolsPage)
**Purpose:** GPS-based celestial navigation tool that gives you a "star reading" based on your real-world location and compass heading.

**How It Works:**
1. Uses `navigator.geolocation.watchPosition()` to get real-time GPS coordinates.
2. Uses `DeviceOrientationEvent` to get compass heading.
3. Sends coordinates, heading, season, and language to the `/ai/starnav` Supabase endpoint.
4. Backend reverse-geocodes the location via Google Geocoding API, then asks Gemini to generate a "Celestial Reading" identifying a visible star/constellation and providing a navigational metaphor.
5. Displays the star name and reading in a mystical UI card.

**Fallback:** If geolocation fails, offers a "Force Almaty Location" button for testing.

### 8.2 PackingList (`/components/tools/PackingList.tsx`)
**Purpose:** Smart packing checklist generator.

**Features:**
- Pre-populated with season-appropriate items (different lists for winter vs. summer).
- Categories: Global essentials, seasonal gear.
- Weight tracking with a configurable weight limit (default 20kg).
- Progress bar showing packed weight vs. limit.
- Add custom items with name and weight.
- Check/uncheck items.
- Reset with confirmation.
- Persistent (items saved in component state).

### 8.3 TravelRealityCheck (`/components/tools/TravelRealityCheck.tsx`)
**Purpose:** Calculate real travel logistics between two cities in Kazakhstan.

**Features:**
- Input: Origin and destination cities (default: Almaty to Astana).
- Calls `/logistics/estimate` Supabase endpoint which:
  1. Gets real distance from Google Distance Matrix API.
  2. Uses Gemini to generate "Nomadic Context": time distortion, nomadic scale comparison, steppe wisdom.
- Output: Distance in km, travel times (plane, train, car), a "Nomadic Scale" comparison (e.g., "Like driving across France"), and a "Steppe Wisdom" warning.
- Language-aware (output in the user's selected language).

### 8.4 CultureGuide (`/components/tools/CultureGuide.tsx`)
**Purpose:** Quick-reference guide to Kazakh etiquette, common phrases, and cultural knowledge.

**Tabs:**
1. **Lexicon** - Essential Kazakh phrases with pronunciation guides.
2. **Etiquette** - Cultural do's and don'ts (tea culture, hospitality customs, yurt etiquette, elder respect).
3. **Quiz** - Interactive cultural knowledge quiz with multiple-choice questions and scoring.

### 8.5 RoadStatus (`/components/tools/RoadStatus.tsx`)
**Purpose:** Live weather-based road condition checker for major Kazakhstan cities.

**Features:**
- Pre-loaded cities: Almaty, Astana, Aktau, Shymkent, Karaganda, Oskemen, Atyrau, Turkestan.
- Add custom cities.
- Fetches live weather from OpenWeatherMap via the `/weather` Supabase endpoint.
- Displays: temperature, feels-like, humidity, pressure, wind speed/direction.
- Color-coded difficulty: GREEN (optimal), YELLOW (challenging), RED (dangerous).
- Localized warnings in KZ/RU/EN.
- Auto-refresh capability.

### 8.6 PdfExporter (`/components/tools/PdfExporter.tsx`)
**Purpose:** Generate a downloadable PDF "Ghost Protocol" survival brief for any location.

**How It Works:**
1. User enters a location (default: "Almaty, Kazakhstan").
2. Calls `/tools/protocol` Supabase endpoint which:
   - Fetches live weather from OpenWeatherMap.
   - Uses Gemini to generate a survival protocol (hazards, culture tip, gear check, emergency note).
3. Generates a PDF using `jsPDF` with:
   - Kendala branding.
   - Location and weather data.
   - Hazard list.
   - Culture tip.
   - Essential gear checklist.
   - Emergency note.
   - Static map image (fetched via `/proxy/static-map` endpoint).
4. Downloads the PDF automatically.

---

## 9. Data Layer

### map_places.ts (`/components/data/map_places.ts`)
- **Type:** `Place[]`
- **Count:** 15+ landmarks.
- **Fields:** `id`, `name` (trilingual), `type` (sacred/nature/history), `lat`, `lng`, `streetViewLat?`, `streetViewLng?`, `desc` (trilingual), `image` (Unsplash URL).
- **Used By:** InteractiveMapPage, PlacesPage, RegionsPage, TripRouteFlyover.

### tours_data.ts (`/components/data/tours_data.ts`)
- **Type:** `Tour[]` (exported as `ALL_TOURS`)
- **Fields:** `id`, `title` (trilingual), `region`, `type` (trilingual), `duration` (days), `price` (USD), `image`, `difficulty`, `description` (trilingual), `longDescription` (trilingual), `rating`, `itinerary[]` (day-by-day with trilingual title/desc), `included[]`, `notIncluded[]`, `whatToBring[]`, `contacts` (phone/email/website).
- **Used By:** ToursPage, TripContext.

### news_data.ts (`/components/data/news_data.ts`)
- **Type:** `LocalizedNewsArticle[]` (exported as `ALL_NEWS`)
- **Fields:** `id`, `category` (trilingual), `date`, `title` (trilingual), `summary` (trilingual), `content` (trilingual), `image`, `featured?`, `author` (name/role/avatar), `location` (trilingual), `readTime`, `sections[]` (heading/body/image/quote/stats, all trilingual), `gallery[]`.
- **Used By:** NewsPage.

### data_localized.ts (`/data_localized.ts`)
- **Type:** `Record<Language, { stays: StayData[] }>`
- **Count:** 50 stays.
- **Fields per stay:** `id`, trilingual names/types/descriptions, `image`, `price`, `rating`, `region`, `contacts`, `specs`, `inclusions`.
- **Used By:** StaysPage.

### CultureData.tsx (`/components/data/CultureData.tsx`)
- Aggregates trilingual culture data from `culture/en.ts`, `culture/ru.ts`, `culture/kz.ts`.
- **Sections:** Musical Instruments (8 instruments with multi-chapter histories, specs, images), Ancient Lore, Craftsmanship, National Cuisine, Great Figures, National Clothing.
- **Images:** Mix of Unsplash URLs and imported Figma PNGs (for instruments).
- **Used By:** CulturePage.

### types.ts (`/types.ts`)
Global type definitions for `Attraction`, `Accommodation`, `ItineraryItem`, `Phrase`.

### plannerTypes.ts (`/components/pages/plannerTypes.ts`)
Core trip planning types: `ItineraryItem` and `Trip`.

---

## 10. Hooks

### useAppEngine (`/hooks/useAppEngine.ts`)
Orchestrates auth readiness and guest data migration. Returns `{ isReady, isMigrating, migrationError, hasCompletedRitual }`.

### useGuestMigration (`/hooks/useGuestMigration.ts`)
On `SIGNED_IN` auth event, checks `localStorage('kendala_trips')` for any guest trips, uploads them to Supabase via `/bookings` POST, then clears localStorage. Returns `{ isMigrating, error }`.

### useImagePreloader (`/hooks/useImagePreloader.ts`)
Utility hook for preloading arrays of image URLs.

### useImagePreconnect (`/utils/useImagePreconnect.ts`)
Adds `<link rel="preconnect">` and `<link rel="dns-prefetch">` hints for Unsplash domains on mount.

### useTripStorage (`/components/pages/useTripStorage.ts`)
Low-level trip CRUD operations. Dual-layer: tries Supabase first (if authenticated), falls back to localStorage. Functions: `fetchTrips()`, `saveTrip(trip, currentId)`, `deleteTrip(id)`. Merges server and local trips (server takes precedence by ID).

### useWishlist (`/components/pages/useWishlist.ts`)
Wishlist CRUD. Dual-layer (Supabase + localStorage). Functions: `fetchWishlist()`, `toggleWishlist(place, regionId)`, `isLiked(placeId)`. Returns `{ wishlist, isLoading, error, fetchWishlist, toggleWishlist, isLiked }`.

### use-mobile (`/components/ui/use-mobile.ts`)
Simple mobile detection hook (screen width breakpoint).

---

## 11. Supabase Backend

### Edge Function Server (`/supabase/functions/server/index.tsx`)

A Hono-based edge function server with CORS enabled for all origins. All authenticated endpoints extract the user from the `x-user-token` header via `supabase.auth.getUser(token)`.

**Endpoints:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check, returns `{ status: "ok" }` |
| GET | `/maps-config` | No | Returns Google Maps API key from `env` table |
| GET | `/weather?city=X&lang=X` | No | Live weather for a city via OpenWeatherMap, with difficulty rating |
| GET | `/profile` | Yes | Get user profile from KV store |
| POST | `/profile` | Yes | Save user profile to KV store |
| GET | `/wishlist` | Yes | Get user's wishlist array from KV store |
| POST | `/wishlist` | Yes | Add item to wishlist (deduplicates by ID) |
| DELETE | `/wishlist/:id` | Yes | Remove item from wishlist |
| GET | `/bookings` | Yes | Get all trips for user from KV store |
| POST | `/bookings` | Yes | Create a new trip (auto-generates UUID + timestamp) |
| PUT | `/bookings/:id` | Yes | Update an existing trip |
| DELETE | `/bookings/:id` | Yes | Delete a trip |
| POST | `/ai/chat` | Yes | Chat with Kendala AI (Gemini 2.5 Flash). Stores last 50 messages. |
| POST | `/logistics/estimate` | Yes | Travel logistics calculator (Google Distance Matrix + Gemini) |
| POST | `/ai/starnav` | Yes | Celestial navigation reading (Google Geocoding + Gemini) |
| GET | `/proxy/static-map` | No | Proxies Google Static Maps API (hides API key) |
| POST | `/tools/protocol` | Yes | Ghost Protocol generator (OpenWeatherMap + Gemini) |
| POST | `/signup` | No | Create user via Supabase Admin API (auto-confirms email) |
| GET | `/preferences` | Yes | Get user preferences (language, season, themeVariant) |
| POST | `/preferences` | Yes | Save user preferences |
| POST | `/geocode-batch` | No | Batch geocode locations (Google Geocoding + Gemini fallback, max 25) |

### KV Store (`/supabase/functions/server/kv_store.tsx`)
Simple key-value abstraction over a Supabase table (`kv_store_3ab99f71`). Schema: `key TEXT PRIMARY KEY, value JSONB`. Functions: `get`, `set`, `del`, `mset`, `mget`, `mdel`, `getByPrefix`.

**Key Patterns:**
- `profile:{userId}` - User profile data
- `wishlist:{userId}` - User's wishlist array
- `bookings:{userId}` - User's trips array
- `chat_history:{userId}` - AI chat history array
- `preferences:{userId}` - User preferences object

### Weather Config (`/supabase/functions/server/weather_config.tsx`)
Sub-router for the `/weather` endpoint. Fetches from OpenWeatherMap, adds nomadic difficulty rating (GREEN/YELLOW/RED) based on temperature, wind speed, and weather codes. Returns trilingual warnings.

### Maps Config (`/supabase/functions/server/maps_config.tsx`)
Dedicated endpoint for Google Maps API key retrieval (fetched from `env` table, with fallback to environment variable).

---

## 12. State Management

### Zustand Store (`/store/useAppStore.ts`)

Persisted Zustand store (`kendala-ui-storage` in localStorage) with two slices:

**PlannerSlice:**
- `pendingActivity` - Temporary holder for an activity being transferred between pages (e.g., from PlacesPage to TripPlanner).
- `setPendingActivity(activity)` / `consumePendingActivity()` - Set and consume (read + clear) the pending activity.

**UiSlice:**
- `hasCompletedRitual` - Whether the user has completed the language + season selection ritual.
- `language` - Persisted language selection.
- `season` - Persisted season selection.
- `setRitualCompleted(bool)` / `setLanguage(lang)` / `setSeason(season)` - Setters.

**Persistence:** Only `hasCompletedRitual`, `language`, and `season` are persisted via `partialize`.

---

## 13. Image & Asset Strategy

### Unsplash Images
All photography comes from Unsplash. The `imageUrls.ts` utility provides:
- `buildImageUrl(url, width, quality)` - Appends optimized query params (`w`, `q`, `fm=webp`, `auto=format`, `fit=crop`).
- `buildSrcSet(url)` - Generates a full srcSet string for responsive images (640w to 3840w).
- `hq(url, width)` - Shorthand for high-quality image URL.
- Named URL constants for all major sections (hero images, season backgrounds, region backgrounds, feature images, news images).

### Figma Assets
Cultural instrument images are imported via the `figma:asset` virtual module scheme:
```typescript
import dombraImg from 'figma:asset/2a1a999b8dd927b5e4403bc5a228394d597ffe73.png';
```

### Preloading Strategy
`GlobalPreloader` uses a priority manifest:
- **Critical** - Language selection backgrounds, season selection images for the saved season.
- **High** - Home hero for the saved season.
- **Medium** - Other season selection images.
- **Low** - Feature images.

`useImagePreconnect` adds DNS prefetch and preconnect hints for `images.unsplash.com`.

---

## 14. Architectural Rules & Conventions

### Z-Index Hierarchy
| Layer | Z-Index | Usage |
|-------|---------|-------|
| Sidebar backdrop | `z-40` | Mobile sidebar overlay |
| Sidebar panel | `z-50` | Sidebar content |
| Full-screen modals | `z-[100]` | Article detail, place detail, tour detail, culture detail |
| Map controls | `z-[1000]` | Floating buttons on InteractiveMapPage |

### Mobile Close Button Rule
Close buttons that would overlap the hamburger menu on mobile get `mt-16 md:mt-0` or `top-20` to push them below the hamburger.

### Translation Rule
Every component that displays user-facing text must either:
1. Call `useLanguage()` directly to get `t` and `language`, OR
2. Receive `t` or `language` as a prop from a parent.

### Google Maps API Key Rule
The Google Maps API key is NEVER hardcoded in frontend code. It is always fetched at runtime from the `/maps-config` Supabase Edge Function endpoint, which reads it from the `env` database table.

### Data Persistence Rule
All user data follows a dual-layer pattern:
1. Try Supabase (if user is authenticated).
2. Fall back to localStorage (for guests or if server is unreachable).
3. On sign-in, guest data is migrated to the server via `useGuestMigration`.

### Styling Rules
- Tailwind CSS v4 (no `tailwind.config.js`).
- Inline styles for dynamic theming (season colors applied via `style={{ color: theme.text }}`).
- CSS custom properties set on `:root` for global theme values.
- No hardcoded font-size/font-weight Tailwind classes unless specifically needed.

### Animation Library
All animations use the `motion` package (imported as `motion/react`). Key patterns:
- `AnimatePresence` for mount/unmount transitions.
- `useScroll` + `useTransform` for parallax effects.
- `useInView` for scroll-triggered reveals.
- `Reorder` for drag-and-drop lists.

---

## 15. File Tree Reference

```
/
├── App.tsx                          # Root component, provider hierarchy, page router
├── types.ts                         # Global TypeScript interfaces
├── data.ts                          # (Legacy data file)
├── data_localized.ts                # Trilingual stays data (50 entries)
│
├── contexts/
│   ├── LanguageContext.tsx           # Language provider + translations (100+ keys x 3 langs)
│   ├── SeasonContext.tsx             # Season + theme provider (4 seasons x 4 variants)
│   ├── NotificationContext.tsx       # Toast notification provider (via Sonner)
│   └── TripContext.tsx               # Trip planner state + CRUD
│
├── store/
│   └── useAppStore.ts               # Zustand persisted store (ritual state, pending activities)
│
├── hooks/
│   ├── useAppEngine.ts              # Auth readiness orchestrator
│   ├── useGuestMigration.ts         # localStorage-to-Supabase trip migration
│   └── useImagePreloader.ts         # Image preloading utility
│
├── utils/
│   ├── imageUrls.ts                 # Unsplash URL builder, srcSet generator, URL constants
│   ├── preloadImage.ts              # Image preload promise utility
│   ├── useImagePreconnect.ts        # DNS prefetch/preconnect hints
│   └── supabase/
│       ├── client.ts                # Supabase client initialization
│       └── info.tsx                 # Project ID and anon key exports
│
├── components/
│   ├── LanguageSelection.tsx        # Full-screen language picker (KZ/RU/EN)
│   │
│   ├── auth/
│   │   ├── AuthTerminal.tsx         # Login/Signup form component
│   │   └── RitualGuard.tsx          # Route guard for language+season ritual
│   │
│   ├── navigation/
│   │   └── VerticalSidebar.tsx      # Main app sidebar navigation
│   │
│   ├── pages/
│   │   ├── HomePage.tsx             # Landing page with hero, features, gallery
│   │   ├── PlacesPage.tsx           # Browse landmarks with filters + wishlist
│   │   ├── RegionsPage.tsx          # Explore by region (N/S/E/W)
│   │   ├── ToursPage.tsx            # Browse tour packages, add to trip
│   │   ├── InteractiveMapPage.tsx   # Google Maps with custom markers + Street View
│   │   ├── AIAssistantPage.tsx      # AI chat + structured tool cards
│   │   ├── CulturePage.tsx          # Cultural heritage deep-dive (6 sections)
│   │   ├── HistoryPage.tsx          # Historical timeline (7 eras)
│   │   ├── NewsPage.tsx             # News articles with detail modals
│   │   ├── StaysPage.tsx            # Accommodations browser with currency toggle
│   │   ├── TripPlannerPage.tsx      # Day-by-day itinerary builder + flyover
│   │   ├── ProfilePage.tsx          # User profile, trips, wishlist, settings
│   │   ├── AuthPage.tsx             # Authentication page with seasonal theme
│   │   ├── SeasonSelection.tsx      # Full-screen season picker
│   │   ├── ToolsPage.tsx            # Travel tools hub (6 tools)
│   │   ├── plannerTypes.ts          # Trip/ItineraryItem type definitions
│   │   ├── useTripStorage.ts        # Trip CRUD hook (Supabase + localStorage)
│   │   └── useWishlist.ts           # Wishlist CRUD hook (Supabase + localStorage)
│   │
│   ├── tools/
│   │   ├── PackingList.tsx          # Smart packing checklist with weight tracking
│   │   ├── TravelRealityCheck.tsx   # Distance/logistics calculator (Gemini + Google)
│   │   ├── CultureGuide.tsx         # Etiquette, phrases, quiz
│   │   ├── RoadStatus.tsx           # Live weather-based road conditions
│   │   └── PdfExporter.tsx          # Ghost Protocol PDF generator
│   │
│   ├── map/
│   │   └── TripRouteFlyover.tsx     # 3D Google Maps flyover along trip route
│   │
│   ├── effects/
│   │   ├── SeasonalParticles.tsx    # Canvas particle system (snow/petals/leaves/fireflies)
│   │   └── NatureMagicOverlay.tsx   # Ambient seasonal glow effects
│   │
│   ├── data/
│   │   ├── map_places.ts           # 15+ Kazakhstan landmarks (trilingual)
│   │   ├── tours_data.ts           # Multi-day tour packages (trilingual)
│   │   ├── news_data.ts            # News articles (trilingual)
│   │   ├── CultureData.tsx         # Culture data aggregator
│   │   └── culture/
│   │       ├── en.ts               # English culture content
│   │       ├── ru.ts               # Russian culture content
│   │       ├── kz.ts               # Kazakh culture content
│   │       ├── images.ts           # Culture image imports
│   │       └── unsplash_images.ts  # Culture Unsplash URLs
│   │
│   ├── ui/
│   │   ├── GlobalPreloader.tsx     # App loading screen with image preloading
│   │   ├── ResponsiveImage.tsx     # Optimized image component with lazy loading
│   │   ├── Typewriter.tsx          # Character-by-character text animation
│   │   ├── KendalaLogo.tsx         # SVG brand logo + wordmark
│   │   ├── PageTransition.tsx      # Page entrance animation wrapper
│   │   ├── Reveal.tsx              # Scroll-triggered animation wrappers
│   │   ├── UserGuide.tsx           # Onboarding guide modal
│   │   ├── icons.tsx               # Icon re-exports + custom icons
│   │   ├── motion.tsx              # Motion utility exports
│   │   ├── use-mobile.ts           # Mobile detection hook
│   │   ├── utils.ts                # Utility functions (cn, etc.)
│   │   └── [shadcn primitives]     # 40+ shadcn/ui components
│   │
│   └── figma/
│       └── ImageWithFallback.tsx   # [PROTECTED] Image with error fallback
│
├── styles/
│   └── globals.css                 # Tailwind v4 base styles + CSS custom properties
│
├── supabase/functions/server/
│   ├── index.tsx                   # Hono edge function server (15+ endpoints)
│   ├── kv_store.tsx                # Key-value store abstraction over Supabase table
│   ├── weather_config.tsx          # OpenWeatherMap weather endpoint
│   └── maps_config.tsx             # Google Maps API key endpoint
│
└── guidelines/
    └── Guidelines.md               # Development guidelines
```
