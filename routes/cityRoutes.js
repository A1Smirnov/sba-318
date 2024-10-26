const express = require('express');
const router = express.Router();
// Add buildings list
const buildings = require('../models/building.js');
// Add logger
const logger = require('../middleware/logger.js');
const quests = require('../models/quests.js');

// Logger middleware for all routes
router.use(logger);
// City data
let cities = [];


router.get('/quests', (req, res) => {
    // Render the quests page, passing the quests data to the view
    res.render('quests', { quests });
});

// Route to toggle quest completion
router.post('/quests/toggle-completion/:id', (req, res) => {
    const questId = parseInt(req.params.id);
    const quest = quests.find(q => q.id === questId);

    if (quest) {
        quest.completed = !quest.completed;

        // Reward the player only if the quest has been newly completed
        if (quest.completed) {
            // Add reward logic here, for example:
            // city.money += quest.reward.money;
            // city.population += quest.reward.population;
        }

        res.json({ success: true, quest });
    } else {
        res.json({ success: false });
    }
});


// Route for making a new city
router.post('/create', (req, res, next) => {
    try {
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
    } catch (error) {
        next(error);
    }
});

// Route to check city
router.get('/:name', (req, res, next) => {
    try {
        const city = cities.find(city => city.name === req.params.name);
        if (city) {
            // Pass city and buildings to the template
            res.render('city', { city, buildings });
        } else {
            const error = new Error('City not found');
            error.status = 404;
            next(error);
        }
    } catch (error) {
        next(error);
    }
});

// Route to "build" new structure
router.post('/:name/build', (req, res, next) => {
    try {
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
                const error = new Error('Not enough resources to build this.');
                error.status = 400;
                next(error);
            }
        } else {
            const error = new Error('City or building not found.');
            error.status = 404;
            next(error);
        }
    } catch (error) {
        next(error);
    }
});

// Route to pass the turn
router.post('/:name/pass-turn', (req, res, next) => {
    try {
        const city = cities.find(city => city.name === req.params.name);
        
        if (city) {
            // Define resources
            let totalMoneyGenerated = 0;
            let totalEnergyGenerated = 0;
            let totalFoodGenerated = 0;

            // Check each building for economic calculations
            city.buildings.forEach(buildingName => {
                const building = buildings.find(b => b.name === buildingName);
                
                if (building) {
                    // Test for sufficient resources
                    if (city.energy >= building.resourceConsumption.energy) {
                        // Resource generation by building
                        totalMoneyGenerated += building.resourceGeneration.money;
                        totalEnergyGenerated += building.resourceGeneration.energy;
                        totalFoodGenerated += building.resourceGeneration.food;

                        // Resource consumption
                        city.money -= building.resourceConsumption.money;
                        city.energy -= building.resourceConsumption.energy;
                        city.food -= building.resourceConsumption.food;
                    } else {
                        // Buildings without enough resources do not function
                        console.log(`${buildingName} not functioning due to lack of energy/resources.`);
                    }
                }
            });

            // Update city resources
            city.money += totalMoneyGenerated;
            city.energy += totalEnergyGenerated;
            city.food += totalFoodGenerated;

            // Redirect to the city view
            res.redirect(`/city/${city.name}`);
        } else {
            const error = new Error('City not found.');
            error.status = 404;
            next(error);
        }
    } catch (error) {
        next(error);
    }
});

// Route to display quests list


module.exports = router;
