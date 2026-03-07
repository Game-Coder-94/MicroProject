import React from 'react';

export default function SemesterOverview({ data }) {
  const rows = [
    { label: 'Total Classes', value: data?.totalClasses || '0' },
    { label: 'Total Credits', value: data?.totalCredits || '0' },
    { label: 'Total GPA Points', value: data?.totalGpaPoints || '0.00' },
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
        Semester Overview
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
