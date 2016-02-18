Motif.Page.include("Motif.Ui.Animations.Base.js");
Motif.Page.include("Motif.Ui.Css.js");

/** 
 * Fade an element animated.
 * @constructor 
 * @extends Motif.Ui.Animations.Base
 * @requires Motif.Ui.Animations.Base
 * @requires Motif.Ui.Css
 * @author Rayraegah
 */
Motif.Ui.Animations.Fade = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Animations.Base");
    this.__class.push("Motif.Ui.Animations.Fade");

    /** Begin opacity @type Number */
    this.begin = 0;
    /** End opacity @type Number */
    this.end = 100;
    /** Active opacity @type Number */
    this.active = 0;

    /** Set current step and change the opacity of the element according to the new status */
    this.setCurrent = function Fade_setCurrent(step) {
        this.Motif$Ui$Animations$Base.setCurrent(step);
        this.active = this.begin - parseInt(((this.begin - this.end) / 100) * this.status);
        Motif.Ui.Css.setOpacity(this.element, this.active);
    };

    /** Configure this fade animation @type Object */
    this.configure = function Fade_configure(config) {
        if (config && Motif.Type.isNumber(config.begin)) {
            this.begin = parseInt(config.begin);
        }
        if (config && Motif.Type.isNumber(config.end)) {
            this.end = parseInt(config.end);
        }
        config = this.Motif$Ui$Animations$Base.configure(config);
        return config;
    };

    /** Get this fade animation as string @type String */
    this.toString = function Fade_toString() {
        return [
            this.Motif$Ui$Animations$Base.toString(),
            "begin=" + this.begin.toString(),
            "end=" + this.end.toString(),
            "active=" + this.active
        ].join(", ");
    };

    /** @ignore */
    this.main = function Fade_main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};