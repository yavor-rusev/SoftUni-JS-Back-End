const url = require('url');
const fs = require('fs');
const path = require('path');
const { readStaticFile } = require('./utils');

function getContentType(url) {
    if(url.endsWith(".css")) {
        return 'text/css';
    } else if (url.endsWith(".ico")) {
        return 'image/svg+xml'; 
    } else if (url.endsWith(".png")) {
        return 'image/png';
    } else if (url.endsWith(".jpeg") || url.endsWith(".jpg")) {
        return 'image/jpeg';
    } else if (url.endsWith(".webp")) {
        return 'image/webp';
    }
}

module.exports = async (req, res) => {
    const pathname = url.parse(req.url).pathname;   

    if(pathname.startsWith("/content") && req.method === "GET") {
        console.log(`Received request for static file with MIME type ${getContentType(pathname)}`);      

        try{            
            const reader = await readStaticFile(pathname);                     

            res.writeHead(200, {
                "Content-Type": getContentType(pathname)
            });

            reader.pipe(res);           

            console.log(`Static file with MIME type ${getContentType(pathname)} is read and sent`);
            return false;

        }catch(err) {
            console.log("Returned error by static-files.js:", err.message);           
            
            res.writeHead(404, {
                "Content-Type": "text/plain"
            });

            res.write("File not found");
            res.end();
            return;            
        }
        
    }else {
        return true;
    }    
}

