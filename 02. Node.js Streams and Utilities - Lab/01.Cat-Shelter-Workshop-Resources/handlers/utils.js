const fsPromises = require('fs/promises');
const path = require('path');

async function readStaticFile(filePath) {
    //Constructs absolute path to static file
    filePath = path.normalize(
        path.join(__dirname, `..${filePath}`)
    );

    console.log("Reading static file:", filePath);    

    //Open file for reading and create readable stream
    const fileHandle = await fsPromises.open(filePath, "r");
    return fileHandle.createReadStream();    
}


async function readHTMLTemplate(template) {    
    //Constructs absolute path to template
    let templatePath = path.normalize(
        path.join(__dirname, "../views/" + template + ".html")
    );          

    try{
        const data = await fsPromises.readFile(templatePath);
        console.log("Read HTML template:", template);
        return data.toString(); 

    }catch(err) {
        console.log("Error in readTemplate():", err.message);
        return;
    }   
}

async function layout(body, hasSearch) {  
    let layoutTemplate = await readHTMLTemplate("layout");

    let search = "";

    //Attaches search bar to HTML
    if(hasSearch) {
        search = await readHTMLTemplate("searchBar");
    }

    layoutTemplate = layoutTemplate.replace("%%search%%", search);

    //Attaches body of requested view to HTML
    return layoutTemplate.replace("%%body%%", body);
}

async function sendError404(response) {    
    console.log('Reseive response in sentError404:', response);
        
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });

    response.write('404 Not found');
    response.end();
}

module.exports = {
    readHTMLTemplate,
    layout,
    readStaticFile,
    sendError404
}