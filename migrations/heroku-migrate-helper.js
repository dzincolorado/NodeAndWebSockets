var migrate = require("./004-category");

migrate.up(function(){
	console.log("Heroku migration complete");
});
