/**
 * Color type
 * @constructor
 * @base Motif.Object
 * @author Rayraegah
 */
Motif.Drawing.Color = function(r, g, b, a) {
    /** @ignore */
    this.inheritFrom = Motif.Object;
    this.inheritFrom();
    this.__class.push("Motif.Drawing.Color");

    /** Alpha value @type Number */
    this.a = 255;
    /** Red value @type Number */
    this.r = 0;
    /** Green value @type Number */
    this.g = 0;
    /** Blue value @type Number */
    this.b = 0;

    /** Increases the values for all colors */
    this.brighten = function(amount) {
        this.r += amount;
        this.g += amount;
        this.b += amount;
    }

    /** Get the hexadecimal value of this object @type String */
    this.toHex = function() {
        var arrHex = [this.r.toString(16).toUpperCase(), this.g.toString(16).toUpperCase(), this.b.toString(16).toUpperCase()];
        for (e in arrHex) {
            arrHex[e] = arrHex[e].length == 1 ? "0" + arrHex[e] : arrHex[e];
        }
        return arrHex.join("");
    };

    /** Parse a hexadecimal value, to populate the values of the object */
    this.fromHex = function(hex) {
        if (!hex) {
            return;
        }
        hex = hex.replace("#", "");
        var h = hex.split("");
        if (h.length == 3) {
            this.r = parseInt(eval("0x" + h[0] + h[0]), 10);
            this.g = parseInt(eval("0x" + h[1] + h[1]), 10);
            this.b = parseInt(eval("0x" + h[2] + h[2]), 10);
        }

        if (h.length == 6) {
            this.r = parseInt(eval("0x" + h[0] + h[1]), 10);
            this.g = parseInt(eval("0x" + h[2] + h[3]), 10);
            this.b = parseInt(eval("0x" + h[4] + h[5]), 10);
        }
    };

    /** Parse the color values from a string, can be hex or r,g,b,a notation */
    this.parse = function(color) {
        if (!color) {
            throw new Error("Motif.Drawing.Color.fromString: No valid color specified, '" + color + "'");
        }
        if (color.charAt(0) == "#") {
            this.fromHex(color);
            return;
        }
        var color = color.replace(/[^\d\,]/g, "");
        var parts = color.split(",");
        if (parts.length < 3 || parts.length > 4) {
            throw new Error("Motif.Drawing.Color.fromString: No valid color specified, '" + color + "'");
        }
        for (e in parts) {
            parts[e] = parseInt(parts[e]);
            if (parts[e] > 255 || parts[e] < 0) {
                throw new Error("Motif.Drawing.Color.fromString: No valid color specified, '" + color + "'");
            }
            if (e == 0) {
                this.r = parts[e];
            }
            if (e == 1) {
                this.g = parts[e];
            }
            if (e == 2) {
                this.b = parts[e];
            }
            if (e == 3) {
                this.a = parts[e];
            }
        }
    };

    /** Try parsing a color value, does the same as parse but without throwing any errors */
    this.tryParse = function(color) {
        try {
            this.parse(color);
        } catch (X) {
            Motif.Page.log.write("Motif.Drawing.Color.tryParse: Parsing color value failed. {" + X.description + "}");
        }
    }

    /** Get the string value of the object, comma separated a,r,g,b @type Number String */
    this.toString = function() {
        return this.a + "," + this.r + "," + this.g + "," + this.b;
    };

    /** @ignore */
    this.main = function(r, g, b, a) {
        if (Motif.Type.isNumber(r)) {
            this.r = r;
        }
        if (Motif.Type.isNumber(g)) {
            this.g = g;
        }
        if (Motif.Type.isNumber(b)) {
            this.b = b;
        }
        if (Motif.Type.isNumber(a)) {
            this.a = a;
        }
    };
    this.main(r, g, b, a);
};