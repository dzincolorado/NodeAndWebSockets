var db = require("../db/db");

function facebook(expressServer, sendConfigSettings) {
	//TODO: cache this
	console.log("within FB");
	var db2 = new db.db2(expressServer);
	db2.appKey().findOne({'facebookKeys' : {$exists: true}}, function(err, doc) {
		/*return {
		 facebook: {
		 consumerKey: "376509982436950",
		 consumerSecret: "8edbdb260256e2fb7e68835a0a154469",
		 callbackURL: "http://nodeandwebsockets.herokuapp.com/auth/facebook/callback"
		 }
		 };
		 */
		console.log("loading FB keys: " + doc.facebookKeys.key);
		if(!err) {
			doc.callbackURL = "http://nodeandwebsockets.herokuapp.com/auth/facebook/callback";
			expressServer.set("facebookConfig", JSON.stringify(doc));
			sendConfigSettings(expressServer);
			//expressServer.set("facebookConsumerSecret", "");
		} else {
			console.log("fb load error: " + err);
		}

	})
}

exports.initFacebook = facebook;
