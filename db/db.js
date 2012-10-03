function db2(expressServer){
	var trackersDb = require("mongojs").connect(expressServer.get("db-uri"));
	var self = this;
	
	self.activity = function(){
		return trackersDb.collection("activity");
	};
	
	//TODO: currently a capped collection.  need to uncap when ready
	self.userActivity = function(){
		return trackersDb.collection("userActivity");
	};
	
	self.emotion = function(){
		return trackersDb.collection("emotion");	
	}
}

exports.db2 = db2;