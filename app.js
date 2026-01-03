const express = require('express');
const grader = require('./utils/grader');

// Create app (Server) instance
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

// Routes
app.get('/', (req, res) => {
    res.send('On Index page');
    res.render('index', { data: null });
});

app.post('/calculate', (req, res) => {

})

// Open server at port
app.listen(3000, () => console.log('Server is live...'));