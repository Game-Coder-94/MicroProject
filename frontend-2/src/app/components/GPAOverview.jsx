import React from 'react';

export default function GPAOverview({ data }) {
  const rows = [
    { label: 'Starting GPA', value: data?.startingGPA?.toFixed(2) || '0.00' },
    { label: 'Total College Credits', value: data?.totalCollegeCredits || '0' },
    { label: 'Semester GPA', value: data?.semesterGPA || '0.00' },
    { label: 'Cumulative GPA', value: data?.cumulativeGPA || '0.00' },
  ];

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
        GPA Overview
      </h3>
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--gpa-text)', opacity: 0.7 }}>
              {row.label}
            </span>
            <span className="text-base" style={{ color: 'var(--gpa-text)' }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
