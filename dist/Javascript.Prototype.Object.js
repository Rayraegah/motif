Object.prototype.toString=function(){var t=[];t.push("{");for(e in this)t.push('"'+e+'": '+this[e].toString()),t.push(",");return t.length>1&&t.pop(),t.push("}"),t.join("")};