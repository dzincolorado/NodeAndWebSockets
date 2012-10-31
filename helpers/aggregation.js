var db = require("../db/db");
var util = require("util");

function getResult(aggregationType, sendResponse, expressServer){
	console.log("aggregation type: %at".replace("%at", aggregationType));
	
	if(aggregationType.trim().length = 0){
		
	}
	else{
		
		//TODO: refactor into more of strategy
		//TODO: will need to segment by date
		//TODO: will need to segment by logged in user
		var db2 = new db.db2(expressServer);
		switch(aggregationType.trim())
		{
			case "average":
				db2.userActivity().mapReduce(mapAverage, reduceAverage, { out : "emotionAverage", query: {emotionValue: {$exists:true}}}, function(err, results, stats){
					if(results != null){
						results.findOne({}, function(err, result){
							
							var avg = 0;
							if(result != null){
								console.log("first one" + util.inspect(result.value));
							
								avg = result.value.avg;
							}
							sendResponse(null, JSON.stringify({'result': avg}));
						});
					}
				});	
				break;
			case "category":
				require('./aggregation/common').getTimeByDimension(aggregationType.trim(), db2, sendResponse, mapCategories, reduceDurationSum, {category: {$exists:true}});
				break;
			case "emotion":
				require('./aggregation/common').getTimeByDimension(aggregationType.trim(), db2, sendResponse, mapEmotion, reduceDurationSum, {emotion: {$exists:true}});
				break;
			default:
				sendResponse(null, JSON.stringify({result: "N/A"}));		
		}
	}
}

/* mapReduce functions
 * 
 *
 */

//common mapreduce method
reduceDurationSum = function(key, values) {
	var durationSum = 0;
	values.forEach(function(doc){
		durationSum += doc.duration;
	});
	
	return {duration: durationSum};
}

//group by category
mapCategories = function(){
	emit(this.category, {duration: this.endMinute - this.startMinute});
}

//group by emotion

mapEmotion = function(){
	emit(this.emotion, {duration: this.endMinute - this.startMinute});
}

//simple average related

mapAverage = function (){
  emit( "average" , { totalEmotion: parseFloat(this.emotionValue), duration: this.endMinute - this.startMinute, num : 1.0, avg: 0.0 } );
};

reduceAverage = function (name, values){
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