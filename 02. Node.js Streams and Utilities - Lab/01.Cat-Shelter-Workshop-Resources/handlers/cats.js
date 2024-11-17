const url = require("url");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
// const qs = require("querystring"); // -> another way to parse queries passed in URL or in request's body instead of new URLSearchParams(<queriesAsString>)
const { readHTMLTemplate, layout, sendError404 } = require("./utils");
const { getBreeds, addBreed, addCat, getCats, updateCats } = require("./model");

/* Image URL's:
    "breed": "Bombay Cat",
    "image": "https://cdn.pixabay.com/photo/2015/06/19/14/20/cat-814952_1280.jpg"
    
    "breed": "Angora Cat",
    "image": "https://cdn.pixabay.com/photo/2018/08/08/05/12/cat-3591348_1280.jpg"
*/

const breedAsOptionTemplate = (breed, selectedBreed) => {
    let isSelected = "";

    if (selectedBreed && selectedBreed === breed) {
        isSelected = "selected";
    }

    return `<option value="${breed}" ${isSelected} >${breed}</option>`
}


module.exports = async (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if(pathname === "/cats/add-cat" && req.method === "GET") {        
        console.log("Received GET request for add-cat");       

        try{
            //Read addCat.html
            let body = await readHTMLTemplate("addCat");
            let addCatTemplate = await layout(body, false);

            //Creates breedOptions in <select> in addCat.html
            const breeds = await getBreeds();
            const html = addCatTemplate.replace("%%breeds%%", breeds.map(breed => breedAsOptionTemplate(breed)));
            
            //Send response
            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.write(html);
            res.end();

            console.log('addCat.html is composed and sent');
            return false;

        } catch(err) {
            console.log(err);
            
            await sendError404(res);            
            return; 
        }
        
    } else if (pathname === "/cats/add-cat" && req.method === "POST") {
        console.log("Received POST request for add-cat");

        try{
            const form = new formidable.IncomingForm({"keepExtensions" : true});

            //Parse input data of the form sent in request body
            form.parse(req, async (error, fields, files) => {
                if(error) {                    
                    console.log(error);
            
                    //Redirect back to Add-cat page                                
                    res.writeHead(301, {
                        "Location": "/cats/add-cat"
                    });

                    res.end()
                    return; 
                }  
                
                const oldImagePath = files.upload[0].filepath;
                const newImagePath = path.normalize(path.join(__dirname, "../content/images/", files.upload[0].originalFilename));                

                //Move uploaded file from temp files to images folder of the project
                fs.rename(oldImagePath, newImagePath, async (err) => {
                    if(err) {
                        //Redirect back to Add-cat page
                        console.log(err);
                        
                        res.writeHead(301, {
                            "Location": "/cats/add-cat"
                        });

                        res.end();
                        return;
                    }

                    console.log("Image file was uploaded seccessfully in images folder"); 

                    //Update cats.json
                    const cat = {
                        name: fields.name[0],
                        description: fields.description[0],
                        image: `http://localhost:3000/content/images/${files.upload[0].originalFilename}`,
                        breed: fields.breed[0]
                    };                   
    
                    await addCat(cat);
                    console.log("Added new cat to cats.json");
                    
                    //Redirect to Home page
                    res.writeHead(301, {"Location": "/"});
                    res.end();                       
                });             
                                       
            })               
                      
            return false;

        } catch(err) {
            console.log(err);
            
            //Redirect back to Add-cat page                       
            res.writeHead(301, {
                "Location": "/cats/add-cat"
            });

            res.end()
            return; 
        }


    } else if(pathname === "/cats/add-breed" && req.method === "GET") {        
        console.log("Received GET request for add-breed");
        
        try{
            //Read addBreed.html
            let body = await readHTMLTemplate("addBreed");
            let addBreedTemplate = await layout(body, false);           
            
            //Send response
            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.write(addBreedTemplate);
            res.end();

            console.log('addBreed.html is composed and sent');
            return false;

        } catch(err) {
            console.log(err);
            
            await sendError404(res);            
            return; 
        }

    } else if (pathname === "/cats/add-breed" && req.method === "POST") {
        console.log("Received POST request for add-breed");

        try{            
            let requestBody = "";            

            req.on("data", (chunk) => {
                requestBody+= chunk;
            });

            req.on("end", async () => {
                console.log("Received body of breed POST request:");

                //Return map with properties parsed from string body
                const inputData = new URLSearchParams(requestBody); // or const inputData = qs.parse(body);                
                const breed = inputData.get("breed"); // or const breed = inputData["breed"];               
                    
                if(breed !== "") {
                    await addBreed(breed);
                    console.log("New breed is added to breeds.json");

                    //Redirect to Add-cat page
                    res.writeHead(301, {
                        "Location": "/cats/add-cat"
                    });

                    res.end();
                } else {
                    //Redirect back to Add-breed page
                    console.log("Breed should not be an empty string");
                    
                    res.writeHead(301, {
                        "Location": "/cats/add-breed"
                    });

                    res.end();
                }
            });            

            return false;

        } catch(err) {
            console.log(err);

            //Redirect back to Add-breed page
            res.writeHead(301, {
                "Location": "/cats/add-breed"
            });

            res.end();           
            return;
        }       

    } else if (pathname.includes("/cats-edit") && req.method === "GET") {
        console.log("Received GET request for cats-edit");
        
        try{    
            //Find and get info of cat to edit
            const catId = pathname.replace("/cats-edit/", "");
            const cats = await getCats();
            const currentCat = cats.find(cat => cat._id === catId);            

            //Read and fill editCat.html
            let body = await readHTMLTemplate("editCat");
            let editCatTemplate = await layout(body, false);                   

            editCatTemplate = editCatTemplate.replace("%%name%%", currentCat.name);
            editCatTemplate = editCatTemplate.replace("%%description%%", currentCat.description);
            editCatTemplate = editCatTemplate.replace("%%image%%", currentCat.image);

            const breeds = await getBreeds();
            editCatTemplate = editCatTemplate.replace("%%breeds%%", breeds.map(breed => breedAsOptionTemplate(breed, currentCat.breed)));
            
            //Send response
            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.write(editCatTemplate);
            res.end();

            console.log('editCat.html is composed and sent');
            return false;

        } catch(err) {
            console.log(err);
            
            await sendError404(res);            
            return; 
        }
        
    } else if (pathname.includes("/cats-edit") && req.method === "POST") {
        console.log("Received POST request for cats-edit");

        try{
            const form = new formidable.IncomingForm({"keepExtensions": true});

            //Parse input data of the form sent in request body
            form.parse(req, async (err, fields, files) => {
                if(err) {
                    console.log(err);
                    
                    //Redirect back to Cats-edit page
                    res.writeHead(301, {
                        "Location": pathname
                    });

                    res.end();          
                    return; 
                }

                const oldImagePath = files.upload[0].filepath;
                const newImagePath = path.normalize(path.join(__dirname, "../content/images/", files.upload[0].originalFilename));
                
                //Move uploaded file from temp files to images folder of the project
                fs.rename(oldImagePath, newImagePath, async (err) => {
                    if(err) {
                        throw err;
                    }

                    console.log("Image file was uploaded seccessfully in images folder"); 

                    //Update cats.json
                    const catId = pathname.replace("/cats-edit/", "");
                    const cats = await getCats();                    

                    cats.forEach(cat => {
                        if(cat._id === catId) {
                            cat.name = fields.name[0];
                            cat.description = fields.description[0];                            
                            cat.image = `http://localhost:3000/content/images/${files.upload[0].originalFilename}`;
                            cat.breed = fields.breed[0];
                        }
                    });                    

                    await updateCats(cats);
                    console.log("Successfully edited cat's data in cats.json");
                    
                    //Redirect to Home page
                    res.writeHead(301, {
                        "Location": "/"
                    })
                    res.end();
                })
            });
            
            return false;
           
        }catch (err) {
            console.log(err);

            //Redirect back to Cats-edit page
            res.writeHead(301, {
                "Location": pathname
            });

            res.end();          
            return;
        }
        
    } else if (pathname.includes("/cats-find-new-home") && req.method === "GET") {
        console.log("Received GET request for cats-find-new-home");        

        try{
            //Find and get info of cat to find home
            const catId = pathname.replace("/cats-find-new-home/", "");
            const cats = await getCats();
            const currentCat = cats.find(cat => cat._id === catId);                      

            //Read and fill catShelter.html
            const body = await readHTMLTemplate("catShelter");
            let catShelterTemplate = await layout(body, false);           

            catShelterTemplate = catShelterTemplate.replace("%%image%%", currentCat.image);
            catShelterTemplate = catShelterTemplate.replace("%%name%%", currentCat.name);
            catShelterTemplate = catShelterTemplate.replace("%%description%%", currentCat.description);

            const breeds = await getBreeds();
            catShelterTemplate = catShelterTemplate.replace("%%breeds%%", breeds.map(breed => breedAsOptionTemplate(breed, currentCat.breed)));
                           
            //Send response
            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.write(catShelterTemplate);
            res.end();

            console.log('catShelter.html is composed and sent');
            return false;

        } catch(err) {
            console.log(err);
            
            await sendError404(res);            
            return; 
        }
        
    } else if (pathname.includes("/cats-find-new-home") && req.method === "POST") {
        console.log("Received POST request for cats-find-new-home");       
        
        try{
            //Update cats.json
            const catId = pathname.replace("/cats-find-new-home/", "");
            const cats = await getCats();
            const updatedCats = cats.filter(cat => cat._id !== catId);                     

            await updateCats(updatedCats);
            console.log("Successfully removed cat from cats.json");
            
            // Redirect to Home page
            res.writeHead(301, {
                "Location": "/"
            })
            res.end();
        
            return false;            
           
        } catch (err) {
            console.log(err);

            //Redirect back to Cat shelter page
            res.writeHead(301, {
                "Location": pathname
            });

            res.end();          
            return;
        }
        
    } else {
        return true;
    }
}

