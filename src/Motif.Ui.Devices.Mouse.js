Motif.Page.include("Motif.Ui.Devices.Screen.js");

/** 
 * Mouse button enumeration, button name to numeric mapping
 * @author Rayraegah
 * @singleton 
 */
Motif.Ui.Devices.MouseButtons = {
    None: -1,
    Left: 0,
    Center: 1,
    Right: 2
};

/** 
 * Static mouse object to which mouse tracker can be registerd to obtain mouse status information.
 * @requires Motif.Ui.Devices.Screen
 * @requires Motif.Ui.Devices.MouseButtons
 * @author Rayraegah
 * @singleton
 */
Motif.Ui.Devices.Mouse = {
    /** Internet explorer buttons map @type Object */
    _ieButtons: {
        b1: 0,
        b4: 1,
        b2: 2
    },
    /** Mouse position x-coordinate @type Number */
    x: 0,
    /** Mouse position y-coordinate @type Number */
    y: 0,
    /** Mouse button @type Number */
    button: Motif.Ui.Devices.MouseButtons.None,
    /** List of trackers which receive mouse status changes @type Motif.Ui.Devices.MouseTracker[] */
    trackers: {},
    /** Amount of trackers registered */
    trackerCount: 0,

    /** Add a mouse tracker to the receive status changes */
    register: function Mouse_register(tracker) {
        if (Motif.Ui.Devices.Mouse.trackerCount == 0) {
            Motif.Ui.Devices.Mouse._attachEvents();
        }

        var id = "tracker" + tracker.ptr.toString();
        if (id in Motif.Ui.Devices.Mouse.trackers) {
            return;
        }

        Motif.Ui.Devices.Mouse.trackers[id] = tracker;
        Motif.Ui.Devices.Mouse.trackerCount++;
    },

    /** Remove a mouse tracker */
    unregister: function Mouse_unregister(tracker) {

        var id = "tracker" + tracker.ptr.toString();
        if (id in Motif.Ui.Devices.Mouse.trackers) {
            delete Motif.Ui.Devices.Mouse.trackers[id];
            Motif.Ui.Devices.Mouse.trackerCount--;
        } else {
            return;
        }
        if (Motif.Ui.Devices.Mouse.trackerCount == 0) {
            Motif.Ui.Devices.Mouse._detachEvents();
        }
    },

    /** Attaches the mouse status listeners to the document */
    _attachEvents: function Mouse__attachEvents() {
        Motif.Page.log.write("Motif.Ui.Devices.Mouse._attachEvents: Attaching events.");
        Motif.Utility.attachEvent(document, "onmousemove", Motif.Ui.Devices.Mouse._mouseMove);
        Motif.Utility.attachEvent(document, "onmousedown", Motif.Ui.Devices.Mouse._mouseDown);
        Motif.Utility.attachEvent(document, "onmouseup", Motif.Ui.Devices.Mouse._mouseUp);

        if (Motif.BrowserInfo.gecko)
            Motif.Utility.attachEvent(window, "onDOMMouseScroll", Motif.Ui.Devices.Mouse._mouseWheel);
        else
            Motif.Utility.attachEvent(document, "onmousewheel", Motif.Ui.Devices.Mouse._mouseWheel);
    },

    /** Detaches the mouse status listeners from the document */
    _detachEvents: function Mouse__detachEvents() {
        Motif.Page.log.write("Motif.Ui.Devices.Mouse._detachEvents: Detaching events.");
        Motif.Utility.detachEvent(document, "onmousemove", Motif.Ui.Devices.Mouse._mouseMove);
        Motif.Utility.detachEvent(document, "onmousedown", Motif.Ui.Devices.Mouse._mouseDown);
        Motif.Utility.detachEvent(document, "onmouseup", Motif.Ui.Devices.Mouse._mouseUp);

        if (Motif.BrowserInfo.gecko)
            Motif.Utility.detachEvent(window, "onDOMMouseScroll", Motif.Ui.Devices.Mouse._mouseWheel);
        else
            Motif.Utility.detachEvent(document, "onmousewheel", Motif.Ui.Devices.Mouse._mouseWheel);
    },

    /** Handler for onmousemove events */
    _mouseMove: function Mouse__mouseMove(e) {
        if (Motif.Ui.Devices.Mouse.trackers.length == 0) {
            Motif.Ui.Devices.Mouse._detachEvents();
            return;
        }
        e = e || event;
        var newX = e.clientX + Motif.Ui.Devices.Screen.getScrollLeft();
        var newY = e.clientY + Motif.Ui.Devices.Screen.getScrollTop();

        var changed = this.x != newX || this.y != newY;
        Motif.Ui.Devices.Mouse.x = newX;
        Motif.Ui.Devices.Mouse.y = newY;
        if (changed) {
            for (e in Motif.Ui.Devices.Mouse.trackers) {
                Motif.Ui.Devices.Mouse.trackers[e].setPosition(newX, newY);
            }
        }
    },

    /** Handler for onmouseup events */
    _mouseUp: function(e) {
        var changed = Motif.Ui.Devices.Mouse.button != Motif.Ui.Devices.MouseButtons.None;
        Motif.Ui.Devices.Mouse.button = Motif.Ui.Devices.MouseButtons.None;
        if (changed) {
            for (e in Motif.Ui.Devices.Mouse.trackers) {
                Motif.Ui.Devices.Mouse.trackers[e].setButton(Motif.Ui.Devices.MouseButtons.None);
            }
        }
    },

    /** Handler for onmousedown events */
    _mouseDown: function(e) {
        e = e || event;
        var button = Motif.BrowserInfo.internetExplorer ? Motif.Ui.Devices.Mouse._ieButtons["b" + e.button.toString()] : e.button;
        var changed = Motif.Ui.Devices.Mouse.button != button;
        Motif.Ui.Devices.Mouse.button = button;

        if (changed) {
            for (e in Motif.Ui.Devices.Mouse.trackers) {
                Motif.Ui.Devices.Mouse.trackers[e].setButton(button);
            }
        }
    },

    _mouseWheel: function(e) {
        e = e || event;
        var delta = e.detail * -1 || e.wheelDelta;
        delta = delta < 0 ? -120 : 120;

        for (e in Motif.Ui.Devices.Mouse.trackers) {
            Motif.Ui.Devices.Mouse.trackers[e].setWheelDelta(delta);
        }
    }
};

