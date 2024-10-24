function resourceCalculation(req, res, next) {
    const city = req.city; // Send object City to middleware

    if (city) {
        // Calc resources
        let totalPopulation = 100;
        let totalEnergy = 500;

        city.buildings.forEach(building => {
            const buildingData = buildings.find(b => b.name === building);
            if (buildingData) {
                totalPopulation += buildingData.populationIncrease;
                totalEnergy -= buildingData.energyRequired;
            }
        });

        // City resource update
        city.population = totalPopulation;
        city.energy = totalEnergy;
    }

    next();
}

const resourceCalculation = require('../middleware/resourceCalculation');

// Using middleware to update game resources after each query
router.use('/:name', (req, res, next) => {
    const city = cities.find(city => city.name === req.params.name);
    if (city) {
        req.city = city; // city to req to use in middleware
        next();
    } else {
        res.send('City not found');
    }
}, resourceCalculation);

module.exports = resourceCalculation;
