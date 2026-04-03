import { createBrowserRouter } from 'react-router';
import { RootLayout } from './components/layouts/RootLayout';
import { AuthLayout } from './components/layouts/AuthLayout';
import { HomePage } from './components/pages/HomePage';
import { PlacesPage } from './components/pages/PlacesPage';
import { ToursPage } from './components/pages/ToursPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { RegionsPage } from './components/pages/RegionsPage';
import { InteractiveMapPage } from './components/pages/InteractiveMapPage';
import { AIAssistantPage } from './components/pages/AIAssistantPage';
import { CulturePage } from './components/pages/CulturePage';
import { HistoryPage } from './components/pages/HistoryPage';
import { NewsPage } from './components/pages/NewsPage';
import { ToolsPage } from './components/pages/ToolsPage';
import { StaysPage } from './components/pages/StaysPage';
import { TripPlannerPage } from './components/pages/TripPlannerPage';
import { AuthPage } from './components/pages/AuthPage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { AdminPage } from './components/pages/AdminPage';
import { PartnerPage } from './components/pages/PartnerPage';
import { CreatePlacePage } from './components/pages/CreatePlacePage';
import { PremiumPage } from './components/pages/PremiumPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'auth', Component: AuthPage },
      
      // Public explore pages — no login required
      { path: 'places', Component: PlacesPage },
      { path: 'tours', Component: ToursPage },
      { path: 'culture', Component: CulturePage },
      { path: 'history', Component: HistoryPage },
      { path: 'news', Component: NewsPage },
      { path: 'stays', Component: StaysPage },
      { path: 'regions', Component: RegionsPage },
      { path: 'partner', Component: PartnerPage },
      { path: 'create-place', Component: CreatePlacePage },
      { path: 'premium', Component: PremiumPage },
      
      // Auth-guarded pages — require login
      {
        Component: AuthLayout,
        children: [
          { path: 'map', Component: InteractiveMapPage },
          { path: 'ai', Component: AIAssistantPage },
          { path: 'planner', Component: TripPlannerPage },
          { path: 'profile', Component: ProfilePage },
          { path: 'tools', Component: ToolsPage },
          { path: 'admin', Component: AdminPage },
        ],
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);