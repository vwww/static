prepath = "http://d.cdn.victorz.ca/d/";
animspeed = 1000;

currentdir = "";
currentsort = "i";

function isNumber(n){ return !isNaN(parseFloat(n)) && isFinite(n); }

function mkdesc(d){
	if(d < 0) return "-";
	else if(!isNumber(d)) return d;
	// thanks to the Date prototype
	return (new Date(d * 1000)).format("mmm dd yyyy hh:MM:ss TT");
}

function fsz(s, noreduce){
	if(s < 0) return "-";
	else if(!isNumber(s)) return s;
	p = ["", "K", "M"]; // prefixes
	m = noreduce ? 0 : p.length - 1; // maximum...
	for(i = 0; i < m; ++i){
		if(s < 1000) break;
		s /= 1024;
	}
	return Math.round(s * 100) / 100 + ' ' + p[i] + 'B';
}

function mkbreadcrumbs(data){
	data = data.split("/");
	ret = ['/<a href="#" onclick="return newDir()">root</a>'];
	cascade = "";
	for(i in data) if(data[i]){
		if(cascade) cascade += '/';
		cascade += data[i];
		ret.push('<a href="#' + cascade + '" onclick="return newDir(\'' + cascade + '\')">' + data[i] + "</a>");
	}
	return ret.join("/") + "/";
}

function up1(d){
	return d
		.replace(/\\/g, '/') // convert backslashes
		.replace(/\/[^\/]*\/?$/, '') // remove last part
		.replace(/^\/+/g, ''); // remove the leading /s
}

// get image
function geti(d){
	// directory
	if(d.t == 'd') return "//p.cdn.victorz.ca/dl/i/folder" + (d.s && d.i != 1337 ? "" : 2) + ".png";
	// virtual "real" entry or URI
	if(d.t == 'r' || d.t == 'l') return "//p.cdn.victorz.ca/dl/i/link.png";
	// not a file
	if(d.t != 'f') return "//p.cdn.victorz.ca/dl/i/unknown.png";
	// file
	ext = d.i.split('.').slice(-1)[0];
	img = "unknown";
	
	switch(ext){
		case 'jpg':
		case 'jpeg':
		case 'bmp':
			img = 'jpg';
			break;
		
		case 'zip':
		case 'rar':
		case 'gz':
			img = 'archive';
			break;
		
		case 'txt':
			img = 'text';
			break;
		
		case 'htm':
		case 'html':
			img = 'html';
			break;
		
		case 'xls':
		case 'xlsx':
			img = 'xls';
			break;
		
		case 'doc':
		case 'docx':
			img = 'doc';
			break;
			
		case 'mpg':
		case 'mpeg':
		case 'mov':
		case 'avi':
			img = 'video';
			break;
		
		case 'gm6':
		case 'gmk':
			img = 'gm';
			break;
		
		case 'js':
		case 'vbs':
			img = 'script';
			break;
		
		// same
		case 'png':
		case 'gif':
		case 'exe':
		case 'fla':
		case 'swf':
		case 'sig':
		case 'pdf':
		case 'psd':
		case 'rm':
		case 'eps':
		case 'css':
			img = ext;
			break;
		// unknown
		default: break;
	}
	return "//p.cdn.victorz.ca/dl/i/" + img + ".png";
}

function fetchListing(){
	$.getJSON(prepath + 'list.php?d=' + currentdir + "&s=" + currentsort + "&callback=?", function(data){
		// update variables
		currentdir = data.p;
		if(data.s) currentsort = data.s;
		// update path display
		$("#breadcrumbpath").html(mkbreadcrumbs(data.p));
		$("#breadcrumbsz").text(fsz(data.c));
		$("#breadcrumbsz").attr("title", fsz(data.c, true));
		// update sort display
		$(".headersortable").css({"font-weight": "normal", "text-decoration": "none"});
		$("#header-" + currentsort.toLowerCase()).css({"font-weight": 900, "text-decoration": ((currentsort == currentsort.toUpperCase()) ? "overline" : "underline")});
		sorts = [ 'i', 's', 'r' ];
		for(i in sorts)
			$("#sort-" + sorts[i]).attr("src", "//p.cdn.victorz.ca/dl/i/" +
				(sorts[i] == currentsort.toLowerCase() ? ((currentsort == currentsort.toUpperCase() ? "s_d" : "s_a") + ".png") : "trans.gif"));
		// update total/above size
		$("#roots").text(fsz(data.t));
		$("#roots").attr("title", fsz(data.t, true));
		$("#ups").text(fsz(data.a));
		$("#ups").attr("title", fsz(data.a, true));
		// update time
		$("#rootl").text(mkdesc(data.m));
		$("#now").text((new Date).getFullYear());
		// upload status
		$("#usize").text(fsz(data.u));
		if(data.u){
			// allow uploads
			$("#upload").show(animspeed);
			$("#uploadbtn").removeAttr('disabled');
		}
		else{ // disallow uploads
			$("#upload").hide(animspeed);
			$("#uploadbtn").attr('disabled', 'disabled');
		}
		data = data.l; // list of contents
		// delete old listing, but spare the root and up
		$("#listing").children().each(function(i,e){ if(i >= 2) $(e).hide(animspeed*.7, function(){$(this).remove();}); });
		// allow up?
		e_up = $(".up");
		if(currentdir == "/") e_up.hide(animspeed*.7);
		else e_up.show(animspeed);
		e_up.attr('href', "#" + up1(currentdir));
		// c for alternating colors
		c = false;
		for(i in data){
			callback = 'onclick="'; // callback doesn't need last double quote
			d = data[i]; // data shortcut
			n = d.i; // name
			s = d.s; // size
			r = d.r; // remarks
			switch(d.t){
				case "r": // virtual "real" entry
					callback = 'href="' + d.i;
					break;
				case "l": // link
					callback = 'href="' + d.r;
					break;
				case "d": // directory
					callback += "return newDir('" + currentdir + '/' + d.i + "')\"";
					callback += 'href="#' + currentdir.substring(1) + (currentdir.length > 1 ? '/' : '') + d.i; // fx
					break; // an INTENTIONAL FALLTHROUGH used to be here as 'd' and 'f' had exclusive size/remarks controls...
				case "f": // file
					target = prepath + 'get.php?d=' + currentdir + '&f=' + d.i;
					callback += "window.open('" + target + "', '_blank');return false\"";
					callback += 'href="' + target; // fx
					break;
				default: // unknown
					n = "(unknown) " + n;
					callback += "return false";
					break;
			}
			a = $('<div><a class="' + ((c = !c) ? 'b' : 'w') + '" title="' + n + '" ' + callback + '"><img src="' + geti(d) + '" alt="' + n + '" /><strong>' + n + '</strong> <em title="' + fsz(s, true) + '">' + fsz(s) + '</em> ' + mkdesc(r) + '</a></div>');
			$("#listing").append(a);
			a.hide().show(animspeed);
		}
	});
}

function newDir(d){
	if(d == '..') currentdir = up1(currentdir);
	else currentdir = d;
	fetchListing();
    return true; // allow hash on click
}

function setsorting(s){ // EXPECTS lowercase FOR s
	s = s.toLowerCase(); // or maybe not
	if(currentsort == s) currentsort = s.toUpperCase();
	else currentsort = s;
	fetchListing();
}

$(function() { // DOM Loaded and Ready
	document.title = "Victor's AJAX Downloads";
	$(".up,#upload").hide();
    currentdir = location.hash.substring(1); // read from anchor hash
	fetchListing();
});