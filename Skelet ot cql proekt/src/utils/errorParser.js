function errorParser(err) {
    if(err instanceof Error) {
        if(!err.errors){
            // Generic or MongoDB error
            const error = new Error('Generic or MongoDB error error');
            error.errors = {'message': err.message};         

            return error;
        } else {
            //Mongoose error
            const error = new Error('Mongoose input validation error');
            error.errors = Object.fromEntries(Object.values(err.errors).map(e => [e.path, e.msg]));
            
            return error;
        }

    }else if (Array.isArray(err)) {
        // Express validator error
        const error = new Error('Express input validation error');
        error.errors = Object.fromEntries(err.map(e => [e.path, e.msg]));

        return error;
    }
}

module.exports = {
    errorParser
};