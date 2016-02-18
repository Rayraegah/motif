/** 
 * Static class for RC4 encryption
 * @singleton 
 * @author Rayraegah
 */
Motif.Encryption.Rc4 = {
    /** Encode the value with the key @type String */
    encode: function(value, key) {
        var tab = [],
            ret = [];
        for (var i = 0; i < 256; i++) {
            tab[i] = i;
        }

        var i = 0,
            j = 0,
            k = 0,
            l = 0,
            tmp = 0;
        for (i = 0; i < 256; i++) {
            j = (j + tab[i] + key.charCodeAt(i % key.length)) % 256;
            tmp = tab[i];
            tab[i] = tab[j];
            tab[j] = tmp;
        }
        i = 256;
        j = 256;

        for (k = 0; k < value.length; k++) {
            i = (i + 1) % 256;
            j = (j + tab[i]) % 256;
            tmp = tab[i];
            tab[i] = tab[j];
            tab[j] = tmp;
            l = (tab[i] + tab[j]) % 256;
            ret.push(String.fromCharCode(value.charCodeAt(k) ^ tab[l]));
        }
        return ret.join("");
    },

    /** Decode the value with the key  @type String */
    decode: function(value, key) {
        return this.encode(value, key);
    }
};