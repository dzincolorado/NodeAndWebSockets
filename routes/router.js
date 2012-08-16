module.exports = function(expressServer, passport, routeCallbacks){
	expressServer.get("/", function(request, response){
		response.render("trackers", {locals: {}});
	});
	
	//TODO:get values from store and also save new value if applicable
	expressServer.get("/autocomplete", function(request, response){
		response.writeHead(200, {"content-type":"text/plain"});
		
		var suggestedValues = ["test1", "test2"];
		response.write(JSON.stringify(suggestedValues));
		response.end();
	})
}	