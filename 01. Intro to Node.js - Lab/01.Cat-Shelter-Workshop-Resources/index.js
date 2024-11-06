const http = require("http");
const port = 3000;
const handlers = require("./handlers");


const server = http.createServer((request, response) => {
    console.log("Received request");

    for (handler of handlers) {
        if(!handler(request, response)){
            console.log("Request is handeled");
            break;
        } else{
            console.log("Next handler");
        }
    } 
    
});

server.listen(port);





