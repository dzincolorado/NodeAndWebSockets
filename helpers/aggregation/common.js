var util = require("util");

function timeByDimension(dimension, db2, sendResponse, commonMap, commonReduce, queryDoc){
	db2.userActivity().mapReduce(commonMap, commonReduce, 
		{ 
			out : "%dDuration".replace('%d', dimension), query: queryDoc
		}, function(err, results, stats){
		if(results != null){
			results.find().toArray(function(err, docs){
				if(!err){
					if(docs != null){
						
						var totalDuration = 0;
						//get the total duration
						docs.forEach(function(doc){
							totalDuration += doc.value.duration;
						});
						
						var timeByDimensionDoc = 
							{
								"totalDuration": totalDuration,
							}
						timeByDimensionDoc["timeByDimension"] = docs;
						console.log("sending to stream: " + util.inspect(timeByDimensionDoc));
						sendResponse(null, JSON.stringify(timeByDimensionDoc));
					}	
				}
				else {
					console.log(err);
				}
					
			});
		}
	});	
}

exports.getTimeByDimension = timeByDimension;