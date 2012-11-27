var db = require("../db/db");
function list(username, sendResponse, expressServer){
	var db2 = new db.db2(expressServer);
	
	//For now just get all userActivity documents.  
	//TODO: list userActivity by user.
	db2.userActivity().find({'username': username}, function(err, docs){
		
		console.log("# tracked: %d".replace("%d", docs.length));
		sendResponse(null, JSON.stringify(docs));
	});
}

exports.list = list;