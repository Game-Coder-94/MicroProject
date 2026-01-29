const ss = require('simple-statistics');

function calculateGrades(students) {
    if (!students || !students.length) return [];

    const subjects = Object.keys(students[0].scores);
    const subjectsStats = {};

    // 1. Calculate Mean & StdDev for each subject
    subjects.forEach(subject => {
        const scores = students.map(s => s.scores[subject]);
        subjectsStats[subject] = {
            mean: ss.mean(scores),
            stdDev: ss.standardDeviation(scores)
        };
    });

    // 2. Assign Grade PER SUBJECT & Calculate Avg Z
    return students.map(student => {
        const subjectGrades = {}; 
        let totalZ = 0;

        subjects.forEach(subject => {
            const rawScore = student.scores[subject];
            const stats = subjectsStats[subject];

            // Calculate Z-Score
            const z = stats.stdDev === 0 ? 0 : (rawScore - stats.mean) / stats.stdDev;
            
            // Add to total
            totalZ += z;

            // Assign individual subject grade
            subjectGrades[subject] = getGradeDetails(z).letter;
        });

        // Calculate Average Z-Score across all subjects
        const avgZ = totalZ / subjects.length;

        return {
            name: student.name,
            subjectGrades: subjectGrades,
            avgZScore: avgZ.toFixed(2) // Round to 2 decimals
        };
    });
}

function getGradeDetails(z) {
    if (z >= 1.5) return { point: 10.0, letter: 'A+' };     // Outstanding
    if (z >= 1.0) return { point: 9.0,  letter: 'A' };      // Excellent
    if (z >= 0.5) return { point: 8.0,  letter: 'B' };      // Very Good
    if (z >= -0.5) return { point: 7.0,  letter: 'C' };     // Good
    if (z >= -1.0) return { point: 6.0,  letter: 'D' };     // Above Average
    if (z >= -1.5) return { point: 5.0,  letter: 'E' };     // Average
    return { point: 0.0, letter: 'F' };                     // Fail
}



module.exports = { calculateGrades };