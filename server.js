var express = require("express");
var passport = require("passport");
var passportFacebookStrategy = require("passport-facebook").Strategy;
var authenticationHelper = require("./helpers/authentication");
var routeCallbacks = require("./routes/routeCallbacks");
var config = require("./config/config");
//TODO: configure cluster processes

var expressServer = require("./config/serverInitialize")(express, passport);

function getConfigSettings(expressServer){
	authenticationHelper.initPassport(passport, passportFacebookStrategy, expressServer)	
}

console.log("preFB");
config.initFacebook(expressServer, getConfigSettings);

require("./routes/router")(expressServer, passport, routeCallbacks);
