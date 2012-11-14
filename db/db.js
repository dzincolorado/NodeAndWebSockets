function db2(expressServer){
	var trackersDb = require("mongojs").connect(expressServer.get("db-uri"));
	var self = this;
	
	self.activity = function(){
		return trackersDb.collection("activity");
	};
	
	self.userActivity = function(){
		return trackersDb.collection("userActivity");
	};
	
	self.emotion = function(){
		return trackersDb.collection("emotion");	
	}
	
	self.category = function(){
		return trackersDb.collection("category");
	}
	
	self.appKey = function(){
		return trackersDb.collection("appKey");
	}
}

exports.db2 = db2;