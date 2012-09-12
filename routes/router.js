var routeCallbacks = require("./routeCallbacks");
//var s = require("string") //TODO: npm install --production string
//var nodeCache = require("memory-cache");//TODO:npm install memory-cache, node-cache

module.exports = function(expressServer, passport){
	
	//autocomplete
	expressServer.get("/autocomplete", routeCallbacks.autoComplete);
	
	//get lookup
	expressServer.get("/lookup/:type", routeCallbacks.lookup);
	
	//index
	expressServer.get("/", routeCallbacks.index);
	
};