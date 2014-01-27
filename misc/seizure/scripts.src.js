var sezBackint = sezImgint = sezTimeout = sezTimeval = 0;
var sezImgIteration = false;
var seizureImagePath = "http://p.cdn.victorz.ca/misc/seizure/i/";
var seizureImages = [
	false,
	'ram',
	'matthew',
	'matthew_release'
];
var seizureImageName = ""; // cached

strobe = false;
function genStrobeColor(){
	return (strobe = !strobe) ? "#000" : "#FFF";
}

function genRandHexColor(){
	return '#'+Math.round(Math.random()*0xFFFFFF).toString(16);
	/*
	colors = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"0",
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
	];
	color = "";
	for (i=0;i<6;++i)
		color += colors[Math.round(Math.random()*15)];
	return "#" + color;
	*/
}

function btnStartSezClicked(){
	document.getElementById('sezTmpHide').style.display = 'none';
	document.getElementById('sezTmpShow').style.display = '';
	// Get Value of Background
	qbr = "#FFFFFF";
	qbo = document.getElementsByName('sezBack');
	qbl = qbo.length;
	for (i = 0; i < qbl; i++) {
		if (qbo[i].checked) {
			qbr = qbo[i].value;
		}
	}
	if (qbr == 1){
		sezBackint = setInterval("handleSeizureBack(genStrobeColor)", parseInt(document.getElementById('sezFreq').value));
	}
	if (qbr == 2){
		handleSeizureBack(genRandHexColor);
		sezBackint = setInterval("handleSeizureBack(genRandHexColor)", parseInt(document.getElementById('sezFreq').value));
	}
	if (qbr == "s"){
		document.body.style.backgroundColor = document.getElementById('sezBacks').value;
		sezBackint = 0;
	}
	if (qbr == "c"){
		document.body.style.backgroundColor = document.getElementById('sezBackc').value;
		sezBackint = 0;
	}
	// Value of Image
	qir = null;
	qio = document.getElementsByName('sezImg');
	qil = qio.length;
	for (i = 0; i < qil; i++) {
		if (qio[i].checked) {
			qir = qio[i].value;
		}
	}
	if(seizureImageName = seizureImages[qir]){
		document.getElementById('sezImgTarget').src = seizureImagePath + seizureImageName + ".png";
		sezImgIteration = false;
		sezImgInt = setInterval(handleSeizureImg, parseInt(document.getElementById('sezFreq').value) * document.getElementById('sezFreqMult').value);
	}
	else{
		document.getElementById('sezImgTarget').src = seizureImagePath + "i.png";
		sezImgInt = 0;
	}
	// timer
	document.getElementById('sezTimeTarget').innerHTML = sezTimeval = 0;
	sezTimeout = setTimeout("handleSeizureTickTock()", 1);
}

function handleSeizureBack(callback){
	document.body.style.backgroundColor = callback();
}

function handleSeizureImg(){
	curname = document.getElementById('sezImgTarget').src;
	if (sezImgIteration = !sezImgIteration){
		document.getElementById('sezImgTarget').src = seizureImagePath + seizureImageName + "_invert.png";
	} else {
		document.getElementById('sezImgTarget').src = seizureImagePath + seizureImageName + ".png";
	}
}

function getCookie(c){var i,x,y,ARRcookies=document.cookie.split(";");for(i=0;i<ARRcookies.length;i++){x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);x=x.replace(/^\s+|\s+$/g,"");if(x==c)return unescape(y)}return 0}
function setRecordCookie(v){var exdate=new Date();exdate.setDate(exdate.getDate() + 365000);document.cookie="record="+v+"; expires="+exdate.toUTCString()} // 1000 years
function getRecordCookie(){return getCookie("record")}

winW = winH = 0;
winR = 250000;
window.onresize = function(){
	// update size variables
	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	if(typeof window.innerWidth != 'undefined'){
		winW = window.innerWidth;
		winH = window.innerHeight;
	}
	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
	else if (document.body && document.body.offsetWidth) {
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	}
	// older versions of IE
	else{
		winW = document.getElementsByTagName('body')[0].clientWidth;
		winH = document.getElementsByTagName('body')[0].clientHeight;
	}
	document.getElementById('winW').innerHTML = winW;
	document.getElementById('winH').innerHTML = winH;
	document.getElementById('winR').innerHTML = winW * winH;
	document.getElementById('winC').innerHTML = winW * winH >= winR ? "is large enough" : "needs to be at least " + winR + " pixels in area!";
}

function handleSeizureTickTock(){
	// sanity checks for the timer
	if(document.body.blurry || winW * winH < winR || (!sezBackint && !sezImgInt)) return;
	// tick-tock-tick-tock
	document.getElementById('sezTimeTarget').innerHTML = ++sezTimeval / 1000;
	sezTimeout = setTimeout("handleSeizureTickTock()", 1);
}

function roundNumber(num,dec){var result=String(Math.round(num*Math.pow(10,dec))/Math.pow(10,dec));if(result.indexOf('.')<0){result+='.'}while(result.length-result.indexOf('.')<=dec){result+='0'}return result}
function formatseizureTime(n){return roundNumber(n / 1000, 3)}

function haltSeizure(){
	if(!sezBackint && !sezImgInt && !sezTimeout) return;
	document.getElementById('sezTmpHide').style.display = '';
	document.getElementById('sezTmpShow').style.display = 'none';
	document.body.style.backgroundColor = "#FFFFFF";
	clearInterval(sezBackint);
	clearInterval(sezImgInt);
	if(sezTimeval > getRecordCookie()){
		document.cookie = setRecordCookie(sezTimeval);
		document.getElementById('sezTimeRecord').innerHTML = formatseizureTime(sezTimeval) + " seconds [!NEW!]";
	}
	else displayRecord();
	document.getElementById('sezTimeLast').innerHTML = formatseizureTime(sezTimeval) + " seconds";
	clearInterval(sezTimeout);
	sezTimeout = 0;
}

function displayRecord(){document.getElementById('sezTimeRecord').innerHTML=getRecordCookie()?formatseizureTime(getRecordCookie())+" seconds":"Unknown"}

// page body.* events
seizureLoad = function(){ // already set for window.onload
	// Copyright year
	document.getElementById('copyyear').innerText = (new Date).getFullYear();

	// Preload seizure images
	for(var i in seizureImages)
		if(seizureImages[i]){
			var i2 = new Image();
			var i3 = new Image();
			i2.src = seizureImagePath + seizureImages[i] + '.png';
			i3.src = seizureImagePath + seizureImages[i] + '_invert.png';
		}

	// Prepare the stop button
	var newStop = document.createElement("img");
	newStop.src = seizureImagePath + "sop.png";
	newStop.onclick = haltSeizure;
	document.getElementById("sezStop").parentNode.replaceChild(newStop, document.getElementById("sezStop"));

	displayRecord();
	window.onresize();
};
window.onfocus = function(){this.blurry=false;};
window.onblur = function(){ this.blurry=true; };
window.ondblclick = haltSeizure;

// reset button
function btnResetClicked(){setRecordCookie('');displayRecord();}
// 1! or 0!/max! button
function btnSezWantsClicked(v){
	var a = document.getElementById('sezFreq');
	for (var i = 0; i < a.options.length; i++) if (a.options[i].value == v) {
		if (a.selectedIndex != i) {
			a.selectedIndex = i;
			a.onchange();
		}
		break;
	}
}