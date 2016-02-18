/**
 * Crc32 checksum encoding, encodes a string to a numeric checksum.
 * @class Motif.Checksum.Crc32
 * @singleton
 * @author Rayraegah
 */
Motif.Checksum.Crc32 = {
    /** @ignore */
    __class: ["Motif.Checksum.Crc32"],
    /** CRC32 value index @type Number[] */
    _index: [],
    /** Create the CRC32 value index */
    _createIndex: function() {
        this._index = [];
        for (var i = 0; i < 256; i++) {
            var c = i;
            for (var j = 0; j < 8; j++) {
                if (c & 1)
                    c = 0xedb88320 ^ ((c >> 1) & 0x7fffffff);
                else
                    c = (c >> 1) & 0x7fffffff;
            }
            this._index.push(c);
        }
    },
    /** Encode the string to a crc32 numeric value @type Number */
    encode: function(data) {
        if (this._index.length == 0) {
            this._createIndex();
        }
        var ret = 0xffffffff;
        for (var i = 0; i < data.length; i++)
            ret = this._index[(ret ^ data.charCodeAt(i)) & 0xff] ^ (ret >> 8);

        ret = ret ^ 0xffffffff;
        return ret;
    }
};