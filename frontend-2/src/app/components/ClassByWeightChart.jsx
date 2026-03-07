import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = [
  'var(--gpa-chart-1)',
  'var(--gpa-chart-2)',
  'var(--gpa-chart-3)',
  'var(--gpa-chart-4)',
  'var(--gpa-chart-5)',
  'var(--gpa-chart-6)',
];

export default function ClassByWeightChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="p-6 rounded-xl shadow-md flex items-center justify-center"
        style={{
          backgroundColor: 'var(--gpa-card-bg)',
          border: '1px solid var(--gpa-border)',
          minHeight: '300px',
        }}
      >
        <p className="text-sm text-center" style={{ color: 'var(--gpa-text)', opacity: 0.5 }}>
          No data available
        </p>
      </div>
    );
  }

  // Get actual color values from CSS variables
  const getColor = (colorVar) => {
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.documentElement).getPropertyValue(colorVar.replace('var(', '').replace(')', '')).trim();
    }
    return colorVar;
  };

  const colors = COLORS.map(c => getColor(c));

  return (
    <div
      className="p-6 rounded-xl shadow-md"
      style={{
        backgroundColor: 'var(--gpa-card-bg)',
        border: '1px solid var(--gpa-border)',
      }}
    >
      <h3
        className="text-lg mb-4 uppercase tracking-wide"
        style={{ color: 'var(--gpa-accent)' }}
      >
        Class by Weight
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--gpa-card-bg)',
              border: '1px solid var(--gpa-border)',
              borderRadius: '8px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span style={{ color: 'var(--gpa-text)', fontSize: '12px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
