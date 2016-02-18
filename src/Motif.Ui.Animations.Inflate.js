Motif.Page.include("Motif.Ui.Animations.Base.js");
Motif.Page.include("Motif.Drawing.Rectangle.js");
Motif.Page.include("Motif.Ui.Utility.js");

/** 
 * Resize a HTMLElement to a target width and height within a specified amount of milliseconds.
 * @constructor 
 * @base Motif.Ui.Animations.Base
 * @requires Motif.Ui.Animations.Base
 * @requires Motif.Drawing.Rectangle
 * @requires Motif.Ui.Utility
 * @author Rayraegah
 */
Motif.Ui.Animations.Inflate = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Animations.Base");
    this.__class.push("Netxion.Ui.Animations.Inflate");

    /** Current dimension @type Object */
    this.active = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    /** Starting dimension @type Object */
    this.begin = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    /** End dimension @type Object */
    this.end = null;

    this.play = function() {
        var overflow = Motif.Ui.Css.getCurrentStyle(this.element, "overflow");
        if (overflow != "hidden") {
            this._oldOverflow = overflow;
            this.element.style.overflow = "hidden";
        }
        this.Motif$Ui$Animations$Base.play();
    };

    /** Move the resize animation to the next step */
    this.setCurrent = function(step) {
        this.Motif$Ui$Animations$Base.setCurrent(step);
        if (!this.end) {
            return;
        }

        var width = this.begin.w + Math.round((this.end.w - this.begin.w) / 100 * this.status);
        var height = this.begin.h + Math.round((this.end.h - this.begin.h) / 100 * this.status);

        var rect = new Motif.Drawing.Rectangle(this.begin);
        rect.inflate(width, height);

        if (rect.x != this.active.x || rect.y != this.active.y || rect.w != this.active.w || rect.h != this.active.h) {
            this.active.x = rect.x;
            this.active.y = rect.y;
            this.active.w = rect.w;
            this.active.h = rect.h;

            this.element.style.cssText += ";" + [
                "left:" + this.active.x.toString() + "px",
                "top:" + this.active.y.toString() + "px",
                "width:" + this.active.w.toString() + "px",
                "height:" + this.active.h.toString() + "px"
            ].join(";");
        }
    };

    /** Set the element and if not set the begin and end state by the element */
    this.setElement = function(element) {
        this.Motif$Ui$Animations$Base.setElement(element);
        if (this.end == null && Motif.Type.isElement(this.element)) {
            var rect = new Motif.Ui.Utility.getRectangle(this.element);
            Motif.Page.log.write("Motif.Ui.Animations.Inflate.setElement: Setting end state with element (" + rect.toString() + ").");

            this.end = {
                x: rect.x,
                y: rect.y,
                w: rect.w,
                h: rect.h
            };
            rect.inflate(1, 1);
            Motif.Page.log.write("Motif.Ui.Animations.Inflate.setElement: Setting begin state with element (" + rect.toString() + ").");
            this.begin = {
                x: rect.x,
                y: rect.y,
                w: rect.w,
                h: rect.h
            };
        }

    };

    /** Configure the resize animation */
    this.configure = function(config) {
        config = this.Motif$Ui$Animations$Base.configure(config);
        Motif.Page.log.write("Motif.Ui.Animations.Inflate.configure: Configuring inflate animation.");
        if (config.begin) {
            this.begin = config.begin;
        }
        if (config.end) {
            this.end = config.end;
        }

        if (!isNaN(config.status)) {
            this.setStatus(parseInt(config.status));
        }
    };

    /** Get the string representation from this object @type String */
    this.toString = function() {
        return this.Motif$Ui$Animations$Base.toString() + ", x=" + this.active.x + ", y=" + this.active.y + ", w=" + this.active.w + ", h=" + this.active.h;
    };

    this._completed = function() {
        if (typeof this._oldOverflow != "undefined") {
            this.element.style.overflow = this._oldOverflow;
        }
    };

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }
        this.attachEvent("oncomplete", this._completed);
    };
    this.main(config);
};