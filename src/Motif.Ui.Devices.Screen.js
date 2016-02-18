Motif.Page.include("Motif.Drawing.Rectangle.js");
Motif.Page.include("Motif.Drawing.Point.js");
/** 
 * Screen device object
 * @singleton
 * @extends Motif.Object
 * @requires Motif.Object
 * @requires Motif.Drawing.Point
 * @requires Motif.Drawing.Rectangle
 * @author Rayraegah
 */
Motif.Ui.Devices.Screen = {
    scrollX: 0,
    scrollY: 0,
    w: 0,
    h: 0,
    trackers: {},
    trackerCount: 0,

    /** Add a mouse tracker to the receive status changes */
    register: function Screen_register(tracker) {
        if (Motif.Ui.Devices.Screen.trackerCount == 0) {
            Motif.Ui.Devices.Screen._attachEvents();
        }

        var id = "tracker" + tracker.ptr.toString();
        if (id in Motif.Ui.Devices.Screen.trackers) {
            return;
        }

        Motif.Ui.Devices.Screen.trackers[id] = tracker;
        Motif.Ui.Devices.Screen.trackerCount++;
    },

    /** Remove a mouse tracker */
    unregister: function Screen_unregister(tracker) {

        var id = "tracker" + tracker.ptr.toString();
        if (id in Motif.Ui.Devices.Screen.trackers) {
            delete Motif.Ui.Devices.Screen.trackers[id];
            Motif.Ui.Devices.Screen.trackerCount--;
        } else {
            return;
        }
        if (Motif.Ui.Devices.Screen.trackerCount == 0) {
            Motif.Ui.Devices.Screen._detachEvents();
        }
    },

    _attachEvents: function() {
        Motif.Page.log.write("Motif.Ui.Devices.Screen._attachEvents: Attaching events.");

        Motif.Utility.attachEvent(window, "onresize", Motif.Ui.Devices.Screen._windowResize);
        Motif.Utility.attachEvent(window, "onscroll", Motif.Ui.Devices.Screen._windowScroll);
    },

    _detachEvents: function() {
        Motif.Page.log.write("Motif.Ui.Devices.Screen._detachEvents: Detaching events.");

        Motif.Utility.detachEvent(document.body, "onresize", Motif.Ui.Devices.Screen._windowResize);
        Motif.Utility.detachEvent(window, "onscroll", Motif.Ui.Devices.Screen._windowScroll);
    },

    _windowResize: function Screen__windowResize(e) {
        Motif.Page.log.write("Motif.Ui.Devices.Screen._windowResize: ");
        var current = {
            w: this.getTotalWidth(),
            h: this.getTotalHeight()
        };
        if (Motif.Ui.Devices.Screen.w === current.w && Motif.Ui.Devices.Screen.h === current.h) {
            return;
        }
        for (e in Motif.Ui.Devices.Screen.trackers) {
            Motif.Ui.Devices.Screen.trackers[e].resize(current.w, current.h);
        }
    },

    _windowScroll: function(e) {
        Motif.Page.log.write("Motif.Ui.Devices.Screen._windowScroll: ");

        var current = {
            x: this.getScrollLeft(),
            y: this.getScrollTop()
        };
        if (Motif.Ui.Devices.Screen.scrollX === current.x && Motif.Ui.Devices.Screen.scrollY === current.y) {
            return;
        }
        for (e in Motif.Ui.Devices.Screen.trackers) {
            Motif.Ui.Devices.Screen.trackers[e].scroll(current.w, current.h);
        }
    },

    /** Amount of pixels scrolled down @type Number*/
    getScrollTop: function() {
        if (document.documentElement.scrollTop) {
            return document.documentElement.scrollTop;
        }
        if (window.pageYOffset) {
            return window.pageYOffset;
        }
        return 0;
    },
    /** Amount of pixels scrolled right @type Number*/
    getScrollLeft: function() {
        if (document.documentElement.scrollLeft) {
            return document.documentElement.scrollLeft;
        }
        if (window.pageXOffset) {
            return window.pageXOffset;
        }
        return 0;
    },
    /** Get the visible width in pixels @type Number */
    getVisibleWidth: function() {
        if (Motif.Ui.Devices.Screen.getScrollLeft() == 0) {
            return Motif.Ui.Devices.Screen.getTotalWidth();
        }
        return document.documentElement.clientWidth;
    },
    /** Get the visible height in pixels @type Number */
    getVisibleHeight: function() {
        if (Motif.Ui.Devices.Screen.getScrollTop() == 0) {
            return Motif.Ui.Devices.Screen.getTotalHeight();
        }
        return document.documentElement.clientHeight;
    },
    _getBodyWidth: function() {
        return document.body.clientWidth;
    },
    _getBodyHeight: function() {
        return document.body.clientHeight;
    },
    _getDocumentWidth: function() {
        return document.documentElement.clientWidth;
    },
    _getDocumentHeight: function() {
        return document.documentElement.clientHeight;
    },
    /** Get the total width in pixels @type Number */
    getTotalWidth: function() {
        var bw = this._getBodyWidth();
        var dw = this._getDocumentWidth();
        return bw > dw ? bw : dw;
    },
    /** Get the total width in pixels @type Number */
    getTotalHeight: function() {
        var bh = this._getBodyHeight();
        var dh = this._getDocumentHeight();
        return bh > dh ? bh : dh;
    },
    /** Get the center of the total page size @type Motif.Drawing.Point */
    getTotalCenter: function() {
        var rect = Motif.Ui.Devices.Screen.getTotalRectangle();
        return rect.getCenter();
    },
    /** Get the center of the visible page size @type Motif.Drawing.Point */
    getVisibleCenter: function() {
        var rect = Motif.Ui.Devices.Screen.getVisibleRectangle();
        return rect.getCenter();
    },
    /** Get a rectangle of the total page @type Motif.Drawing.Rectangle */
    getTotalRectangle: function() {
        return new Motif.Drawing.Rectangle({
            x: 0,
            y: 0,
            w: Motif.Ui.Devices.Screen.getTotalWidth(),
            h: Motif.Ui.Devices.Screen.getTotalHeight()
        });
    },
    /** Get a rectangle of the visible page @type Motif.Drawing.Rectangle */
    getVisibleRectangle: function() {
        return new Motif.Drawing.Rectangle({
            x: Motif.Ui.Devices.Screen.getScrollLeft(),
            y: Motif.Ui.Devices.Screen.getScrollTop(),
            w: Motif.Ui.Devices.Screen.getVisibleWidth(),
            h: Motif.Ui.Devices.Screen.getVisibleHeight()
        });
    }
};

