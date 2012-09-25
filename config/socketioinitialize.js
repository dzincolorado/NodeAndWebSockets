function initialize(server){
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
	});
}

exports.init = initialize;