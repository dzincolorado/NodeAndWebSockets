function initPassport(passport, passportFacebookStrategy, expressServer){
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});
	
	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});
	
	console.log("has keys: " + expressServer.get("facebookConfig"))
	var facebookConfig = JSON.parse(expressServer.get("facebookConfig"));
	
	//Passport using facebook strategy
	passport.use(new passportFacebookStrategy({
		clientID:facebookConfig.facebookKeys.key,
		clientSecret:facebookConfig.facebookKeys.secret,
		callbackURL: facebookConfig.facebookKeys.callbackURL
		},
		function(token, refreshToken, profile, done){
			process.nextTick(function()
			{
				return done(null, profile);
			});
		}
	
	));
}

exports.initPassport = initPassport;
