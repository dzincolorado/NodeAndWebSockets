var defaultActivity = "Twiddling my thumbs";

function Tracker(id, startMinute, endMinute, activity, emotion, emotionValue, addDate){
	var self = this;
	
	self.trackerId = id;
	self.startMinute = ko.observable(startMinute);
	self.endMinute = ko.observable(endMinute);
	self.activity = ko.observable(activity);
	self.emotion = ko.observable(emotion);
	self.emotionValue = ko.observable(emotionValue);
	self.addDate = ko.observable(addDate)
	
	self.formattedDate = ko.computed(function(){
		return new Date(self.addDate()).toDateString();
	});
	
	self.label = ko.computed(function(){
		return buildTrackerLabel(self.startMinute(), self.endMinute(), self.activity());
	});
}

function buildTrackerLabel(startMinute, endMinute, activity){
	var duration = endMinute - startMinute; 
	var tokenized = "%a {%d mins}";
	var trackerLabel = tokenized.replace("%a", (typeof activity == "undefined" || activity.trim() == "" ? defaultActivity : activity));
	trackerLabel = trackerLabel.replace("%d", duration.toString());
	return trackerLabel;
}

function TrackerViewModel(){
	var self = this;
	
	self.trackers = ko.observableArray([]);
	
	self.addTracker = function(id, startMinute, endMinute, activity, emotion, emotionValue, addDate){
		
		self.trackers.push(new Tracker(id, startMinute, endMinute, activity, emotion, emotionValue, addDate));
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
	applyDynamicStyles("", emotionModel.emotionValues()[0].value)
}

function applyDynamicStyles(id, emotion){
	
	var sliderRangeId = getSliderRangeId(id);
	var txtMinutesId = getTrackerCaptionId(id);
	var txtTrackerCaptionAddDateId = getTrackerCaptionAddDateId(id);
	
	var emotionText = typeof emotion == "undefined" ? "happy" : emotion.replace(" ", "_").toLowerCase();
	$(sliderRangeId + " a").removeClass("ui-slider-handle ui-state-default ui-corner-all .ui-state-default");
	$(sliderRangeId + " div").removeClass("ui-widget-header");
	
	$(txtMinutesId).removeClass (function (index, css) {
	    return (css.match (/\btrackerCaption-\S+/g) || []).join(' ');
	});
	
	var regex = new RegExp("%ev", "g");
	$(sliderRangeId + " a").addClass("ui-slider-handle ui-state-%ev ui-corner-all .ui-state-%ev".replace(regex, emotionText));
	$(sliderRangeId + " div").addClass("ui-widget-header-%ev".replace("%ev", emotionText));
	
	$(txtMinutesId).addClass("trackerCaption-%ev".replace("%ev", emotionText));
	if(id != ""){
		$(txtTrackerCaptionAddDateId).addClass("trackerCaption-%ev".replace("%ev", emotionText));
	}
}

//TODO: need to encapsulate id properties into js class
function getSliderRangeId(id){
	return "#slider-range" + id; 
}

function getTrackerCaptionId(id){
	return "#txtMinutes" + id;
}

function getTrackerCaptionAddDateId(id){
	return "#wrpAddDate" + id;
}

function configureTracker(id, startMinute, endMinute, activity, emotion, emotionValue){
	$(function() {
		var sliderRangeId =getSliderRangeId(id);
		var txtMinutesId =getTrackerCaptionId(id);
		 
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
		
		applyDynamicStyles(id, emotion);
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
	$("#txtActivity").attr("placeholder", defaultActivity);
	$("#ddlEmotion").on("change", function(event){
		var emotion = $("option:selected", $(this)).text();
		applyDynamicStyles("", emotion);
	});
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
			return new Tracker(item["_id"], item["startMinute"], item["endMinute"], item["activity"], item["emotion"], item["emotionValue"], item["addDate"]);
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
				tracker.emotionValue(),
				tracker.addDate());
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
		model.addTracker(data.trackerId, startMinute, endMinute, activity, emotion, emotionValue, new Date());
		configureTracker(data.trackerId, startMinute, endMinute, activity, emotion, emotionValue, new Date());
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

//TODO: for time slider implement http://jsbin.com/orora3/3/edit

//TODO: configure to use real data:

function configureChart() {

  var container = document.getElementById("trackerChart");
  var
    d1        = [[1, 4, 10]],
    d2        = [[1, 5, 4]],
    d3        = [[1, 3, 2]],
    d4        = [[1, 2, 9]],
    d5        = [[1, 1, 8]],
    data      = [],
    timeline  = { show : true, barWidth : .6 },
    markers   = [],
    labels    = ['Health', 'Education', 'Work', 'Soul Sucking', 'Fun'],
    i, graph, point;

  // Timeline
  Flotr._.each([d1, d2, d3, d4, d5], function (d) {
    data.push({
      data : d,
      timeline : Flotr._.clone(timeline)
    });
  });

  // Markers
  Flotr._.each([d1, d2, d3, d4, d5], function (d) {
    point = d[0];
    markers.push([point[0], point[1]]);
  });
  data.push({
    data: markers,
    markers: {
      show: true,
      position: 'rm',
      fontSize: 10,
      labelFormatter : function (o) { return labels[o.index]; }
    }
  });
  
  // Draw Graph
  graph = Flotr.draw(container, data, {
    xaxis: {
       showLabels: false
    },
    yaxis: {
      showLabels : false
    },
    grid: {
   	  color: '#37AA37',
      horizontalLines : false
    },
    title: "Time By Category",
    fontColor: '#37AA37',
  	backgroundColor: '#FFFFFF',
  	fill: false
  });
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
	configureChart();
})
