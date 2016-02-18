Motif.Collections.List=function(t){Motif.Utility.extend(this,"Motif.Object"),this.__class.push("Motif.Collections.List"),this.items=[],this.count=0,this.add=function(t){var i=this.fireEvent("onbeforeadd",[t]);return i===!0?t:(this._insertRange(this.items.length,[t]),this.fireEvent("onadd",[t]),t)},this.addRange=function(t){var i=this.fireEvent("onbeforeaddrange",[t]);return i===!0?t:(this._insertRange(this.items.length,t),this.fireEvent("onaddrange",[t]),t)},this.insert=function(t,i){var e=this.fireEvent("onbeforeinsert",[t,i]);return e===!0?i:(this._insertRange(t,[i]),void this.fireEvent("oninsert",[t,i]))},this.insertRange=function(t,i){if(i&&i.items&&(i=i.items),!Motif.Type.isArray(i))throw new Error("Motif.Collections.insertRange: Invalid parameter specified.");var e=this.fireEvent("onbeforeinsertrange",[t,i]);return e===!0?i:(this._insertRange(t,i),this.fireEvent("oninsertrange",[t,i]),i)},this._insertRange=function(t,i){if(i&&i.items&&(i=i.items),Motif.Type.isArray(i)){var e=[];t<this.items.length&&(e=this.items.splice(t,this.items.length-t)),this.items=this.items.concat(i,e)}return this.count=this.items.length,i},this.clone=function(){return this.getRange(0,this.items.length)},this.contains=function(t){return-1!=this.indexOf(t)},this.getRange=function(t,i){return new Motif.Collections.List(this.items.slice(t,i))},this.getItem=function(t,i){if(t=parseInt(t),isNaN(t))throw new Error("Motif.Collections.List.getItem: Incorrect parameter specified.");return 0>t||t>this.items.count?i:this.items[t]},this.indexOf=function(t){for(var i=0;i<this.items.length;i++)if(this.items[i]===t)return i;return-1},this.remove=function(t,i){var e=this.fireEvent("onbeforeremove",[t,i]);if(e===!0)return new Motif.Collections.List([]);i=i?i:1;var n=this.items.splice(t,i);return this.count=this.items.length,this.fireEvent("onremove",[n]),new Motif.Collections.List(n)},this.removeAll=function(){var t=this.fireEvent("onbeforeremoveall");if(t===!0)return new Motif.Collections.List([]);var i=this.items.splice(0,this.items.length);return this.count=0,this.fireEvent("onremoveall",[i]),new Motif.Collections.List(i)},this.reverse=function(){var t=this.fireEvent("onbeforereverse");t!==!0&&(this.items=this.items.reverse(),this.fireEvent("onreverse"))},this.sort=function(){var t=this.fireEvent("onbeforeresort");if(t!==!0){var i=new Function("a","b","if(a < b){return -1;} if(a > b){return 1;} return 0;");this.items.sort(i),this.fireEvent("onsort")}},this.sortBy=function(t){var i=this.fireEvent("onbeforeresort");if(i!==!0){var e=new Function("a","b","if(a['"+t+"'] < b['"+t+"']){return -1}if(a['"+t+"'] > b['"+t+"']){return 1}return 0;");this.items.sort(e),this.fireEvent("onsort")}},this.toArray=function(){return new Array(this.items)},this.onbeforeadd=function(t){},this.onadd=function(t){},this.onbeforeaddrange=function(t){},this.onaddrange=function(t){},this.onbeforeinsert=function(t,i){},this.oninsert=function(t,i){},this.onbeforeinsertrange=function(t,i){},this.oninsertrange=function(t,i){},this.onbeforesort=function(){},this.onsort=function(){},this.onbeforeremove=function(t,i){},this.onremove=function(t){},this.onbeforeremoveall=function(){},this.onremoveall=function(t){},this.main=function(t){this.addRange(t)},this.main(t)};