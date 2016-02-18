Motif.Page.include("Motif.Ui.Animations.Base.js");
Motif.Page.include("Motif.Ui.Css.js");

/** 
 * Animated movement of an element. When applied to a absolute positioned element it will use the style.top and style.left 
 * properties, otherwise it will assume moving around another element en uses the style.marginLeft and style.marginTop properties.
 * @constructor 
 * @base Motif.Ui.Animations.Base
 * @requires Motif.Ui.Animations.Base
 * @author Rayraegah
 */
Motif.Ui.Animations.Move = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Animations.Base");
    this.__class.push("Motif.Ui.Animation.Move");

    /** Starting position @type Object */
    this.begin = null;
    /** End position @type Object */
    this.end = null;
    /** Current position @type Object */
    this.active = {
        x: 0,
        y: 0
    };

    /** Sets the element and checks whether the current style is 'relative' or 'absolute' and sets it to 'relative' of neither */
    this.setElement = function Move_setElement(element) {
        this.Motif$Ui$Animations$Base.setElement(element);
        var pos = Motif.Ui.Css.getCurrentStyle(element, "position");
        if (pos != "absolute" && pos != "relative") {
            element.style.position = "relative";
        }
        return element;
    };

    /** Set the current step or this move animation, calculates the top left point by status, begin and end point */
    this.setCurrent = function Move_setCurent(step) {
        this.Motif$Ui$Animations$Base.setCurrent(step);
        if (!this.end) {
            return;
        }

        var pointNew = {
            x: 0,
            y: 0
        };
        pointNew.x = this.begin.x + Math.round((this.end.x - this.begin.x) / 100 * this.status);
        pointNew.y = this.begin.y + Math.round((this.end.y - this.begin.y) / 100 * this.status);

        if (pointNew.x != this.active.x || pointNew.y != this.active.y) {
            this.active.x = pointNew.x;
            this.active.y = pointNew.y;

            this.element.style.cssText += ";" + [
                "left:" + this.active.x.toString() + "px",
                "top:" + this.active.y.toString() + "px"
            ].join(";");
        }
    };

    /** Configure the move animation */
    this.configure = function Move_configure(config) {
        config = this.Motif$Ui$Animations$Base.configure(config);
        Motif.Page.log.write("Motif.Ui.Animations.Move.configure: Configuring move animation.");
        if (config.begin) {
            this.begin = config.begin;
        }
        if (config.end) {
            this.end = config.end;
        }
        if (Motif.Type.isElement(config.element)) {
            Motif.Page.log.write("Motif.Ui.Animations.Move.configure: Configuring element.");
            if (this.begin == null) {
                var rect = Motif.Ui.Utility.getRectangle(config.element);
                this.begin = {
                    x: rect.x,
                    y: rect.y
                };
                Motif.Page.log.write("Motif.Ui.Animations.Move.configure: Getting end from element dimensions (" + rect.toString() + ").");
            }

            config.element.style.left = this.begin.x.toString() + "px";
            config.element.style.top = this.begin.y.toString() + "px";
        }
        if (config.status) {
            this.setStatus(config.status);
        }
    };

    /** Get the properties as string @type String */
    this.toString = function Move_toString() {
        return [
            this.Motif$Ui$Animations$Base.toString(),
            "x=" + this.active.x.toString(),
            "y=" + this.active.y.toString()
        ].join(", ");
    }

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};