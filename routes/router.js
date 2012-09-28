var routeCallbacks = require("./routeCallbacks");
//var s = require("string") //TODO: npm install --production string
//var nodeCache = require("memory-cache");//TODO:npm install memory-cache, node-cache

module.exports = function(expressServer, passport){
	
	//autocomplete
	expressServer.get("/autocomplete", function(request, response){
			routeCallbacks.autoComplete(request, response, expressServer);
		});
	
	//get lookup
	expressServer.get("/lookup/:type", function(request, response){
		routeCallbacks.lookup(request, response, expressServer);
		});
	
	//create/update tracker
	expressServer.post("/trackers/upsert", function(request, response){
		routeCallbacks.upsert(request, response, expressServer);
	})
	
	//index
	expressServer.get("/", routeCallbacks.index);
	
};