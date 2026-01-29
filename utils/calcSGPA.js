const { getGradeDetails } = require('./gradeScale.js');

function calculateSGPA (results, sigp = 0) {
    return results.map(student => {
    let sumCiPi = 0;
    let sumCi = 0;

    const reportCard = Object.keys(student.course.courseGrades).map(course => {
        const Ci = parseFloat(student.course.courseCredits[course]);
        const z = parseFloat(student.course.courseZScores[course]);
        
        if (isNaN(Ci) || isNaN(z)) {
            throw new Error(`Invalid data for subject: ${course.Subject}`);
        }
        
        const grade = getGradeDetails(z);
        const Pi = grade.point;
        
        sumCiPi += (Ci * Pi);
        sumCi += Ci;

        return {
            subject: course.Subject,
            credits: Ci,
            z_score_obtained: z,
            grade_point: Pi,
            grade_letter: grade.letter
        };
    });

    if(sumCi === 0) {
        throw new Error("Total credits can't be zero. Cannot calculate SGPA");
    }

    const numerator = sumCiPi + sigp;
    const finalSGPA = numerator / sumCi;     // SGPA calculation

    return {
        name: student.name,
        summary: {
            sgpa: finalSGPA.toFixed(2),
            total_credits: sumCi,
            sigp_added: sigp
        },
        individual_grades: reportCard
    };
    });
}

// Export as object
module.exports = { calculateSGPA };