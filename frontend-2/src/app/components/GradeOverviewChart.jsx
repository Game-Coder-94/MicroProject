import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GradeOverviewChart({ data }) {
  if (!data || Object.keys(data).length === 0) {
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

  // Convert grade distribution object to array for recharts
  const chartData = Object.entries(data).map(([grade, count]) => ({
    grade,
    count,
  }));

  // Get actual color value from CSS variable
  const getColor = (colorVar) => {
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.documentElement).getPropertyValue(colorVar.replace('var(', '').replace(')', '')).trim();
    }
    return colorVar;
  };

  const barColor = getColor('var(--gpa-accent)');

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
        Grade Overview
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--gpa-border)" />
          <XAxis
            dataKey="grade"
            tick={{ fill: 'var(--gpa-text)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--gpa-border)' }}
          />
          <YAxis
            tick={{ fill: 'var(--gpa-text)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--gpa-border)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--gpa-card-bg)',
              border: '1px solid var(--gpa-border)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--gpa-text)' }}
          />
          <Bar dataKey="count" fill={barColor} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
