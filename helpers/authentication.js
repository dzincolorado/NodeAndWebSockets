var config = require("../config/config");

function initPassport(passport, passportFacebookStrategy){
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});
	
	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});
	
	//Passport using facebook strategy
	passport.use(new passportFacebookStrategy({
		clientID:config.facebook.consumerKey,
		clientSecret:config.facebook.consumerSecret,
		callbackURL: config.facebook.callbackURL
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
