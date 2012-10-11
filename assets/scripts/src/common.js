function Tracker(id, startMinute, endMinute, activity, emotion, emotionValue){
	var self = this;
	
	self.trackerId = id;
	self.startMinute = ko.observable(startMinute);
	self.endMinute = ko.observable(endMinute);
	self.activity = ko.observable(activity);
	self.emotion = ko.observable(emotion);
	self.emotionValue = ko.observable(emotionValue);
	
	self.label = ko.computed(function(){
		return buildTrackerLabel(self.startMinute(), self.endMinute(), self.activity());
	});
}

function buildTrackerLabel(startMinute, endMinute, activity){
	var duration = endMinute - startMinute; 	
	return (typeof activity == "undefined" || activity.trim() == "" ? "Twiddling my thumbs" : activity) + " {" + duration.toString() + " minutes}"
}

function TrackerViewModel(){
	var self = this;
	
	self.trackers = ko.observableArray([]);
	
	self.addTracker = function(id, startMinute, endMinute, activity, emotion, emotionValue){
		
		self.trackers.push(new Tracker(id, startMinute, endMinute, activity, emotion, emotionValue));
	}
}

function Emotion(name, value, color){
	var self = this;
	
	self.name = ko.observable(name);
	self.value = ko.observable(value);
	self.color = ko.observable(color);
}

function EmotionViewModel(){
	var self = this;
	self.emotionValues = ko.observableArray([]);
}

function resetTrackingInfo()
{
	$("#slider-range" ).slider({values: [0, 30]});
	$("#txtActivity").val("");
	$("ddlEmotion").val(emotionModel.emotionValues()[0].value);
}

function configureTracker(id, startMinute, endMinute, activity, emotion, emotionValue){
	$(function() {
		var sliderRangeId ="#slider-range" + id; 
		var txtMinutesId ="#txtMinutes" + id;
		 
		$( sliderRangeId ).slider({
			range: true,
			min: 0,
			max: 288,
			step: 5,
			values: [ startMinute, endMinute ],
			slide: function( event, ui ) {
				$( txtMinutesId ).text(buildTrackerLabel(ui.values[ 0 ], ui.values[ 1 ], activity));
			}
		});
		
		if(id == ""){
			$( txtMinutesId ).text(
				buildTrackerLabel(
					$( sliderRangeId ).slider( "values", 0 ), 
					$( sliderRangeId ).slider( "values", 1 ), 
					activity));
		}
		
		var emotionText = id == "" || typeof emotion == "undefined" ? "happy" : emotion.replace(" ", "_").toLowerCase();
		$(sliderRangeId + " a").removeClass("ui-slider-handle ui-state-default ui-corner-all .ui-state-default");
		$(sliderRangeId + " div").removeClass("ui-widget-header");
		
		var regex = new RegExp("%ev", "g");
		$(sliderRangeId + " a").addClass("ui-slider-handle ui-state-%ev ui-corner-all .ui-state-%ev".replace(regex, emotionText));
		$(sliderRangeId + " div").addClass("ui-widget-header-%ev".replace("%ev", emotionText));
	});
}

function configureTrackAnotherButton(){
	//configure fx speeds
	$.fx.speeds._default = 300;
	$(function() {
		$( "#wrpTrackAnother" ).dialog({
			autoOpen: false,
			show: {effect: 'drop', direction: 'up'},
			hide: {effect: 'drop', direction: 'up'},
			width: 450
		});

		$( "#btnTrackAnother" ).click(function() {
			$( "#wrpTrackAnother" ).dialog( "open" );
			return false;
		});
	});
}

function configureTrackNewButton(){
	$( "#btnTrackNew" ).click(function() {
		
		var startMinute = $("#slider-range" ).slider("values", 0 );
		var endMinute = $("#slider-range" ).slider("values", 1 );
		var activity = $("#txtActivity").val();
		var emotionValue = $("#ddlEmotion").val();
		var emotion = $("#ddlEmotion option:selected").text();
	
		saveTrackerInfo(startMinute, endMinute, activity, emotion, emotionValue);
		
		$( "#wrpTrackAnother" ).dialog( "close" );
		return false;
	});
}

function configureDataBindings(){
	ko.applyBindings(model, document.getElementById("olTrackers"));
	ko.applyBindings(emotionModel, document.getElementById("ddlEmotion"));
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

function configureUI(){
	$("#wrpRunningAvg").hide();
}

var emotionModel = new EmotionViewModel();
function getLookupData(){
	$.getJSON("lookup/emotion", function(data, status, xhr){
		var mappedData = ko.utils.arrayMap(data, function(item){
			return new Emotion(item["name"], item["value"], item["color"])
		});
		
		emotionModel.emotionValues(mappedData);
	});
}

function getTrackers(){
	$.getJSON("trackers", function(data, status, xhr){
		var mappedData = ko.utils.arrayMap(data, function(item){
			return new Tracker(item["_id"], item["startMinute"], item["endMinute"], item["activity"], item["emotion"], item["emotionValue"]);
		});
		
		model.trackers(mappedData);
	}).success(function(){
		updateAverage();
		model.trackers().forEach(function(tracker){
			configureTracker(
				tracker.trackerId, 
				tracker.startMinute(), 
				tracker.endMinute(), 
				tracker.activity(), 
				tracker.emotion(), 
				tracker.emotionValue());
		});
	});
}

function saveTrackerInfo(startMinute, endMinute, activity, emotion, emotionValue, trackerId){
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
				"_id": trackerId
			}
		}
	).done(function(data){
		model.addTracker(data.trackerId, startMinute, endMinute, activity, emotion, emotionValue);
		configureTracker(data.trackerId, startMinute, endMinute, activity, emotion, emotionValue);
		updateAverage();
		resetTrackingInfo();
	}).fail(function(jqXHR, textStatus){
		alert(textStatus);
	});
}

function updateAverage(){
	
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

var model = new TrackerViewModel();
//setup event handlers
$(document).ready(function(){
	
	configureUI();
	configureDataBindings();
	configureTracker("", 0, 30);
	configureTrackAnotherButton();
	configureTrackNewButton();
	configureAutoComplete();
	getLookupData();
	getTrackers();
})
