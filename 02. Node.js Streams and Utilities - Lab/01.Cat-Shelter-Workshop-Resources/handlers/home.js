const url = require("url");
const fs = require("fs");
const path = require("path");
const { layout, readHTMLTemplate, sendError404 } = require("./utils");
const { getCats } = require("./model");


const catTemplate = (cat) => {
    return `<li>
                <img src="${cat.image}" alt="${cat.name}">
                <h3>${cat.name}</h3>
                <p><span>Breed: </span>${cat.breed}</p>
                <p><span>Description: </span>${cat.description}</p>
                <ul class="buttons">
                    <li class="btn edit"><a href="/cats-edit/${cat._id}" >Change Info</a></li>
                    <li class="btn delete"><a href="/cats-find-new-home/${cat._id}" >New Home</a></li>
                </ul>
            </li>`
}

module.exports = async (request, response) => {      
    const pathname = url.parse(request.url).pathname;
    
    if((pathname === '/' || pathname === '/index.html') && request.method === 'GET') {
        //Implement the logic for showing home view
        console.log("Received request for Home view");       
        
        try{ 
            //Read home.html            
            let body = await readHTMLTemplate("home");         

            //Read layout.html and attach home.html as body
            let homeTemplate = await layout(body, true);            
                  

            //Creates catTemplates in <ul> in home.html body
            const cats = await getCats();            
            const html = homeTemplate.toString().replace("%%catContent%%", cats.map(catTemplate).join("\n"));
            
            // Send response
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });

            response.write(html);
            response.end();

            console.log('home.html is composed and sent');
            return false;

        }catch (err) {
            // Failed to read some of the files
            console.log(err);

            await sendError404(response);            
            return;
        }           

    } else {        
        return true; //true -> request is not handled
    }
}