function getGradeDetails(z) {
    if (z >= 1.5) return { point: 10.0, letter: 'A+' };     // Outstanding
    if (z >= 1.0) return { point: 9.0,  letter: 'A' };      // Excellent
    if (z >= 0.5) return { point: 8.0,  letter: 'B' };      // Very Good
    if (z >= -0.5) return { point: 7.0,  letter: 'C' };     // Good
    if (z >= -1.0) return { point: 6.0,  letter: 'D' };     // Above Average
    if (z >= -1.5) return { point: 5.0,  letter: 'E' };     // Average
    return { point: 0.0, letter: 'F' };                     // Fail
}

function calculateResults (courses, sigp = 0) {
    const sumCiPi = 0;
    const sumCi = 0;

    const reportCard = courses.map(course => {
        const Ci = parseFloat(course.Credit);
        const z = parseFloat(course.zScore);

        const grade = getGradeDetails(z);
        const Pi = grade.point;

        sumCiPi += (Ci * Pi);
        sumCi += Ci;

        return {
            subject: course.Subject,
            credits: Ci,
            z_score_obtained: z,
            grade_point: Pi,
            grade_letter: letter
        };
    });

    if(sumCi === 0) {
        throw new Error("Total credits can't be zero. Cannot calculate SGPA");
    }

    const numerator = sumCiPi + sigp;
    const finalSGPA = numerator / sumCi;     // SGPA calculation

    return {
        summary: {
            sgpa: finalSGPA,
            total_credits: sumCi,
            sigp_added: sigp
        },
        individual_grades: reportCard
    };
}

// Export as object
module.exports = { calculateResults };