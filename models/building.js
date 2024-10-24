// models/building.js


// That is buildlist beta.
// Need to balance food limit, energy and money generation! Make it realtime or turn-based


const buildings = [
    {
        name: 'Factory',
        cost: 50,
        energyRequired: 3,
        populationIncrease: 0,
        resourceGeneration: {
            money: 10,
            energy: 0,
            food: 0
        },
        resourceConsumption: {
            money: 0,
            energy: 3,
            food: 0
        }
    },
    {
        name: 'Food farm',
        cost: 30,
        energyRequired: 2,
        populationIncrease: 0,
        resourceGeneration: {
            money: 5,
            energy: 0,
            food: 15
        },
        resourceConsumption: {
            money: 0,
            energy: 2,
            food: 0
        }
    }
    // Add more buildings after test
];

module.exports = buildings;
