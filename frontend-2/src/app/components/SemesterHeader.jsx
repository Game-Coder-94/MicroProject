import React from 'react';

export default function SemesterHeader({ semesterName = 'Fall Semester', year = '2023', onChangeYear }) {
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 5 + i).toString());

  return (
    <div
      className="p-6 rounded-xl shadow-md"
      style={{
        backgroundColor: 'var(--gpa-card-bg)',
        border: '1px solid var(--gpa-border)',
      }}
    >
      <h2 className="text-2xl mb-3" style={{ color: 'var(--gpa-text)' }}>
        {semesterName}
      </h2>
      <div className="flex items-center gap-2">
        <label htmlFor="year-select" className="text-sm" style={{ color: 'var(--gpa-text)' }}>
          Year:
        </label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => onChangeYear && onChangeYear(e.target.value)}
          className="px-3 py-1 rounded-lg border text-sm"
          style={{
            backgroundColor: 'var(--gpa-bg)',
            borderColor: 'var(--gpa-border)',
            color: 'var(--gpa-text)',
          }}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
