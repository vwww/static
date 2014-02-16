// Map
var START_POS = new L.LatLng(1.1, 0.2);
var START_ZOOM = 10; // also the maximum
var map = L.map('map', { center: START_POS, zoom: START_ZOOM });

// Attribution
map.attributionControl.setPrefix('Engine by <a href="http://leafletjs.com">Leaflet</a>'); // customize prefix
map.attributionControl.addAttribution('<span id="attribution">this is <a href="http://victorz.ca">Victor</a>\'s zoomable visualization of <a href="https://xkcd.com/1110/" rel="external nofollow">xkcd - Click and Drag</a> (<a href="https://creativecommons.org/licenses/by-nc/2.5/">CC-BY-NC 2.5</a>)</span>');
map.attributionControl.addAttribution('inspired by <a href="http://xkcd-map.rent-a-geek.de">dividuum</a>\'s map');
map.attributionControl.addAttribution('images served by <a href="https://cloudflare.com">CloudFlare</a> and <a href="https://github.com">Github</a>');
map.attributionControl.addAttribution('<script id="_wau_target"></script>');

// Hash
var hash = new L.Hash();
hash.init(map);

// Online
var _wau = _wau || [];
_wau.push(["small","xvictorx","_target"]);
(function(){
var s=document.createElement("script");
s.async=true;
s.src="http://widgets.amung.us/small.js";
document.getElementsByTagName("head")[0].appendChild(s);})();

// Intro Hider
/*
//if (window.location.hash.length > 1)
var parsed_hash = hash.parseHash(window.location.hash);
if(parsed_hash && (parsed_hash.zoom != START_ZOOM || parsed_hash.center != START_POS || parsed_hash.center.distanceTo(START_POS) > 100000))
	document.getElementById('intro').style.display = 'none';
else
*/
map.on('movestart', // not 'dragstart'
	function move_start(){
		document.getElementById('intro').style.display = 'none';
		map.off('movestart', move_start);
	}
);

// Tiles
// xkcd-{s}.xkcd.cdn
var layer_url = 'http://xkcd.cdn.victorz.ca/converted/{z}-{x}-{y}.png';

function tile_is_available(zoom, x, y){
	return zoom in available && available[zoom].indexOf(x + '-' + y) != -1;
}

var tileLayer = L.tileLayer(layer_url, {
	maxZoom: START_ZOOM,
	continuousWorld: true,
	subdomains: "1234567890"
});

tileLayer.getTileUrl = function(tilePoint, zoom){
	zoom = zoom || this._getZoomForUrl();
	if(tile_is_available(zoom, tilePoint.x, tilePoint.y))
		return L.Util.template(this._url, L.Util.extend({ 
			s: this._getSubdomain(tilePoint), 
			z: zoom, 
			x: tilePoint.x, 
			y: tilePoint.y
		}, this.options));
	// sky block?
	// 1 << n = 2^n
	if(zoom){
		if(tilePoint.y < (1 << (zoom-1)))
			return 'http://xkcd.cdn.victorz.ca/sky.png';
		else return 'http://xkcd.cdn.victorz.ca/ground.png';
	}
	else{
		if(tilePoint.y < 0)
			return 'http://xkcd.cdn.victorz.ca/sky.png';
		else if(tilePoint.y > 0)
			return 'http://xkcd.cdn.victorz.ca/ground.png';
		else return 'http://xkcd.cdn.victorz.ca/split.png';
	}
}
tileLayer.addTo(map);

// Debug Tile layers
var originalLayer = L.tileLayer.canvas({"maxZoom": START_ZOOM, "tileSize": 2048});
originalLayer.drawTile = function (canvas, tilePoint, zoom) {
	if(tilePoint.x < 31 || tilePoint.x > 111) return;
	var ctx = canvas.getContext('2d');
	ctx.strokeStyle = ctx.fillStyle = "green";
	if(zoom > START_ZOOM){
		ctx.beginPath();
		ctx.strokeRect(0,0, 2048,2048);
		// 64,63 = 1n1e
		var xcoord = tilePoint.x >= 64 ? ((tilePoint.x - 64 + 1) + "e") : ((64 - tilePoint.x) + "w");
		var ycoord = tilePoint.y >= 64 ? ((tilePoint.y - 64 + 1) + "s") : ((64 - tilePoint.y) + "n");
		ctx.fillText('(' + xcoord + ycoord + '.png)',5,10);
	}
	else{
		ctx.beginPath();
		ctx.strokeRect(0,0, 256,256);
		// 64,63 = 1n1e
		var xcoord = tilePoint.x >= 64 ? ((tilePoint.x - 64 + 1) + "e") : ((64 - tilePoint.x) + "w");
		var ycoord = tilePoint.y >= 64 ? ((tilePoint.y - 64 + 1) + "s") : ((64 - tilePoint.y) + "n");
		ctx.fillText('(' + xcoord + ycoord + '.png)',5,10);
	}
};

var coordinateLayer = L.tileLayer.canvas({"maxZoom": START_ZOOM});
coordinateLayer.drawTile = function (canvas, tilePoint, zoom) {
	if(tilePoint.x < 0 || tilePoint.x >= (1 << zoom)) return;
	var ctx = canvas.getContext('2d');
	ctx.strokeStyle = ctx.fillStyle = "red";
	ctx.strokeRect(0,0, 256,256);
	ctx.fillText('(' + tilePoint.x + ', ' + tilePoint.y + ')',5,10);
};

var contentLayer = L.tileLayer.canvas({"maxZoom": START_ZOOM});
contentLayer.drawTile = function (canvas, tilePoint, zoom) {
	if(!tile_is_available(zoom, tilePoint.x, tilePoint.y)) return;
	var ctx = canvas.getContext('2d');
	ctx.strokeStyle = ctx.fillStyle = "blue";
	ctx.strokeRect(0,0, 256,256);
};

// Layer Group
var baseMaps = {"xkcd 1110": tileLayer};
var overlayMaps = {
	"File": originalLayer,
	"Coordinates": coordinateLayer,
	"Content": contentLayer
};
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Auto Close
function auto_close(){
	var target = document.getElementById('autoclose');
	target.parentNode.removeChild(target);
}
window.setTimeout(auto_close, 5000);
