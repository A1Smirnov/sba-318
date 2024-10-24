// models/building.js


// That is buildlist beta.
// Need to balance food limit, energy and money generation! Make it realtime or turn-based


const buildings = [
    {
        name: "Factory",
        cost: 200,
        energyRequired: 100,
        populationIncrease: 20
    },
    {
        name: "School",
        cost: 150,
        energyRequired: 50,
        populationIncrease: 0
    },
    {
        name: "House",
        cost: 100,
        energyRequired: 30,
        populationIncrease: 50
    }
];

module.exports = buildings;
