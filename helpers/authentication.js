var db = require("../db/db");

function initPassport(passport, passportFacebookStrategy, expressServer){
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});
	
	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});
	
	var facebookConfig = JSON.parse(expressServer.locals.facebookConfig);
	console.log("verify callbackurl: " + facebookConfig.facebookKeys.callbackUrl);
	
	//Passport using facebook strategy
	passport.use(new passportFacebookStrategy({
		clientID:facebookConfig.facebookKeys.key,
		clientSecret:facebookConfig.facebookKeys.secret,
		callbackURL: facebookConfig.facebookKeys.callbackUrl
		},
		function(token, refreshToken, profile, done){
			process.nextTick(function()
			{
				console.log("FB profile: " + profile.username);
				//create the user record or retrieve it
				var db2 = new db.db2(expressServer);
				var saveError = null;
				db2.facebookUser().findOne({'username': profile.username}, function(err, doc){
					if(!err){
						if(doc == null){
							//insert document
							db2.facebookUser().save(profile);
						}
					}
					else
					{
						saveError = err;
						console.log(err);
					}
				});
				
				return done(saveError, profile);
			});
		}
	
	));
}

exports.initPassport = initPassport;
