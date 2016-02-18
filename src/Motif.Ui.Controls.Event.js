/**
 * Control event object, crossbroser wrapper for the dom event object and base for the MouseEvent and KeyEvent objects
 * @extends Motif.Object
 * @requires Motif.Object
 * @constructor
 * @author Rayraegah
 */
Motif.Ui.Controls.Event = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Ui.Controls.Event");

    this.srcEvent = null;
    this.srcElement = null;
    this.control = null;
    this.type = "";
    this.altKey = false;
    this.ctrlKey = false;
    this.shifKey = false;
    this.created = new Date();
    this.isCanceled = false;

    this.cancel = function Event_cancel() {
        if (this.srcEvent) {
            if (typeof this.srcEvent.preventDefault != "undefined") {
                this.srcEvent.preventDefault();
            }
            if (typeof this.srcEvent.preventBubble != "undefined") {
                this.srcEvent.preventBubble();
            }
            if (typeof this.srcEvent.cancleBubble != "undefined") {
                this.srcEvent.cancleBubble = true;
            }
            Motif.Page.log.write("Motif.Ui.Controls.Event.cancel: Event '" + this.type + "' canceled.");
        }
        this.isCanceled = true;
    };

    /** Configure this event object @type Motif.Ui.Controls.EventConfig */
    this.configure = function Column_configure(config) {
        config = this.Motif$Object.configure(config);
        if (config.event) {
            this.srcEvent = config.event;
            this.srcElement = config.event.srcElement || config.event.target;
            this.altKey = config.event.altKey;
            this.ctrlKey = config.event.ctrlKey;
            this.shifKey = config.event.shifKey;
        }
        if (config.type) {
            this.type = config.type;
        }
        if (config.control) {
            this.control = config.control;
        }
        return config;
    };

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};

/**
 * Control event configuration object
 * @constructor
 * @author Rayraegah
 */
Motif.Ui.Controls.EventConfig = function() {
    this.event = null;
    this.control = null;
    this.type = "";
};

/**
 * Mouse event object
 * @extends Motif.Ui.Controls.Event
 * @requires Motif.Ui.Controls.Event
 * @constructor
 * @author Rayraegah
 */
Motif.Ui.Controls.KeyEvent = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Event");
    this.__class.push("Motif.Ui.Controls.KeyEvent");

    /** Keycode of the key pressed @type Number */
    this.keyCode = -1;

    /** Configure this mouse event object @type Object */
    this.configure = function MouseEvent_configure(config) {
        config = this.Motif$Ui$Controls$Event.configure(config)
        if (this.srcEvent) {
            this.keyCode = this.srcEvent.keyCode;
        }
        return config;
    };

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};

/**
 * Mouse event object
 * @extends Motif.Ui.Controls.Event
 * @requires Motif.Ui.Controls.Event
 * @requires Motif.Ui.Utility
 * @constructor
 * @author Rayraegah
 */
Motif.Ui.Controls.MouseEvent = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Event");
    this.__class.push("Motif.Ui.Controls.MouseEvent");

    /** Screen x-coordinate of the mouse pointer @type Number */
    this.x = 0;
    /** Screen y-coordinate of the mouse pointer @type Number */
    this.y = 0;
    /** Element x-coordinate of the mouse pointer @type Number */
    this.offsetX = 0;
    /** Element y-coordinate of the mouse pointer @type Number */
    this.offsetY = 0;
    /** Button that started th event, either left=0, center=1 or right=2 @type Number */
    this.button = -1;
    /** Wheel scroll indication either 120 (up) or -120 (down) @type Number */
    this.wheelDelta = 0;

    /** Configure this mouse event object @type Object */
    this.configure = function MouseEvent_configure(config) {
        config = this.Motif$Ui$Controls$Event.configure(config)
        if (this.srcEvent) {
            this.x = this.srcEvent.clientX;
            this.y = this.srcEvent.clientY;

            this.button = this.srcEvent.button;
            if (Motif.BrowserInfo.internetExplorer) {
                this.button = this.button == 1 ? 0 : this.button == 4 ? 1 : this.button;
            }

            this.wheelDelta = this.srcEvent.detail * -1 || this.srcEvent.wheelDelta;
            var delta = this.srcEvent.detail * -1 || this.srcEvent.wheelDelta;
            this.wheelDelta = this.wheelDelta < 0 ? -120 : 120;

            this.offsetX = typeof this.srcEvent.layerX == "undefined" ? this.srcEvent.offsetX : this.srcEvent.layerX;
            this.offsetY = typeof this.srcEvent.layerY == "undefined" ? this.srcEvent.offsetY : this.srcEvent.layerY;
            this.offsetX = this.offsetX < 0 ? 0 : this.offsetX;
            this.offsetY = this.offsetY < 0 ? 0 : this.offsetY;
        }
        return config;
    };

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};

/**
 * User event enumeration
 * @author Rayraegah
 * @singleton
 */
Motif.Ui.Controls.UserEvents = {
    onblur: "onblur",
    oncontextmenu: "oncontextmenu",
    onfocus: "focus",
    onresize: "onresize",
    onscroll: "onscroll",
    onselectstart: "onselectstart"
};

/**
 * Key event enumeration
 * @author Rayraegah
 * @singleton
 */
Motif.Ui.Controls.KeyEvents = {
    onkeydown: "onkeydown",
    onkeypress: "onkeypress",
    onkeyup: "onkeyup"
};

/**
 * Mouse event enumeration
 * @author Rayraegah
 * @singleton
 */
Motif.Ui.Controls.MouseEvents = {
    onclick: "onclick",
    ondblclick: "ondblclick",
    onmousedown: "onmousedown",
    onmousemove: "onmousemove",
    onmouseout: "onmouseout",
    onmouseover: "onmouseover",
    onmouseup: "onmouseup",
    onmousewheel: "onmousewheel"
};