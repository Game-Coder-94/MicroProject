/**
 * Utility functions for formatting data in the GPA dashboard
 */

/**
 * Grade to numeric points mapping
 */
export const GRADE_POINTS = {
  'A+': 10,
  'A': 9,
  'A-': 8.5,
  'B+': 8,
  'B': 7,
  'B-': 6.5,
  'C+': 6,
  'C': 5,
  'C-': 4.5,
  'D': 4,
  'F': 0,
};

/**
 * Grade ordering for charts (highest to lowest)
 */
export const GRADE_ORDER = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

/**
 * Convert letter grade to numeric point value
 */
export function gradeToPoints(grade) {
  if (!grade) return 0;
  return GRADE_POINTS[grade] || 0;
}

/**
 * Format GPA to 2 decimal places
 */
export function formatGPA(gpa) {
  if (typeof gpa === 'string') {
    return parseFloat(gpa).toFixed(2);
  }
  return (gpa || 0).toFixed(2);
}

/**
 * Get badge color based on grade
 */
export function getGradeBadgeColor(grade) {
  if (!grade) return 'bg-gray-200 text-gray-700';
  
  const colors = {
    'A+': 'bg-green-100 text-green-800',
    'A': 'bg-green-100 text-green-700',
    'A-': 'bg-green-50 text-green-700',
    'B+': 'bg-blue-100 text-blue-700',
    'B': 'bg-blue-100 text-blue-700',
    'B-': 'bg-blue-50 text-blue-700',
    'C+': 'bg-yellow-100 text-yellow-800',
    'C': 'bg-yellow-100 text-yellow-800',
    'C-': 'bg-yellow-50 text-yellow-800',
    'D': 'bg-orange-100 text-orange-800',
    'F': 'bg-red-100 text-red-800',
  };
  
  return colors[grade] || 'bg-gray-200 text-gray-700';
}
