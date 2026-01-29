// Import libs
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

// Import utilities
const { calculateGrades } = require('./utils/grader');
const { calculateSGPA } = require('./utils/calcSGPA');
const { parseAndMerge } = require('./utils/parser');
const { error } = require('console');

// Create app (Server) instance
const app = express();
const upload = multer({ dest: 'uploads/' });    // Temp storage

const uploadFields = upload.fields([
    { name: 'csvMarksFile', maxCount: 1 },
    { name: 'csvCreditsFile', maxCount: 1 }
]);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send("Backend is running. Use the React Frontend to upload files.");
});

app.get('/hello', (req, res) => {
    res.send('Hi! there...');
})

// Calaculate grades
app.post('/grades', uploadFields, (req, res) => {
    try {
        if (!req.files || !req.files['csvMarksFile'] || !req.files['csvCreditsFile']) {
            return res.status(400).json({ error: "Both Scores and Credits files are required." });
        }

        // 1. Read uploaded files
        const sigp = req.body.sigp ? parseFloat(req.body.sigp) : 0;
        const csvMarksText = fs.readFileSync(req.files['csvMarksFile'][0].path, 'utf8');
        const csvCreditsText = fs.readFileSync(req.files['csvCreditsFile'][0].path, 'utf8');

        // 2. Convert data        
        const studentsData = parseAndMerge(csvMarksText, csvCreditsText);   // {name, marks: {}, credits: {}}
        console.log("Parsed data:", studentsData);

        // 3. Process data
        // Array of {name, course: {courseCredits: {}, courseGrades: {}, courseZScores: {}}, avgZScore}
        const results = calculateGrades(studentsData);
        console.log("Calculated Grades:", results);
        // Array of {summary: {sgpa, total_credits, sigp}, individual_grades: []}
        const sgpaResults = calculateSGPA(results, sigp);
        console.log("Calculated SGPA:", sgpaResults);

        // 4. Cleanup
        fs.unlinkSync(req.files['csvMarksFile'][0].path);
        fs.unlinkSync(req.files['csvCreditsFile'][0].path);

        // 5. Flatten results for frontend
        const flatResults = results.map(student => ({
            name: student.name,
            courseCredits: student.course.courseCredits,
            courseGrades: student.course.courseGrades,
            courseZScores: student.course.courseZScores,
            avgZScore: student.avgZScore
        }));

        // 6. Send results to frontend
        res.json({ success: true, results: flatResults, sgpa: sgpaResults });

    } catch (err) {
        // Log error
        console.error(err);

        // Clean up files if error occurs
        if (req.files) {
            if (req.files['csvMarksFile']) try { fs.unlinkSync(req.files['csvMarksFile'][0].path); } catch (e) {}
            if (req.files['csvCreditsFile']) try { fs.unlinkSync(req.files['csvCreditsFile'][0].path); } catch (e) {}
        }

        // Send error response
        res.status(500).json({ success: false, error: err.message });
    }
});

// // Calculate 
// app.post('/sgpa', upload.single('csvFile'), (req, res) => {
//     try {
//         if(!req.file) {
//             return res.status(400).json({ error: "No file uploaded" });
//         }

//         // 1. Get SIGP from the form data (Default to 0 if not provided)
//         // Multer allows us to access text fields in req.body
//         const sigp = req.body.sigp ? parseFloat(req.body.sigp) : 0.0;

//         // 2. Read the CSV file
//         const csvMarksText = fs.readFileSync(req.file.path, 'utf8');

//         // 3. Parse CSV into an array of objects
//         // Expected CSV format: Subject, Credit, GradePoint
//         const semesterData = parseAndMerge(csvMarksText);

//         // 4. Calculate SGPA using the formula
//         const grades = calculateSGPA(semesterData, sigp);

//         // 5. Cleanup (Delete temp file)
//         fs.unlinkSync(req.file.path);
        
//         // 6. Send grades
//         res.json({ 
//             success: true, 
//             sigp_applied: sigp,
//             grades: grades 
//         });

//     } catch (err) {
//         console.error(err);
//         // Clean up file if error occurs
//         if (req.file && fs.existsSync(req.file.path)) {
//             fs.unlinkSync(req.file.path);
//         }
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// Open server at port
app.listen(8000, () => console.log('Server is live at http://localhost:8000'));