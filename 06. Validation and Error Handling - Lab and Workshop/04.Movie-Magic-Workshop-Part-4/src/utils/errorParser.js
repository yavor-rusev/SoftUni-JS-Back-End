function parseError(err) {
    if (err instanceof Error) {
        if(!err.errors) {
            // Generic or MongoDB error 
            console.log('Generic or MongoDB error ->', err);
            
        } else {
            // Mongoose error
            console.log('Mongoose error ->', err);
        }

    }else if (Array.isArray(err)) {
        // Express-validator error
        let errors = {}; 
        
        // Works with more than one error message per validated field if there is no <bail()> used after each validation
        err.forEach(e => {            

            if(!errors[e.path]) {
                errors[e.path] = [];
            }
    
            errors[e.path].push(e.msg);            
        });         
       
        console.log('Validator error ->', errors);
        
        return errors;        
    } 
}

module.exports = { parseError };