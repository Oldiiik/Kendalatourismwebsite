import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RouterProvider } from 'react-router';
import { SeasonProvider } from './contexts/SeasonContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { TripProvider } from './contexts/TripContext';
import { AuthProvider } from './contexts/AuthContext';
import { PremiumProvider } from './contexts/PremiumContext';
import { router } from './routes';

/**
 * Top-level error boundary that catches everything — including
 * crashes in context providers, router, and layout components.
 * Without this, a crash anywhere before the page-level ErrorBoundary
 * renders produces a silent white screen.
 */
class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AppErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#1C1E26',
            color: '#E0E2E8',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
            <div
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                opacity: 0.5,
                marginBottom: '1.5rem',
              }}
            >
              Kendala — Something went wrong
            </div>
            <p
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                opacity: 0.6,
                wordBreak: 'break-all',
                marginBottom: '2rem',
                lineHeight: 1.6,
              }}
            >
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              style={{
                padding: '0.6rem 2rem',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: '#E0E2E8',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Log uncaught errors that bypass React error boundaries
  React.useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      console.error('[window.onerror]', e.error || e.message);
    };
    const handleRejection = (e: PromiseRejectionEvent) => {
      console.error('[unhandledrejection]', e.reason);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <AppErrorBoundary>
      <LanguageProvider>
        <SeasonProvider>
          <NotificationProvider>
            <AuthProvider>
              <PremiumProvider>
                <TripProvider>
                  <RouterProvider router={router} />
                </TripProvider>
              </PremiumProvider>
            </AuthProvider>
          </NotificationProvider>
        </SeasonProvider>
      </LanguageProvider>
    </AppErrorBoundary>
  );
}