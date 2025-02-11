const { verifyToken } = require('../services/tokenService');

function session() {
    // Return function to be invoked after <cookie-parser> middleware
    return function(req, res, next) {        
        const token = req.cookies.token;

        // Check if there is a token-cookie in request
        if(token) {
            try{
                // Check if token is valid and throw error if false
                const payload = verifyToken(token);
    
                // Attach user data (session) as property to request if token is valid
                req.user = payload;

                // Attach <hasUser> property to global context object <locals> that is visible for Handelbars layouts
                res.locals.hasUser = true;               

            } catch(err) {
                // Clear token-cookie if token is invalid
                console.log('Session middleware throw error ->', err.message);                
                res.clearCookie('token');                
            }
        }
        
        next();
    };
}

module.exports = { session };