function getEmotionLookup(){
	$.getJSON("lookup/emotion", function(data, status, xhr){
		var mappedData = ko.utils.arrayMap(data, function(item){
			return new Emotion(item["name"], item["value"], item["color"]);
		});
		
		emotionModel.emotionValues(mappedData);
	});
}

function getCategoryLookup(){
	$.getJSON("lookup/category", function(data, status, xhr){
		var mappedData = ko.utils.arrayMap(data, function(item){
			return new Category(item["name"]);
		});
		
		categoryModel.categories(mappedData);
	});
}

function getTrackers(){
	$.getJSON("trackers", function(data, status, xhr){
		var mappedData = ko.utils.arrayMap(data, function(item){
			return new Tracker(item["_id"], item["startMinute"], item["endMinute"], item["activity"], item["emotion"], item["emotionValue"], item["category"], item["addDate"]);
		});
		
		model.trackers(mappedData);
	}).success(function(){
		updateAggregates();
		model.trackers().forEach(function(tracker){
			configureTracker(
				tracker.trackerId, 
				tracker.startMinute(), 
				tracker.endMinute(), 
				tracker.activity(), 
				tracker.emotion(), 
				tracker.emotionValue(),
				tracker.category(),
				tracker.addDate());
		});
	});
}

function saveTrackerInfo(startMinute, endMinute, activity, emotion, emotionValue, category, trackerId){
	/*
	var socket = io.connect(window.location.hostname);
	
	socket.emit("saveTrackerInfo", {'startMinute': startMinute, 'endMinute':endMinute, 'activity': activity, 'emotionValue': emotionValue});
	socket.on("userTrackerUpdate", function(data){
		//alert(data);
	});
	
	*/
	
	$.ajax(
		{
			url: "trackers/upsert",
			type: "POST",
			dataType: "json",
			data: {
				'startMinute': startMinute, 
				'endMinute':endMinute, 
				'activity': activity, 
				'emotion' : emotion, 
				'emotionValue': parseInt(emotionValue),
				'category': category, 
				"_id": trackerId
			}
		}
	).done(function(data){
		model.addTracker(data.trackerId, startMinute, endMinute, activity, emotion, emotionValue, category, new Date());
		configureTracker(data.trackerId, startMinute, endMinute, activity, emotion, emotionValue, category, new Date());
		updateAggregates();
		resetTrackingInfo();
	}).fail(function(jqXHR, textStatus){
		alert(textStatus);
	});
}

function updateAggregates(){
	
	var effect = "drop";
	if(model.trackers().length > 1){
		effect = "highlight";
	}
	
	$( "#wrpRunningAvg" ).show(effect, null, 1000, null );
	$.getJSON("aggregate/average", function(data, status, xhr){
		//alert(data.result);
		$("#wrpAverage").html(data.result);
	})
}

function configureAutoComplete(){
	//configure autocomplete
	$(function() {
		var cache = {},
			lastXhr;
		$( "#txtActivity" ).autocomplete({
			minLength: 2,
			source: function( request, response ) {
				var term = request.term;
				if ( term in cache ) {
					response( cache[ term ] );
					return;
				}

				lastXhr = $.getJSON( "autocomplete", request, function( data, status, xhr ) {
					cache[ term ] = data;
					if ( xhr === lastXhr ) {
						response( data );
					}
				});
			}
		});
	});
}