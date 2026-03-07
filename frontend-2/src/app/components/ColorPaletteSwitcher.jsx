import React from 'react';
import { useTheme } from './ThemeProvider';

const PALETTES = [
  { id: 'mint-cream', name: 'Mint Cream', color: '#6aa78e' },
  { id: 'peach-rose', name: 'Peach Rose', color: '#d97b6e' },
  { id: 'cool-gray', name: 'Cool Gray', color: '#6b7c93' },
];

export default function ColorPaletteSwitcher() {
  const { palette, setPalette } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm mr-2" style={{ color: 'var(--gpa-text)' }}>Theme:</span>
      <div className="flex gap-2">
        {PALETTES.map((p) => (
          <button
            key={p.id}
            onClick={() => setPalette(p.id)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              palette === p.id ? 'border-gray-800 scale-110' : 'border-gray-300'
            }`}
            style={{ backgroundColor: p.color }}
            title={p.name}
            aria-label={`Switch to ${p.name} palette`}
          />
        ))}
      </div>
    </div>
  );
}
