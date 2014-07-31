// config
$.timeago.settings.strings.seconds = '%d seconds';

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
	},
	// Poke bot info
	poke_update: function (data, first){
		// current stats (p)
		$('#poke_r').text(data.pokes);
		$('#poke_t').text(data.ticks); // (t)
		$('#poke_c').text((data.pokes * 100 / data.ticks).toFixed(4) + '%');
		// previous day stats (q)
		$('#poke_dr').text('(+' + (data.pokes - data.pokes_) + ')');
		$('#poke_dt').text('(+' + (data.ticks - data.ticks_) + ')');
		var dc = 10000 * (data.pokes / data.ticks - data.pokes_ / data.ticks_);
		if(dc < 0){
			$('#poke_dc').html('(-' + (-dc).toFixed(4) + '&#8241;)');
			$('#poke_dc').attr('class', 'poke_dn');
		} else {
			$('#poke_dc').html('(+' + dc.toFixed(4) + '&#8241;)');
			$('#poke_dc').attr('class', 'poke_up');
		}
		// last poke (l)
		if(data.l){
			$('#poke_lt').text((new Date(data.l[0] * 1000)).toString());
			$('#poke_lt').attr('title', (new Date(data.l[0] * 1000)).toISOString());
			$('#poke_lt').data("timeago", null).timeago();
			$('#poke_lu').text(data.l[2]);
			$('#poke_lu').attr('href', 'https://www.facebook.com/' + data.l[1]);
		} else {
			$('#poke_lt').text('unknown');
			$('#poke_lu').text('someone');
			$('#poke_lu').removeAttr('href');
		}
		console.log(data);
	}
};

// Initialization scripts
$(document).ready(function () {
	// Use #hash to jump locations
	vsite.browse(location.hash.slice(1), true);

	// Copyright year (once)
	$("span#now").text((new Date).getFullYear());

	// Format build time
	$("span#build-time").timeago();

	// "Uptime" counter
	// Interval for decimal = 315.36ms = 0.00000001 years
	// Interval for hexadecimal = 117.5 ms = 1 / 16 ^ 7 years to ms
	setInterval(vsite.uptick, 105);
	vsite.uptick(); // initial tick

	// Poke bot info
	$("span#poke_info").text("[getting data]");
	var simperium = new Simperium('brake-foods-bc7', { token : 'ce4832ce12e24ee6860886d9b4567b12'});
	var bucket = simperium.bucket('poke');
	bucket.on('notify', function(id, data) {
		if(id == 'p')
			vsite.poke_update(data);
		else {
			console.log(id + " was updated to");
			console.log(data);
		}
	});
	bucket.start();
});

// bind to the hash changes
$(window).bind('hashchange', function(e) {
	vsite.browse(location.hash.slice(1));
});