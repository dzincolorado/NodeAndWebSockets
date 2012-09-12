module.exports = function(express, passport){
	var expressServer = express();
	var port = 8000;
	//expressServer.listen(process.env.PORT || port);
	console.log("Listening on: " + port);
	
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
