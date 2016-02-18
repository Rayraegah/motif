Motif.Page.include("Motif.Ui.Animations.Base.js");
Motif.Page.include("Motif.Drawing.Color.js");
Motif.Page.include("Motif.Ui.Css.js");
/** 
 * Transform one color to another
 * @constructor 
 * @extends Motif.Ui.Animations.Base
 * @requires Motif.Drawing.Color
 */
Motif.Ui.Animations.Color = function(config) {
    Motif.Utility.extend(this, "Motif.Ui.Animations.Base");
    /** @ignore */
    this.__class.push("Motif.Ui.Animations.Color");

    /** The source color @type Motif.Drawing.Color */
    this.begin = new Motif.Drawing.Color();
    /** The target color @type Motif.Drawing.Color */
    this.end = new Motif.Drawing.Color();
    /** The active color @type Motif.Drawing.Color */
    this.active = new Motif.Drawing.Color();

    /** The style property of the element which should be transformed, default is 'color' @type String */
    this.style = "color";

    /** Set the current value for this animation, adjusts the current color with start, stop and status */
    this.setCurrent = function Color_setCurrent(step) {
        this.Motif$Ui$Animations$Base.setCurrent(step);
        this.active.r = this.begin.r - parseInt((this.begin.r - this.end.r) / 100 * this.status);
        this.active.g = this.begin.g - parseInt((this.begin.g - this.end.g) / 100 * this.status);
        this.active.b = this.begin.b - parseInt((this.begin.b - this.end.b) / 100 * this.status);
        var styles = this.style.split(",");
        for (var i = 0, len = styles.length; i < len; i++) {
            styles[i] = styles[i] + ":#" + this.active.toHex();
        }

        this.element.style.cssText += ";" + styles.join(";");
    };

    /** Internal configuration handler, binds begin and end color properties to this object */
    this.configure = function(config) {
        config = this.Motif$Ui$Animations$Base.configure(config);
        if (config.style) {
            this.style = config.style;
        }

        if (!config.begin && this.element != null) {
            var style = this.style.split(",")[0];
            this.begin.tryParse(Motif.Ui.Css.getCurrentStyle(this.element, style));
        }

        if (config.begin) {
            if (Motif.Type.isMotifType(config.begin, "Motif.Drawing.Color")) {
                this.begin = config.begin;
            }
            if (Motif.Type.isString(config.begin)) {
                this.begin.tryParse(config.begin);
            }
        }
        if (config.end) {
            if (Motif.Type.isMotifType(config.end, "Motif.Drawing.Color")) {
                this.end = config.end;
            }
            if (Motif.Type.isString(config.end)) {
                this.end.tryParse(config.end);
            }
        }
        Motif.Page.log.write("Motif.Ui.Animations.Color.configure: Object configured with begin:" + this.begin + " and end:" + this.end);
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