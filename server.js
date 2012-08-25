var express = require("express");
var passport = require("passport");
var passportTwitterStrategy = require("passport-twitter").Strategy;

var routeCallbacks = require("./routes/routeCallbacks");
//TODO: need facebook, linkedin auth strategy
//TODO:  hookup mongo (mongojs or mongoose)
//TODO: configure sockets and cluster processes

//require("./handlers/authentication")(passport, passportTwitterStrategy, config);
var expressServer = require("./config/serverInitialize")(express, passport);
require("./routes/router")(expressServer, passport, routeCallbacks);