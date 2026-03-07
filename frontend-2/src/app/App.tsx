import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--gpa-bg)' }}>
        <Header />
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}
