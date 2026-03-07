import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [palette, setPalette] = useState('mint-cream');

  useEffect(() => {
    // Set the data-palette attribute on root
    document.documentElement.setAttribute('data-palette', palette);
  }, [palette]);

  const value = {
    palette,
    setPalette,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
