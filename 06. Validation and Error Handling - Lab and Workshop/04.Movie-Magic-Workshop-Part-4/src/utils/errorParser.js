function parseError(err) {
    if (err instanceof Error) {
        if(!err.errors) {
            // Generic or MongoDB error 
            console.log('Generic or MongoDB error ->', err);

            let errors = {};
            errors.message = [err.message];

            console.log('Generic or MongoDB error parsed ->', errors);
            return errors;           
            
        } else {
            // Mongoose error
            console.log('Mongoose error ->', err);

            const arr = Object.values(err.errors);
            const errors = Object.fromEntries(arr.map(e => [e.path, [e.message]]));
            
            console.log('Mongoose error parsed ->', errors);
            return errors;
        }

    }else if (Array.isArray(err)) {
        // Express-validator error
        console.log('Express-validator error ->', err);         
        
        let errors = {};

        // Works with more than one error message per validated field if there is no <bail()> used after each validation
        err.forEach(e => {            

            if(!errors[e.path]) {
                errors[e.path] = [];
            }
    
            errors[e.path].push(e.msg);            
        });         
       
        console.log('Validator error parsed ->', errors);
        return errors;        
    }    
}

module.exports = { parseError };