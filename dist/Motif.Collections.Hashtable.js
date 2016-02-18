Motif.Collections.Hashtable=function(t){Motif.Utility.extend(this,"Motif.Object"),this.__class.push("Motif.Collections.Hashtable"),this.items={},this.count=0,this.getItem=function(t,i){return t in this.items?this.items[t]:i},this.getInt=function(t){var i=parseInt(this.items[t]);return isNaN(i)?0:i},this.getFloat=function(t){var i=parseFloat(this.items[t]);return isNaN(i)?0:i},this.getBoolean=function(t){return this.items[t]===!1||"false"==this.items[t]?!1:this.items[t]===!0||"true"==this.items[t]?!0:0!=this.getInt(t)},this.add=function(t,i){var e=!this.contains(t);return e?(this.fireEvent("onadd",[t,i]),this.count++):this.fireEvent("onchange",[t,this.items[t],i]),this.items[t]=i,i},this.toArray=function(){return this.getValues()},this.getValues=function(){var t=[];for(e in this.items)this.items[e]!=Object.prototype[e]&&t.push(this.items[e]);return t},this.getKeys=function(){var t=[];for(e in this.items)this.items[e]!=Object.prototype[e]&&t.push(e);return t},this.sort=function(){var t=this.getKeys(),i=[];t.sort();for(var e=0;e<t.length;e++)i.push(this.items[t[e]]);this.removeAll(),this.count=t.length;for(var e=0;e<t.length;e++)this.items[t[e]]=i[e]},this.remove=function(t){var i=null;return this.contains(t)&&(this.fireEvent("onremove",[t,this.items[t]]),i=this.items[t],delete this.items[t],this.count--),i},this.removeAll=function(){var t=[];for(e in this.items)this.items[e]!=Object.prototype[e]&&t.push(this.items[e]);return this.fireEvent("onremoveall",t),this.items={},this.count=0,t},this.contains=function(t){return t in this.items},this.indexOf=function(t){for(e in this.items)if(this.items[e]===t)return e},this.search=function(t){var i=[];for(e in this.items)this.items[e]!=Object.prototype[e]&&this.items[e]===t&&i.push(e);return i},this.clone=function(){return new Motif.Collections.Hashtable({items:this.items})},this.rename=function(t,i){this.contains(t)&&!this.contains(i)&&t!=i&&(this.items[i]=this.items[t],delete this.items[t])},this.configure=function(t){if(t=this.Motif$Object.configure(t),t.items)for(e in t.items)t.items[e]!=Object.prototype[e]&&(this.items[e]=t.items[e],this.count++);return t},this.onadd=function(t,i){},this.onchange=function(t,i){},this.onremove=function(t,i){},this.onremoveall=function(t){},this.main=function(t){t&&this.configure(t)},this.main(t)};