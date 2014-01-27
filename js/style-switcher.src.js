/**
Victor's CSS stylesheet switcher script!
*/

/* x-refs
acr/forum
acr/team
dl/docs
misc/3d
misc/pubs
// /xrefs*/

// cookie helper
function __vss_createCookie(name,value,secs) {
	if (secs) {
		var date = new Date();
		date.setTime(date.getTime()+secs);
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function __vss_readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function __vss_eraseCookie(name) {
	__vss_createCookie(name,"",-1);
}

// stylesheet new
function ssn(ni){
	var metas = document.getElementsByTagName("meta");
	var newStyle = null;
	for(var i in metas)
		if(metas[i].name == "vss_" + ni)
			newStyle = metas[i].content;
	document.getElementById("vss_style").href = newStyle;
	//document.getElementById("style" + ni).href = null;
	__vss_createCookie("vss", ni, 2*365*24*60*60*1000); // 2 years * 365 days/year * 24 hours/day * 60 minutes/hour * 60 seconds/minute * 1000 seconds/millisecond
	return false;
}

// as long as stylesheets are loaded...
if(__vss_readCookie("vss") !== null) ssn(__vss_readCookie("vss"));