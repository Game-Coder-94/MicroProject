export default function getGradeClass(grade) {
  // no data
  if (grade == null || grade === '' || grade === '-') {
    return 'grade-unknown';
  }

  const s = String(grade).trim().toUpperCase();

  // numeric score
  const n = parseFloat(s);
  if (!isNaN(n)) {
    if (n >= 90) return 'grade-A';
    if (n >= 80) return 'grade-B';
    if (n >= 70) return 'grade-C';
    if (n >= 60) return 'grade-D';
    return 'grade-F';
  }

  // letter grades
  switch (s) {
    case 'A+':
      return 'grade-A-plus';
    case 'A':
      return 'grade-A';
    case 'B+':
    case 'B':
      return 'grade-B';
    case 'C+':
    case 'C':
      return 'grade-C';
    case 'D+':
    case 'D':
      return 'grade-D';
    case 'E':
      return 'grade-E';
    case 'F':
    default:
      return 'grade-F';
  }
}