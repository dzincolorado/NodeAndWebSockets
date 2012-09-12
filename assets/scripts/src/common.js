var trackerId = 0; //TODO: depracate in favor of a storage driven Id.

function Tracker(id, startMinute, endMinute, activity){
	var self = this;
	
	self.trackerId = id;
	self.startMinute = ko.observable(startMinute);
	self.endMinute = ko.observable(endMinute);
	self.activity = ko.observable(activity);
}

function TrackerViewModel(){
	var self = this;
	
	self.trackers = ko.observableArray([]);
	
	self.addTracker = function(id, startMinute, endMinute, activity){
		self.trackers.push(new Tracker(id, startMinute, endMinute, activity));
	
		//TODO: need to hook up emotionvalue
		SaveTrackerInfo(startMinute, endMinute, activity, 5);
		//TODO:  need to reset activity and slider values
	}
}

function configureTracker(id, startMinute, endMinute, activity){
	$(function() {
		var sliderRangeId ="#slider-range" + id; 
		var txtMinutesId ="#txtMinutes" + id;
		//alert($( sliderRangeId ).slider( "values", 1 ));
		
		if(typeof activity != "undefined"){
			activity += " - "; 
		}
		else {
			activity = ""; 	
		}
		 
		$( sliderRangeId ).slider({
			range: true,
			min: 0,
			max: 288,
			step: 5,
			values: [ startMinute, endMinute ],
			slide: function( event, ui ) {
				var minutes = ui.values[ 1 ] - ui.values[ 0 ];
				$( txtMinutesId ).text(activity + minutes + " minutes" );
			}
		});
		
		var minutes = $( sliderRangeId ).slider( "values", 1 ) - $( sliderRangeId ).slider( "values", 0 );
		$( txtMinutesId ).text(activity + minutes.toString() + " minutes");
	});
}

function configureTrackAnotherButton(){
	//configure fx speeds
	$.fx.speeds._default = 300;
	$(function() {
		$( "#wrpTrackAnother" ).dialog({
			autoOpen: false,
			show: {effect: 'drop', direction: 'up'},
			hide: {effect: 'drop', direction: 'up'}
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
		
		trackerId++;
		model.addTracker(trackerId, startMinute, endMinute, activity);
		ConfigureTracker(trackerId, startMinute, endMinute, activity);
		
		$( "#wrpTrackAnother" ).dialog( "close" );
		return false;
	});
}

function configureDataBindings(){
	ko.applyBindings(model);
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

function getLookupData(){
	$.getJSON("lookup/emotion", function(data, status, xhr){
		alert('lookup data: ' + data);
	});
}

function SaveTrackerInfo(startMinute, endMinute, activity, emotionValue){
	var socket = io.connect("http://localhost");
	
	socket.emit("saveTrackerInfo", {'startMinute': startMinute, 'endMinute':endMinute, 'activity': activity, 'emotionValue': emotionValue});
	socket.on("userTrackerUpdate", function(data){
		alert(data);
	});
}


var model = new TrackerViewModel();
//setup event handlers
$(document).ready(function(){
	
	configureDataBindings();
	configureTracker("", 0, 5);
	configureTrackAnotherButton();
	configureTrackNewButton();
	configureAutoComplete();
	getLookupData();
})
