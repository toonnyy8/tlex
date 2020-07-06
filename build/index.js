parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"kHl8":[function(require,module,exports) {
"use strict";var e=this&&this.__assign||function(){return(e=Object.assign||function(e){for(var t,r=1,s=arguments.length;r<s;r++)for(var n in t=arguments[r])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}).apply(this,arguments)},t=this&&this.__spreadArrays||function(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var s=Array(e),n=0;for(t=0;t<r;t++)for(var o=arguments[t],l=0,f=o.length;l<f;l++,n++)s[n]=o[l];return s};Object.defineProperty(exports,"__esModule",{value:!0}),exports.kleene=exports.or=exports.and=exports.chars=exports.char=void 0,exports.char=function(e){return[{action:e.source,offsets:[1]},{action:null,offsets:[]}]},exports.chars=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return e.map(function(e){return exports.char(e)})},exports.and=function(){for(var r=[],s=0;s<arguments.length;s++)r[s]=arguments[s];return r.length>1?t(r[0].slice(0,-1),[e(e({},r[0].slice(-1)[0]),{offsets:[1]})],exports.and.apply(void 0,r.slice(1))):t(r[0])},exports.or=function(){for(var r=[],s=0;s<arguments.length;s++)r[s]=arguments[s];if(r.length>1){var n=exports.or.apply(void 0,r.slice(1));return t([{action:null,offsets:[1,r[0].length+1]}],r[0].slice(0,-1),[e(e({},r[0].slice(-1)[0]),{offsets:[n.length+1]})],n.slice(0,-1),[e(e({},n.slice(-1)[0]),{offsets:[1]}),{action:null,offsets:[]}])}return t(r[0].slice(0,-1),[e(e({},r[0].slice(-1)[0]),{offsets:[]})])},exports.kleene=function(r){return t([{action:null,offsets:[1,r.length+1]}],r.slice(0,-1),[e(e({},r.slice(-1)[0]),{offsets:[1-r.length,1]}),{action:null,offsets:[]}])};
},{}],"xczE":[function(require,module,exports) {
"use strict";var n=this&&this.__assign||function(){return(n=Object.assign||function(n){for(var t,e=1,r=arguments.length;e<r;e++)for(var o in t=arguments[e])Object.prototype.hasOwnProperty.call(t,o)&&(n[o]=t[o]);return n}).apply(this,arguments)},t=this&&this.__spreadArrays||function(){for(var n=0,t=0,e=arguments.length;t<e;t++)n+=arguments[t].length;var r=Array(n),o=0;for(t=0;t<e;t++)for(var i=arguments[t],l=0,s=i.length;l<s;l++,o++)r[o]=i[l];return r};Object.defineProperty(exports,"__esModule",{value:!0}),exports.toDFA=exports.unfold=exports.InterClosure=void 0,exports.InterClosure=function(n,e){void 0===e&&(e=0);var r=function n(e,r){return void 0===r&&(r=0),null===e[r].action?e[r].offsets.map(function(t){return n(e,r+t)}).reduce(function(n,e){return{elems:t(n.elems,e.elems),links:t(n.links,e.links)}},{elems:[r],links:[]}):{elems:[r],links:[{action:e[r].action,toElems:[r+e[r].offsets[0]]}]}}(n,e);return r={elems:t(r.elems).sort(function(n,t){return n-t}),links:i(r.links)}};var e=function(n,t,e){return n.length===t.length&&void 0===n.find(function(n,r){return!e(n,t[r])})},r=function(n,e,r){return void 0===n.find(function(n){return r(n,e)})?t(n,[e]):t(n)},o=function(n,t,e){return t.reduce(function(n,t){return r(n,t,e)},n)},i=function(e){return t(e).sort(function(n,t){return n.action>t.action?1:n.action===t.action?0:-1}).reduce(function(e,r){if(0!=e.length){var i=e[e.length-1];return i.action===r.action?t(e.slice(0,-1),[n(n({},i),{toElems:o(i.toElems,r.toElems,function(n,t){return n===t})})]):t(e,[r])}return[r]},[])},l=function(n){return n.reduce(function(n,t){return{elems:o(n.elems,t.elems,function(n,t){return n===t}).sort(function(n,t){return n-t}),links:i(o(n.links,t.links,function(n,t){return n.action===t.action&&e(n.toElems,t.toElems,function(n,t){return n===t})}))}},{elems:[],links:[]})};exports.unfold=function(r){for(var o=[],i=[exports.InterClosure(r)];0!==i.length;){var s=i[0].links.reduce(function(o,i){var s=o.all,u=o.now,c=i.toElems.map(function(n){return exports.InterClosure(r,n)}),f=l(c),a=s.findIndex(function(n){return e(f.elems,n.elems,function(n,t){return n===t})});return-1===a?(u=n(n({},u),{links:t(u.links,[{action:i.action,toClosure:s.length}])}),{all:t(s,[f]),now:u}):{all:s,now:u=n(n({},u),{links:t(u.links,[{action:i.action,toClosure:a}])})}},{all:t(o,i),now:{elems:i[0].elems,links:[]}}),u=s.all,c=s.now;i=u.slice(o.length+1),o=t(o,[c])}return o},exports.toDFA=function(n){return exports.unfold(n).map(function(t){return t.elems[t.elems.length-1]===n.length-1?{exit:!0,links:t.links.map(function(n){return{action:n.action,next:n.toClosure}})}:{exit:!1,links:t.links.map(function(n){return{action:n.action,next:n.toClosure}})}})};
},{}],"KaVg":[function(require,module,exports) {
"use strict";var e=this&&this.__assign||function(){return(e=Object.assign||function(e){for(var n,t=1,r=arguments.length;t<r;t++)for(var i in n=arguments[t])Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i]);return e}).apply(this,arguments)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.Driver=exports.rule=void 0;var n=require("./dfa");exports.rule=function(e,t){return{token:e,dfa:n.toDFA(t)}},exports.Driver=function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];var r,i,u=new Array(n.length).fill(0),a=new Array(n.length).fill({value:"",temp:""}),o=n.map(function(t){return e(e({},n),{dfa:t.dfa.map(function(n){return e(e({},n),{links:n.links.map(function(n){return e(e({},n),{action:new RegExp(n.action)})})})})})});return{reset:function(){r="",0,0},addCode:function(e){return r+=e},genToken:function(){switch("\n"===r[0]&&(1,0),i){case-1:0!==r.length&&(u=o.map(function(e,n){if(-1!==u[n]){a[n]={value:a[n].value,temp:a[n].temp+r[0]},e.dfa[u[n]].exit&&(a[n]={value:a[n].value+a[n].temp,temp:""});var t=e.dfa[u[n]].links.find(function(e){return e.action.test(r[0])});return void 0!==t?t.next:-1}return-1}));break;case 0:r.length}return i},getToken:function(){return e({},null)},dropToken:function(){switch(i){case 0:case 1:i=0}return i}}};
},{"./dfa":"xczE"}],"QCba":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./nfa");Object.defineProperty(exports,"char",{enumerable:!0,get:function(){return e.char}}),Object.defineProperty(exports,"chars",{enumerable:!0,get:function(){return e.chars}}),Object.defineProperty(exports,"and",{enumerable:!0,get:function(){return e.and}}),Object.defineProperty(exports,"or",{enumerable:!0,get:function(){return e.or}}),Object.defineProperty(exports,"kleene",{enumerable:!0,get:function(){return e.kleene}});var r=require("./driver");Object.defineProperty(exports,"rule",{enumerable:!0,get:function(){return r.rule}}),Object.defineProperty(exports,"Driver",{enumerable:!0,get:function(){return r.Driver}});
},{"./nfa":"kHl8","./driver":"KaVg"}]},{},["QCba"], null)
//# sourceMappingURL=index.js.map