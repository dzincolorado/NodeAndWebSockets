
//setup event handlers
$(document).ready(function(){
	$(function() {
		$( "#slider-range" ).slider({
			range: true,
			min: 0,
			max: 288,
			step: 5,
			values: [ 0, 5 ],
			slide: function( event, ui ) {
				$( "#minutes" ).val(ui.values[ 1 ] - ui.values[ 0 ] + " minutes" );
			}
		});
		$( "#minutes" ).val($( "#slider-range" ).slider( "values", 1 ) - 
			$( "#slider-range" ).slider( "values", 0 ) + " minutes");
	});
	
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
})
