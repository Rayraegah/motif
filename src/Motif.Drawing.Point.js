/** 
 * x,y coordinate object 
 * @constructor 
 */
Motif.Drawing.Point = function(x, y) {
    /** @ignore */
    this.inheritFrom = Motif.Object;
    this.inheritFrom();
    this.__class.push("Motif.Drawing.Point");

    /** Coordinate x of the point @type Number */
    this.x = null;
    /** Coordinate y of the point @type Number */
    this.y = null;

    /** Move the point to a new location */
    this.move = function(x, y) {
            this.x = x;
            this.y = y;
        }
        /** Move the point by the x,y values */
    this.moveBy = function(x, y) {
        this.x += x;
        this.y += y;
    }

    /** Convert the point to String as 'x,y' format @type String */
    this.toString = function() {
        return this.x.toString() + "," + this.y.toString();
    }

    /** @ignore */
    this.main = function(x, y) {
        if (x && !isNaN(x)) {
            this.x = parseInt(x);
        }
        if (y && !isNaN(y)) {
            this.y = parseInt(y);
        }
    };
    this.main(x, y);
}