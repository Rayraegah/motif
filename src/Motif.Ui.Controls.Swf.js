Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Ui.Utility.js");

/**
 * SWF base object for shockwave flash movies
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Ui.Utility
 * @author Rayraegah
 */
Motif.Ui.Controls.Swf = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.Swf");

    /** Reference to a HTMLObject element for swf @type HTMLObject */
    this.swf = null;
    /** Source of the SWF movie @type String */
    this.src = "";
    /** Parameters object, name value pairs which can will be added to the HTMLObject @type Object */
    this.parameters = {};
    /** Flashvars object, name value pairs which can be obtained with the getFlashVars method @type Object */
    this.flashvars = {};

    /** Get the flashvars as string @type String */
    this.getFlashVars = function Swf_getFlashVars() {
        var ret = [];
        for (e in this.flashvars) {
            if (this.flashvars[e] == Object.prototype[e]) {
                continue;
            }
            ret.push(e + "=" + this.flashvars[e]);
        }
        var vars = ret.join("&");
        Motif.Page.log.write("Motif.Ui.Controls.Swf.getFlashVars: Flashvars from object:'" + vars + "'");
        return vars;
    };

    /** Internal method which appends the HTMLObject to the control's element */
    this._appendSwf = function Swf__appendSwf() {
        if (this.swf == null) {
            Motif.Page.log.write("Motif.Ui.Controls.Swf._appendSwf: A new SWF object has been created.");
            this.parameters.flashvars = this.getFlashVars();
            this.parameters.src = this.src;
            this.swf = Motif.Ui.Utility.createSwfObject({
                width: "100%",
                height: "100%"
            }, this.parameters);
        }
        this.element.appendChild(this.swf);
    };

    /** Open the SWF object */
    this.open = function Swf_open(parent) {
        this.Motif$Ui$Controls$Control.open(parent);
        this._appendSwf();
    };

    /** Load the SWF object */
    this.load = function Swf_load(element) {
        this.Motif$Ui$Controls$Control.load(element);
        this._appendSwf();
        return null;
    };

    /** Set the flash movie propertie */
    this.setSrc = function Swf_setSrc(src) {
        if (this.src === src) {
            return;
        }
        this.src = src;
        Motif.Page.log.write("Motif.Ui.Controls.Swf.setSrc: Setting source to '" + src + "'.");
        if (this.swf != null) {
            this.swf.data = src;
            var param1 = Motif.Dom.Utility.getElementsByAttribute(this.swf, "name", "src")[0];
            var param2 = Motif.Dom.Utility.getElementsByAttribute(this.swf, "name", "movie")[0];
            if (param1) {
                param1.value = src;
            }
            if (param2) {
                param2.value = src;
            }
        }
    };

    /** Configure this SWF control @type Object */
    this.configure = function Swf_configure(config) {
        Motif.Page.log.write("Motif.Ui.Controls.Swf.configure: Setting swf specific items from config.");

        config = this.Motif$Ui$Controls$Control.configure(config);
        if (Motif.Type.isObject(config.flashvars)) {
            for (e in config.flashvars)
                if (config.flashvars != Object.prototype[e])
                    this.flashvars[e] = config.flashvars[e];
        }
        if (typeof config.src != "undefined") {
            this.src = config.src;
        }
        return config;
    };

    /** @ignore */
    this.main = function Swf_main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};

/**
 * SWF control configuration object
 * @constructor
 * @author Rayraegah
 */
Motif.Ui.Controls.SwfConfig = function() {
    /** Flashvars object @type Object */
    this.flashvars = {};
    /** Swf movie source @type String */
    this.src = "";
};