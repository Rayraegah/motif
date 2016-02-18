/** 
 * Static class for XOR encryption. XOR is a simple encryption method wich should be used for hiding, not securing data.
 * @singleton 
 * @author Rayraegah
 */
Motif.Encryption.Xor = {
    /** Encode the value with the key @type String */
    encode: function(value, key) {
        var ret = [];
        for (var i = 0; i < value.length; i++) {
            ret.push(String.fromCharCode(value.charCodeAt(i) ^ key.charCodeAt(i % key.length)));
        }
        return ret.join("");
    },

    /** Decode the value with the key @type String */
    decode: function(value, key) {
        return this.encode(value, key);
    }
};