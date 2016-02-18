Motif.Page.include("Motif.Drawing.Point.js");

/**
 * Rectangle object
 * @requires Motif.Drawing.Point
 * @constructor
 * @author Rayraegah
 */
Motif.Drawing.Rectangle = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Drawing.Rectangle");

    /** x coordinate of the rectangle @type Number */
    this.x = 0;
    /** y coordinate of the rectangle @type Number */
    this.y = 0;
    /** width of the rectangle @type Number */
    this.w = 0;
    /** height of the rectangle @type Number */
    this.h = 0;

    /** Check if this rectangle equals another @param Motif.Drawing.Rectangle */
    this.equals = function(rect) {
        return this.x == rect.x && this.y == rect.y && this.w == rect.w && this.h == rect.h;
    };

    /** Check if certain rectangle is contained within the current */
    this.contains = function(rect) {
        return rect.x >= this.x && rect.y >= this.y && rect.x + rect.w <= this.x + this.w && rect.y + rect.h <= this.y + this.h;
    };

    /** Check if certain point is contained within the current */
    this.containsPoint = function(point) {
        return point.x >= this.x && point.y >= this.y && point.x <= this.x + this.w && point.y <= this.y + this.h;
    };

    this.copyTo = function(rect) {
        rect.x = this.x;
        rect.y = this.y;
        rect.w = this.w;
        rect.h = this.h;
        return rect;
    };

    /** Center supplied rectangle according to current rectangle */
    this.center = function(rect) {
        rect.setCenter(this.getCenter());
        return rect;
    };

    /** Make the rectangle grow to the specified width and height  */
    this.inflate = function(w, h) {
        this.x += Math.round((this.w - w) / 2);
        this.y += Math.round((this.h - h) / 2);
        this.w = w;
        this.h = h;
    };

    /** Make the rectangle grow by the specified width and height  */
    this.inflateBy = function(w, h) {
        this.inflate(this.w + w, this.h + h);
    };

    /** The current rectangle to a new one @type Motif.Drawing.Rectangle */
    this.clone = function() {
        return new Motif.Drawing.Rectangle({
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        });
    };

    /** Get the center coordinates of the rectangle @type Motif.Drawing.Point */
    this.getCenter = function() {
        return new Motif.Drawing.Point({
            x: this.x + Math.round(this.w / 2),
            y: this.y + Math.round(this.h / 2)
        });
    };

    /** Set the center coordinates of the rectangle, returns itself @type Motif.Drawing.Rectangle */
    this.setCenter = function(point) {
        this.move(point.x - Math.round(this.w / 2), point.y - Math.round(this.h / 2));
        return this;
    };

    /** The top left corner coordinates of the rectangle @type Motif.Drawing.Point */
    this.getTopLeft = function() {
        return new Motif.Drawing.Point({
            x: this.x,
            y: this.y
        });
    };

    /** The top right corner coordinates of the rectangle @type Motif.Drawing.Point */
    this.getTopRight = function() {
        return new Motif.Drawing.Point({
            x: this.x + this.w,
            y: this.y
        });
    };

    /** The bottom left corner coordinates of the rectangle @type Motif.Drawing.Point */
    this.getBottomLeft = function() {
        return new Motif.Drawing.Point({
            x: this.x,
            y: this.y + this.h
        });
    };

    /** The bottom right corner coordinates of the rectangle @type Motif.Drawing.Point */
    this.getBottomRight = function() {
        return new Motif.Drawing.Point({
            x: this.x + this.w,
            y: this.y + this.h
        });
    };

    /** Move the rectangle to the new coordinates */
    this.move = function(x, y) {
        if (this.x != x || this.y != y && x || y) {
            this.fireEvent("onbeforemove");
            if (x) {
                this.x = x;
            }
            if (y) {
                this.y = y;
            }
            this.fireEvent("onmove");
            this.fireEvent("onchange");
        }
    };

    /** Move the rectangle by the new coordinates */
    this.moveBy = function(x, y) {
        this.move(this.x += x, this.y += y);
    };

    /** Resize the rectangle to the new size */
    this.resize = function(w, h) {
        if (w != this.w || this.h != h && h || w) {
            this.fireEvent("onbeforeresize");
            if (w) {
                this.w = w;
            }
            if (h) {
                this.h = h;
            }
            this.fireEvent("onresize");
            this.fireEvent("onchange");
        }
    };

    /** Resize the rectangle by the new size */
    this.resizeBy = function(w, h) {
        this.resize(this.w += w, this.h += h);
    };

    /** Reset this rectangle to it's defaults */
    this.reset = function() {
        if (this.x != 0 || this.y != 0 || this.w != 0 || this.h != 0) {
            this.fireEvent("onchange");
        }
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.fireEvent("onreset");
    };

    /** Configure this rectangle object */
    this.configure = function(config) {
        config = this.Motif$Object.configure(config);

        if (!isNaN(parseInt(config.x))) {
            this.x = parseInt(config.x);
        }
        if (!isNaN(parseInt(config.y))) {
            this.y = parseInt(config.y);
        }
        if (!isNaN(parseInt(config.w))) {
            this.w = parseInt(config.w);
        }
        if (!isNaN(parseInt(config.h))) {
            this.h = parseInt(config.h);
        }
    };

    /** Return the string representation of this rectangle @type String */
    this.toString = function() {
        return this.x.toString() + "," + this.y.toString() + "," + this.w.toString() + "," + this.h.toString();
    };
    /** Fires when w,h,x or y values change */
    this.onchange = function() {};
    /** Fires before x,y values change */
    this.onbeforemove = function() {};
    /** Fires when the move function is invoked and x,y values change */
    this.onmove = function() {};
    /** Fires when w,h  values change */
    this.onresize = function() {};
    /** Fires before the resize function is invoked and w or h values change */
    this.onbeforeresize = function() {};
    /** Fires when reset function is invoked */
    this.onreset = function() {};

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};