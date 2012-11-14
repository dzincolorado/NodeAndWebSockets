function initPassport(passport, passportFacebookStrategy, expressServer){
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});
	
	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});
	
	var facebookConfig = JSON.parse(expressServer.get("facebookConfig"));
	console.log("verify callbackurl: " + facebookConfig.callbackURL);
	
	//Passport using facebook strategy
	passport.use(new passportFacebookStrategy({
		clientID:facebookConfig.facebookKeys.key,
		clientSecret:facebookConfig.facebookKeys.secret,
		callbackURL: facebookConfig.callbackURL
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
