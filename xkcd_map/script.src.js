// Map
var START_POS = new L.LatLng(1.1, 0.2);
/** @const */ var MAX_ZOOM = 10; // also the maximum
var map = L.map('map', { center: START_POS, zoom: MAX_ZOOM, fullscreenControl: true });

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
if(parsed_hash && (parsed_hash.zoom != MAX_ZOOM || parsed_hash.center != START_POS || parsed_hash.center.distanceTo(START_POS) > 100000))
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
	maxZoom: MAX_ZOOM,
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

// Tile Highlighting layers
var originalLayer = L.tileLayer.canvas({"maxZoom": MAX_ZOOM, "tileSize": 2048});
function to_original(tx, ty, x, y, zoom){
	var newx = (tx << (MAX_ZOOM - zoom)) + x - (1 << (MAX_ZOOM - 4));
	if(newx < -33 || newx >= 48) return false; // 81 frames wide (33 West - 48 East)
	if(newx >= 0) newx = (newx+1) + 'e';
	else newx = (-newx) + 'w';
	var newy = (ty << (MAX_ZOOM - zoom)) + y - (1 << (MAX_ZOOM - 4));
	if(newy < -19 || newy >= 13) return false; // 32 frames tall (13 North - 19 South)
	if(newy >= 0) newy = (newy+1) + 's';
	else newy = (-newy) + 'n';
	return newy + newx + '.png'; //' (' + tx + ', ' + ty + ' / ' + x + ', ' + y + ')';
}
originalLayer.drawTile = function (canvas, tilePoint, zoom) {
	if(zoom < 5) return; // too crowded
	//if(tilePoint.x < 31 || tilePoint.x > 111) return; // TODO: add optimizer
	if(tilePoint.x < 0 || tilePoint.x >= (1 << zoom)) return;
	var ctx = canvas.getContext('2d');
	ctx.strokeStyle = ctx.fillStyle = "green";
	var tile_size = 2 << zoom; // MAX_ZOOM: 2048, MAX_ZOOM-1: 1024, MAX_ZOOM-2: 512 etc.
	var tile_num = 1 << (MAX_ZOOM-zoom); // MAX_ZOOM: 1, MAX_ZOOM-1: 2, MAX_ZOOM-2: 4, etc.
	for(var x = 0; x < tile_num; ++x)
		for(var y = 0; y < tile_num; ++y){
			var xoff = x * tile_size;
			var yoff = y * tile_size;
			var original_file = to_original(tilePoint.x, tilePoint.y, x, y, zoom);
			if(!original_file) continue;
			ctx.strokeRect(xoff, yoff, tile_size, tile_size);
			ctx.fillText(original_file, xoff + 5, yoff + 10);
		}
};

var coordinateLayer = L.tileLayer.canvas({"maxZoom": MAX_ZOOM});
coordinateLayer.drawTile = function (canvas, tilePoint, zoom) {
	if(tilePoint.x < 0 || tilePoint.x >= (1 << zoom)) return;
	var ctx = canvas.getContext('2d');
	ctx.strokeStyle = ctx.fillStyle = "red";
	ctx.strokeRect(0,0, 256,256);
	ctx.fillText('(' + tilePoint.x + ', ' + tilePoint.y + ')',5,10);
};

var contentLayer = L.tileLayer.canvas({"maxZoom": MAX_ZOOM});
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

var layers = new L.LayerGroup([tileLayer]);
var miniMap = new L.Control.MiniMap(tileLayer, {width: 350, height: 250, toggleDisplay: true}).addTo(map);

// Auto Close
function auto_close(){
	var target = document.getElementById('autoclose');
	target.parentNode.removeChild(target);
}
window.setTimeout(auto_close, 5000);
