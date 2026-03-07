import React from 'react';
import getGradeClass from '../utils/getGradeClass';
import '../../styles/gradesBadges.css';

export default function ClassesTable({ courses, results }) {
  if (!courses || courses.length === 0) {
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
          Classes
        </h3>
        <p
          className="text-sm text-center py-8"
          style={{ color: 'var(--gpa-text)', opacity: 0.5 }}
        >
          No data available. Upload CSV files to view classes.
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
        Classes
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gpa-border)' }}>
              <th
                className="text-left py-3 px-2 text-xs uppercase tracking-wide"
                style={{ color: 'var(--gpa-text)', opacity: 0.6 }}
              >
                Student Name
              </th>
              <th
                className="text-center py-3 px-2 text-xs uppercase tracking-wide"
                style={{ color: 'var(--gpa-text)', opacity: 0.6 }}
              >
                SGPA
              </th>
              {courses.map((course) => (
                <th
                  key={course.name || course}
                  className="text-center py-3 px-2 text-xs uppercase tracking-wide"
                  style={{ color: 'var(--gpa-text)', opacity: 0.6 }}
                >
                  {course.name || course}
                </th>
              ))}
              <th
                className="text-right py-3 px-2 text-xs uppercase tracking-wide"
                style={{ color: 'var(--gpa-text)', opacity: 0.6 }}
              >
                Grade Points
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((student, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: '1px solid var(--gpa-border)',
                }}
              >
                <td className="py-3 px-2" style={{ color: 'var(--gpa-text)' }}>
                  {student.name}
                </td>
                <td className="py-3 px-2 text-center">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: 'var(--gpa-accent-2)',
                      color: 'var(--gpa-text)',
                    }}
                  >
                    {student.summary.sgpa ?? '-'}
                  </span>
                </td>
                {courses.map((course) => {
                  const courseKey = course.name || course;
                  return (
                    <td key={courseKey} style={{ textAlign: 'center' }}>                      
                      <span
                        className={`py-3 px-2 text-center grade-badge ${getGradeClass(
                          student.courseGrades?.[courseKey]
                        )}`}
                      >
                        {student.courseGrades?.[courseKey] ?? '-'}
                      </span>
                    </td>
                  );
                })}
                <td
                  className="py-3 px-2 text-right"
                  style={{ color: 'var(--gpa-text)' }}
                >
                  {student.summary.sgpa ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
