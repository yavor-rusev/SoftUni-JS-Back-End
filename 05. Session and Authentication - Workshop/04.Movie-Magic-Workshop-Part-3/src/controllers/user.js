const { register, login } = require('../services/userService');
const { createToken } = require('../services/tokenService');

module.exports = {
    registerGet: async (req, res) => {
        res.render('register', { pageTitle: 'Register' });
    },

    registerPost: async (req, res) => {
        const {email, password, repass} = req.body;        
        
        try {

            //Validate input data
            if(!email || !password) {
                throw new Error('All fields are requiered!');
            }

            if(password !== repass) {
                throw new Error('Passwords do not match!');
            }

            // Create user record
            const user = await register(email, password);

            // Create user token
            const token = createToken(user);            

            // Send token-cookie to client
            res.cookie('token', token, {httpOnly: true});

            res.redirect('/'); 

        }catch(err) {
            console.log('catched register error ->', err.message);
            
            res.render('register', { pageTitle: 'Register', inputData: { email }, errorMessage: err.message});
            return;
        }        

    },

    loginGet: async (req, res) => {
        res.render('login', { pageTitle: 'Login' });
    },

    loginPost: async (req, res) => {
        console.log('login post');
        
        const {email, password} = req.body;

        try{
            //Validate input data
            if(!email || !password) {
                throw new Error('All fields are requiered!');
            }

            // Get authenticated user
            const user = await login(email, password);

            // Create user token
            const token = createToken(user);

            // Send token-cookie to client
            res.cookie('token', token, {httpOnly: true});

            res.redirect('/');

        } catch(err) {
            console.log('catched login error ->', err.message);

            res.render('login', { pageTitle: 'Login', inputData: { email }, errorMessage: err.message});
            return;
        }        
    },

    logout: (req, res) => {
        // clear token-cookie
        res.clearCookie('token');    
        res.redirect('/');
    }
};