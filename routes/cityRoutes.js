// models/cityRoutes.js

const express = require('express');
const router = express.Router();
const buildings = require('../models/building.js');
const logger = require('../middleware/logger.js');
const quests = require('../models/quests.js');

router.use(logger);
let cities = [];

// Route for creating a new city
router.post('/create', (req, res, next) => {
    try {
        const cityName = req.body.name;

        // Validation: Check if city name is provided and valid
        if (!cityName || !/^[a-zA-Z0-9\s-]+$/.test(cityName)) {
            return res.status(400).send('Invalid city name. Please use only letters, numbers, spaces, and hyphens.');
        }

        // Check if city already exists
        const existingCity = cities.find(city => city.name === cityName);
        if (existingCity) {
            return res.status(400).send('City already exists.');
        }

        const newCity = {
            name: cityName,
            population: 100,
            money: 1000,
            energy: 500,
            food: 0,
            buildings: []
        };
        
        cities.push(newCity);
        res.redirect(`/city/${cityName}`);
    } catch (error) {
        next(error);
    }
});

// Route to "build" new structure or upgrade an existing one
router.post('/:name/build', (req, res, next) => {
    try {
        const city = cities.find(city => city.name === req.params.name);
        const buildingName = req.body.building;
        const upgradeName = req.body.upgrade; // Get the upgrade name if provided
        let building = buildings.find(b => b.name === buildingName);

        if (city) {
            if (upgradeName) {
                // Logic for upgrading the building
                const upgrade = building.upgrades.find(u => u.name === upgradeName);

                if (upgrade) {
                    // Check resources for upgrading
                    if (city.money >= upgrade.cost && city.energy >= upgrade.energyRequired) {
                        city.money -= upgrade.cost;
                        city.energy -= upgrade.energyRequired;

                        // Apply the upgrade
                        const buildingIndex = city.buildings.indexOf(buildingName);
                        if (buildingIndex !== -1) {
                            city.buildings[buildingIndex] = upgrade.name; // Replace building with upgraded version
                        }

                        return res.redirect(`/city/${city.name}`);
                    } else {
                        const error = new Error('Not enough resources to upgrade this building.');
                        error.status = 400;
                        return next(error);
                    }
                } else {
                    const error = new Error('Upgrade not found.');
                    error.status = 404;
                    return next(error);
                }
            } else {
                // Logic for building a new structure
                if (building) {
                    if (city.money >= building.cost && city.energy >= building.energyRequired) {
                        city.money -= building.cost;
                        city.energy -= building.energyRequired;
                        city.population += building.populationIncrease;
                        city.buildings.push(building.name);
                        return res.redirect(`/city/${city.name}`);
                    } else {
                        const error = new Error('Not enough resources to build this.');
                        error.status = 400;
                        return next(error);
                    }
                } else {
                    const error = new Error('Building not found.');
                    error.status = 404;
                    return next(error);
                }
            }
        } else {
            const error = new Error('City not found.');
            error.status = 404;
            return next(error);
        }
    } catch (error) {
        next(error);
    }
});

// Additional routes remain unchanged

// Route for quests
router.get('/quests/:difficulty([easy|medium|hard])', (req, res) => {
    const difficulty = req.params.difficulty;
    
    // Filter quests
    const filteredQuests = quests.filter(quest => quest.difficulty === difficulty);

    res.render('quests', { quests: filteredQuests });
});

// Route to toggle quest completion for a specific city
router.post('/:name/quests/toggle-completion/:id', (req, res, next) => {
    const questId = parseInt(req.params.id);
    const cityName = req.params.name;
    const city = cities.find(c => c.name === cityName);
    const quest = quests.find(q => q.id === questId);

    if (city && quest) {
        // Toggle completion status
        quest.completed = !quest.completed;

        // Apply rewards only if the quest is newly completed
        if (quest.completed) {
            city.money += quest.reward.money || 0;
            city.population += quest.reward.population || 0;
        }

        res.json({ success: true, quest });
    } else {
        res.status(404).json({ success: false, message: 'City or quest not found' });
    }
});

// Route to display quests list for a specific city
router.get('/:name/quests', (req, res, next) => {
    const cityName = req.params.name;
    const city = cities.find(c => c.name === cityName);

    if (city) {
        res.render('quests', { quests, city });
    } else {
        const error = new Error('City not found');
        error.status = 404;
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

// Route to delete a building
router.delete('/:name/buildings/:buildingName', (req, res, next) => {
    try {
        const city = cities.find(city => city.name === req.params.name);
        const buildingName = req.params.buildingName;

        if (city) {
            // Check if the building exists in the city's buildings list
            const buildingIndex = city.buildings.indexOf(buildingName);

            if (buildingIndex !== -1) {
                // Remove the building from the city's buildings list
                city.buildings.splice(buildingIndex, 1);
                res.status(200).json({ message: 'Building deleted successfully.' });
            } else {
                const error = new Error('Building not found in the city.');
                error.status = 404;
                next(error);
            }
        } else {
            const error = new Error('City not found.');
            error.status = 404;
            next(error);
        }
    } catch (error) {
        next(error);
    }
});

// Route for deleting a building
router.post('/:name/buildings/:buildingName', (req, res) => {
    const cityName = req.params.name;
    const buildingName = req.params.buildingName;

    // Find the city
    const city = cities.find(c => c.name === cityName);
    if (!city) {
        return res.status(404).send('City not found');
    }

    // Find the building
    const buildingIndex = city.buildings.indexOf(buildingName);
    if (buildingIndex > -1) {
        city.buildings.splice(buildingIndex, 1);
        return res.redirect(`/city/${cityName}`);
    } else {
        return res.status(404).send('Building not found');
    }
});

// route for upgrading a building (revised)
router.patch('/:name/upgrade', (req, res, next) => {
    try {
        const city = cities.find(c => c.name === req.params.name);
        const { buildingName, upgradeName } = req.body; 

        if (!city) return res.status(404).send('City not found');

        const building = buildings.find(b => b.name === buildingName);
        if (!building) return res.status(404).send('Building not found');

        const upgrade = building.upgrades.find(u => u.name === upgradeName);
        if (!upgrade) return res.status(404).send('Upgrade not found');

        // Check for sufficient resources
        if (city.money >= upgrade.cost && city.energy >= upgrade.energyRequired) {
            city.money -= upgrade.cost;
            city.energy -= upgrade.energyRequired;
            // Assuming upgrades replace buildings in city.buildings
            city.buildings[city.buildings.indexOf(buildingName)] = upgrade.name;
            return res.redirect(`/city/${city.name}`);
        } else {
            return res.status(400).send('Not enough resources to upgrade this building');
        }
    } catch (error) {
        next(error);
    }
});




module.exports = router;
