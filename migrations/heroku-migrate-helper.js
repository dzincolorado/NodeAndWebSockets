var migrate = require("./004-category");

migrate.up(function(){
	console.log("Heroku migration complete");
});

//NOTE: once deployed to heroku, run following command through toolbelt:  
//	heroku run node migrations/heroku-migrate-helper.js