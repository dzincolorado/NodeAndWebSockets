var db = require("../db/db");

function getLookup(lookupType, sendResponse, expressServer){
	var lookupList = [];
	
	console.log(lookupType);
	
	var db2 = new db.db2(expressServer);
	//TODO: cache this list.
	switch(lookupType.toLowerCase().trim())
	{
		case "emotion":
			db2.emotion().find({}, function(err, docs){			
				sendResponse(null, JSON.stringify(docs));
			});
			break;
		case "category":
			db2.category().find({}, function(err, docs){			
				sendResponse(null, JSON.stringify(docs));
			});
			break;
		default:
			sendResponse(null, JSON.stringify(lookupList));
			break;
	}
}

exports.getLookup = getLookup;