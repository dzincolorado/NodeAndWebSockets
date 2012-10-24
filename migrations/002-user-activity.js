var db = require("mongojs").connect(process.env.MONGOLABLIFE_URI);

exports.up = function(next){
	db.createCollection("emotion", function(err, collection){
		
		//create emotion records
		var docs = [];
		docs.push({
			name: "Happy",
			value: 9,
			color: "green"
		});
		
		docs.push({
			name: "Angry",
			value: -6,
			color: "red"
		});
		
		docs.push({
			name: "High Stress",
			value: -10,
			color: "red"
		});
		
		docs.push({
			name: "Sad",
			value: -5,
			color: "orange"
		});
		
		docs.push({
			name: "No Feeling",
			value: 0,
			color: "brown"
		});
		
		docs.push({
			name: "Love",
			value: 10,
			color: "green"
		});
		
		collection.insert(docs);
	})
	
	//create userActivity record
	db.createCollection("userActivity", function(err, collection){
		var doc = {
			username: "firstuser",
			activity: "swimming",
			addedDate: new Date(),
			emotion: "Happy",
			emotionValue: 10,
			emotionColor: "green"
			};
			
		//remove all entries
		collection.remove({});
	  	
	  	next();
	});
	
};

exports.down = function(next){
  
  	next();
};
