import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

export default function NormalCurveChart({ data }) {
  if (!data || !data.length) {
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
          No bell-curve data available
        </p>
      </div>
    );
  }

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
        Normal Distribution (Bell Curve)
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--gpa-border)" />
          <XAxis
            dataKey="z"
            tick={{ fill: 'var(--gpa-text)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--gpa-border)' }}
            label={{ value: 'Z-Score', position: 'insideBottom', offset: -5, fill: 'var(--gpa-text)' }}
          />
          <YAxis
            tick={{ fill: 'var(--gpa-text)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--gpa-border)' }}
            width={60}
            label={{ value: 'Density', angle: -90, position: 'insideLeft', fill: 'var(--gpa-text)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--gpa-card-bg)',
              border: '1px solid var(--gpa-border)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--gpa-text)' }}
          />
          <ReferenceLine x={0} stroke="var(--gpa-accent)" strokeDasharray="4 4" />
          <Area
            type="monotone"
            dataKey="normalDensity"
            stroke="none"
            fill="var(--gpa-accent)"
            fillOpacity={0.12}
            isAnimationActive={false}
          />
          <Line type="monotone" dataKey="normalDensity" stroke="var(--gpa-accent)" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
