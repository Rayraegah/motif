 /** Get the properties of an object as string @type String */
Object.prototype.toString = function() {
    var ret = [];
    ret.push("{");
    for (e in this) {
        ret.push("\"" + e + "\": " + this[e].toString());
        ret.push(",");
    }
    if (ret.length > 1) {
        ret.pop();
    }
    ret.push("}");
    return ret.join("");
};