Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Collections.List.js");

/**
 * Display child controls in a sliding manor.
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Collections.List
 * @author Rayraegah
 */
Motif.Ui.Controls.SlideShow = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.SlideShow");

    /** Internal object for event handler references @type Object */
    this._handlers = {};
    /** Internal reference to a timer object which enables playing @type Number */
    this._timer = null;

    /** Indication whether this slideshow loops @type Boolean */
    this.loop = false;
    /** Duration in milliseconds to display an item when playing, default is 3000 @type Number */
    this.duration = 3000;
    /** Current item index @type Number */
    this.current = -1;
    /** Indication whether to show the first item @type Boolean */
    this.showfirst = true;
    /** Indication whether to hide the last item @type Boolean */
    this.hidelast = false;
    /** Indication whether the control is playing or not @type Boolean */
    this.isPlaying = false;

    /** List of control @type Motif.Collections.List */
    this.items = new Motif.Collections.List();

    /** Add a control to the slideshow @type Motif.Ui.Controls.Control */
    this.add = function SlideShow_add(control) {
        control.hide(true);
        control.attachEvent("onhide", this._handlers.onhide);
        this.items.add(control);
        return control;
    };

    /** Remove a control from the slideshow @type Motif.Ui.Controls.Control */
    this.remove = function SlideShow_remove(index) {
        var ret = this.items.remove(index);
        ret.attachEvent("onhide", this._handlers.onhide);
        ret.close();
        return ret;
    };

    /** Remove all controls from the slideshow @type Motif.Ui.Controls.Control[] */
    this.removeAll = function SlideShow_removeAll() {
        var ret = this.items.removeAll();
        for (e in ret) {
            control.detachEvent("onhide", this._handlers.onhide);
            ret[e].close();
        }
        return ret;
    };

    /** Set the current item by index */
    this.setCurrent = function SlideShow_setCurrent(index) {
        Motif.Page.log.write("Motif.Ui.Controls.SlideShow.setCurrent: Setting the current to '" + index + "'.");
        var item = this.items.getItem(index, null);
        if (item == null) {
            throw new Error("Motif.Ui.Controls.SlideShow.setCurrent: Index out of range.");
        }
        this.fireEvent("onbeforechange", [this.current, index]);

        var current = this.getCurrent();

        this.current = index;
        if (current != null) {
            current.hide();
        } else {
            current = this.getCurrent();
            if (current != null) {
                current.show();
            }
        }

        this.fireEvent("onchange", [this.current]);
    };

    /** Get the current item */
    this.getCurrent = function SlidShow_getCurrent() {
        return this.items.getItem(this.current, null);
    };

    /** Start playing all items in order with optional duration */
    this.play = function SlidShow_play(duration) {
        this.duration = duration || this.duration
        if (this.isPlaying === true) {
            return;
        }
        this.fireEvent("onplaystart");
        this._doPlay();
        return this;
    };

    /** Internal method to display next item after a certain timeout */
    this._doPlay = function SlidShow__doPlay() {
        var index = this.current + 1;
        if (index > this.items.count - 1) {
            index = this.loop === true ? 0 : -1;
        }
        if (index != -1) {
            this.setCurrent(index);
            this._timer = setTimeout(this.referenceString() + "._doPlay();", this.duration);
            this.fireEvent("onplaynext");
        } else {
            this.fireEvent("onplayend");
        }
    };

    /** Pause playback of items */
    this.pause = function SlidShow_pause() {
        this.isPlaying = false;
        clearTimeout(this._timer);
        this._timer = null;
    };

    /** Stop playback of items */
    this.stop = function SlidShow_stop() {
        if (this.isPlaying === false) {
            return;
        }
        this.isPlaying = false;
        clearTimeout(this._timer);
        this._timer = null;
        this.reset();
    };

    /** Show next item in line @type Motif.Ui.Controls.SlideShow */
    this.next = function SlidShow_next() {
        var index = this.current + 1;
        if (index > this.items.count - 1) {
            index = this.loop === true ? 0 : this.items.count - 1;
        }
        this.setCurrent(index);
        return this;
    };

    /** Show previous item in line @type Motif.Ui.Controls.SlideShow */
    this.previous = function SlidShow_previous() {
        var index = this.current - 1;
        if (index < 0) {
            index = this.loop === true ? this.items.count - 1 : 0;
        }
        this.setCurrent(index);
        return this;
    };

    /** Toggle loop and returns itself @type Motif.Ui.Controls.SlideShow */
    this.toggleLoop = function SlidShow_toggleLoop() {
        this.loop = this.loop !== true;
        return this;
    };

    /** Reverse the sliding order @type Motif.Ui.Controls.SlideShow */
    this.reverse = function SlidShow_reverse() {
        this.items.reverse();
        return this;
    };

    /** Reset the slideshow */
    this.reset = function SlidShow_reset() {
        var current = this.getCurrent();
        var first = this.items.getItem(0, null);
        if (current != null) {
            current.detachEvent("onhide", this._handlers.onhide);
            current.hide(true);
            current.attachEvent("onhide", this._handlers.onhide);
        }
        if (this.showfirst === true && first != null) {
            first.show(true);
        }
        this.current = 0;
    };

    /** Configure the slideshow control @type Object */
    this.configure = function SlideShow_configure(config) {
        Motif.Page.log.write("Motif.Ui.Controls.MenuItem.configure: Configuring menu item.");
        config = this.Motif$Object.configure(config);

        if (config.showfirst === true) {
            this.setCurrent(0);
        }
        if (Motif.Type.isBoolean(config.loop)) {
            this.loop = config.loop;
        }
        if (Motif.Type.isBoolean(config.hidelast)) {
            this.hidelast = config.hidelast
        }
        if (Motif.Type.isNumber(config.duration)) {
            this.duration = config.duration
        }
        if (Motif.Type.isBoolean(config.autoplay)) {
            this.play();
        }

        return config;
    };

    /** Loads the control without configuring, which is done after the childnodes are loaded. */
    this.load = function SlideShow_load(element) {
        element = this.Motif$Ui$Controls$Control.load(element, false);
        return element;
    };

    /** Event handler for onloadtree events which adds the child controls and configures the control */
    this._onloadtree = function SlideShow__onloadtree() {
        var arr = this.getChildControls();
        for (var i = 0; i < arr.length; i++) {
            this.add(arr[i]);
        }

        var config = this.element.getAttribute("config");
        if (config) {
            this.configure(config);
        }
    };

    /** Event handler for control onhide events which is added to every control added to this control */
    this._onhidecontrol = function SlideShow__onhidecontrol() {
        var control = this.getCurrent();
        if (control == null) {
            return;
        }
        control.show();
    };

    /** @ignore */
    this.main = function SlideShow_main(config) {
        if (config) {
            this.configure(config);
        }
        this._handlers.onhide = new Function(this.referenceString() + "._onhidecontrol();");
        this._handlers.onloadtree = new Function(this.referenceString() + "._onloadtree();");
        this.attachEvent("onloadtree", this._handlers.onloadtree);
    };
    this.main(config);
};

/**
 * Slidesow configuration object
 * @constructor
 * @extends Motif.Ui.Controls.ControlConfig
 * @requires Motif.Ui.Controls.ControlConfig
 * @author Rayraegah
 */
Motif.Ui.Controls.SlideShowConfig = function() {
    /** Current index to display @type Number*/
    this.current = -1;
    /** Indication whether to start playing automatically @type Boolean */
    this.autoplay = false;
    /** Display duration of an item when playing @type Number */
    this.duration = 0;
    /** Indication whether to hide the last item @type Boolean */
    this.hidelast = false;
    /** Indication wheter to show the first item @type Boolean */
    this.showfirst = false;
};