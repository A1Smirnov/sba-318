const express = require('express');
const router = express.Router();

// City data
let cities = [];

// Route for making new city
router.post('/create', (req, res) => {
    const cityName = req.body.name;
    const newCity = {
        name: cityName,
        population: 100,
        money: 1000,
        energy: 500,
        buildings: []
    };
    cities.push(newCity);
    res.redirect(`/city/${cityName}`);
});

// Route to check city
router.get('/:name', (req, res) => {
    const city = cities.find(city => city.name === req.params.name);
    if (city) {
        res.render('city', { city });
    } else {
        res.send('City not found');
    }
});

module.exports = router;
