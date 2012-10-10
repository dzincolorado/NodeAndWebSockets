var db = require("../db/db");

function getLookup(lookupType, sendResponse, expressServer){
	var lookupList = [];
	
	console.log(lookupType);
	
	if(lookupType.trim().length == 0){
		sendResponse(null, JSON.stringify(lookupList));
	}
	else if(lookupType.toLowerCase().trim() == "emotion"){
		
		//TODO: cache this list.
		var db2 = new db.db2(expressServer);
		db2.emotion().find({}, function(err, docs){
			/*
			docs.forEach(function(doc){
				lookupList.push(doc);
			});*/
			
			console.log("writing list to response stream");
			sendResponse(null, JSON.stringify(docs));
		});
	}
}

exports.getLookup = getLookup;