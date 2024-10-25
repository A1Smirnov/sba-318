const express = require('express');
const router = express.Router();
// Add buildings list
const buildings = require('../models/building.js');
// Add logger
const logger = require('../middleware/logger');

// Logger middleware for all routes
router.use(logger);
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

// Route to pass the turn
router.post('/:name/pass-turn', (req, res) => {
    const city = cities.find(city => city.name === req.params.name);
    
    if (city) {
        // Define resources
        let totalMoneyGenerated = 0;
        let totalEnergyGenerated = 0;
        let totalFoodGenerated = 0;

        // Check each buildings for economy calc
        city.buildings.forEach(buildingName => {
            const building = buildings.find(b => b.name === buildingName);
            
            if (building) {
                // Test consumpted resources
                if (city.energy >= building.resourceConsumption.energy) {
                    // Building resource generation
                    totalMoneyGenerated += building.resourceGeneration.money;
                    totalEnergyGenerated += building.resourceGeneration.energy;
                    totalFoodGenerated += building.resourceGeneration.food;

                    // Reource consumption
                    city.money -= building.resourceConsumption.money;
                    city.energy -= building.resourceConsumption.energy;
                    city.food -= building.resourceConsumption.food;
                } else {
                    // Lack of resource lead to non-functional buildings
                    console.log(`${buildingName} not functioning because a lack of energy(resources).`);
                }
            }
        });

        // Update city resources
        city.money += totalMoneyGenerated;
        city.energy += totalEnergyGenerated;
        city.food += totalFoodGenerated;

        // Redirect to a city
        res.redirect(`/city/${city.name}`);
    } else {
        res.send('City not found.');
    }
});

module.exports = router;
