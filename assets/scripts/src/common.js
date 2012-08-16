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
		
		//TODO:  need to reset activity and slider values
	}
}

function ConfigureTracker(id, startMinute, endMinute){
	$(function() {
		var sliderRangeId ="#slider-range" + id; 
		var txtMinutesId ="#txtMinutes" + id;
		//alert($( sliderRangeId ).slider( "values", 1 ));
		 
		$( sliderRangeId ).slider({
			range: true,
			min: 0,
			max: 288,
			step: 5,
			values: [ startMinute, endMinute ],
			slide: function( event, ui ) {
				$( txtMinutesId ).val(ui.values[ 1 ] - ui.values[ 0 ] + " minutes" );
			}
		});
		$( txtMinutesId ).val($( sliderRangeId ).slider( "values", 1 ) - 
			$( sliderRangeId ).slider( "values", 0 ) + " minutes");
	});
}

function ConfigureTrackAnotherButton(){
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

function ConfigureTrackNewButton(){
	$( "#btnTrackNew" ).click(function() {
		
		var startMinute = $("#slider-range" ).slider("values", 0 );
		var endMinute = $("#slider-range" ).slider("values", 1 );
		var activity = $("#txtActivity").val();
		
		trackerId++;
		model.addTracker(trackerId, startMinute, endMinute, activity);
		ConfigureTracker(trackerId, startMinute, endMinute);
		
		$( "#wrpTrackAnother" ).dialog( "close" );
		return false;
	});
}

function ConfigureDataBindings(){
	ko.applyBindings(model);
}

function ConfigureAutoComplete(){
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


var model = new TrackerViewModel();
//setup event handlers
$(document).ready(function(){
	
	ConfigureDataBindings();
	ConfigureTracker("", 0, 5);
	ConfigureTrackAnotherButton();
	ConfigureTrackNewButton();
	ConfigureAutoComplete();
	
})
