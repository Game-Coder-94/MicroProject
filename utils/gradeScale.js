function getGradeDetails(z) {
    if (z >= 1.5) return { point: 10.0, letter: 'A+' };     // Outstanding
    if (z >= 1.0) return { point: 9.0, letter: 'A' };      // Excellent
    if (z >= 0.5) return { point: 8.0, letter: 'B' };      // Very Good
    if (z >= -0.5) return { point: 7.0,  letter: 'C' };     // Good
    if (z >= -1.0) return { point: 6.0,  letter: 'D' };     // Above Average
    if (z >= -1.5) return { point: 5.0,  letter: 'E' };     // Average
    return { point: 0.0, letter: 'F' };                     // Fail
}

module.exports = { getGradeDetails };