var db = require("../db/db");
var util = require("util");

function getResult(aggregationType, sendResponse, expressServer){
	console.log("aggregation type: %at".replace("%at", aggregationType));
	
	if(aggregationType.trim().length = 0){
		sendResponse(null, JSON.stringify({result: "N/A"}));
	}
	else{
		var db2 = new db.db2(expressServer);
			db2.userActivity().mapReduce(map, reduce, { out : "emotionAverage", query: {emotionValue: {$exists:true}}}, function(err, results, stats){
				results.findOne({}, function(err, result){
					
					var avg = 0;
					if(result != null){
						console.log("first one" + util.inspect(result.value));
					
						avg = result.value.avg;
					}
					sendResponse(null, JSON.stringify({result: avg}));
				});
			});
	}
}

/* mapReduce functions
 * 
 *
 */


//TODO:  need to account for activity duration
map = function (){
  emit( "average" , { totalEmotion: parseFloat(this.emotionValue), duration: this.endMinute - this.startMinute, num : 1.0, avg: 0.0 } );
};

reduce = function (name, values){
  var n = {totalEmotion : 0.0, duration: 0.0, num : 0.0, avg:0.0};
  
  values.forEach(function(value){
  	n.totalEmotion += value.totalEmotion * value.duration;
  	n.duration += value.duration;
    n.num += value.num;
  });
  
  if(n.num > 0){
  		n.avg = n.totalEmotion / n.duration;
  }
  
  return n;
};

exports.getResult = getResult;