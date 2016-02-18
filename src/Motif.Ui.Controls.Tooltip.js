Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Ui.Utility.js");

/**
 * Tooltip control, display relevant information about an element
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Ui.Utility
 * @author Rayraegah
 */
Motif.Ui.Controls.Tooltip = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.Tooltip");

    this.offsetTop = 5;
    this.offsetLeft = 5;
    this.boundTo = null;
    this.align = Motif.Ui.Controls.TooltipAlignment.Mouse;
    this._handlers = {};

    this.bind = function(element) {
        this.boundTo = element;
        Motif.Utility.attachEvent(this.boundTo, "onmouseover", this._handlers.mouseOver);
        Motif.Utility.attachEvent(this.boundTo, "onmouseout", this._handlers.mouseOut);

    };

    this.unbind = function(element) {
        if (this.boundTo == null) {
            return;
        }
        Motif.Utility.detachEvent(this.boundTo, "onmouseover", this._handlers.mouseOver);
        Motif.Utility.detachEvent(this.boundTo, "onmouseout", this._handlers.mouseOut);
        this.boundTo = null;
    };

    this.setElement = function(element) {
        return this.Motif$Ui$Controls$Control.setElement(element);

    };

    this.show = function(mouseX, mouseY) {
        this.Motif$Ui$Controls$Control.show();
        this._updateCoords(mouseX, mouseY);
    };

    this._updateCoords = function(mouseX, mouseY) {
        var rectElement = null,
            rectBound = null;
        if (this.align != Motif.Ui.Controls.TooltipAlignment.Mouse) {
            if (this.boundTo == null) {
                throw new Error("Motif.Ui.Controls.Tooltip._updateCoords: Object not bound to an element, can't get coordinates");
            }
            rectElement = Motif.Ui.Utility.getOuterRectangle(this.element);
            rectBound = Motif.Ui.Utility.getRectangle(this.boundTo);
        }

        if (Motif.Ui.Css.getCurrentStyle(this.element, "position") != "absolute") {
            this.element.style.position = "absolute";
        }

        var x = 0,
            y = 0;
        if (this.align === Motif.Ui.Controls.TooltipAlignment.Top) {
            x = rectBound.x;
            y = (rectBound.y - rectElement.h - this.offsetTop);
        }
        if (this.align === Motif.Ui.Controls.TooltipAlignment.Right) {
            x = rectBound.x + rectBound.w + this.offsetLeft;
            y = rectBound.y + this.offsetTop;
        }
        if (this.align === Motif.Ui.Controls.TooltipAlignment.Bottom) {
            x = rectBound.x + this.offsetLeft;
            y = rectBound.y + rectBound.h + this.offsetTop;
        }
        if (this.align === Motif.Ui.Controls.TooltipAlignment.Left) {
            x = rectBound.x - rectBound.w - this.offsetLeft;
            y = rectBound.y - this.offsetTop;
        }
        if (this.align === Motif.Ui.Controls.TooltipAlignment.Mouse) {
            x = mouseX + this.offsetLeft;
            y = mouseY + this.offsetTop;
        }

        if (this._x !== x || this._y !== y) {
            this._x = x;
            this._y = y;
            this.element.style.cssText += ";left:" + x.toString() + "px; top:" + y.toString() + "px;";
            Motif.Page.log.write("Motif.Ui.Controls.Tooltip._updateCoords: Setting coords to x=" + x.toString() + ",y=" + y.toString() + ".");
        }
    };

    this.configure = function Tooltip_configure(config) {
        config = this.Motif$Ui$Controls$Control.configure(config);

        if (Motif.Type.isElement(config.bind)) {
            this.bind(config.bind);
        }
        if (Motif.Type.isString(config.bind)) {
            this.bind(document.getElementById(config.bind));
        }
        if (typeof config.align != "undefined") {
            if (Motif.Ui.Controls.TooltipAlignment[config.align]) {
                this.align = Motif.Ui.Controls.TooltipAlignment[config.align];
            } else {
                for (e in Motif.Ui.Controls.TooltipAlignment) {
                    if (Motif.Ui.Controls.TooltipAlignment[e] === config.align) {
                        this.align = config.align;
                        break;
                    }
                }
            }
            if (this.align != config.align) {
                throw new Error("Motif.Ui.Controls.Tooltip.configure: Invalid value for 'align' specified.");
            }
        }
    };

    /** @ignore */
    this.main = function Image_main(config) {
        this._handlers.mouseOver = new Function("e", "e=e||event; " + this.referenceString() + ".show(e.clientX, e.clientY);");
        this._handlers.mouseOut = new Function(this.referenceString() + ".hide();");
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};

/**
 * Tooltip alignment enumeration
 * @singleton
 * @author Rayraegah
 */
Motif.Ui.Controls.TooltipAlignment = {
    Top: 0,
    Right: 1,
    Bottom: 2,
    Left: 3,
    Mouse: 4
};