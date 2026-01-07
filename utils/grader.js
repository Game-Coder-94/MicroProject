const ss = require('simple-statistics');

function calculateGrades(students) {
    const subjects = Object.keys(students[0].scores);    // ['Math', 'English'] (Gets total subjects)
    const subjectsStats = {};

    subjects.forEach(subject => {
        const scores = students.map(s => s.scores[subject]);

        // Calculate mean & stdDev of students for each subject
        subjectsStats[subject] = {
            mean: ss.mean(scores),
            stdDev: ss.standardDeviation(scores)
        };
    });

    return students.map(student => {
        let totalZ = 0;

        subjects.forEach(subject => {
            const rawScores = student.scores[subject];
            const stats = subjectsStats[subject];

            const z = stats.stdDev === 0 ? 0 : (rawScores - stats.mean) / stats.stdDev;
            totalZ += z;
        })

        const avgZ = totalZ / subjects.length;

        return {
            name: student.name,
            finalZ: avgZ.toFixed(2),
            finalGrade: assignGrade(avgZ)
        };
    });
}

function assignGrade(zScore) {
    if (zScore >= 1.5) return 'A';
    if (zScore >= 0.5) return 'B';
    if (zScore >= -0.5) return 'C';
    if (zScore >= -1.5) return 'D';
    return 'F';
}

module.exports = { calculateGrades };