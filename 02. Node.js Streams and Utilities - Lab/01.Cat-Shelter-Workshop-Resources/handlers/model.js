const fsPromises = require('fs/promises');
const path = require('path');

const catsFilePath = path.normalize(
    path.join(__dirname, "../data/cats.json")
);

const breedsFilePath = path.normalize(
    path.join(__dirname, "../data/breeds.json")
);

async function readData(fileName) {    
    const jsonBuffer = await fsPromises.readFile(fileName);
    const data = JSON.parse(jsonBuffer.toString());
    
    return data;
}

async function writeData(fileName, data) {
    await fsPromises.writeFile(fileName, JSON.stringify(data, null, 2));    
}

async function getCats() {
    return await readData(catsFilePath);    
}

async function addCat(catData) {
    catData._id = generateId();

    let cats = await getCats();
    cats.push(catData);
    
    await writeData(catsFilePath, cats);
}

async function updateCats(newData) {
    await writeData(catsFilePath, newData);
}

async function getBreeds() {
    return await readData(breedsFilePath);    
}

async function addBreed(breed) {
    let breeds = await getBreeds();    

    if(breeds.includes(breed)){
        console.log("This breed already exist:", breed);        
        return;
    }

    breeds.push(breed);
    await writeData(breedsFilePath, breeds);
}

async function searchCats(search) {
    const cats = await getCats();
    const result = cats.filter(cat => (
        cat.name.toLowerCase() === search.toLowerCase() || 
        cat.breed.toLowerCase().includes(search.toLowerCase()) 
    ));
    return result;    
}

function generateId() {
    const timestamp = Date.now().toString(36);
    const randomSuffix = Math.floor(Math.random() * 1000).toString(36);
    return `${timestamp}-${randomSuffix}`;
}


module.exports = {
    getCats,
    addCat,
    updateCats,
    getBreeds,
    addBreed,
    searchCatsByBreed: searchCats
}
