var db = require("../db/db");
var lookupHelper = require("../helpers/lookup");
var aggregationHelper = require("../helpers/aggregation");
var responseHelper = require("../helpers/response");
var trackersHelper = require("../helpers/trackers");

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

function aggregate(request, response, expressServer){
	var aggregationType = request.params.type;
	aggregationHelper.getResult(aggregationType, responseHelper.makeSendResponse(response), expressServer);
}

function getTrackers(request, response, expressServer){
	trackersHelper.list(responseHelper.makeSendResponse(response), expressServer);
}

function persistNewActivity(newActivity, expressServer){
	
	if(typeof newActivity != "undefined" && newActivity.trim() != ""){
		var db2 = new db.db2(expressServer);
		db2.activity().findOne({'name': newActivity}, function(err, doc){;
			console.log("looking for: %s".replace("%s", newActivity) );
			if(doc == null){
				console.log("Saving new activity: " + newActivity.trim());
				db2.activity().save({'name': newActivity.trim().substr(29), 'addDate': new Date()});
			}
		});
	}
}

function upsert(request, response, expressServer){
	//create/update tracker in mongo
	
	//converting emotionValue to a number as this is being stored as string and mapReduce functions are returning NaN.
	var newTrackerValue = request.body;
	//console.log(typeof newTrackerValue.emotionValue);
	newTrackerValue.emotionValue = parseInt(newTrackerValue.emotionValue);
	
	//following fields were not part of initial migration so they will be created in the collection first time around.
	newTrackerValue.addDate = new Date();
	newTrackerValue.modifiedDate = newTrackerValue.addDate;
	//console.log(typeof newTrackerValue.emotionValue);
	
	var db2 = new db.db2(expressServer);
	db2.userActivity().find({}, function(err, docs){
		console.log("doc count: " + docs.length);
		
		//TODO: remove once we no longer need a cap on the collection.  Not using capped collections at this time.
		if(docs.length > 30)
		{
			//?
		}
		else {
			
			persistNewActivity(newTrackerValue.activity, expressServer);
			
			db2.userActivity().save(request.body, function(err, doc){
				if(!err){
					var result = {"trackerId": doc._id}; 
					console.log(result);
					
					response.write(JSON.stringify(result));
					response.end();
				}
				else{
					console.log(err);
					throw err;
				}
			});
		}
	})
}

//TODO: split routeCallbacks into into separate modules
exports.index = index;
exports.autoComplete = autoComplete;
exports.lookup = lookup;
exports.upsert = upsert;
exports.aggregate = aggregate;
exports.getTrackers = getTrackers;