const express = require('express');
const router = express.Router();
// Add buildings list
const buildings = require('../models/building.js');

// City data
let cities = [];

// Route for making a new city
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
        // Pass city and buildings to the template
        res.render('city', { city, buildings });
    } else {
        res.send('City not found');
    }
});

// Route to "build" new structure
router.post('/:name/build', (req, res) => {
    const city = cities.find(city => city.name === req.params.name);
    const buildingName = req.body.building;
    const building = buildings.find(b => b.name === buildingName);

    if (city && building) {
        // Check for resources, resources math
        if (city.money >= building.cost && city.energy >= building.energyRequired) {
            city.money -= building.cost;
            city.energy -= building.energyRequired;
            city.population += building.populationIncrease;
            city.buildings.push(building.name);
            res.redirect(`/city/${city.name}`);
        } else {
            res.send('Not enough resources to build this.');
        }
    } else {
        res.send('City or building not found.');
    }
});

module.exports = router;
