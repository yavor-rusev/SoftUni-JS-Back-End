function isGuest() {
    return function(req, res, next) {
        if(req.user) {            
            res.redirect('/');
        } else {
            next();
        }
    };
}

function isUser() {
    return function(req, res, next) {
        if(!req.user) { 
            if(req.path === '/logout') {
                res.redirect('/');                
            } else {
                res.redirect('/login');
            }          
        } else {
            next();
        }      
    };
}

module.exports = {
    isGuest, 
    isUser
};