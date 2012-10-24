function buildTrackerLabel(startMinute, endMinute, activity){
	var duration = endMinute - startMinute; 
	var tokenized = "%a {%d mins}";
	var trackerLabel = tokenized.replace("%a", (typeof activity == "undefined" || activity.trim() == "" ? defaultActivity : activity));
	trackerLabel = trackerLabel.replace("%d", duration.toString());
	return trackerLabel;
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

function configureUI(){
	$("#wrpRunningAvg").hide();
	$("#txtActivity").attr("placeholder", defaultActivity);
	$("#ddlEmotion").on("change", function(event){
		var emotion = $("option:selected", $(this)).text();
		applyDynamicStyles("", emotion);
	});
}

//TODO: for time slider implement http://jsbin.com/orora3/3/edit

//TODO: configure to use real data:

function configureCategoryChart() {

  var container = document.getElementById("categoryChart");
  var
    d1        = [[1, 4, 10]],
    d2        = [[1, 5, 4]],
    d3        = [[1, 3, 2]],
    d4        = [[1, 2, 9]],
    d5        = [[1, 1, 8]],
    data      = [],
    timeline  = { show : true, barWidth : .6, fillColor: 'green', color: 'green' },
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

function configureEmotionChart() {

  var container = document.getElementById("emotionChart");
  var
    d1        = [[1, 4, 3]],
    d2        = [[1, 5, 4]],
    d3        = [[1, 3, 2]],
    d4        = [[1, 2, 9]],
    d5        = [[1, 1, 8]],
    data      = [],
    timeline  = { show : true, barWidth : .6, fillColor: 'blue', color: 'blue' },
    markers   = [],
    labels    = ['Angry', 'Sad', 'Love', 'Happy', 'Excited'],
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
    title: "Time By Emotion",
    fontColor: '#37AA37',
  	backgroundColor: '#FFFFFF',
  	fill: false
  });
}

//setup event handlers
$(document).ready(function(){
	
	configureUI();
	configureDataBindings();
	configureTracker("", 0, 30);
	configureTrackAnotherButton();
	configureTrackNewButton();
	configureAutoComplete();
	getEmotionLookup();
	getCategoryLookup();
	getTrackers();
	configureCategoryChart();
	configureEmotionChart();
})
