import { gradeToPoints, GRADE_ORDER } from './formatters';

/**
 * Map backend results to dashboard aggregates
 */
export function mapResultsToAggregates(results) {
  console.log('Mapping results to aggregates. Input:', results);
  
  if (!results || results.length === 0) {
    return {
      courses: [],
      classByWeight: [],
      gradeDistribution: {},
      classSummary: {
        startingGPA: 0,
        totalCollegeCredits: 0,
        semesterGPA: 0,
        cumulativeGPA: 0,
        totalGpaPoints: 0,
      },
      semesterOverview: {
        totalClasses: 0,
        totalCredits: 0,
        totalGpaPoints: 0,
      },
    };
  }

  // Extract all unique courses
  const coursesSet = new Set();
  results.forEach(student => {
    if (student.courseGrades) {
      Object.keys(student.courseGrades).forEach(course => coursesSet.add(course));
    }
  });
  const courseNames = Array.from(coursesSet);
  
  console.log(`Found ${courseNames.length} unique courses:`, courseNames);

  // Compute per-course aggregates
  const courseAggregates = {};
  const gradeDistribution = {};
  const aGradeCounts = {};
  let semesterGpaSum = 0;
  let totalCreditsSum = 0;
  let totalGpaPointsSum = 0;

  results.forEach(student => {
    const sgpa = parseFloat(student.summary?.sgpa || '0');
    semesterGpaSum += sgpa;
    
    const studentCredits = student.summary?.total_credits || 0;
    totalCreditsSum += studentCredits;

    courseNames.forEach(courseName => {
      const grade = student.courseGrades?.[courseName];
      const credit = student.courseCredits?.[courseName] || 0;

      if (!courseAggregates[courseName]) {
        courseAggregates[courseName] = {
          credits: credit,
          gradePointsSum: 0,
          gradeCount: 0,
          grades: [],
        };
      }

      if (grade) {
        const gradePoint = gradeToPoints(grade);
        courseAggregates[courseName].gradePointsSum += gradePoint;
        courseAggregates[courseName].gradeCount++;
        courseAggregates[courseName].grades.push(grade);

        // Build grade distribution
        if (!gradeDistribution[grade]) {
          gradeDistribution[grade] = 0;
        }
        gradeDistribution[grade]++;

        // Build A-grade counts for course chart (A+, A, A-)
        if (/^A[+-]?$/.test(grade)) {
          aGradeCounts[courseName] = (aGradeCounts[courseName] || 0) + 1;
        }
      }
    });
  });

  // Calculate total GPA points
  courseNames.forEach(courseName => {
    const agg = courseAggregates[courseName];
    totalGpaPointsSum += agg.gradePointsSum;
  });

  // Build courses array for table
  const courses = courseNames.map(name => {
    const agg = courseAggregates[name];
    const avgPoint = agg.gradeCount > 0 ? agg.gradePointsSum / agg.gradeCount : 0;
    
    return {
      name,
      credits: agg.credits,
      avgPoint: avgPoint.toFixed(2),
      gradePoints: agg.gradePointsSum.toFixed(2),
    };
  });

  // Build class by weight data for donut chart (converted to A-grade counts)
  const classByWeight = courseNames.map(name => ({
    name,
    value: aGradeCounts[name] || 0,
  }));

  // Sort grade distribution by grade order
  const sortedGradeDistribution = {};
  GRADE_ORDER.forEach(grade => {
    if (gradeDistribution[grade]) {
      sortedGradeDistribution[grade] = gradeDistribution[grade];
    }
  });

  // Calculate class summary
  const semesterGPA = results.length > 0 ? semesterGpaSum / results.length : 0;
  const avgCredits = results.length > 0 ? totalCreditsSum / results.length : 0;

  // Build bell curve data from average z-scores across students
  const allZScores = results
    .map(student => parseFloat(student.avgZScore))
    .filter(Number.isFinite);

  let normalCurveData = [];
  if (allZScores.length > 0) {
    const mean = allZScores.reduce((sum, value) => sum + value, 0) / allZScores.length;
    const variance = allZScores.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / allZScores.length;
    const stdDev = Math.sqrt(variance || 1);

    const lower = mean - 3 * stdDev;
    const upper = mean + 3 * stdDev;
    const points = 70;

    const gaussian = x => (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));

    normalCurveData = Array.from({ length: points }, (_, i) => {
      const z = lower + (i * (upper - lower)) / (points - 1);
      return {
        z: Number(z.toFixed(2)),
        normalDensity: Number(gaussian(z).toFixed(5)),
      };
    });
  }

  const aggregatedData = {
    courses,
    classByWeight,
    gradeDistribution: sortedGradeDistribution,
    normalCurveData,
    classSummary: {
      startingGPA: 0, // Could be derived from previous data if available
      totalCollegeCredits: Math.round(avgCredits),
      semesterGPA: semesterGPA.toFixed(2),
      cumulativeGPA: semesterGPA.toFixed(2), // Simplified
      totalGpaPoints: totalGpaPointsSum.toFixed(2),
    },
    semesterOverview: {
      totalClasses: courseNames.length,
      totalCredits: Math.round(avgCredits),
      totalGpaPoints: (totalGpaPointsSum / results.length).toFixed(2),
    },
  };
  
  console.log('Aggregated data:', aggregatedData);
  return aggregatedData;
}