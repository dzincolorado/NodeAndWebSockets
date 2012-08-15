module.exports = function(expressServer, passport, routeCallbacks){
	expressServer.get("/", function(request, response){
		response.render("trackers", {locals: {}});
	})
}	