function db(){
	
	//TODO:  need to understand implications of calling this over and over
	//TODO: consider using node-mongoskin instead of mongojs
	return require("mongojs").connect("trackers");
}

function activity(){
	return db().collection("activity");
}

function userActivity(){
	return db().collection("userActivity");
}

exports.db = db;//create separate module for exposing db
exports.activity = activity;
exports.userActivity = userActivity;