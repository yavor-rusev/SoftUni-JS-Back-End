const fsPromises = require('fs/promises');
const { MovieModel } = require('../models/Model');

const databasePath = './data/database.json';

async function readFile() {
    const buffer = await fsPromises.readFile(databasePath);
    const dataAsJSON = buffer.toString();
    const database =  JSON.parse(dataAsJSON);

    return database;
}

async function writeFile(data) {
    const dataAsJSON = JSON.stringify(data, null, 2);
    await fsPromises.writeFile(databasePath, dataAsJSON);    
    
}

function idGenerator() {
    const id = 'xxxx-xxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16));
    return id;
}

function populateMovieModel(movieData) {
    const movieObj = new MovieModel();

    movieObj.id = movieData.id;
    movieObj.title = movieData.title;
    movieObj.genre = movieData.genre;
    movieObj.director = movieData.director;
    movieObj.year = Number(movieData.year);
    movieObj.imageURL = movieData.imageURL;
    movieObj.rating = Number(movieData.rating);
    movieObj.description = movieData.description;    

    return movieObj;
}

async function getAllMovies() {
    const data = await readFile();
    const moviesAsObjects = data.map(movieData => populateMovieModel(movieData));

    return moviesAsObjects;
}

async function getMovieById(id){
    const data = await readFile();    
    const movieData = data.find(movie => movie.id === id);    
    
    const movieAsObject = movieData ? populateMovieModel(movieData) : movieData;
    return movieAsObject;
}

async function createMovie(movieData) {
    const database = await readFile(databasePath);

    const movieObj = populateMovieModel(movieData);
    movieObj['id'] = idGenerator();
    database.push(movieObj);

    await writeFile(database);     
    return movieObj;
}


module.exports = {
    getAllMovies,
    getMovieById,
    createMovie
};