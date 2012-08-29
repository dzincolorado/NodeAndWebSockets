var activity = require("../db/db").activity();
//var s = require("string") //TODO: npm install --production string
//var nodeCache = require("memory-cache");//TODO:npm install memory-cache, node-cache

module.exports = function(expressServer, passport, routeCallbacks){
	expressServer.get("/", function(request, response){
		response.render("trackers", {locals: {}});
	});
	
	//TODO:get values from store and also save new value if applicable
	expressServer.get("/autocomplete", function(request, response){
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
	})
}	