/** Indication wheter the string ends with the specified parameter @type Boolean */
String.prototype.endsWith = function(value) {
    return (this.substr(this.length - value.length) === value);
};
/** Indication wheter the string starts with the specified parameter @type Boolean */
String.prototype.startsWith = function(value) {
    return (this.substr(0, value.length) === value);
};
/** Remove the parameter from the beginning or end of the string, the parameter defaults to whitespace @type String */
String.prototype.trim = function(pattern) {
    if (!pattern) {
        pattern = "\\s";
    }
    var regex = new RegExp("^" + pattern + "+|" + pattern + "+$", "g");
    return this.replace(regex, "");
};
/** Remove the parameter from the end of the string, the parameter defaults to whitespace @type String */
String.prototype.trimEnd = function(pattern) {
    if (!pattern) {
        pattern = "\\s";
    }
    var regex = new RegExp(pattern + "+$", "g");
    return this.replace(regex, "");
};
/** Remove the parameter from the beginning of the string, the parameter defaults to whitespace @type String */
String.prototype.trimStart = function(pattern) {
    if (!pattern) {
        pattern = "\\s";
    }
    var regex = new RegExp("^" + pattern + "+", "g");
    return this.replace(regex, "");
};
/** Convert the string to an array of chars @type String[] */
String.prototype.toCharArray = function() {
    var ret = [];
    for (var i = 0; i < this.length; i++) {
        ret.push(this.charAt(i));
    }
    return ret;
};