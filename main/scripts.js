var vsite={ANIMSPEED:1E3,browse:function(a,g){function b(a){for(var b=count=0;b<a.length;count+=+("/"===a[b++]));return count}var h=g?0:vsite.ANIMSPEED,k=$("ol#sites > li");k.filter(function(b){return $(this).attr("data-path")==a}).length||(a="");var d=$("p#breadcrumbs");d.text("/");$("<a>").text("[root]").attr("href","#").appendTo(d);var e=a.split();if(e[0])for(var l in e)d.append("/"),$("<a>").text(e[l]).attr("href","#"+e.slice(0,l+1).join("/")).appendTo(d);k.each(function(d,e){var f=$(this),c=f.attr("data-path");void 0==c&&(c="");a!=c&&(a.slice(0,c.length)==c||b(c)==(a?b(a)+1:0)&&c.slice(0,a.length)==a)?f.show(h):f.hide(h)})},uptick:function(){var a=(new Date-new Date(2004,12,20))/365.25/24/3600/1E3;$("span#uptime-years").text(a.toFixed(8));a=a.toString(16);$("span#uptime-years-hex").text(a.slice(0,7+a.indexOf(".")+1));$("#poke_timer").each(function(){$(this).text(((new Date-vsite.poke_last)/1E3).toFixed(1)+"s ago")})},poke_last:null,poke_update:function(a,g){var b=a[0]+" returned / "+a[1]+" checks / "+(100*a[0]/a[1]).toFixed(3)+"% duty cycle / last poke: ";a[2]?(vsite.poke_last=new Date(1E3*a[2][0]),b+='<a id="poke_timer" title="'+vsite.poke_last.toString()+'">recently</a> by <a href="https://www.facebook.com/'+a[2][1]+'">'+a[2][2]+"</a>"):b+="unknown";$("span#poke_info").html(b);console.log(a)}};$(document).ready(function(){vsite.browse(location.hash.slice(1),!0);$("span#now").text((new Date).getFullYear());setInterval(vsite.uptick,105);vsite.uptick();$("span#poke_info").text("[getting data]");$.getJSON("https://vfbbot.appspot.com/stats?callback=?",function(a){vsite.poke_update(a,!0)});(new Fpp.Client("http://pubsub.fanout.io/r/20018da6")).Channel("p").on("data",vsite.poke_update)});$(window).bind("hashchange",function(a){vsite.browse(location.hash.slice(1))});