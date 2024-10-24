const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Set EJS Template
app.set('view engine', 'ejs');

// Middleware to body parse
app.use(bodyParser.urlencoded({ extended: true }));

// Connecting routes
const cityRoutes = require('./routes/cityRoutes');
app.use('/city', cityRoutes);

// Static files
app.use(express.static('public'));

// Main Page
app.get('/', (req, res) => {
    res.render('index', { title: 'City Simulator' });
});

// Run and listen server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
