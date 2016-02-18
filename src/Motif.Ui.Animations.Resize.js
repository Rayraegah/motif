Motif.Page.include("Motif.Ui.Animations.Base.js");
Motif.Page.include("Motif.Ui.Utility.js");

/** 
 * Resize a HTMLElement to a target width and height within a specified amount of milliseconds.
 * @constructor 
 * @base Motif.Ui.Animations.Base
 * @requires Motif.Ui.Animations.Base
 * @requires Motif.Ui.Utility
 * @author Rayraegah
 */
Motif.Ui.Animations.Resize = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Animations.Base");
    this.__class.push("Netxion.Ui.Animations.Resize");

    /** Current dimension @type Object */
    this.active = {
        w: 0,
        h: 0
    };
    /** Starting dimension @type Object */
    this.begin = {
        w: 0,
        h: 0
    };
    /** End dimension @type Object */
    this.end = null;

    /** Set the current step for the animation */
    this.setCurrent = function Resize_setCurrent(step) {
        this.Motif$Ui$Animations$Base.setCurrent(step);
        if (!this.end) {
            return;
        }
        var dimensionNew = {
            w: 0,
            h: 0
        };
        dimensionNew.w = this.begin.w + Math.round((this.end.w - this.begin.w) / 100 * this.status);
        dimensionNew.h = this.begin.h + Math.round((this.end.h - this.begin.h) / 100 * this.status);
        if (dimensionNew.w != this.active.w || dimensionNew.h != this.active.h) {
            this.active.w = dimensionNew.w;
            this.active.h = dimensionNew.h;
            this.element.style.cssText += ["",
                "width:" + this.active.w.toString() + "px",
                "height:" + this.active.h.toString() + "px"
            ].join(";");
        }
    };

    /** Configure the resize animation */
    this.configure = function Resize_configure(config) {
        config = this.Motif$Ui$Animations$Base.configure(config);
        Motif.Page.log.write("Motif.Ui.Animations.Resize.configure: Configuring resize animation.");
        if (config.begin) {
            this.begin = config.begin;
        }
        if (config.end) {
            this.end = config.end;
        }

        if (Motif.Type.isElement(config.element)) {
            Motif.Page.log.write("Motif.Ui.Animations.Resize.configure: Configuring element.");
            if (config.element.style.overflow != "hidden") {
                config.element.style.overflow = "hidden";
            }
            if (this.end == null) {
                var rect = Motif.Ui.Utility.getRectangle(config.element);
                this.end = {
                    w: rect.w,
                    h: rect.h
                };
                Motif.Page.log.write("Motif.Ui.Animations.Resize.configure: Getting end from element dimensions (" + rect.toString() + ").");
            }

            config.element.style.width = this.begin.w.toString() + "px";
            config.element.style.height = this.begin.h.toString() + "px";
        }
        this.setStatus(this.status);
    };

    /** Get the string representation from this object @type String */
    this.toString = function() {
        return this.Motif$Ui$Animations$Base.toString() + ", w=" + this.active.w + ", h=" + this.active.h;
    };

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};