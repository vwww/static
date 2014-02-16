var START_POS=new L.LatLng(1.1,0.2),START_ZOOM=10,map=L.map("map",{center:START_POS,zoom:START_ZOOM});map.attributionControl.setPrefix('Engine by <a href="http://leafletjs.com">Leaflet</a>');map.attributionControl.addAttribution('<span id="attribution">this is <a href="http://victorz.ca">Victor</a>\'s zoomable visualization of <a href="https://xkcd.com/1110/" rel="external nofollow">xkcd - Click and Drag</a> (<a href="https://creativecommons.org/licenses/by-nc/2.5/">CC-BY-NC 2.5</a>)</span>');map.attributionControl.addAttribution('inspired by <a href="http://xkcd-map.rent-a-geek.de">dividuum</a>\'s map');map.attributionControl.addAttribution('images served by <a href="https://cloudflare.com">CloudFlare</a> and <a href="https://github.com">Github</a>');map.attributionControl.addAttribution('<script id="_wau_target">\x3c/script>');var hash=new L.Hash;hash.init(map);var _wau=_wau||[];_wau.push(["small","xvictorx","_target"]);(function(){var a=document.createElement("script");a.async=!0;a.src="http://widgets.amung.us/small.js";document.getElementsByTagName("head")[0].appendChild(a)})();map.on("movestart",function move_start(){document.getElementById("intro").style.display="none";map.off("movestart",move_start)});var layer_url="http://xkcd.cdn.victorz.ca/converted/{z}-{x}-{y}.png";function tile_is_available(a,b,c){return a in available&&-1!=available[a].indexOf(b+"-"+c)}var tileLayer=L.tileLayer(layer_url,{maxZoom:START_ZOOM,continuousWorld:!0,subdomains:"1234567890"});tileLayer.getTileUrl=function(a,b){b=b||this._getZoomForUrl();return tile_is_available(b,a.x,a.y)?L.Util.template(this._url,L.Util.extend({s:this._getSubdomain(a),z:b,x:a.x,y:a.y},this.options)):b?a.y<1<<b-1?"http://xkcd.cdn.victorz.ca/sky.png":"http://xkcd.cdn.victorz.ca/ground.png":0>a.y?"http://xkcd.cdn.victorz.ca/sky.png":0<a.y?"http://xkcd.cdn.victorz.ca/ground.png":"http://xkcd.cdn.victorz.ca/split.png"};tileLayer.addTo(map);var originalLayer=L.tileLayer.canvas({maxZoom:START_ZOOM,tileSize:2048});originalLayer.drawTile=function(a,b,c){31>b.x||111<b.x||(a=a.getContext("2d"),a.strokeStyle=a.fillStyle="green",c>START_ZOOM?(a.beginPath(),a.strokeRect(0,0,2048,2048)):(a.beginPath(),a.strokeRect(0,0,256,256)),c=64<=b.x?b.x-64+1+"e":64-b.x+"w",b=64<=b.y?b.y-64+1+"s":64-b.y+"n",a.fillText("("+c+b+".png)",5,10))};var coordinateLayer=L.tileLayer.canvas({maxZoom:START_ZOOM});coordinateLayer.drawTile=function(a,b,c){0>b.x||b.x>=1<<c||(a=a.getContext("2d"),a.strokeStyle=a.fillStyle="red",a.strokeRect(0,0,256,256),a.fillText("("+b.x+", "+b.y+")",5,10))};var contentLayer=L.tileLayer.canvas({maxZoom:START_ZOOM});contentLayer.drawTile=function(a,b,c){tile_is_available(c,b.x,b.y)&&(a=a.getContext("2d"),a.strokeStyle=a.fillStyle="blue",a.strokeRect(0,0,256,256))};var baseMaps={"xkcd 1110":tileLayer},overlayMaps={File:originalLayer,Coordinates:coordinateLayer,Content:contentLayer};L.control.layers(baseMaps,overlayMaps).addTo(map);function auto_close(){var a=document.getElementById("autoclose");a.parentNode.removeChild(a)}window.setTimeout(auto_close,5E3);