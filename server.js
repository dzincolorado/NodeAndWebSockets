var express = require("express");
var passport = require("passport");
var passportFacebookStrategy = require("passport-facebook").Strategy;
var authenticationHelper = require("./helpers/authentication");
var routeCallbacks = require("./routes/routeCallbacks");
//TODO: configure cluster processes

authenticationHelper.initPassport(passport, passportFacebookStrategy)
var expressServer = require("./config/serverInitialize")(express, passport);
require("./routes/router")(expressServer, passport, routeCallbacks);
