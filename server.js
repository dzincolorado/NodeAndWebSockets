var express = require("express");
var passport = require("passport");
var passportFacebookStrategy = require("passport-facebook").Strategy;
var config = require("./config/config");

var routeCallbacks = require("./routes/routeCallbacks");
//TODO: need facebook, linkedin auth strategy
//TODO:  hookup mongo (mongojs or mongoose)
//TODO: configure sockets and cluster processes

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
var expressServer = require("./config/serverInitialize")(express, passport);
require("./routes/router")(expressServer, passport, routeCallbacks);
