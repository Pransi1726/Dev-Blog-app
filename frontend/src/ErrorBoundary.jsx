import React from 'react';

// Without this, an uncaught error anywhere in the React tree unmounts
// everything and leaves a blank white page with no clue why.
// This catches it and shows the actual error instead.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error in app:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'sans-serif',
          background: '#fef2f2',
          color: '#991b1b',
        }}>
          <div style={{ maxWidth: 600 }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Something crashed
            </h1>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              {this.state.error.message || String(this.state.error)}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#7f1d1d' }}>
              Open DevTools → Console for the full stack trace.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
