const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const { layout, readHTMLTemplate, sendError404 } = require("./utils");
const { searchCatsByBreed } = require("./model");

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


module.exports = async (req, res) => {
    const pathname = url.parse(req.url).pathname;

    const querystring = url.parse(req.url).query;
    const searchedBreed = qs.parse(querystring).search;

    if(pathname.includes("/search") && req.method === "GET") {
        //Implement the logic for showing searched cats
        console.log("Received request for search breed");        

        try{
            //Read home.html            
            let body = await readHTMLTemplate("home");            

            //Read layout.html and attach home.html as body
            let searchTemplate = await layout(body, true);                    

            //Creates catTemplates in <ul> in home.html body
            const searchedCats = await searchCatsByBreed(searchedBreed);           
            const html = searchTemplate.toString().replace("%%catContent%%", searchedCats.map(catTemplate).join("\n"));
            
            // Send response
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(html);
            res.end();

            console.log('HTML is composed with searched cats and sent');
            return false;
 

        } catch(err) {
             // Failed to read some of the files
             console.log(err);

             await sendError404(res);            
             return;
        }        
    }

}





/*vizualizira Home page no samo s rezultatite 
    -> moje da go realiziram v home.js ili v model.js
    -> s GET ili POST zaqvka?
    -> kak kachvam queritata v URL-a pri GET zaqvka    
*/

