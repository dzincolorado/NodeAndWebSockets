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
				//TODO: create the user record or retrieve it
				return done(null, profile);
			});
		}
	
	));
}

exports.initPassport = initPassport;
