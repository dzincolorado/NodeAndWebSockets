module.exports = function(express, passport){
	var expressServer = express();
	
	expressServer.configure("development", function(){
		//Dev will just use the default localhost
		//expressServer.configure("db-uri", "mongodb://localhost/trackers");
	});
	
	expressServer.configure("production", function(){
		
		//get the environment variable set by:  heroku config | grep MONGOLAB_URI
		//MONGOLAB_URI => mongodb://<USER>:<PW>@alex.mongohq.com:10076/app6890420 (Heroku MongoHq)
		//MONGOLAB_URI => mongodb://<USER>:<PW>@ds037587-a.mongolab.com:37587/trackers (MongoLab)
		//MONGOLAB_URI => mongodb://<USER>:<PW>@dbh86-a.mongolab.com:27867/trackers (Heroku MongoLab)
		var dbConnection = process.env.MONGOLABLIFE_URI;
		
		expressServer.configure("db-uri", dbConnection)
	});
	
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
	
	var port = process.env.PORT || 8000;
	console.log("Listening on: %d, environment: '%s'", port, expressServer.settings.env);
	
	//setup socket.io
	var http = require('http');
	var server = http.createServer(expressServer);
	
	//using socket.io required me to use the server instance to listen on the port instead of the expressServer instance.
	server.listen(port);
	var io = require("socket.io").listen(server);
	//configuring simple io handling
	//TODO: consider session data sharing and auth. handshake
	io.sockets.on('connection', function(socket){
		socket.emit('init', {message: "getting data", allowResponse: true});
		
		socket.on('saveTrackerInfo', function(data){
			console.log(data);
			
			socket.emit("userTrackerUpdate", {'emotionValue': 10});
		});
		
		socket.on("trendRequest", function(data){
			socket.emit('trendRequest', {'emotionValue': 5});
		});
	})
	
	return expressServer;
}
