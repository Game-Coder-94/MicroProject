// Returns each row as an object with header keys
// Returns {header: value, ...}
function parseCSV(csvText) {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index];
        });
        return row;
    });
}

// Returns {name, marks: {}, credits: {}}
function parseAndMerge(scoresCSVText, creditsCSVText) {
    // 1. Parse both files into arrays of objects
    const scoresData = parseCSV(scoresCSVText);
    const creditsData = parseCSV(creditsCSVText);

    // 2. Merge logic
    const mergedResults = scoresData.map(scoreRow => {
        const studentName = scoreRow.Name;

        // Find matching row in Credits data
        const creditRow = creditsData.find(c => c.Name === studentName);

        if (!creditRow) {
            console.warn(`Missing credits for student: ${studentName}`);
            return null; // Skip if no match found
        }

        const scoresObj = {};
        const creditsObj = {};

        // Loop through keys in the score row (excluding 'Name') to find subjects
        Object.keys(scoreRow).forEach(key => {
            if (key !== 'Name') {
                const courseName = key; // e.g., "Math"

                // A. Get Marks
                scoresObj[courseName] = parseFloat(scoreRow[key]);

                // B. Get Credits
                // We construct the key expected in the Credits CSV: "Math" -> "Math_Credits"
                const creditKey = `${courseName}_Credits`;
                
                // Parse the credit value (default to 0 if missing)
                const creditVal = parseFloat(creditRow[creditKey]);
                creditsObj[courseName] = isNaN(creditVal) ? 0 : creditVal;
            }
        });

        return {
            name: studentName,
            scores: scoresObj,
            credits: creditsObj
        };
    }).filter(item => item !== null); // Remove nulls (unmatched students)

    return mergedResults;
}

module.exports = { parseAndMerge };