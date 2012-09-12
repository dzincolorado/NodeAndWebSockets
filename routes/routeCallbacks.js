var activity = require("../db/db").activity();
var lookupHelper = require("../helpers/lookup");

function index(request, response){
	response.render("trackers", {locals: {}});
}

function autoComplete(request, response){
	
	response.writeHead(200, {"content-type":"text/plain"});
	
	//TODO: trim term
	var term = request.query.term;
	
	if(term.length > 2){
		activity.find({"name": {"$regex" : "(" + term + ")"}}, function(err, docs){
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

function lookup(request, response){
	var lookupType = request.params.type;
	
	var lookupList = [];
	//TODO: need to create as callback since lines are running out of order
	lookupHelper.getLookup(lookupType, lookupList);
	console.log(lookupList);
	response.write(JSON.stringify(lookupList));
	console.log("wrote lookup list to response");
	response.end();
}	

function lookupCallback(){
	
}

exports.index = index;
exports.autoComplete = autoComplete;
exports.lookup = lookup;