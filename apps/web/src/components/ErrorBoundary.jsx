import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 [ErrorBoundary] Startup Error Caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 flex flex-col items-center justify-center font-sans">
          <div className="max-w-3xl w-full bg-slate-900 border border-red-500/30 rounded-xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-red-400">Application Startup Error</h1>
            </div>
            
            <div className="mb-6 space-y-4">
              <p className="text-slate-300">The application encountered an error during startup. This is usually caused by a missing import, undefined variable, or hook error.</p>
              
              <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto border border-slate-800">
                <p className="text-red-300 font-mono text-sm mb-2 font-bold">
                  {this.state.error && this.state.error.toString()}
                </p>
                <pre className="text-slate-500 font-mono text-xs whitespace-pre-wrap">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>🔄</span> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}