Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Ui.Utility.js");

/**
 * The progressbar control displays a progress status
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.ProgressbarType
 * @requires Motif.Ui.Utility
 * @author Rayraegah
 */
Motif.Ui.Controls.Progressbar = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.Progressbar");

    this.progressbarType = Motif.Ui.Controls.ProgressbarType.Horizontal;
    this.value = 0;
    this.innerElement = null;

    /** Set the value in percentage for this control */
    this.setValue = function(percentage) {
        if (typeof percentage == "undefined") {
            return;
        }
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            throw new Error("Motif.Ui.Controls.Progressbar.setValue: Incorrect parameter specified, parameter='" + percentage + "'.");
        }

        percentage = parseInt(percentage);
        if (percentage === this.value) {
            return;
        }

        this.fireEvent("onbeforechange", [percentage, this.value]);
        this.value = percentage;

        this._setInnerDimensions();

        this.fireEvent("onchange", [percentage]);
    };

    /** Get the value of this control @type Number */
    this.getValue = function() {
        return this.value;
    };

    /** Set the progress bar type */
    this.setProgressbarType = function(type) {
        var isType = false;
        for (e in Motif.Ui.Controls.ProgressbarType) {
            if (Motif.Ui.Controls.ProgressbarType[e] === type) {
                isType = true;
                break;
            }
        }

        if (isType === false) {
            throw new Error("Motif.Ui.Controls.Progressbar.setProgressbarType: Incorrect parameter specified.");
        }
        if (type === this.progressbarType) {
            return;
        }

        this.fireEvent("onbeforetypechange", [type, this.progressbarType]);
        this.progressbarType = type;

        this._setInnerDimensions();

        this.fireEvent("ontypechange", [this.progressbarType]);
    };

    /** Get the progressbar type @type Motif.Ui.Controls.ProgressbarType */
    this.getProgressbarType = function() {
        return this.progressbarType;
    };

    /** Set the dimensions for the inner element */
    this._setInnerDimensions = function() {
        var rect = Motif.Ui.Utility.getRectangle(this.element);
        if (this.progressbarType === Motif.Ui.Controls.ProgressbarType.Vertical) {
            var h = (rect.h / 100) * this.value;
            this.innerElement.style.cssText = [
                "",
                "width:100%",
                "margin-top:" + (rect.h - h).toString() + "px",
                "height:" + h
                .toString() + "px"
            ].join(";");
        } else {
            this.innerElement.style.cssText = [
                "",
                "height:100%",
                "width:" + ((rect.w / 100) * this.value)
                .toString() + "px"
            ].join(";");
        }
    };

    /** Set the element for this control and add the innerElement to it */
    this.setElement = function(element) {
        this.Motif$Ui$Controls$Control.setElement(element);
        this.element.appendChild(this.innerElement);
    };

    /** Load the progressbar, removes all child nodes and adds them to the inner element */
    this.load = function(element) {
        while (element.childNodes.length > 0) {
            this.innerElement.appendChild(element.removeChild(element.childNodes[0]));
        }
        this.Motif$Ui$Controls$Control.load(element);
    };

    /** Configure this control */
    this.configure = function(config) {
        Motif.Page.log.write("Motif.Ui.Controls.Progressbar.configure: Configuring progressbar.");
        config = this.Motif$Object.configure(config);
        if (typeof config.value != "undefined") {
            this.setValue(config.value);
        }
        if (typeof config.type != "undefined") {
            this.setProgressbarType(config.type);
        }
    };

    /** @ignore */
    this.main = function(config) {
        this.innerElement = document.createElement("div");
        this.innerElement.className = "Inner";

    };
    this.main(config);
};

/**
 * Progressbar type enumeration
 * @singleton
 * @author Rayraegah
 */
Motif.Ui.Controls.ProgressbarType = {
    /** Horizontal type, indicates a horizontal progressbar @type Number */
    Horizontal: 0,

    /** Vertical type, indicates a vertical progressbar @type Number */

    Vertical: 1
};