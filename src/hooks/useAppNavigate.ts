import { useNavigate } from 'react-router';

const PAGE_TO_PATH: Record<string, string> = {
  home: '/',
  places: '/places',
  tours: '/tours',
  map: '/map',
  ai: '/ai',
  culture: '/culture',
  history: '/history',
  news: '/news',
  profile: '/profile',
  regions: '/regions',
  tools: '/tools',
  stays: '/stays',
  planner: '/planner',
  auth: '/auth',
  admin: '/admin',
  partner: '/partner',
  'create-place': '/create-place',
  premium: '/premium',
};

export function useAppNavigate() {
  const navigate = useNavigate();

  return (page: string) => {
    const path = PAGE_TO_PATH[page] || `/${page}`;
    navigate(path);
  };
}

export function pathToPage(pathname: string): string {
  if (pathname === '/') return 'home';
  const segment = pathname.split('/')[1];
  return segment || 'home';
}