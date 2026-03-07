import React from 'react';
import ColorPaletteSwitcher from './ColorPaletteSwitcher';

export default function Header() {
  return (
    <header className="text-center py-8 relative">
      <div className="absolute top-8 right-8">
        <ColorPaletteSwitcher />
      </div>
      <h1 className="mb-2">
        <span
          className="text-6xl md:text-7xl"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--gpa-text)',
          }}
        >
          GPA
        </span>
        <span className="mx-3"></span>
        <span
          className="text-5xl md:text-6xl"
          style={{
            fontFamily: "'Pacifico', cursive",
            color: 'var(--gpa-accent)',
          }}
        >
          Calculator & Tracker
        </span>
      </h1>
      <p
        className="text-sm uppercase tracking-wider mt-2"
        style={{ color: 'var(--gpa-text)', opacity: 0.6 }}
      >
        Google Sheets • Instant Download • Automated
      </p>
    </header>
  );
}
