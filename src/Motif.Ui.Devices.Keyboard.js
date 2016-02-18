/** 
 * Keyboard device, tracks keyboard interaction and fires event delegates. Possible events are onkeydown, onkeychange and onkeyup.
 * @extends Motif.Object
 * @requires Motif.Object
 * @author Rayraegah
 * @singleton 
 */
Motif.Ui.Devices.Keyboard = {
    /** Keycode of last pressed key @type Number */
    lastKey: -1,
    /** Keycode of current pressed key @type Number */
    key: -1,
    /** Indication whether the 'shift' key is pressed @type Number */
    shiftKey: false,
    /** Indication whether the 'alt' key is pressed @type Number */
    altKey: false,
    /** Indication whether the 'ctrl' key is pressed @type Number */
    ctrlKey: false,
    /** List of trackers which receive mouse status changes @type Motif.Ui.Devices.MouseTracker[] */
    trackers: {},
    /** Amount of trackers registered */
    trackerCount: 0,

    /** Add a Keyboard tracker to the receive status changes */
    register: function Keyboard_register(tracker) {
        if (Motif.Ui.Devices.Keyboard.trackerCount == 0) {
            Motif.Ui.Devices.Keyboard._attachEvents();
        }

        var id = "tracker" + tracker.ptr.toString();
        if (id in Motif.Ui.Devices.Keyboard.trackers) {
            return;
        }

        Motif.Ui.Devices.Keyboard.trackers[id] = tracker;
        Motif.Ui.Devices.Keyboard.trackerCount++;
    },

    /** Remove a Keyboard tracker */
    unregister: function Keyboard_unregister(tracker) {

        var id = "tracker" + tracker.ptr.toString();
        if (id in Motif.Ui.Devices.Keyboard.trackers) {
            delete Motif.Ui.Devices.Keyboard.trackers[id];
            Motif.Ui.Devices.Keyboard.trackerCount--;
        } else {
            return;
        }
        if (Motif.Ui.Devices.Keyboard.trackerCount == 0) {
            Motif.Ui.Devices.Keyboard._detachEvents();
        }
    },

    /** Attaches the Keyboard status listeners to the document */
    _attachEvents: function Keyboard__attachEvents() {
        Motif.Page.log.write("Motif.Ui.Devices.Keyboard._attachEvents: Attaching events.");
        Motif.Utility.attachEvent(document, "onkeydown", Motif.Ui.Devices.Mouse._keyDown);
        Motif.Utility.attachEvent(document, "onkeyup", Motif.Ui.Devices.Mouse._keyUp);
    },

    /** Detaches the mouse status listeners from the document */
    _detachEvents: function Keyboard__detachEvents() {
        Motif.Page.log.write("Motif.Ui.Devices.Keyboard._detachEvents: Detaching events.");
        Motif.Utility.detachEvent(document, "onkeydown", Motif.Ui.Devices.Mouse._keyDown);
        Motif.Utility.detachEvent(document, "onkeyup", Motif.Ui.Devices.Mouse._keyUp);
    },

    /** Handler for onkeydown events */
    _keyDown: function(e) {
        e = e || event;
        Motif.Ui.Devices.Keyboard.key = e.keyCode;
        Motif.Ui.Devices.Keyboard.shiftKey = e.shiftKey;
        Motif.Ui.Devices.Keyboard.ctrlKey = e.ctrlKey;
        Motif.Ui.Devices.Keyboard.altKey = e.altKey;

        for (e in Motif.Ui.Devices.Mouse.trackers) {
            Motif.Ui.Devices.Mouse.trackers[e].setKeys(
                Motif.Ui.Devices.Keyboard.key,
                Motif.Ui.Devices.Keyboard.shiftKey,
                Motif.Ui.Devices.Keyboard.ctrlKey,
                Motif.Ui.Devices.Keyboard.altKey
            );
        }

    },

    /** Handler for onkeydown events */
    _keyUp: function(e) {
        e = e || event;
        Motif.Ui.Devices.Keyboard.lastKey = Motif.Ui.Devices.Keyboard.key;
        Motif.Ui.Devices.Keyboard.key = -1;
        Motif.Ui.Devices.Keyboard.shiftKey = e.shiftKey;
        Motif.Ui.Devices.Keyboard.ctrlKey = e.ctrlKey;
        Motif.Ui.Devices.Keyboard.altKey = e.altKey;

        for (e in Motif.Ui.Devices.Mouse.trackers) {
            Motif.Ui.Devices.Mouse.trackers[e].setKeys(
                Motif.Ui.Devices.Keyboard.key,
                Motif.Ui.Devices.Keyboard.shiftKey,
                Motif.Ui.Devices.Keyboard.ctrlKey,
                Motif.Ui.Devices.Keyboard.altKey
            );
        }

    }
};

