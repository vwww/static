var vsite={ANIMSPEED:1E3,browse:function(a,h){function b(a){for(var b=count=0;b<a.length;count+=+("/"===a[b++]));return count}var d=h?0:vsite.ANIMSPEED,k=$("ol#sites > li");k.filter(function(b){return $(this).attr("data-path")==a}).length||(a="");var e=$("p#breadcrumbs");e.text("/");$("<a>").text("[root]").attr("href","#").appendTo(e);var f=a.split();if(f[0])for(var l in f)e.append("/"),$("<a>").text(f[l]).attr("href","#"+f.slice(0,l+1).join("/")).appendTo(e);k.each(function(e,f){var g=$(this),c=g.attr("data-path");void 0==c&&(c="");a!=c&&(a.slice(0,c.length)==c||b(c)==(a?b(a)+1:0)&&c.slice(0,a.length)==a)?g.show(d):g.hide(d)})},uptick:function(){var a=(new Date-new Date(2004,12,20))/365.25/24/3600/1E3;$("span#uptime-years").text(a.toFixed(8));a=a.toString(16);$("span#uptime-years-hex").text(a.slice(0,7+a.indexOf(".")+1));vsite.poke_last&&$("#poke_lt").text(((new Date-vsite.poke_last)/1E3).toFixed(0)+"s ago")},poke_last:null,poke_now:[1,2],poke_yesterday:[0,1],poke_update:function(a,h){for(var b in a)switch(b){case"p":vsite.poke_now=a[b],$("#poke_r").text(a[b][0]),$("#poke_t").text(a[b][1]),$("#poke_t").text((a[b][0]/a[b][1]).toFixed(4));case"q":"q"==b&&(vsite.poke_yesterday=a[b]);$("#poke_dr").text("(+"+(vsite.poke_now[0]-vsite.poke_yesterday[0])+")");$("#poke_dt").text("(+"+(vsite.poke_now[1]-vsite.poke_yesterday[1])+")");var d=vsite.poke_now[0]/vsite.poke_now[1]-vsite.poke_yesterday[0]-vsite.poke_yesterday[1];0>d?($("#poke_dt").text("(-"+(-d).toFixed(4)+")"),$("#poke_dt").attr("class","poke_dn")):($("#poke_dt").text("(+"+d.toFixed(4)+")"),$("#poke_dt").attr("class","poke_up"));break;case"l":a[b]?(vsite.poke_last=new Date(1E3*a[b][0]),$("#poke_lt").text("recently"),$("#poke_lt").attr("title",vsite.poke_last.toString()),$("#poke_lu").text(a[b][2]),$("#poke_lu").attr("href","https://www.facebook.com/"+a[b][1])):($("#poke_lt").text("unknown"),$("#poke_lu").text("someone"),$("#poke_lu").removeAttr("href"))}console.log(a)}};$(document).ready(function(){vsite.browse(location.hash.slice(1),!0);$("span#now").text((new Date).getFullYear());setInterval(vsite.uptick,105);vsite.uptick();$("span#poke_info").text("[getting data]");$.getJSON("https://vfbbot.appspot.com/stats?callback=?",vsite.poke_update);(new Fpp.Client("http://pubsub.fanout.io/r/20018da6")).Channel("p").on("data",vsite.poke_update)});$(window).bind("hashchange",function(a){vsite.browse(location.hash.slice(1))});