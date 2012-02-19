// Module Dependencies
express = require('express');
fs = require('fs');
async = require('async');
Sequelize = require("sequelize");
_ = require('underscore');
db = require('./config/db');
config = require('./config/app');



// Bootstrap and sync database
db.bootstrap();

// automatically grab all models from models directory
// (if no 'id' attribute was provided, take a guess)
// NOT CASE SENSITIVE
global.modelNames = [];
_.each(require('require-all')({
		dirname: __dirname + '/models'
		, filter: /(.+)\.js$/
	}),function (model, filename) {
	var className = model.id || filename;
	className = capitalizeFirstLetter(className);
	global.modelNames.push(className);
	global[className] = model.model;
});

// Create domain associations
_.each(modelNames,function (className) {
	global[className].options.associate();
});



// HTTPs
/*
var app = module.exports = express.createServer({
    key: fs.readFileSync('ssl/private.key.pem'),
    cert: fs.readFileSync('ssl/combined.crt')
});
*/

// HTTP
var app = module.exports = express.createServer();

// Configuration
// Enable JSONP
app.enable("jsonp callback");

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Instantiate services
ApiService = require('./services/ApiService');


// Map Routes
// *** NOTE: MUST BE AFTER app.configure in order for bodyparser to work ***
(apiRouter = require('./apiRouter')).mapUrls(app);
(router = require('./router')).mapUrls(app);



// Start server
app.listen(config.port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);




function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}