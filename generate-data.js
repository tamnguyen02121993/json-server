const faker = require('faker');
const fs = require('fs');

// Set locale to use English
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
            mark: faker.datatype.float({
                min: 0,
                max: 10,
                precision: 0.1,
            }),
            gender: randomNumber >= 0.5 ? 'male' : 'female',
            city: cities[cityIndex].code,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    });
    return students;
}
const generateAuthors = (n) => {
    const authors = [];
    if (n <= 0) return authors;

    Array.from(new Array(n)).forEach(() => {
        authors.push({
            id: faker.datatype.uuid(),
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            summary: faker.lorem.text(),
            avatar: faker.image.avatar(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })
    })

    return authors;
}

const generatePosts = (n, authors) => {
    const posts = [];
    if (n <= 0) return posts;

    Array.from(new Array(n)).forEach(() => {
        const randomNumber = Math.random();
        const authorIndex = Math.floor(randomNumber * authors.length);
        posts.push({
            id: faker.datatype.uuid(),
            title: faker.lorem.lines(1),
            description: faker.lorem.paragraph(5),
            author: authors[authorIndex].id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    });
    return posts;
}

// Generate data
(() => {
    const cities = generateCities(20);
    const students = generateStudents(200, cities);
    const authors = generateAuthors(50);
    const posts = generatePosts(1000, authors);
    const db = {
        cities,
        students,
        authors,
        posts
    }

    // Write file
    fs.writeFile('db.json', JSON.stringify(db), () => {
        console.log('Generate data successfully!');
    })
})()