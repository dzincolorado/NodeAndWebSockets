var db = require("../db/db");

function facebook(expressServer, sendConfigSettings) {
	//TODO: cache this
	console.log("within FB");
	var db2 = new db.db2(expressServer);
	db2.appKey().findOne({'facebookKeys' : {$exists: true}}, function(err, doc) {
		console.log("loading FB keys: " + doc.facebookKeys.key);
		if(!err) {
			doc.callbackURL = "http://nodeandwebsockets.herokuapp.com/auth/facebook/callback";
			expressServer.set("facebookConfig", JSON.stringify(doc));
			sendConfigSettings(expressServer);
		} else {
			console.log("fb load error: " + err);
		}

	})
}

exports.initFacebook = facebook;
