import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#1C1E26', color: '#E0E2E8' }}>
          <div className="max-w-md text-center space-y-4">
            <div className="text-[10px] uppercase tracking-[0.3em] opacity-50">Something went wrong</div>
            <p className="text-xs font-mono opacity-60 break-all">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2 border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
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
