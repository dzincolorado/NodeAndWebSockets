var db = require("../db/db");

function getLookup(lookupType, lookupList){
	//var lookupList = [];
	
	console.log(lookupType);
	
	if(lookupType.trim().length == 0){
		return lookupList;
	}
	else if(lookupType.toLowerCase().trim() == "emotion"){
		db.emotion().find({}, function(err, docs){
			docs.forEach(function(doc){
				lookupList.push(doc);
			});
			
			console.log("about to return lookup list");
			
			return lookupList;
		});
	}
}

exports.getLookup = getLookup;