function buildTrackerLabel(startMinute, endMinute, activity, category){
	var duration = endMinute - startMinute; 
	var tokenized = "%c: %a {%d mins}";
	var trackerLabel = tokenized.replace("%a", (typeof activity == "undefined" || activity.trim() == "" ? defaultActivity : activity));
	trackerLabel = trackerLabel.replace("%d", duration.toString());
	trackerLabel = trackerLabel.replace("%c", category);
	return trackerLabel;
}

function resetTrackingInfo()
{
	$("#slider-range" ).slider({values: [0, 30]});
	$("#txtActivity").val("");
	$('#ddlEmotion option:first-child').attr("selected", "selected");
	$('#ddlCategory option:first-child').attr("selected", "selected");
	applyDynamicStyles("", $("#ddlEmotion option:selected").text());
}

function applyDynamicStyles(id, emotion){
	
	var sliderRangeId = getSliderRangeId(id);
	var txtMinutesId = getTrackerCaptionId(id);
	var txtTrackerCaptionAddDateId = getTrackerCaptionAddDateId(id);
	
	var emotionText = typeof emotion == "undefined" ? "happy" : emotion.replace(" ", "_").toLowerCase();
	//$(sliderRangeId + " a").removeClass("ui-slider-handle ui-state-default ui-corner-all .ui-state-default");
	//$(sliderRangeId + " div").removeClass("ui-widget-header");
	
	$(sliderRangeId + " a").removeClass(function(index, css){
		return (css.match (/\bui-slider-handle ui-state-\S+/g) || []).join(' ');
	});
	$(sliderRangeId + " div").removeClass(function(index, css){
		return (css.match (/\bui-widget-header\S+/g) || []).join(' ');
	});
	
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

function configureTracker(id, startMinute, endMinute, activity, emotion, emotionValue, category){
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
				$( txtMinutesId ).text(buildTrackerLabel(ui.values[ 0 ], ui.values[ 1 ], activity, category));
			}
		});
		
		if(id == ""){
			$( txtMinutesId ).text(
				buildTrackerLabel(
					$( sliderRangeId ).slider( "values", 0 ), 
					$( sliderRangeId ).slider( "values", 1 ), 
					activity,
					category));
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

		$( ".btn.btn-primary.another" ).click(function() {
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
		var category = $("#ddlCategory option:selected").text();
	
		saveTrackerInfo(startMinute, endMinute, activity, emotion, emotionValue, category);
		
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

function configureChart(aggregateData, container, title) {

  var dataParsed = [];
  var labelsParsed = [];
  
  var i = 1;
  aggregateData.timeByDimension.forEach(function(t){
  	dataParsed.push([[1, i, t.value.duration]]);
  	labelsParsed.push(t._id + ' ' + t.value.duration + '/' + aggregateData.totalDuration);
  	i++;
  });
  
  var
    data      = [],
    timeline  = { show : true, barWidth : .6},
    markers   = [],
    i, graph, point;

  // Timeline
  Flotr._.each(dataParsed, function (d) {
    data.push({
      data : d,
      timeline : Flotr._.clone(timeline)
    });
  });

  // Markers
  Flotr._.each(dataParsed, function (d) {
    point = d[0];
    markers.push([point[0], point[1]]);
  });
  data.push({
    data: markers,
    markers: {
      show: true,
      position: 'rm',
      stackingType: 'b',
      stacked: false,
      stroke: false,
      fontSize: 10,
      horizontal: true,
      labelFormatter : function (o) { return labelsParsed[o.index]; }
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
    title: title,
  	backgroundColor: '#FFFFFF',
  	fill: false,
  	colors: aggregateData.colors
  });
}

function configureCalendar(){
	$(function() {
        $( "#datepicker" ).datepicker({
            numberOfMonths: 3,
            showButtonPanel: true,
            defaultDate: new Date(),
            setDate: new Date(),
            showOn: "button",
            buttonImage: "images/calendar.gif",
            buttonImageOnly: true
        });
    });
    
    $( "#datepicker" ).val(formatDate(new Date()));
}

function formatDate(d){
	var curr_date = d.getDate();
	var curr_month = d.getMonth() + 1; //Months are zero based
	var curr_year = d.getFullYear();
	return curr_month + "/" + curr_date + "/" + curr_year;
}

//setup event handlers
$(document).ready(function(){
	
	configureCalendar();
	configureUI();
	configureDataBindings();
	configureTracker("", 0, 30);
	configureTrackAnotherButton();
	configureTrackNewButton();
	configureAutoComplete();
	getEmotionLookup();
	getCategoryLookup();
	getTrackers();
})