Motif.Ui.Devices.ScreenTracker = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Ui.Devices.ScreenTracker");

    this.scrollX = 0;
    this.scrollY = 0;
    this.w = 0;
    this.h = 0;
    this.isTracking = false;

    this.start = function ScreenTracker_start() {
        this.fireEvent("onbeforestart");

        Motif.Ui.Devices.Screen.register(this);
        this.isTracking = true;

        this.fireEvent("onstart");

    };

    this.stop = function ScreenTracker_stop() {
        if (this.isTracking === false) {
            return;
        }
        this.fireEvent("onbeforestop");

        Motif.Ui.Devices.Screen.unregister(this);
        this.isTracking = false;

        this.fireEvent("onstop");

    };

    this.resize = function ScreenTracker_resize(w, h) {
        if (w === this.w && h === this.h) {
            return;
        }
        this.fireEvent("onbeforeresize", [this.w, this.h, w, h]);

        this.w = w;
        this.h = h;

        this.fireEvent("onresize", [this.w, this.h]);
    };

    this.scroll = function ScreenTracker_scroll(x, y) {
        if (x === this.scrollX && y === this.scrollY) {
            return;
        }
        this.fireEvent("onbeforerescroll", [this.scrollX, this.scrollY, x, y]);

        this.scrollX = x;
        this.scrollY = y;

        this.fireEvent("onscroll", [this.scrollX, this.scrollY]);
    };

    this.onbeforestart = function() {};
    this.onstart = function() {};

    this.onbeforestop = function() {};
    this.onstop = function() {};

    this.onbeforeresize = function(oldW, oldH, newW, newH) {};
    this.onresize = function(w, h) {};

    this.onbeforescroll = function(oldX, oldY, newX, newY) {};
    this.onscroll = function(x, y) {};

    /** @ignore */
    this.main = function ScreenTracker_main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};