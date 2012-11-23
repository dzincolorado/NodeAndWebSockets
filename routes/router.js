var routeCallbacks = require("./routeCallbacks");
//var s = require("string") //TODO: npm install --production string
//var nodeCache = require("memory-cache");//TODO:npm install memory-cache, node-cache

module.exports = function(expressServer, passport){
	
	expressServer.get("/ajax/*", ensureAuthenticated)
	
	//autocomplete
	expressServer.get("/ajax/autocomplete", function(request, response){
			routeCallbacks.autoComplete(request, response, expressServer);
		});
	
	//get lookup
	expressServer.get("/ajax/lookup/:type", function(request, response){
		routeCallbacks.lookup(request, response, expressServer);
		});
		
	//get a list of the trackers
	//TODO: consider using *index* route
	expressServer.get("/ajax/trackers", function(request, response){
		routeCallbacks.getTrackers(request, response, expressServer);
	})
	
	//create/update tracker
	expressServer.post("/ajax/trackers/upsert", function(request, response){
		routeCallbacks.upsert(request, response, expressServer);
	})
	
	//get some calculated values
	expressServer.get("/ajax/aggregate/:type", function(request, response){
		console.log("aggregation time" + require("util").inspect(request));
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
	expressServer.get("/login", function(request, response){
		routeCallbacks.login(request, response, expressServer);
	});
	
	//logout
	expressServer.get("/logout", function(request, response){
		request.logout();
		response.redirect("/");
	});
};

function isXHR(request) {
    return request.header( 'HTTP_X_REQUESTED_WITH' ) === 'XMLHttpRequest';
}

//check for authenticated user
function ensureAuthenticated(request, response, next){
	if(request.isAuthenticated()){
		return next();
	}
	if(!isXHR(request)){
		//return next(); //uncomment to bypass auth
		response.redirect("/login");	
	}
	else
	{
		response.write("{message: 'Not Authenticated'}");
		response.end();	
	}
}
