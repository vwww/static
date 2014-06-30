// "Victor's Site" code (encapsulate the scope)
var vsite = {
	// CONSTANTS
	ANIMSPEED: 1000,
	// Functions
	// Browse to a specific path (must be checked first)
	browse: function (newpath, skipanim){
		var anim = skipanim ? 0 : vsite.ANIMSPEED;
		// Check the path first
		var $list = $("ol#sites > li");
		if(!$list.filter(function (index){ return $(this).attr("data-path") == newpath; }).length)
			newpath = "";
		// Update breadcrumbs
		var $breadcrumbs = $("p#breadcrumbs");
		$breadcrumbs.text("/"); // clear it on the way
		$("<a>").text("[root]").attr("href", "#").appendTo($breadcrumbs);
		var newpath_split = newpath.split();
		if(newpath_split[0])
			for(var i in newpath_split){
				$breadcrumbs.append("/");
				$("<a>").text(newpath_split[i]).attr("href", "#" + newpath_split.slice(0, i + 1).join("/")).appendTo($breadcrumbs);
			}
		function cs(str){
			for(var i=count=0; i<str.length; count+=+('/'===str[i++]));
			return count;
		};
		// Show/hide as needed
		$list.each(function (index, element){
			var $t = $(this);
			var tpath = $t.attr("data-path");
			// special: root element laziness
			if(tpath == undefined) tpath = "";
			// show if: // not currently selected AND (ancestor OR child by 1 level)
			if(newpath != tpath && ((newpath.slice(0, tpath.length) == tpath) ||
				(cs(tpath) == (newpath ? cs(newpath) + 1 : 0) && tpath.slice(0, newpath.length) == newpath)))
					$t.show(anim);
			else $t.hide(anim);
		});
	},
	// "Uptime" Counter function
	uptick: function (){
		var timeValue = ((new Date() - new Date(2004, 12, 20)) / 365.25 / 24 / 3600 / 1000);
		$('span#uptime-years').text(timeValue.toFixed(8));
		var hexTimeValue = timeValue.toString(16);
		$('span#uptime-years-hex').text(hexTimeValue.slice(0, 7 + hexTimeValue.indexOf('.') + 1));
		// also good for the poke bot...
		$('#poke_timer').each(function() {
			$(this).text(((new Date() - vsite.poke_last) / 1000).toFixed(1) + " s");
		});
	},
	// Poke bot info
	poke_last: null,
	poke_update: function (data, first){
		var msg = data[0] + " returned / " + data[1] + " checks / " + (data[0] * 100 / data[1]).toFixed(3) + "% duty cycle / last poke: ";
		if(data[2]){
			vsite.poke_last = new Date(data[2][0] * 1000);
			msg += '<a href="https://www.facebook.com/' + data[2][1] + '">' + data[2][2] + '</a> <a id="poke_timer" title="' + vsite.poke_last.toString() + '">a moment</a> ago';
		} else {
			msg += 'unknown';
		}
		$("span#poke_info").html(msg);
		console.log(data);
	}
};

// Initialization scripts
$(document).ready(function () {
	// Use #hash to jump locations
	vsite.browse(location.hash.slice(1), true);

	// Copyright year (once)
	$("span#now").text((new Date).getFullYear());

	// "Uptime" counter
	// Interval for decimal = 315.36ms = 0.00000001 years
	// Interval for hexadecimal = 117.5 ms = 1 / 16 ^ 7 years to ms
	setInterval(vsite.uptick, 105);
	vsite.uptick(); // initial tick

	// Poke bot info
	$("span#poke_info").text("[getting data]");
	$.getJSON("https://vfbbot.appspot.com/stats?callback=?", function( data ) {
		vsite.poke_update(data, true);
	});
	var client = new Fpp.Client('http://pubsub.fanout.io/r/20018da6');
	var channel = client.Channel('p');
	channel.on('data', vsite.poke_update);
});

// bind to the hash changes
$(window).bind('hashchange', function(e) {
	vsite.browse(location.hash.slice(1));
});