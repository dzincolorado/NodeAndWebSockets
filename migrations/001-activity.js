var db = require("../db/db").db();

exports.up = function(next){
	//activity.save("");
	
	//create the activity collection and seed table
	db.createCollection("activity", function(err, collection){
		var docs = [];
		docs.push({"name": "running", "addedDate": new Date()});
		docs.push({"name": "swimming", "addedDate": new Date()});
		docs.push({"name": "cycling", "addedDate": new Date()});
		docs.push({"name": "reading", "addedDate": new Date()});
		docs.push({"name": "tv", "addedDate": new Date()});
		docs.push({"name": "drinking", "addedDate": new Date()});
		docs.push({"name": "working", "addedDate": new Date()});
		docs.push({"name": "yard work", "addedDate": new Date()});
		docs.push({"name": "building", "addedDate": new Date()});
		
		collection.insert(docs);
		
		//setup the index
		collection.ensureIndex({"name":1});
	  	next();	
	});
};

exports.down = function(next){
	db.dropCollection("activity", function(err){
		console.log("activity collection dropped");
		
		next();
	});
};
