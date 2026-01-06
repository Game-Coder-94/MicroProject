const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });    // Temp storage
const fs = require('fs');
const grader = require('./utils/grader');

// Create app (Server) instance
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

// Routes
app.get('/', (req, res) => {
    res.render('index', { data: "null" });
});

app.get('/hello', (req, res) => {
    res.send('Hi! there...');
})

app.post('/calculate', upload.single('csvFile'), (req, res) => {
    // 1. Get data in csv format
    const csvText = fs.readFileSync(req.file.path, 'utf8');

    // 2. Convert data
    const studentsData = parseCSV(csvText);

    // 3. Process data
    const results = grader.calculateGrades(studentsData);
    
    // 4. Display results
    res.render('index', { data: results});
})

// Open server at port
app.listen(3000, () => console.log('Server is live at http://localhost:3000'));