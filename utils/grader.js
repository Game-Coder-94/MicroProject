const { getGradeDetails } = require('./gradeScale.js');
const ss = require('simple-statistics');

// Returns array of {name, courseGrades: {}, avgZScore}
function calculateGrades(students) {
    if (!students || !students.length) return [];

    const courses = Object.keys(students[0].scores);
    const coursesStats = {};

    // 1. Calculate Mean & StdDev for each course
    courses.forEach(course => {
        const scores = students.map(s => s.scores[course]);
        coursesStats[course] = {
            mean: ss.mean(scores),
            stdDev: ss.standardDeviation(scores)
        };
    });

    // 2. Assign Grade PER SUBJECT & Calculate Avg Z
    return students.map(student => {
        const courseGrades = {}; 
        const courseZScores = {};
        let totalZ = 0;

        courses.forEach(course => {
            const rawScore = student.scores[course];
            const stats = coursesStats[course];

            // Calculate Z-Score
            const z = stats.stdDev === 0 ? 0 : (rawScore - stats.mean) / stats.stdDev;
            
            // Add to total
            totalZ += z;

            // Assign individual course grade
            courseGrades[course] = getGradeDetails(z).letter;
            courseZScores[course] = z;
        });

        // Calculate Average Z-Score across all courses
        const avgZ = totalZ / courses.length;

        return {
            name: student.name,
            course: {
                courseCredits: student.credits,
                courseGrades: courseGrades,
                courseZScores: courseZScores,
            },
            avgZScore: avgZ.toFixed(2) // Round to 2 decimals
        };
    });
}

module.exports = { calculateGrades };