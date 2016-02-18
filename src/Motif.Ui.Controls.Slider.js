Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Ui.Devices.Mouse.js");
Motif.Page.include("Motif.Ui.Css.js");

/**
 * Slider input type
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 */
Motif.Ui.Controls.Slider = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.Slider");

    /** Internal mousetracker object for tracking mouse events on the handle @type Motif.Ui.Devices.MouseTracker */
    this._mouseTracker = new Motif.Ui.Devices.MouseTracker();
    /** Slider handle @type HTMLDiv */
    this.handle = null;

    /** Range of values @type Object[] */
    this.range = null;
    /** Curent value @type Object */
    this.value = null;
    /** Current status in percentage @type Number */
    this.status = -1;
    /** Slider type @type Motif.Ui.Controls.SliderType */
    this.type = Motif.Ui.Controls.SliderType.Horizontal;

    /** Set a range of values for the slider */
    this.setRange = function Slider_setRange(range) {
        if (!Motif.Type.isArray(range)) {
            throw new Error("Motif.Ui.Controls.Slider.setRange: Incorrect parameter specified, expected Array.");
        }
        this.range = range;
        this.reset();
    };

    /** Reset the slider */
    this.reset = function Slider_reset() {
        this.setStatus(0);
    };

    /** Set the handle to the position according to index position */
    this.setValue = function Slider_setValue(value) {
        this.setStatus(this.getStatusByValue(value));
    };

    /** Get the current value @type Object */
    this.getValue = function Slider_getValue() {
        return this.value;
    };

    /** Set the status in percentage */
    this.setStatus = function Slider_setStatus(percentage) {
        if (!Motif.Type.isNumber(percentage)) {
            throw new Error("Motif.Ui.Controls.Slider.setStatus: Incorrect parameter specified, expected Number.");
        }
        if (percentage < 0 || percentage > 100) {
            throw new Error("Motif.Ui.Controls.Slider.setStatus: Incorrect parameter specified, out of range.");
        }
        if (percentage === this.status) {
            return;
        }

        var cancel = this.fireEvent("onbeforestatuschange", [this.status, percentage]);
        if (cancel === true) {
            return;
        }

        if (this.type == Motif.Ui.Controls.SliderType.Horizontal) {
            var width = this.getWidth();
            var handleWidth = parseInt(Motif.Ui.Css.getCurrentStyle(this.handle, "width"));
            var left = parseInt(percentage * width / 100) - parseInt(handleWidth / 2);
            this.handle.style.left = left.toString() + "px";
        }

        if (this.type == Motif.Ui.Controls.SliderType.Vertical) {
            var height = this.getHeight();
            var handleHeight = parseInt(Motif.Ui.Css.getCurrentStyle(this.handle, "height"));
            var top = parseInt(((percentage - 100) * -1) * height / 100) - parseInt(handleHeight / 2);
            this.handle.style.top = top.toString() + "px";
        }

        this.status = percentage;

        var value = status;
        if (Motif.Type.isArray(this.range)) {
            value = this.range[this.getIndexByStatus(percentage)];
        }

        if (value != this.value) {
            this.fireEvent("onbeforechange", [this.value, value]);
            this.value = value;
            this.fireEvent("onchange", [this.value]);
        }

        this.fireEvent("onstatuschange", [this.status]);
    };

    /** Get the current status depending on the position of the handle, optionally an alternate position can be specified @type Number */
    this.getStatus = function Slider_getStatus(position) {
        var ret = 0;
        if (this.type == Motif.Ui.Controls.SliderType.Horizontal) {
            var width = this.getWidth();
            position = typeof position == "undefined" ? parseInt(Motif.Ui.Css.getCurrentStyle(this.handle, "left")) : position;
            var handleWidth = parseInt(Motif.Ui.Css.getCurrentStyle(this.handle, "width"));
            ret = (position + handleWidth / 2) / (width / 100);
        }
        if (this.type == Motif.Ui.Controls.SliderType.Vertical) {
            var height = this.getHeight();
            position = typeof position == "undefined" ? parseInt(Motif.Ui.Css.getCurrentStyle(this.handle, "top")) : position;
            var handleHeight = parseInt(Motif.Ui.Css.getCurrentStyle(this.handle, "height"));
            ret = (position + handleHeight / 2) / (height / 100);
            ret = (ret - 100) * -1;
        }
        return ret;
    };

    /** Get the range index by status @type Number */
    this.getIndexByStatus = function Slider_getIndexByStatus(status) {
        if (!Motif.Type.isArray(this.range)) {
            return -1;
        }
        status = typeof status == "undefined" ? this.status : status;
        var size = 100 / (this.range.length - 1);
        return status % size > size / 2 ? Math.ceil(status / size) : Math.floor(status / size);
    };

    /** Get the range index by value @type Number */
    this.getIndexByValue = function Slider_getIndexByValue(value) {
        if (!Motif.Type.isArray(this.range)) {
            return -1;
        }
        for (var i = 0; i < this.range.length; i++)
            if (this.range[i] === value)
                return i;

        return -1;
    };

    /** Get the status by range index @type Number */
    this.getStatusByIndex = function Slider_getStatusByIndex(index) {
        if (!Motif.Type.isArray(this.range)) {
            return 0;
        }
        index = index < 0 ? 0 : index > this.range.length - 1 ? this.range.length - 1 : index;
        return 100 / (this.range.length - 1) * index;
    };

    /** Get the status by range index @type Number */
    this.getStatusByValue = function Slider_getStatusByIndex(value) {
        if (Motif.Type.isArray(this.range)) {
            return this.getStatusByIndex(this.getIndexByValue(value));
        } else {
            value = parseFloat(value);
            return value < 0 ? 0 : value > 100 ? 100 : value;
        }
    };

    /** Configure the slideshow control @type Object */
    this.configure = function Slider_configure(config) {
        Motif.Page.log.write("Motif.Ui.Controls.Slider.configure: Configuring menu item.");
        config = this.Motif$Ui$Controls$Control.configure(config);

        if (config.type) {
            this.type = config.type;
        }

        if (config.range) {
            if (Motif.Type.isArray(config.range)) {
                this.setRange(config.range);
            }
            if (Motif.Type.isString(config.range) && config.range.indexOf("-")) {
                var arr = config.range.split("-");
                var min = parseInt(arr[0]);
                var max = parseInt(arr[1]);
                var range = [];
                for (var i = min; i <= max; i++) {
                    range.push(i);
                }
                this.setRange(range);
            }
        }

        if (config.value) {
            this.setValue(config.value);
        }

        return config;
    };

    /** Set the element for this control and adds the handle to it */
    this.setElement = function Slider_setElement(element) {
        element = this.Motif$Ui$Controls$Control.setElement(element);

        element.tabIndex = -1;
        element.appendChild(this.handle);

        Motif.Utility.attachEvent(this.element, "onclick", new Function("e", "e=e||event; " + this.referenceString() + "._mouseClick(e);"));

        return element;
    };

    /** Event handler for onclick events */
    this._mouseClick = function Slider__mouseClick(evt) {
        if (this._mouseTracker.isTracking === true) {
            return;
        }
        var pt = Motif.Ui.Utility.getOffsetPoint(this.element);

        var status = 0;
        if (this.type == Motif.Ui.Controls.SliderType.Horizontal) {
            var width = parseInt(Motif.Ui.Css.getCurrentStyle(this.handle, "width"));
            status = this.getStatus((evt.clientX - pt.x) - parseInt(width));
        }
        if (this.type == Motif.Ui.Controls.SliderType.Vertical) {
            var height = parseInt(Motif.Ui.Css.getCurrentStyle(this.handle, "height"));
            status = this.getStatus((evt.clientY - pt.y) - parseInt(height));
        }

        status = status > 100 ? 100 : status < 0 ? 0 : status;
        this.setStatus(status);
    };

    /** Event handler for handle onmousedown events */
    this._mouseDown = function Slider__mouseDown(evt) {
        this._mouseTracker.start(evt);
        this._rect = this.getRectangle(this.element);
    };

    /** Event handler for positionchange events on the mousetracker, changes the status according to mouse position */
    this._positionChange = function Slider__positionChange(oldx, oldy, newx, newy, diffx, diffy) {
        var newStatus = 0;
        if (this.type == Motif.Ui.Controls.SliderType.Horizontal) {
            if (newx > this._rect.x + this._rect.w) {
                newStatus = 100;
            } else if (newx < this._rect.x) {
                newStatus = 0;
            } else {
                var width = parseInt(Motif.Ui.Css.getCurrentStyle(this.handle, "width"));
                newStatus = this.getStatus(newx - this._rect.x - parseInt(width / 2));
            }
        }

        if (this.type == Motif.Ui.Controls.SliderType.Vertical) {
            if (newy > this._rect.y + this._rect.h) {
                newStatus = 100;
            } else if (newy < this._rect.y) {
                newStatus = 0;
            } else {
                var height = parseInt(Motif.Ui.Css.getCurrentStyle(this.handle, "height"));
                newStatus = this.getStatus(newy - this._rect.y - parseInt(height / 2));
            }
        }

        this.setStatus(newStatus);
    };

    /** Event handler for button change events on the mousetracker */
    this._buttonChange = function Slider__buttonChange() {
        this._mouseTracker.stop();
    };

    /** Event fired before a status change takes place, when it returns a boolean 'true' the operation is canceled */
    this.onbeforestatuschange = function(oldstatus, newstatus) {};
    /** Event fired when a status change takes place */
    this.onstatuschange = function(status) {};
    /** Event fired before the value changes */
    this.onbeforechange = function(oldvalue, newvalue) {};
    /** Event fired when a value changed */
    this.onchange = function(newvalue) {};

    /** @ignore */
    this.main = function Slider_main(config) {
        this.handle = document.createElement("div");
        this.handle.className = "Handle";
        this.handle.tabIndex = -1;
        this.handle.style.MozUserSelect = "none";
        this.attachEvent("onfocus", function() {
            this.handle.focus()
        });

        this._mouseTracker.attachEvent("onpositionchange", new Function("oldx", "oldy", "newx", "newy", "diffx", "diffy", this.referenceString() + "._positionChange(oldx, oldy, newx, newy, diffx, diffy);"));
        this._mouseTracker.attachEvent("onbuttonchange", new Function(this.referenceString() + "._buttonChange();"));

        Motif.Utility.attachEvent(this.handle, "ondragstart", new Function("e", "e=e||event; e.cancelBubble=true; return false;"));
        Motif.Utility.attachEvent(this.handle, "onmousedown", new Function("e", "e=e||event; " + this.referenceString() + "._mouseDown(e);"));

        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};

Motif.Ui.Controls.SliderType = {
    Horizontal: 0,
    Vertical: 1
}