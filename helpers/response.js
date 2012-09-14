//create sendResponse callback - assumes JSON data payload
function makeSendResponse(response){
	return function sendResponse(err, data){
		if(err){
			console.log(err);
			response.send(500, {error: err});
			
			return;
		}
		
		response.write(data);
		response.end();
	}
}

exports.makeSendResponse = makeSendResponse;