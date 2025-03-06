const { homeRouter } = require("../controllers/home");

function configRoutes(app) {
    app.use(homeRouter);
    
    //TODO add routers
}

module.exports = { configRoutes };