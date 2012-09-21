var db = require("../db/db");
var lookupHelper = require("../helpers/lookup");
var responseHelper = require("../helpers/response");

function index(request, response){
	response.render("trackers", {locals: {}});
}

function autoComplete(request, response, expressServer){
	
	response.writeHead(200, {"content-type":"text/plain"});
	
	//TODO: trim term
	var term = request.query.term;
	
	if(term.length > 2){
		var db2 = new db.db2(expressServer);
		db2.activity().find({"name": {"$regex" : "(" + term + ")"}}, function(err, docs){
			if(docs.length == 0){
				//activity.save(request.query.term))	
			}
			
			console.log(docs.length);
			
			var suggestedValues = [];
			docs.forEach(function(doc){
				suggestedValues.push(doc["name"]);
			});
			
			response.write(JSON.stringify(suggestedValues));
			response.end();	
		});
	}
	else
	{
		response.end();
	}
}

function lookup(request, response, expressServer){
	var lookupType = request.params.type;
	lookupHelper.getLookup(lookupType, responseHelper.makeSendResponse(response), expressServer);
}	

exports.index = index;
exports.autoComplete = autoComplete;
exports.lookup = lookup;