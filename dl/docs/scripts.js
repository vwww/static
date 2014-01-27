// highlighter
jQuery.extend({
	highlight: function (node, re, nodeName, className) {
		if (node.nodeType === 3) {
			var match = node.data.match(re);
			if (match) {
				var highlight = document.createElement(nodeName || 'span');
				if(className) highlight.className = className;
				var wordNode = node.splitText(match.index);
				wordNode.splitText(match[0].length);
				var wordClone = wordNode.cloneNode(true);
				highlight.appendChild(wordClone);
				wordNode.parentNode.replaceChild(highlight, wordNode);
				return 1; //skip added node in parent
			}
		} else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
				!/(script|style)/i.test(node.tagName) && // ignore script and style nodes
				!(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
			for (var i = 0; i < node.childNodes.length; i++) {
				i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
			}
		}
		return 0;
	}
});

jQuery.fn.unhighlight = function (options) {
	var settings = { className: 'highlight', element: 'span' };
	jQuery.extend(settings, options);

	return this.find(settings.element + "." + settings.className).each(function () {
		var parent = this.parentNode;
		parent.replaceChild(this.firstChild, this);
		parent.normalize();
	}).end();
};

jQuery.fn.highlight = function (words, options) {
	var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
	jQuery.extend(settings, options);

	if (words.constructor === String) {
		words = [words];
	}
	words = jQuery.grep(words, function(word, i){
	  return word != '';
	});
	words = jQuery.map(words, function(word, i) {
	  return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	});
	if (words.length == 0) { return this; };

	var flag = settings.caseSensitive ? "" : "i";
	var pattern = "(" + words.join("|") + ")";
	if (settings.wordsOnly) {
		pattern = "\\b" + pattern + "\\b";
	}
	var re = new RegExp(pattern, flag);

	return this.each(function () {
		jQuery.highlight(this, re, settings.element, settings.className);
	});
};

function doHighlight(){
	ho = $("div#content div.article, div.content-in li, ul.ul-list li");
	ho.highlight.apply(ho, arguments);
}

function undoHighlight(){
	ho = $("div#content div.article, div.content-in li, ul.ul-list li");
	ho.unhighlight.apply(ho, arguments);
}

// search function
function searchDirty(){
	// looks like our search results are dirty--fix it!
	var searchfor = $("#search-input input").val().toLowerCase().split(" ");
	var rules = [];
	for(var i in searchfor) if(searchfor[i] != ''){
		switch(searchfor[i][0]){
			default: rules.push([searchfor[i], 1]); break;
			case '-': rules.push([searchfor[i].substring(1), 0]); break;
			case '+': // also works as default handler, but not as fast
				var searchnum = 0;
				while(searchfor[i][searchnum] == '+')
					++searchnum;
				rules.push([searchfor[i].substring(searchnum), 1 + searchnum]);
				break;
		}
	}
	// define highlights
	highlight_strike = {element: "s", className: "highlight_strike"};
	highlight_full = {className: "highlight_full"};
	highlight_partial = {className: "highlight_partial"};
	// define queues
	h_strike = [];
	h_full = [];
	h_partial = [];
	// chear highlights
	undoHighlight(highlight_strike);
	undoHighlight(highlight_full);
	undoHighlight(highlight_partial);
	$("div#content div.article, div.content-in li, ul.ul-list li").each(function (){
		var matches_all = true;
		for(var i in rules){
			var lookfor = rules[i][0];
			var tokenlen = lookfor.length;
			var find = rules[i][1];
			var thistext = $(this).html().toLowerCase();
			var pos = thistext.indexOf(lookfor);
			if(!find){
				if(pos >= 0){
					// strikethrough? + excluded
					h_strike.push(lookfor);
					matches_all = false;
				}
			}
			else if(pos < 0) matches_all = false; // not found
			else{ // if(find > 1){ // must repeat
				var valid = true;
				while(--find > 0){
					pos += tokenlen;
					if((pos = thistext.indexOf(lookfor, pos)) < 0){
						valid = false;
						break;
					}
				}
				if(valid){
					// highlight
					h_full.push(lookfor);
				}
				else{
					// light highlight + excluded
					h_partial.push(lookfor);
					matches_all = false;
				}
			}
		}
		// does it work?
		if(matches_all){
			//$(this).css('background-color', '');
			$(this).css('opacity', 1);
		}
		else{
			//$(this).css('background-color', '#000');
			$(this).css('opacity', 0.3);
		}
	});
	// highlight
	if(h_strike.length) doHighlight(h_strike, highlight_strike);
	if(h_full.length) doHighlight(h_full, highlight_full);
	if(h_partial.length) doHighlight(h_partial, highlight_partial);
}