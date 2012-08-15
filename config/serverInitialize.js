module.exports = function(express, passport){
	var expressServer = express.createServer();
	expressServer.listen(process.env.PORT || 8000);
	console.log("Listening on: " + expressServer.address().port);
	
	expressServer.set("views", __dirname + "/../views");
	expressServer.set("view engine", "jade");
	expressServer.set("view options", {layout:false});
	
	expressServer.use(express.logger());
	expressServer.use(express.cookieParser());
	expressServer.use(express.bodyParser());
	expressServer.use(express.methodOverride());
	expressServer.use(express.favicon());
	
	expressServer.use(express.session({secret: 'trackers'}))
	expressServer.use(passport.initialize());
	expressServer.use(passport.session());
	expressServer.use(expressServer.router);
	expressServer.use(express.static(__dirname + "/../assets"));
	
	return expressServer;
}
