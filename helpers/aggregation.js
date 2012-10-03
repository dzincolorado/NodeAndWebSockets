var db = require("../db/db");
var util = require("util");

function getResult(aggregationType, sendResponse, expressServer){
	console.log("aggregation type: %at".replace("%at", aggregationType));
	
	if(aggregationType.trim().length = 0){
		sendResponse(null, JSON.stringify({result: "N/A"}));
	}
	else{
		var db2 = new db.db2(expressServer);
			db2.userActivity().mapReduce(map, reduce, { out : "emotionAverage"}, function(err, results, stats){
				results.findOne({}, function(err, result){
					console.log("first one" + util.inspect(result.value));
					
					//TODO: need to figure out why mapreduce function is returning NaN
					sendResponse(null, JSON.stringify({result: result.value.avg}));
				});
			});
	}
}

/* mapReduce functions
 * 
 *
 */


map = function (){
  emit( this.name , { totalEmotion : this.emotionValue , num : 1, avg: 0 } );
};

reduce = function (name, values){
  var n = {totalEmotion : 0, num : 0, avg:0};
  
  values.forEach(function(value){
  	n.totalEmotion += value.totalEmotion;
    n.num += value.num;
  });
  
  n.avg = n.totalEmotion / n.num;
  
  return n;
};

exports.getResult = getResult;