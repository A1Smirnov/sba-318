const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cityRoutes = require('./routes/cityRoutes');
const errorHandler = require('./middleware/errorHandler');

// Set EJS Template
app.set('view engine', 'ejs');

// Middleware to body parse
app.use(bodyParser.urlencoded({ extended: true }));

// Connecting routes
app.use('/city', cityRoutes);

// Static files
app.use(express.static('public'));

// Main Page
app.get('/', (req, res) => {
    res.render('index', { title: 'City Simulator' });
});


// None-existing route tracer (404-catcher)
app.use((req, res, next) => {
    const error = new Error('Route Not Found');
    error.status = 404;
    next(error);
});

// Middleware for errors
app.use(errorHandler);

// Run and listen server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
