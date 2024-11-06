const url = require("url");
const fs = require("fs");
const path = require("path");
const cats = require("../data/cats.json");


const catTemplate = (cat) => {
    return `<li>
                <img src=${cat.image} alt="Black Cat">
                <h3>${cat.name}</h3>
                <p><span>Breed: </span>${cat.breed}</p>
                <p><span>Description: </span>${cat.description}</p>
                <ul class="buttons">
                    <li class="btn edit"><a href="">Change Info</a></li>
                    <li class="btn delete"><a href="">New Home</a></li>
                </ul>
            </li>`
}

module.exports = (request, response) => {      
    const pathname = url.parse(request.url).pathname;
    
    if((pathname === '/' || pathname === '/index.html') && request.method === 'GET') {
        //Implement the logic for showing home html view
        console.log("Received request for Home view");
        
        //Constructs absolute path to index.html
        let pathToIndexHtml = path.normalize(
            path.join(__dirname, '../views/home/index.html')
        );
        

        //Gets html for Home page from 'index.html' and assigns it to "data"
        fs.readFile(pathToIndexHtml, (err, data) => {

            // moje da go iznesa v otdeln callback funkciq???
            if(err) {
                //Failed to read index.html
                console.log(err);

                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                response.write('404 Not found');
                response.end();
                
                return; //true/false ???
            } else {
                //Secceeded to read index.html
                console.log("Type of data is ", typeof data);

                //Creates catTemplates in <ul> in index.html 
                const html = data.toString().replace("%%catContent%%", cats.map(catTemplate).join("\n"));               

                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                response.write(html);
                response.end();

                console.log('Index.html is read and sent');
            }
        })        

        return false;

    } else {
        //true - request is not handled
        return true;
    }
}