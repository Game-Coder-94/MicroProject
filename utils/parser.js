function parseCSV(csvText) {
    // 1. Split text into lines
    const rows = csvText.trim().split('\n');

    // 2. Split into headers (['Name', 'Maths'])
    const headers = rows[0].split(',').map(h => h.trim());

    // 3. Map rest of the rows to Student Object
    const students = rows.slice(1).map(row => {
        const values = row.split(',');

        if(values.length < headers.length) return null; // Skip empty rows

        const name = values[0].trim();  // Get names
        const scores = {};

        // Loop through Subjects
        for(let i = 1; i < headers.length; i++) {
            const subject = headers[i];
            const score = parseFloat(values[i]);
            scores[subject] = score;
        }

        return { name, scores };
    }).filter(s => s !== null); // remove null rows

    return students;
}