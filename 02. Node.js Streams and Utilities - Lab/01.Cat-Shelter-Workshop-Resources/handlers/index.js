const homeHandler = require("./home");
const staticFiles = require("./static-files");
const catsAndBreedsHandler = require("./cats");
const searchHandler = require("./search");

module.exports = [homeHandler, staticFiles, catsAndBreedsHandler, searchHandler];