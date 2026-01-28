// Import libs
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

// Import utilities
const { calculateGrades } = require('./utils/grader');
const { calculateSGPA } = require('./utils/calcSGPA');
const { parseCSV } = require('./utils/parser');
const { error } = require('console');

// Create app (Server) instance
const app = express();
const upload = multer({ dest: 'uploads/' });    // Temp storage

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
app.post('/grades', upload.single('csvFile'), (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // 1. Get data in csv format
        const csvText = fs.readFileSync(req.file.path, 'utf8');

        // 2. Convert data
        const studentsData = parseCSV(csvText);

        // 3. Process data
        const results = calculateGrades(studentsData, sigp);

        // 4. Cleanup
        fs.unlinkSync(req.file.path);
        
        // 4. Send results to frontend
        res.json({ success: true, results: results });

    } catch (err) {
        console.error(err);
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
//         const csvText = fs.readFileSync(req.file.path, 'utf8');

//         // 3. Parse CSV into an array of objects
//         // Expected CSV format: Subject, Credit, GradePoint
//         const semesterData = parseCSV(csvText);

//         // 4. Calculate SGPA using the formula
//         const results = calculateSGPA(semesterData, sigp);

//         // 5. Cleanup (Delete temp file)
//         fs.unlinkSync(req.file.path);
        
//         // 6. Send results
//         res.json({ 
//             success: true, 
//             sigp_applied: sigp,
//             results: results 
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