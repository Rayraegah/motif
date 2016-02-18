/**
 * Base class for animations, supplies animation essentials
 * @extends Motif.Object
 * @requires Motif.Object
 * @constructor
 * @author Rayraegah
 */
Motif.Ui.Animations.Base = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Ui.Animations.Base");

    /** Timer reference for recursive stepping @type Number */
    this._timeout = null;

    /** Element to which this animation is applied @type HTMLElement */
    this.element = null;
    /** Current status percentage 0-100 @type Number */
    this.status = 0;
    /** Indication whether the animation is playing or not @type Boolean */
    this.isPlaying = false;
    /** Indication whether the animation is paused or not @type Boolean */
    this.isPaused = false;
    /** Current step of the animation @type Number */
    this.current = 0;
    /** Stepsize, negative for reversed animations @type Number */
    this.increment = 1;
    /** Amount of milliseconds to step interval @type Number */
    this.interval = 10;
    /** Period of time in milliseconds which the animation runs @type Number */
    this.duration = 600;
    /** Step count, based on interval and duration @type Number */
    this.count = 60;

    /** Begin value, to override in derived classes @type Object */
    this.begin = null;
    /** End value, to override in derived classes  @type Object */
    this.end = null;
    /** Active value, to override in derived classes  @type Object */
    this.active = null;

    /** Set the element on which the animation is applied */
    this.setElement = function(element) {
        this.fireEvent("onbeforesetelement", [element]);
        this.element = element;
        this.fireEvent("onsetelement", [element]);
    };

    /** Play the animation */
    this.play = function() {
        this._timeout = window.setTimeout(this.referenceString() + "._step()", this.interval);
        this.isPlaying = true;
        this.fireEvent("onplay");
    };

    /** Pause the animation */
    this.pause = function() {
        window.clearTimeout(this._timeout);
        this.isPlaying = false;
        this.isPaused = true;
        this.fireEvent("onpause");
    };

    /** Stop the animation, this will also reset the animation */
    this.stop = function() {
        window.clearTimeout(this._timeout);
        this.isPlaying = this.isPaused = false;
        this.reset();
        this.fireEvent("onstop");
    };

    /** Reverse the animation */
    this.reverse = function() {
        this.increment *= -1;
        this.fireEvent("onreverse");
    };

    /** Set the status to 0 */
    this.reset = function() {
        this.setStatus(0);
    };

    /** Set the status for the animation */
    this.setStatus = function(percentage) {
        if (isNaN(percentage)) {
            return;
        }
        this.status = parseInt(percentage);
        this.status = this.status > 100 ? 100 : this.status < 0 ? 0 : this.status;
        this.count = Math.round(this.duration / this.interval);
        this.setCurrent(Math.round((this.count / 100) * this.status));
    };

    /** Set the current animation step */
    this.setCurrent = function(step) {
        if (this.current == step) {
            return;
        }
        this.current = step;
        this.status = Math.round(this.current / (this.count / 100));
        this.status = this.status > 100 ? 100 : this.status < 0 ? 0 : this.status;
        this.fireEvent("onstep");
    };

    /** Internal method which executes a step of the animation */
    this._step = function() {
        this.count = Math.round(this.duration / this.interval);
        if ((this.current > this.count && this.increment > 0) || (this.current < 0 && this.increment < 0)) {
            this.isPlaying = false;
            this.fireEvent("oncomplete");
            return;
        }
        this.setCurrent(this.current + this.increment);
        this._timeout = window.setTimeout(this.referenceString() + "._step()", this.interval);
    };

    /** Configure the animation, expects configuration object with one of the following properties {duration, interval, increment, element, current, status} */
    this.configure = function(config) {
        config = this.Motif$Object.configure(config);
        if (Motif.Type.isNumber(config.duration)) {
            this.duration = config.duration;
        }
        if (Motif.Type.isNumber(config.interval)) {
            this.interval = config.interval;
        }
        if (Motif.Type.isNumber(config.increment)) {
            this.increment = config.increment;
        }
        if (Motif.Type.isElement(config.element)) {
            this.setElement(config.element);
        }
        if (Motif.Type.isNumber(config.current)) {
            this.setCurrent(config.current);
        }
        if (Motif.Type.isNumber(config.status)) {
            this.setStatus(config.status);
        }
        return config;
    };

    /** Convert the animation's properties to a string */
    this.toString = function() {
        return "current=" + this.current.toString() + ", status=" + this.status.toString() + ", increment=" + this.increment.toString() + ", interval=" + this.interval.toString() + ", duration=" + this.duration.toString() + ", count=" + this.count.toString();
    };

    /** Event fired before the animation element is set */
    this.onbeforesetelement = function(element) {};
    /** Event fired when the animation element is set */
    this.onsetelement = function(element) {};
    /** Event fired when the animation is paused */
    this.onpause = function() {};
    /** Event fired when the animation starts playing */
    this.onplay = function() {};
    /** Event fired when the animation is stopped */
    this.onstop = function() {};
    /** Event fired when the animation completed */
    this.oncomplete = function() {};
    /** Event fired when the animation is reversed */
    this.onreverse = function() {};
    /** Event fired when an animation step occurs */
    this.onstep = function() {};

    /** @ignore */
    this.main = function(config) {
        this.configure(config);
    };
    this.main(config);
};