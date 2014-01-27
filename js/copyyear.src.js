/* x-refs
acr/team
acr/ms
blog
chat
-dl
dl/docs
misc/
 3d
 -iq
 logic
 music
 -oxidane
 -seizure
ssl?
// /xrefs*/
(function(){
	var auto_copyright = function(){
		document.getElementById('copyyear').innerText = (new Date).getFullYear();
	}
	if(window.onload === null) window.onload = auto_copyright;
})();