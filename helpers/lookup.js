var db = require("../db/db");

function getLookup(lookupType, sendResponse){
	var lookupList = [];
	
	console.log(lookupType);
	
	if(lookupType.trim().length == 0){
		sendResponse(JSON.stringify(lookupList));
	}
	else if(lookupType.toLowerCase().trim() == "emotion"){
		db.emotion().find({}, function(err, docs){
			docs.forEach(function(doc){
				lookupList.push(doc);
			});
			
			console.log("about to return lookup list");
			
			console.log("writing list to response stream");
			sendResponse(null, JSON.stringify(lookupList));
		});
	}
}

exports.getLookup = getLookup;