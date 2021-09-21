const faker = require('faker');
const fs = require('fs');

// Set locale to use Vietnamese
faker.locale = 'en';

const generateCities = (n) => {
    const cities = [];
    if (n <= 0) return cities;


    Array.from(new Array(n)).forEach(() => {
        const cityName = faker.address.cityName();
        cities.push({
            id: faker.datatype.uuid(),
            name: cityName,
            code: cityName.toLowerCase().replace(' ', '_'),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    });
    return cities;
}

const generateStudents = (n, cities) => {
    const students = [];
    if (n <= 0) return students;

    Array.from(new Array(n)).forEach(() => {
        const randomNumber = Math.random();
        const cityIndex = Math.floor(randomNumber * cities.length);
        students.push({
            id: faker.datatype.uuid(),
            name: faker.name.findName(),
            age: faker.datatype.number({
                min: 18,
                max: 60
            }),
            mark: faker.datatype.number({
                min: 0,
                max: 10,
            }),
            gender: randomNumber >= 0.5 ? 'male' : 'female',
            city: cities[cityIndex].name,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    });
    return students;
}

// Generate data
(() => {
    const cities = generateCities(20);
    const students = generateStudents(200, cities);
    const db = {
        cities,
        students,
    }

    // Write file
    fs.writeFile('db.json', JSON.stringify(db), () => {
        console.log('Generate data successfully!');
    })
})()