/** 
 * Pointing device object, tracks mouse events on the document object and reflect it's state.
 * @base Motif.Object 
 * @requires Motif.Object
 * @requires Motif.Ui.Devices.Mouse
 * @author Rayraegah
 * @constructor 
 */
Motif.Ui.Devices.MouseTracker = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Ui.Devices.MouseTracker");

    /** Mouse position x-coordinate @type Number */
    this.x = 0;
    /** Mouse position y-coordinate @type Number */
    this.y = 0;
    /** Mouse button @type Number */
    this.button = Motif.Ui.Devices.MouseButtons.None;
    /** Indication whether the tracker is tracking or not @type Boolean */
    this.isTracking = false;
    /** Indication of the mouse wheel movement, up=120 and down=-120  @type Number */
    this.wheelDelta = 0;

    /** Start tracking mouse interaction, optionally a mouse event can be passed to initialize the tracker properties */
    this.start = function MouseTracker_start(evt) {
        if (this.isTracking === true) {
            return;
        }
        if (evt) {
            Motif.Ui.Devices.Mouse.x = this.x = evt.clientX + Motif.Ui.Devices.Screen.getScrollLeft();
            Motif.Ui.Devices.Mouse.y = this.y = evt.clientY + Motif.Ui.Devices.Screen.getScrollTop();
            Motif.Ui.Devices.Mouse.button = this.button = Motif.BrowserInfo.internetExplorer ? Motif.Ui.Devices.Mouse._ieButtons["b" + evt.button.toString()] : evt.button;
        }
        this.fireEvent("onbeforestart");

        Motif.Ui.Devices.Mouse.register(this);
        this.isTracking = true;

        this.fireEvent("onstart");
    };

    /** Stop tracking */
    this.stop = function MouseTracker_stop() {
        if (this.isTracking === false) {
            return;
        }
        this.fireEvent("onbeforestop");

        Motif.Ui.Devices.Mouse.unregister(this);
        this.isTracking = false;

        this.fireEvent("onstop");
    };

    /** Set the position for this object */
    this.setPosition = function MouseTracker_setPosition(x, y) {
        if (this.x == x && this.y == y) {
            return;
        }
        var diffx = x - this.x;
        var diffy = y - this.y;

        this.fireEvent("onpositionchange", [this.x, this.y, x, y, diffx, diffy]);
        this.x = x;
        this.y = y;
    };

    /** Set the button for this object */
    this.setButton = function MouseTracker_setButton(button) {
        if (this.button == button) {
            return;
        }
        this.fireEvent("onbuttonchange", [this.button, button]);
        this.button = button;
    };

    /** Set the mousewheel movement for this tracker */
    this.setWheelDelta = function MouseTracker_setWheelDelta(delta) {
        this.fireEvent("onwheel", [delta]);
        this.wheelDelta = delta;
    };

    /** Configures this mousetracker object */
    this.configure = function MouseTracker_configure(config) {
        config = this.Motif$Object.configure(config);
        if (Motif.Type.isNumber(config.x)) {
            this.x = config.x;
        }
        if (Motif.Type.isNumber(config.y)) {
            this.y = config.y;
        }
        if (Motif.Type.isNumber(config.button)) {
            this.button = config.button;
        }
    };

    /** Get the string represtation of current mouse state */
    this.toString = function() {
        return "x=" + this.x + ";y=" + this.y + ";b=" + this.button + ";w=" + this.wheelDelta;
    };

    /** Event fired when the mouse position changes */
    this.onpositionchange = function(oldx, oldy, newx, newy, diffx, diffy) {};
    /** Event fired when the mouse button changes */
    this.onbuttonchange = function(oldbutton, newbutton) {};
    /** Event fired when the mouse button changes */
    this.onwheel = function(oldbutton, newbutton) {};

    /** @ignore */
    this.main = function MouseTracker_main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};