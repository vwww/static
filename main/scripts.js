$.timeago.settings.strings.seconds="%ds ago";var vsite={ANIMSPEED:1E3,browse:function(a,f){function b(a){for(var b=count=0;b<a.length;count+=+("/"===a[b++]));return count}var g=f?0:vsite.ANIMSPEED,h=$("ol#sites > li");h.filter(function(b){return $(this).attr("data-path")==a}).length||(a="");var e=$("p#breadcrumbs");e.text("/");$("<a>").text("[root]").attr("href","#").appendTo(e);var c=a.split();if(c[0])for(var k in c)e.append("/"),$("<a>").text(c[k]).attr("href","#"+c.slice(0,k+1).join("/")).appendTo(e);h.each(function(f,e){var c=$(this),d=c.attr("data-path");void 0==d&&(d="");a!=d&&(a.slice(0,d.length)==d||b(d)==(a?b(a)+1:0)&&d.slice(0,a.length)==a)?c.show(g):c.hide(g)})},uptick:function(){var a=(new Date-new Date(2004,12,20))/365.25/24/3600/1E3;$("span#uptime-years").text(a.toFixed(8));a=a.toString(16);$("span#uptime-years-hex").text(a.slice(0,7+a.indexOf(".")+1))},poke_update:function(a,f){$("#poke_r").text(a.pokes);$("#poke_t").text(a.ticks);$("#poke_c").text((100*a.pokes/a.ticks).toFixed(4)+"%");$("#poke_dr").text("(+"+(a.pokes-a.pokes_)+")");$("#poke_dt").text("(+"+(a.ticks-a.ticks_)+")");var b=1E4*(a.pokes/a.ticks-a.pokes_/a.ticks_);0>b?($("#poke_dc").html("(-"+(-b).toFixed(4)+"&#8241;)"),$("#poke_dc").attr("class","poke_dn")):($("#poke_dc").html("(+"+b.toFixed(4)+"&#8241;)"),$("#poke_dc").attr("class","poke_up"));a.l?($("#poke_lt").text((new Date(1E3*a.l[0])).toString()),$("#poke_lt").attr("title",(new Date(1E3*a.l[0])).toISOString()),$("#poke_lt").timeago(),$("#poke_lu").text(a.l[2]),$("#poke_lu").attr("href","https://www.facebook.com/"+a.l[1])):($("#poke_lt").text("unknown"),$("#poke_lu").text("someone"),$("#poke_lu").removeAttr("href"));console.log(a)}};$(document).ready(function(){vsite.browse(location.hash.slice(1),!0);$("span#now").text((new Date).getFullYear());$("span#build-time").timeago();setInterval(vsite.uptick,105);vsite.uptick();$("span#poke_info").text("[getting data]");var a=(new Simperium("brake-foods-bc7",{token:"ce4832ce12e24ee6860886d9b4567b12"})).bucket("poke");a.on("notify",function(a,b){"p"==a?vsite.poke_update(b):(console.log(a+" was updated to"),console.log(b))});a.start()});$(window).bind("hashchange",function(a){vsite.browse(location.hash.slice(1))});