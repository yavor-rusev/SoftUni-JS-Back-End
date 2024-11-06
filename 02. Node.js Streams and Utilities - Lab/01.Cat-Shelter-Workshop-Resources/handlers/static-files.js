const url = require('url');
const fs = require('fs');
const path = require('path');

function getContentType(url) {
    if(url.endsWith(".css")) {
        return 'text/css';
    } else if (url.endsWith(".ico")) {
        return 'image/svg+xml'; 
    } 
}

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if(pathname.startsWith("/content") && req.method === "GET") {
        console.log(`Received request for static file with MIME type ${getContentType(pathname)}`);        

         //Constructs absolute path to static file
         let pathToStaticFile = path.normalize(
            path.join(__dirname, `..${pathname}`)
        );

        //Reads static file from "content" folder
        fs.readFile(pathToStaticFile, "utf-8", (err, data) => {
            if(err) {
                console.log(err);
                console.log(pathname);
                console.log(pathToStaticFile);
                
                res.writeHead(404, {
                    "Content-Type": "text/plain"
                });

                res.write("File not found");
                res.end();
                return;
            } 
            
            console.log("Type of data is ", typeof data);

            res.writeHead(200, {
                "Content-Type": getContentType(pathname)
            });

            res.write(data);
            res.end();

            console.log(`Static file with MIME type is ${getContentType(pathname)} is read and sent`);                      

            return false;

        })
    }else {
        return true;
    }    
}