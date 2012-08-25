var trackersDB = require("mongojs").connect("trackers");
//var s = require("string") //TODO: npm install --production string
//var nodeCache = require("memory-cache");//TODO:npm install memory-cache, node-cache

//TODO: install migrations?  npm install migrate

module.exports = function(expressServer, passport, routeCallbacks){
	expressServer.get("/", function(request, response){
		response.render("trackers", {locals: {}});
	});
	
	//TODO:get values from store and also save new value if applicable
	expressServer.get("/autocomplete", function(request, response){
		response.writeHead(200, {"content-type":"text/plain"});
		
		//TODO: trim term
		var term = request.query.term;
		
		if(term.length > 0){
			//var activities = trackersDB.collection("Activity")
			//activities.find({"name": term})
			//activities.save(request.query.term))
			
			var suggestedValues = ["test1", "test2"];
			response.write(JSON.stringify(suggestedValues));
			response.end();
		}
	})
}	