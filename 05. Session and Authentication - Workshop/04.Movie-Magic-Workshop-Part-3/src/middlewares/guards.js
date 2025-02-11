function isGuest() {
    // Prevent accessing to page if user is already logged in 
    return function(req, res, next) {
        
        // Check if there is <user> (session) property in <request>
        if(!req.user) {
            next();
        } else {
            res.redirect('/');            
        }
    };
}

function isUser() {
    // Prevent accessing page if user isn`t logged in 
    return function(req, res, next) {
        
        // Check if there is <user> (session) property in <request>
        if(req.user) {
            next();
        } else {
            res.redirect('/login');           
        }
    };    
}

module.exports = {
    isGuest,
    isUser
};