/** 
 * Keyboard change tracker, tracks keyboard interaction
 * @base Motif.Object 
 * @requires Motif.Object
 * @requires Motif.Ui.Devices.Keyboard
 * @author Rayraegah
 * @constructor 
 */
Motif.Ui.Devices.KeyboardTracker = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Ui.Devices.KeyboardTracker");

    /** Keycode of last pressed key @type Number */
    this.lastKey = -1;
    /** Keycode of current pressed key @type Number */
    this.key = -1;
    /** Indication whether the 'shift' key is pressed @type Number */
    this.shiftKey = false;
    /** Indication whether the 'alt' key is pressed @type Number */
    this.altKey = false;
    /** Indication whether the 'ctrl' key is pressed @type Number */
    this.ctrlKey = false;
    /** Indication whether the tracker is tracking or not @type Boolean */
    this.isTracking = false;

    /** Start tracking mouse interaction, optionally a mouse event can be passed to initialize the tracker properties */
    this.start = function KeyboardTracker_start(evt) {
        if (this.isTracking === true) {
            return;
        }
        if (evt) {
            Motif.Ui.Devices.Mouse.x = this.x = evt.clientX + Motif.Ui.Devices.Screen.getScrollLeft();
            Motif.Ui.Devices.Mouse.y = this.y = evt.clientY + Motif.Ui.Devices.Screen.getScrollTop();
            Motif.Ui.Devices.Mouse.button = this.button = Motif.BrowserInfo.internetExplorer ? Motif.Ui.Devices.Mouse._ieButtons["b" + evt.button.toString()] : evt.button;
        }
        this.fireEvent("onbeforestart");

        Motif.Ui.Devices.Keyboard.register(this);
        this.isTracking = true;

        this.fireEvent("onstart");
    };

    /** Stop tracking */
    this.stop = function KeyboardTracker_stop() {
        if (this.isTracking === false) {
            return;
        }
        this.fireEvent("onbeforestop");

        Motif.Ui.Devices.Keyboard.unregister(this);
        this.isTracking = false;

        this.fireEvent("onstop");
    };

    /** Set the keys for this tracker */
    this.setKeys = function Kyboard_setKeys(key, shiftKey, ctrlKey, altKey) {
        this.fireEvent("onbeforechange", [this.key, key]);
        this.lastKey = this.key;
        this.key = key;
        this.shiftKey = shiftKey;
        this.ctrlKey = ctrlKey;
        this.altKey = altKey;
        this.fireEvent("onchange", [this.key]);
    };

    /** Configures this mousetracker object */
    this.configure = function KeyboardTracker_configure(config) {
        config = this.Motif$Object.configure(config);
        if (Motif.Type.isNumber(config.key)) {
            this.key = config.key;
        }
        if (Motif.Type.isNumber(config.lastKey)) {
            this.lastKey = config.lastKey;
        }
        if (Motif.Type.isBoolean(config.shiftKey)) {
            this.shiftKey = config.shiftKey;
        }
        if (Motif.Type.isBoolean(config.altKey)) {
            this.altKey = config.altKey;
        }
        if (Motif.Type.isBoolean(config.ctrlKey)) {
            this.ctrlKey = config.ctrlKey;
        }
    };

    /** Get the string represtation of current keyboard state */
    this.toString = function Keyboard_toString() {
        return [
            "lastKey=" + this.lastKey,
            "key=" + this.key,
            "shiftKey=" + this.shifKey,
            "altKey=" + this.altKey,
            "ctrlKey=" + this.ctrlKey
        ].join(";") + ";";
    };

    /** Event fired before a key changes */
    this.onbeforechange = function(oldkey, newkey) {};
    /** Event fired when a key changes */
    this.onchange = function(key) {};

    /** @ignore */
    this.main = function KeyboardTracker_main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
}