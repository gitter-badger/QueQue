// Knockout JavaScript library v1.2.0pre
// (c) 2010 Steven Sanderson - http://knockoutjs.com/
// License: Ms-Pl (http://www.opensource.org/licenses/ms-pl.html)

(function(window,undefined){
function c(d){throw d;}var n=void 0,o=null,p=window.ko={};p.b=function(d,b){for(var a=d.split("."),e=window,f=0;f<a.length-1;f++)e=e[a[f]];e[a[a.length-1]]=b};p.i=function(d,b,a){d[b]=a};
p.a=new function(){var d=/^(\s|\u00A0)+|(\s|\u00A0)+$/g;return{ba:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],h:function(b,a){for(var e=0,f=b.length;e<f;e++)a(b[e])},g:function(b,a){if(typeof b.indexOf=="function")return b.indexOf(a);for(var e=0,f=b.length;e<f;e++)if(b[e]==a)return e;return-1},xa:function(b,a,e){for(var f=0,g=b.length;f<g;f++)if(a.call(e,b[f]))return b[f];return o},M:function(b,a){var e=p.a.g(b,a);e>=0&&b.splice(e,1)},$:function(b){b=b||[];for(var a=[],e=0,f=b.length;e<
f;e++)p.a.g(a,b[e])<0&&a.push(b[e]);return a},K:function(b,a){b=b||[];for(var e=[],f=0,g=b.length;f<g;f++)e.push(a(b[f]));return e},J:function(b,a){b=b||[];for(var e=[],f=0,g=b.length;f<g;f++)a(b[f])&&e.push(b[f]);return e},L:function(b,a){for(var e=0,f=a.length;e<f;e++)b.push(a[e])},aa:function(b){for(;b.firstChild;)p.removeNode(b.firstChild)},Wa:function(b,a){p.a.aa(b);a&&p.a.h(a,function(a){b.appendChild(a)})},ka:function(b,a){var e=b.nodeType?[b]:b;if(e.length>0){for(var f=e[0],g=f.parentNode,
d=0,i=a.length;d<i;d++)g.insertBefore(a[d],f);d=0;for(i=e.length;d<i;d++)p.removeNode(e[d])}},ma:function(b,a){navigator.userAgent.indexOf("MSIE 6")>=0?b.setAttribute("selected",a):b.selected=a},ca:function(b,a){if(!b||b.nodeType!=1)return[];var e=[];b.getAttribute(a)!==o&&e.push(b);for(var f=b.getElementsByTagName("*"),d=0,h=f.length;d<h;d++)f[d].getAttribute(a)!==o&&e.push(f[d]);return e},m:function(b){return(b||"").replace(d,"")},Za:function(b,a){for(var e=[],f=(b||"").split(a),d=0,h=f.length;d<
h;d++){var i=p.a.m(f[d]);i!==""&&e.push(i)}return e},Xa:function(b,a){b=b||"";if(a.length>b.length)return!1;return b.substring(0,a.length)===a},Ga:function(b,a){if(a===n)return(new Function("return "+b))();with(a)return eval("("+b+")")},Ea:function(b,a){if(a.compareDocumentPosition)return(a.compareDocumentPosition(b)&16)==16;for(;b!=o;){if(b==a)return!0;b=b.parentNode}return!1},O:function(b){return p.a.Ea(b,document)},q:function(b,a,e){typeof jQuery!="undefined"?jQuery(b).bind(a,e):typeof b.addEventListener==
"function"?b.addEventListener(a,e,!1):typeof b.attachEvent!="undefined"?b.attachEvent("on"+a,function(a){e.call(b,a)}):c(Error("Browser doesn't support addEventListener or attachEvent"))},qa:function(b,a){(!b||!b.nodeType)&&c(Error("element must be a DOM node when calling triggerEvent"));if(typeof document.createEvent=="function")if(typeof b.dispatchEvent=="function"){var e=document.createEvent(a=="click"?"MouseEvents":"HTMLEvents");e.initEvent(a,!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,b);b.dispatchEvent(e)}else c(Error("The supplied element doesn't support dispatchEvent"));
else if(typeof b.fireEvent!="undefined"){if(a=="click"&&b.tagName=="INPUT"&&(b.type.toLowerCase()=="checkbox"||b.type.toLowerCase()=="radio"))b.checked=b.checked!==!0;b.fireEvent("on"+a)}else c(Error("Browser doesn't support triggering events"))},d:function(b){return p.B(b)?b():b},Da:function(b,a){return p.a.g((b.className||"").split(/\s+/),a)>=0},pa:function(b,a,e){var f=p.a.Da(b,a);if(e&&!f)b.className=(b.className||"")+" "+a;else if(f&&!e){e=(b.className||"").split(/\s+/);f="";for(var d=0;d<e.length;d++)e[d]!=
a&&(f+=e[d]+" ");b.className=p.a.m(f)}},Ta:function(b,a){b=p.a.d(b);a=p.a.d(a);for(var e=[],f=b;f<=a;f++)e.push(f);return e},ga:function(b){for(var a=[],e=b.length-1;e>=0;e--)a.push(b[e]);return a},Q:/MSIE 6/i.test(navigator.userAgent),Ma:/MSIE 7/i.test(navigator.userAgent),da:function(b,a){for(var e=p.a.ga(b.getElementsByTagName("INPUT")).concat(p.a.ga(b.getElementsByTagName("TEXTAREA"))),f=typeof a=="string"?function(e){return e.name===a}:function(e){return a.test(e.name)},d=[],h=e.length-1;h>=
0;h--)f(e[h])&&d.push(e[h]);return d},D:function(b){if(typeof b=="string"&&(b=p.a.m(b))){if(window.JSON&&window.JSON.parse)return window.JSON.parse(b);return(new Function("return "+b))()}return o},V:function(b){(typeof JSON=="undefined"||typeof JSON.stringify=="undefined")&&c(Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js"));return JSON.stringify(p.a.d(b))},
Sa:function(b,a,e){e=e||{};var f=e.params||{},d=e.includeFields||this.ba,h=b;if(typeof b=="object"&&b.tagName=="FORM"){h=b.action;for(var i=d.length-1;i>=0;i--)for(var j=p.a.da(b,d[i]),k=j.length-1;k>=0;k--)f[j[k].name]=j[k].value}a=p.a.d(a);var l=document.createElement("FORM");l.style.display="none";l.action=h;l.method="post";for(var q in a)b=document.createElement("INPUT"),b.name=q,b.value=p.a.V(p.a.d(a[q])),l.appendChild(b);for(q in f)b=document.createElement("INPUT"),b.name=q,b.value=f[q],l.appendChild(b);
document.body.appendChild(l);e.submitter?e.submitter(l):l.submit();setTimeout(function(){l.parentNode.removeChild(l)},0)}}};p.b("ko.utils",p.a);p.b("ko.utils.arrayForEach",p.a.h);p.b("ko.utils.arrayFirst",p.a.xa);p.b("ko.utils.arrayFilter",p.a.J);p.b("ko.utils.arrayGetDistinctValues",p.a.$);p.b("ko.utils.arrayIndexOf",p.a.g);p.b("ko.utils.arrayMap",p.a.K);p.b("ko.utils.arrayPushAll",p.a.L);p.b("ko.utils.arrayRemoveItem",p.a.M);p.b("ko.utils.fieldsIncludedWithJsonPost",p.a.ba);
p.b("ko.utils.getElementsHavingAttribute",p.a.ca);p.b("ko.utils.getFormFields",p.a.da);p.b("ko.utils.postJson",p.a.Sa);p.b("ko.utils.parseJson",p.a.D);p.b("ko.utils.registerEventHandler",p.a.q);p.b("ko.utils.stringifyJson",p.a.V);p.b("ko.utils.range",p.a.Ta);p.b("ko.utils.toggleDomNodeCssClass",p.a.pa);p.b("ko.utils.triggerEvent",p.a.qa);p.b("ko.utils.unwrapObservable",p.a.d);
Function.prototype.bind||(Function.prototype.bind=function(d){var b=this,a=Array.prototype.slice.call(arguments);d=a.shift();return function(){return b.apply(d,a.concat(Array.prototype.slice.call(arguments)))}});
p.a.e=new function(){var d=0,b="__ko__"+(new Date).getTime(),a={};return{get:function(a,b){var d=p.a.e.getAll(a,!1);return d===n?n:d[b]},set:function(a,b,d){d===n&&p.a.e.getAll(a,!1)===n||(p.a.e.getAll(a,!0)[b]=d)},getAll:function(e,f){var g=e[b];if(!g){if(!f)return;g=e[b]="ko"+d++;a[g]={}}return a[g]},clear:function(e){var f=e[b];f&&(delete a[f],e[b]=o)}}};
p.a.p=new function(){function d(e,b){var d=p.a.e.get(e,a);d===n&&b&&(d=[],p.a.e.set(e,a,d));return d}function b(a){var b=d(a,!1);if(b){b=b.slice(0);for(var g=0;g<b.length;g++)b[g](a)}p.a.e.clear(a);typeof jQuery=="function"&&typeof jQuery.cleanData=="function"&&jQuery.cleanData([a])}var a="__ko_domNodeDisposal__"+(new Date).getTime();return{Z:function(a,b){typeof b!="function"&&c(Error("Callback must be a function"));d(a,!0).push(b)},ja:function(b,f){var g=d(b,!1);g&&(p.a.M(g,f),g.length==0&&p.a.e.set(b,
a,n))},u:function(a){if(!(a.nodeType!=1&&a.nodeType!=9)){b(a);a=a.getElementsByTagName("*");for(var d=0,g=a.length;d<g;d++)b(a[d])}},removeNode:function(a){p.u(a);a.parentNode&&a.parentNode.removeChild(a)}}};p.u=p.a.p.u;p.removeNode=p.a.p.removeNode;p.b("ko.cleanNode",p.u);p.b("ko.removeNode",p.removeNode);p.b("ko.utils.domNodeDisposal",p.a.p);p.b("ko.utils.domNodeDisposal.addDisposeCallback",p.a.p.Z);p.b("ko.utils.domNodeDisposal.removeDisposeCallback",p.a.p.ja);
p.k=function(){function d(){return((1+Math.random())*4294967296|0).toString(16).substring(1)}function b(a,d){if(a)if(a.nodeType==8){var g=p.k.ha(a.nodeValue);g!=o&&d.push({Ca:a,Pa:g})}else if(a.nodeType==1){g=0;for(var h=a.childNodes,i=h.length;g<i;g++)b(h[g],d)}}var a={};return{S:function(b){typeof b!="function"&&c(Error("You can only pass a function to ko.memoization.memoize()"));var f=d()+d();a[f]=b;return"<\!--[ko_memo:"+f+"]--\>"},ra:function(b,d){var g=a[b];g===n&&c(Error("Couldn't find any memo with ID "+
b+". Perhaps it's already been unmemoized."));try{return g.apply(o,d||[]),!0}finally{delete a[b]}},sa:function(a,d){var g=[];b(a,g);for(var h=0,i=g.length;h<i;h++){var j=g[h].Ca,k=[j];d&&p.a.L(k,d);p.k.ra(g[h].Pa,k);j.nodeValue="";j.parentNode&&j.parentNode.removeChild(j)}},ha:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:o}}}();p.b("ko.memoization",p.k);p.b("ko.memoization.memoize",p.k.S);p.b("ko.memoization.unmemoize",p.k.ra);p.b("ko.memoization.parseMemoText",p.k.ha);
p.b("ko.memoization.unmemoizeDomNodeAndDescendants",p.k.sa);p.Ya=function(d,b){this.za=d;this.n=function(){this.La=!0;b()}.bind(this);p.i(this,"dispose",this.n)};p.W=function(){var d=[];this.X=function(b,a){var e=a?b.bind(a):b,f=new p.Ya(e,function(){p.a.M(d,f)});d.push(f);return f};this.w=function(b){p.a.h(d.slice(0),function(a){a&&a.La!==!0&&a.za(b)})};this.Ja=function(){return d.length};p.i(this,"subscribe",this.X);p.i(this,"notifySubscribers",this.w);p.i(this,"getSubscriptionsCount",this.Ja)};
p.fa=function(d){return typeof d.X=="function"&&typeof d.w=="function"};p.b("ko.subscribable",p.W);p.b("ko.isSubscribable",p.fa);p.z=function(){var d=[];return{ya:function(){d.push([])},end:function(){return d.pop()},ia:function(b){p.fa(b)||c("Only subscribable things can act as dependencies");d.length>0&&d[d.length-1].push(b)}}}();
p.t=function(d){function b(){return arguments.length>0?(a=arguments[0],b.w(a),this):(p.z.ia(b),a)}var a=d;b.o=p.t;b.G=function(){b.w(a)};p.W.call(b);p.i(b,"valueHasMutated",b.G);return b};p.B=function(d){if(d===o||d===n||d.o===n)return!1;if(d.o===p.t)return!0;return p.B(d.o)};p.C=function(d){if(typeof d=="function"&&d.o===p.t)return!0;if(typeof d=="function"&&d.o===p.j&&d.Ka)return!0;return!1};p.b("ko.observable",p.t);p.b("ko.isObservable",p.B);p.b("ko.isWriteableObservable",p.C);
p.Ra=function(d){arguments.length==0&&(d=[]);d!==o&&d!==n&&!("length"in d)&&c(new "The argument passed when initializing an observable array must be an array, or null, or undefined.");var b=new p.t(d);p.a.h(["pop","push","reverse","shift","sort","splice","unshift"],function(a){b[a]=function(){var e=b();e=e[a].apply(e,arguments);b.G();return e}});p.a.h(["slice"],function(a){b[a]=function(){var e=b();return e[a].apply(e,arguments)}});b.remove=function(a){for(var e=b(),d=[],g=[],h=typeof a=="function"?
a:function(b){return b===a},i=0,j=e.length;i<j;i++){var k=e[i];h(k)?g.push(k):d.push(k)}b(d);return g};b.Ua=function(a){if(a===n){var e=b();b([]);return e}if(!a)return[];return b.remove(function(b){return p.a.g(a,b)>=0})};b.N=function(a){for(var e=b(),d=typeof a=="function"?a:function(b){return b===a},g=e.length-1;g>=0;g--)d(e[g])&&(e[g]._destroy=!0);b.G()};b.Ba=function(a){if(a===n)return b.N(function(){return!0});if(!a)return[];return b.N(function(b){return p.a.g(a,b)>=0})};b.indexOf=function(a){var e=
b();return p.a.g(e,a)};b.replace=function(a,e){var d=b.indexOf(a);d>=0&&(b()[d]=e,b.G())};p.i(b,"remove",b.remove);p.i(b,"removeAll",b.Ua);p.i(b,"destroy",b.N);p.i(b,"destroyAll",b.Ba);p.i(b,"indexOf",b.indexOf);return b};p.b("ko.observableArray",p.Ra);
p.j=function(d,b,a){function e(){p.a.h(m,function(a){a.n()});m=[]}function f(a){e();p.a.h(a,function(a){m.push(a.X(g))})}function g(){if(j&&typeof a.disposeWhen=="function"&&a.disposeWhen())h.n();else{try{p.z.ya(),i=a.owner?a.read.call(a.owner):a.read()}finally{var b=p.a.$(p.z.end());f(b)}h.w(i);j=!0}}function h(){if(arguments.length>0)if(typeof a.write==="function"){var b=arguments[0];a.owner?a.write.call(a.owner,b):a.write(b)}else c("Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
else return j||g(),p.z.ia(h),i}var i,j=!1;d&&typeof d=="object"?a=d:(a=a||{},a.read=d||a.read,a.owner=b||a.owner);typeof a.read!="function"&&c("Pass a function that returns the value of the dependentObservable");var k=typeof a.disposeWhenNodeIsRemoved=="object"?a.disposeWhenNodeIsRemoved:o,l=o;if(k){l=function(){h.n()};p.a.p.Z(k,l);var q=a.disposeWhen;a.disposeWhen=function(){return!p.a.O(k)||typeof q=="function"&&q()}}var m=[];h.o=p.j;h.Ia=function(){return m.length};h.Ka=typeof a.write==="function";
h.n=function(){k&&p.a.p.ja(k,l);e()};p.W.call(h);a.deferEvaluation!==!0&&g();p.i(h,"dispose",h.n);p.i(h,"getDependenciesCount",h.Ia);return h};p.j.o=p.t;p.b("ko.dependentObservable",p.j);
(function(){function d(e,f,g){g=g||new a;e=f(e);if(!(typeof e=="object"&&e!==o&&e!==n))return e;var h=e instanceof Array?[]:{};g.save(e,h);b(e,function(a){var b=f(e[a]);switch(typeof b){case "boolean":case "number":case "string":case "function":h[a]=b;break;case "object":case "undefined":var k=g.get(b);h[a]=k!==n?k:d(b,f,g)}});return h}function b(a,b){if(a instanceof Array)for(var d=0;d<a.length;d++)b(d);else for(d in a)b(d)}function a(){var a=[],b=[];this.save=function(d,h){var i=p.a.g(a,d);i>=0?
b[i]=h:(a.push(d),b.push(h))};this.get=function(d){d=p.a.g(a,d);return d>=0?b[d]:n}}p.oa=function(a){arguments.length==0&&c(Error("When calling ko.toJS, pass the object you want to convert."));return d(a,function(a){for(var b=0;p.B(a)&&b<10;b++)a=a();return a})};p.toJSON=function(a){a=p.oa(a);return p.a.V(a)}})();p.b("ko.toJS",p.oa);p.b("ko.toJSON",p.toJSON);
p.f={l:function(d){if(d.tagName=="OPTION"){if(d.__ko__hasDomDataOptionValue__===!0)return p.a.e.get(d,p.c.options.T);return d.getAttribute("value")}else return d.tagName=="SELECT"?d.selectedIndex>=0?p.f.l(d.options[d.selectedIndex]):n:d.value},H:function(d,b){if(d.tagName=="OPTION")switch(typeof b){case "string":case "number":p.a.e.set(d,p.c.options.T,n);"__ko__hasDomDataOptionValue__"in d&&delete d.__ko__hasDomDataOptionValue__;d.value=b;break;default:p.a.e.set(d,p.c.options.T,b),d.__ko__hasDomDataOptionValue__=
!0,d.value=""}else if(d.tagName=="SELECT")for(var a=d.options.length-1;a>=0;a--){if(p.f.l(d.options[a])==b){d.selectedIndex=a;break}}else{if(b===o||b===n)b="";d.value=b}}};p.b("ko.selectExtensions",p.f);p.b("ko.selectExtensions.readValue",p.f.l);p.b("ko.selectExtensions.writeValue",p.f.H);
p.s=function(){function d(a,d){return a.replace(b,function(a,b){return d[b]})}var b=/\[ko_token_(\d+)\]/g,a=/^[\_$a-z][\_$a-z0-9]*(\[.*?\])*(\.[\_$a-z][\_$a-z0-9]*(\[.*?\])*)*$/i,e=["true","false"];return{D:function(a){a=p.a.m(a);if(a.length<3)return{};for(var b=[],e=o,i,j=a.charAt(0)=="{"?1:0;j<a.length;j++){var k=a.charAt(j);if(e===o)switch(k){case '"':case "'":case "/":e=j;i=k;break;case "{":e=j;i="}";break;case "[":e=j,i="]"}else if(k==i){k=a.substring(e,j+1);b.push(k);var l="[ko_token_"+(b.length-
1)+"]";a=a.substring(0,e)+l+a.substring(j+1);j-=k.length-l.length;e=o}}e={};a=a.split(",");i=0;for(j=a.length;i<j;i++){l=a[i];var q=l.indexOf(":");q>0&&q<l.length-1&&(k=p.a.m(l.substring(0,q)),l=p.a.m(l.substring(q+1)),k.charAt(0)=="{"&&(k=k.substring(1)),l.charAt(l.length-1)=="}"&&(l=l.substring(0,l.length-1)),k=p.a.m(d(k,b)),l=p.a.m(d(l,b)),e[k]=l)}return e},P:function(b){var d=p.s.D(b),h=[],i;for(i in d){var j=d[i],k;k=j;k=p.a.g(e,p.a.m(k).toLowerCase())>=0?!1:k.match(a)!==o;k&&(h.length>0&&h.push(", "),
h.push(i+" : function(__ko_value) { "+j+" = __ko_value; }"))}h.length>0&&(b=b+", '_ko_property_writers' : { "+h.join("")+" } ");return b}}}();p.b("ko.jsonExpressionRewriting",p.s);p.b("ko.jsonExpressionRewriting.parseJson",p.s.D);p.b("ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson",p.s.P);p.c={};
p.I=function(d,b,a,e){function f(a){return function(){return i[a]}}function g(){return i}var h=!0;e=e||"data-bind";var i;new p.j(function(){var j;if(!(j=typeof b=="function"?b():b)){var k=d.getAttribute(e);try{var l=" { "+p.s.P(k)+" } ";j=p.a.Ga(l,a===o?window:a)}catch(q){c(Error("Unable to parse binding attribute.\nMessage: "+q+";\nAttribute value: "+k))}}i=j;if(h)for(var m in i)p.c[m]&&typeof p.c[m].init=="function"&&(0,p.c[m].init)(d,f(m),g,a);for(m in i)p.c[m]&&typeof p.c[m].update=="function"&&
(0,p.c[m].update)(d,f(m),g,a)},o,{disposeWhenNodeIsRemoved:d});h=!1};p.ua=function(d,b){b&&b.nodeType==n&&c(Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node (note: this is a breaking change since KO version 1.05)"));b=b||window.document.body;var a=p.a.ca(b,"data-bind");p.a.h(a,function(a){p.I(a,o,d)})};p.Ha=function(){return"data-bind"};p.b("ko.bindingHandlers",p.c);p.b("ko.applyBindings",p.ua);p.b("ko.applyBindingsToNode",p.I);
p.b("ko.getBindingAttribute",p.Ha);p.a.h(["click"],function(d){p.c[d]={init:function(b,a,e,f){return p.c.event.init.call(this,b,function(){var b={};b[d]=a();return b},e,f)}}});p.c.event={init:function(d,b,a,e){var f=b()||{},g;for(g in f)(function(){var f=g;typeof f=="string"&&p.a.q(d,f,function(d){var g,k=b()[f],l=a();try{g=k.apply(e,arguments)}finally{if(g!==!0)d.preventDefault?d.preventDefault():d.returnValue=!1}if(l[f+"Bubble"]===!1)d.cancelBubble=!0,d.stopPropagation&&d.stopPropagation()})})()}};
p.c.submit={init:function(d,b,a,e){typeof b()!="function"&&c(Error("The value for a submit binding must be a function to invoke on submit"));p.a.q(d,"submit",function(a){var g,h=b();try{g=h.call(e,d)}finally{if(g!==!0)a.preventDefault?a.preventDefault():a.returnValue=!1}})}};p.c.visible={update:function(d,b){var a=p.a.d(b()),e=d.style.display!="none";if(a&&!e)d.style.display="";else if(!a&&e)d.style.display="none"}};
p.c.enable={update:function(d,b){var a=p.a.d(b());if(a&&d.disabled)d.removeAttribute("disabled");else if(!a&&!d.disabled)d.disabled=!0}};p.c.disable={update:function(d,b){p.c.enable.update(d,function(){return!p.a.d(b())})}};
p.c.value={init:function(d,b,a){var e=a().valueUpdate||"change",f=!1;p.a.Xa(e,"after")&&(f=!0,e=e.substring(5));var g=f?function(a){setTimeout(a,0)}:function(a){a()};p.a.q(d,e,function(){g(function(){var e=b(),f=p.f.l(d);p.C(e)?e(f):(e=a(),e._ko_property_writers&&e._ko_property_writers.value&&e._ko_property_writers.value(f))})})},update:function(d,b){var a=p.a.d(b()),e=p.f.l(d),f=a!=e;a===0&&e!==0&&e!=="0"&&(f=!0);f&&(e=function(){p.f.H(d,a)},e(),d.tagName=="SELECT"&&setTimeout(e,0));d.tagName=="SELECT"&&
(e=p.f.l(d),e!==a&&p.a.qa(d,"change"))}};
p.c.options={update:function(d,b,a){d.tagName!="SELECT"&&c(Error("options binding applies only to SELECT elements"));var e=p.a.K(p.a.J(d.childNodes,function(a){return a.tagName&&a.tagName=="OPTION"&&a.selected}),function(a){return p.f.l(a)||a.innerText||a.textContent}),f=d.scrollTop,g=p.a.d(b());p.a.aa(d);if(g){var h=a();typeof g.length!="number"&&(g=[g]);if(h.optionsCaption){var i=document.createElement("OPTION");i.innerHTML=h.optionsCaption;p.f.H(i,n);d.appendChild(i)}a=0;for(b=g.length;a<b;a++){i=
document.createElement("OPTION");var j=typeof h.optionsValue=="string"?g[a][h.optionsValue]:g[a],k=h.optionsText;optionText=typeof k=="function"?k(g[a]):typeof k=="string"?g[a][k]:j;j=p.a.d(j);optionText=p.a.d(optionText);p.f.H(i,j);i.innerHTML=optionText.toString();d.appendChild(i)}g=d.getElementsByTagName("OPTION");a=h=0;for(b=g.length;a<b;a++)p.a.g(e,p.f.l(g[a]))>=0&&(p.a.ma(g[a],!0),h++);if(f)d.scrollTop=f}}};p.c.options.T="__ko.bindingHandlers.options.optionValueDomData__";
p.c.selectedOptions={ea:function(d){var b=[];d=d.childNodes;for(var a=0,e=d.length;a<e;a++){var f=d[a];f.tagName=="OPTION"&&f.selected&&b.push(p.f.l(f))}return b},init:function(d,b,a){p.a.q(d,"change",function(){var d=b();p.C(d)?d(p.c.selectedOptions.ea(this)):(d=a(),d._ko_property_writers&&d._ko_property_writers.value&&d._ko_property_writers.value(p.c.selectedOptions.ea(this)))})},update:function(d,b){d.tagName!="SELECT"&&c(Error("values binding applies only to SELECT elements"));var a=p.a.d(b());
if(a&&typeof a.length=="number")for(var e=d.childNodes,f=0,g=e.length;f<g;f++){var h=e[f];h.tagName=="OPTION"&&p.a.ma(h,p.a.g(a,p.f.l(h))>=0)}}};p.c.text={update:function(d,b){var a=p.a.d(b());if(a===o||a===n)a="";typeof d.innerText=="string"?d.innerText=a:d.textContent=a}};p.c.html={update:function(d,b){var a=p.a.d(b());if(a===o||a===n)a="";d.innerHTML=a}};p.c.css={update:function(d,b){var a=p.a.d(b()||{}),e;for(e in a)if(typeof e=="string"){var f=p.a.d(a[e]);p.a.pa(d,e,f)}}};
p.c.style={update:function(d,b){var a=p.a.d(b()||{}),e;for(e in a)if(typeof e=="string"){var f=p.a.d(a[e]);d.style[e]=f||""}}};p.c.uniqueName={init:function(d,b){if(b())d.name="ko_unique_"+ ++p.c.uniqueName.Aa,p.a.Q&&d.mergeAttributes(document.createElement("<input name='"+d.name+"'/>"),!1)}};p.c.uniqueName.Aa=0;
p.c.checked={init:function(d,b,a){function e(){var e;if(d.type=="checkbox")e=d.checked;else if(d.type=="radio"&&d.checked)e=d.value;else return;var g=b();d.type=="checkbox"&&p.a.d(g)instanceof Array?(e=p.a.g(p.a.d(g),d.value),d.checked&&e<0?g.push(d.value):!d.checked&&e>=0&&g.splice(e,1)):p.C(g)?g()!==e&&g(e):(g=a(),g._ko_property_writers&&g._ko_property_writers.checked&&g._ko_property_writers.checked(e))}p.a.q(d,"change",e);p.a.q(d,"click",e);d.type=="radio"&&!d.name&&p.c.uniqueName.init(d,function(){return!0})},
update:function(d,b){var a=p.a.d(b());if(d.type=="checkbox")d.checked=a instanceof Array?p.a.g(a,d.value)>=0:a,a&&p.a.Q&&d.mergeAttributes(document.createElement("<input type='checkbox' checked='checked' />"),!1);else if(d.type=="radio")d.checked=d.value==a,d.value==a&&(p.a.Q||p.a.Ma)&&d.mergeAttributes(document.createElement("<input type='radio' checked='checked' />"),!1)}};
p.c.attr={update:function(d,b){var a=p.a.d(b())||{},e;for(e in a)if(typeof e=="string"){var f=p.a.d(a[e]);f===!1||f===o||f===n?d.removeAttribute(e):d.setAttribute(e,f.toString())}}};
p.Y=function(){this.renderTemplate=function(){c("Override renderTemplate in your ko.templateEngine subclass")};this.isTemplateRewritten=function(){c("Override isTemplateRewritten in your ko.templateEngine subclass")};this.rewriteTemplate=function(){c("Override rewriteTemplate in your ko.templateEngine subclass")};this.createJavaScriptEvaluatorBlock=function(){c("Override createJavaScriptEvaluatorBlock in your ko.templateEngine subclass")}};p.b("ko.templateEngine",p.Y);
p.F=function(){var d=/(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi;return{Fa:function(b,a){a.isTemplateRewritten(b)||a.rewriteTemplate(b,function(b){return p.F.Qa(b,a)})},Qa:function(b,a){return b.replace(d,function(b,d,g,h,i,j,k){b=p.s.P(k);return a.createJavaScriptEvaluatorBlock("ko.templateRewriting.applyMemoizedBindingsToNextSibling(function() {                     return (function() { return { "+b+" } })()                 })")+d})},va:function(b){return p.k.S(function(a,
d){a.nextSibling&&p.I(a.nextSibling,b,d)})}}}();p.b("ko.templateRewriting",p.F);p.b("ko.templateRewriting.applyMemoizedBindingsToNextSibling",p.F.va);
(function(){function d(a,d,f,g,h){var i=p.a.d(g);h=h||{};var j=h.templateEngine||b;p.F.Fa(f,j);f=j.renderTemplate(f,i,h);(typeof f.length!="number"||f.length>0&&typeof f[0].nodeType!="number")&&c("Template engine must return an array of DOM nodes");f&&p.a.h(f,function(a){p.k.sa(a,[g])});switch(d){case "replaceChildren":p.a.Wa(a,f);break;case "replaceNode":p.a.ka(a,f);break;case "ignoreTargetNode":break;default:c(Error("Unknown renderMode: "+d))}h.afterRender&&h.afterRender(f,g);return f}var b;p.na=
function(a){a!=n&&!(a instanceof p.Y)&&c("templateEngine must inherit from ko.templateEngine");b=a};p.U=function(a,e,f,g,h){f=f||{};(f.templateEngine||b)==n&&c("Set a template engine before calling renderTemplate");h=h||"replaceChildren";if(g){var i=g.nodeType?g:g.length>0?g[0]:o;return new p.j(function(){var b=typeof a=="function"?a(e):a;b=d(g,h,b,e,f);h=="replaceNode"&&(g=b,i=g.nodeType?g:g.length>0?g[0]:o)},o,{disposeWhen:function(){return!i||!p.a.O(i)},disposeWhenNodeIsRemoved:i&&h=="replaceNode"?
i.parentNode:i})}else return p.k.S(function(b){p.U(a,e,f,b,"replaceNode")})};p.Va=function(a,b,f,g){return new p.j(function(){var h=p.a.d(b)||[];typeof h.length=="undefined"&&(h=[h]);h=p.a.J(h,function(a){return f.includeDestroyed||!a._destroy});p.a.la(g,h,function(b){var e=typeof a=="function"?a(b):a;return d(o,"ignoreTargetNode",e,b,f)},f)},o,{disposeWhenNodeIsRemoved:g})};p.c.template={update:function(a,b,d,g){b=p.a.d(b());d=typeof b=="string"?b:b.name;if(typeof b.foreach!="undefined")g=p.Va(d,
b.foreach||[],{templateOptions:b.templateOptions,afterAdd:b.afterAdd,beforeRemove:b.beforeRemove,includeDestroyed:b.includeDestroyed,afterRender:b.afterRender},a);else{var h=b.data;g=p.U(d,typeof h=="undefined"?g:h,{templateOptions:b.templateOptions,afterRender:b.afterRender},a)}(b=p.a.e.get(a,"__ko__templateSubscriptionDomDataKey__"))&&typeof b.n=="function"&&b.n();p.a.e.set(a,"__ko__templateSubscriptionDomDataKey__",g)}}})();p.b("ko.setTemplateEngine",p.na);p.b("ko.renderTemplate",p.U);
p.a.v=function(d,b,a){if(a===n)return p.a.v(d,b,1)||p.a.v(d,b,10)||p.a.v(d,b,Number.MAX_VALUE);else{d=d||[];b=b||[];for(var e=d,f=b,g=[],h=0;h<=f.length;h++)g[h]=[];h=0;for(var i=Math.min(e.length,a);h<=i;h++)g[0][h]=h;h=1;for(i=Math.min(f.length,a);h<=i;h++)g[h][0]=h;i=e.length;var j,k=f.length;for(h=1;h<=i;h++){var l=Math.min(k,h+a);for(j=Math.max(1,h-a);j<=l;j++)g[j][h]=e[h-1]===f[j-1]?g[j-1][h-1]:Math.min(g[j-1][h]===n?Number.MAX_VALUE:g[j-1][h]+1,g[j][h-1]===n?Number.MAX_VALUE:g[j][h-1]+1)}a=
d.length;e=b.length;f=[];h=g[e][a];if(h===n)g=o;else{for(;a>0||e>0;){i=g[e][a];j=e>0?g[e-1][a]:h+1;k=a>0?g[e][a-1]:h+1;l=e>0&&a>0?g[e-1][a-1]:h+1;if(j===n||j<i-1)j=h+1;if(k===n||k<i-1)k=h+1;l<i-1&&(l=h+1);j<=k&&j<l?(f.push({status:"added",value:b[e-1]}),e--):(k<j&&k<l?f.push({status:"deleted",value:d[a-1]}):(f.push({status:"retained",value:d[a-1]}),e--),a--)}g=f.reverse()}return g}};p.b("ko.utils.compareArrays",p.a.v);
(function(){function d(b,a,d){var f=[];b=p.j(function(){var b=a(d)||[];f.length>0&&p.a.ka(f,b);f.splice(0,f.length);p.a.L(f,b)},o,{disposeWhenNodeIsRemoved:b,disposeWhen:function(){return f.length==0||!p.a.O(f[0])}});return{Oa:f,j:b}}p.a.la=function(b,a,e,f){a=a||[];f=f||{};var g=p.a.e.get(b,"setDomNodeChildrenFromArrayMapping_lastMappingResult")===n,h=p.a.e.get(b,"setDomNodeChildrenFromArrayMapping_lastMappingResult")||[],i=p.a.K(h,function(a){return a.wa}),j=p.a.v(i,a);a=[];var k=0,l=[];i=[];for(var q=
o,m=0,u=j.length;m<u;m++)switch(j[m].status){case "retained":var r=h[k];a.push(r);r.A.length>0&&(q=r.A[r.A.length-1]);k++;break;case "deleted":h[k].j.n();p.a.h(h[k].A,function(a){l.push({element:a,index:m,value:j[m].value});q=a});k++;break;case "added":var s=d(b,e,j[m].value);r=s.Oa;a.push({wa:j[m].value,A:r,j:s.j});s=0;for(var v=r.length;s<v;s++){var t=r[s];i.push({element:t,index:m,value:j[m].value});q==o?b.firstChild?b.insertBefore(t,b.firstChild):b.appendChild(t):q.nextSibling?b.insertBefore(t,
q.nextSibling):b.appendChild(t);q=t}}p.a.h(l,function(a){p.u(a.element)});e=!1;if(!g){if(f.afterAdd)for(m=0;m<i.length;m++)f.afterAdd(i[m].element,i[m].index,i[m].value);if(f.beforeRemove){for(m=0;m<l.length;m++)f.beforeRemove(l[m].element,l[m].index,l[m].value);e=!0}}e||p.a.h(l,function(a){a.element.parentNode&&a.element.parentNode.removeChild(a.element)});p.a.e.set(b,"setDomNodeChildrenFromArrayMapping_lastMappingResult",a)}})();p.b("ko.utils.setDomNodeChildrenFromArrayMapping",p.a.la);
p.R=function(){function d(a){var b=document.getElementById(a);b==o&&c(Error("Cannot find template with ID="+a));return b}this.r=function(){if(typeof jQuery=="undefined"||!jQuery.tmpl)return 0;if(jQuery.tmpl.tag){if(jQuery.tmpl.tag.tmpl&&jQuery.tmpl.tag.tmpl.open&&jQuery.tmpl.tag.tmpl.open.toString().indexOf("__")>=0)return 3;return 2}return 1}();var b=RegExp("__ko_apos__","g");this.renderTemplate=function(a,e,f){f=f||{};this.r==0&&c(Error("jquery.tmpl not detected.\nTo use KO's default template engine, reference jQuery and jquery.tmpl. See Knockout installation documentation for more details."));
if(this.r==1)return a='<script type="text/html">'+d(a).text+"<\/script>",e=jQuery.tmpl(a,e)[0].text.replace(b,"'"),jQuery.clean([e],document);if(!(a in jQuery.template)){var g=d(a).text;jQuery.template(a,g)}e=[e];e=jQuery.tmpl(a,e,f.templateOptions);e.appendTo(document.createElement("div"));jQuery.fragments={};return e};this.isTemplateRewritten=function(a){if(a in jQuery.template)return!0;return d(a).Na===!0};this.rewriteTemplate=function(a,b){var f=d(a),g=b(f.text);this.r==1&&(g=p.a.m(g),g=g.replace(/([\s\S]*?)(\${[\s\S]*?}|{{[\=a-z][\s\S]*?}}|$)/g,
function(a,b,d){return b.replace(/\'/g,"__ko_apos__")+d}));f.text=g;f.Na=!0};this.createJavaScriptEvaluatorBlock=function(a){if(this.r==1)return"{{= "+a+"}}";return"{{ko_code ((function() { return "+a+" })()) }}"};this.ta=function(a,b){document.write("<script type='text/html' id='"+a+"'>"+b+"<\/script>")};p.i(this,"addTemplate",this.ta);this.r>1&&(jQuery.tmpl.tag.ko_code={open:(this.r<3?"_":"__")+".push($1 || '');"})};p.R.prototype=new p.Y;p.na(new p.R);p.b("ko.jqueryTmplTemplateEngine",p.R);
})(window);
