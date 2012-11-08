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
		
	//get a list of the trackers
	//TODO: consider using *index* route
	expressServer.get("/trackers", function(request, response){
		routeCallbacks.getTrackers(request, response, expressServer);
	})
	
	//create/update tracker
	expressServer.post("/trackers/upsert", function(request, response){
		routeCallbacks.upsert(request, response, expressServer);
	})
	
	//get some calculated values
	expressServer.get("/aggregate/:type", function(request, response){
		console.log("aggregation time");
		routeCallbacks.aggregate(request, response, expressServer);
	});
	
	//index
	expressServer.get("/", ensureAuthenticated, routeCallbacks.index);
	
	//handle route to facebook auth.
	expressServer.get("/auth/facebook", passport.authenticate("facebook", {display: 'touch'}), function(request, response){
		//never called since request is routed to FB
	});
	
	//handle route to call back url
	expressServer.get("/auth/facebook/callback", 
		passport.authenticate("facebook", {failureRedirect: "/login"}), function(request, response){
			response.redirect("/");
		});	
	
	//login
	expressServer.get("/login", routeCallbacks.login);
	
	//logout
	expressServer.get("/logout", function(request, response){
		request.logout();
		response.redirect("/");
	});
};

//check for authenticated user
function ensureAuthenticated(request, response, next){
	return next(); //uncomment to bypass auth
	if(request.isAuthenticated()){
		return next();
	}
	response.redirect("/login");
	
}
