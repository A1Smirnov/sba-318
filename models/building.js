// models/building.js


// That is buildlist beta.
// Need to balance food limit, energy and money generation! Make it realtime or turn-based


// models/building.js

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
        },
        upgrades: [
            {
                name: 'Advanced Factory',
                cost: 100,
                energyRequired: 4,
                resourceGeneration: {
                    money: 15,
                    energy: 0,
                    food: 0
                },
                resourceConsumption: {
                    money: 0,
                    energy: 4,
                    food: 0
                }
            }
        ]
    },
    {
        name: 'Food Farm',
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
        },
        upgrades: [
            {
                name: 'Hydroponic Farm',
                cost: 60,
                energyRequired: 3,
                resourceGeneration: {
                    money: 0,
                    energy: 0,
                    food: 25
                },
                resourceConsumption: {
                    money: 0,
                    energy: 3,
                    food: 0
                }
            }
        ]
    },
    {
        name: 'Power Plant',
        cost: 80,
        energyRequired: 5,
        populationIncrease: 0,
        resourceGeneration: {
            money: 0,
            energy: 20,
            food: 0
        },
        resourceConsumption: {
            money: 5,
            energy: 0,
            food: 0
        }
    },
    {
        name: 'Market',
        cost: 40,
        energyRequired: 2,
        populationIncrease: 0,
        resourceGeneration: {
            money: 8,
            energy: 0,
            food: 10
        },
        resourceConsumption: {
            money: 2,
            energy: 0,
            food: 0
        }
    },
    {
        name: 'Residential Building',
        cost: 70,
        energyRequired: 1,
        populationIncrease: 5,
        resourceGeneration: {
            money: 0,
            energy: 0,
            food: 0
        },
        resourceConsumption: {
            money: 0,
            energy: 1,
            food: 5
        }
    },
    {
        name: 'Research Lab',
        cost: 120,
        energyRequired: 6,
        populationIncrease: 0,
        resourceGeneration: {
            money: 0,
            energy: 0,
            food: 0
        },
        resourceConsumption: {
            money: 10,
            energy: 3,
            food: 0
        },
        effect: 'Increases the efficiency of all buildings by 10%'
    }
];

module.exports = buildings;
