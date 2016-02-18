Motif.Page.include("Motif.Ui.Controls.Control.js");

/** 
 * Titlebar for form objects
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Form
 */
Motif.Ui.Controls.FormTitleBar = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.FormTitleBar");

    /** Title element @type HTMLSpan */
    this.title = null;
    /** Icon element @type HTMLImg */
    this.icon = null;
    /** Minimize button element @type HTMLImg */
    this.min = null;
    /** Maximize button element @type HTMLImg */
    this.max = null;
    /** Exit buttin element @type HTMLImg */
    this.exit = null;

    /** Load the properties from an element source */
    this.load = function(element) {
        this._removeEvents();

        if (element.parentNode != null) {
            element.parentNode.removeChild(element);
        }

        var icons = {
            icon: this.icon,
            min: this.min,
            max: this.max,
            exit: this.exit
        };
        for (e in icons) {
            var img = Motif.Dom.Utility.getChildElements(element, "img", e)[0];
            if (img) {
                icons[e].parentNode.replaceChild(img, icons[e]);
                img.style.cursor = "default";
                this[e] = img;
            }
        }
        var title = Motif.Dom.Utility.getElementsByClassName(element, "title")[0];
        if (title) {
            this.title.innerHTML = title.innerHTML;
        }
        this._addEvents();
    };

    /** Configure this object */
    this.configure = function FormTitleBar$configure(config) {
        if (config && config.element) {
            config.element = null;
        }
        config = this.Motif$Ui$Controls$Control.configure(config);

        Motif.Page.log.write("Motif.Ui.Controls.FormTitleBar.configure: Setting the formtitlebar specific items from config.");

        if (!Motif.Type.isUndefined(config.icon)) {
            this.icon.style.display = "inline";
            this.icon.src = config.icon;
        }
        if (!Motif.Type.isUndefined(config.min)) {
            this.min.style.display = "inline";
            this.min.src = config.min;
        }
        if (!Motif.Type.isUndefined(config.max)) {
            this.max.style.display = "inline";
            this.max.src = config.max;
        }
        if (!Motif.Type.isUndefined(config.exit)) {
            this.exit.style.display = "inline";
            this.exit.src = config.exit;
        }
        if (!Motif.Type.isUndefined(config.title)) {
            this.title.innerHTML = config.title;
        }
    };

    /** Add events to the button elements */
    this._addEvents = function() {
        if (!this._eventMin) {
            this._eventMin = new Function(this.referenceString() + ".fireEvent(\"onmin\");");
            this._eventMax = new Function(this.referenceString() + ".fireEvent(\"onmax\");");
            this._eventExit = new Function(this.referenceString() + ".fireEvent(\"onexit\");");
            this._eventReturn = function(e) {
                e = e || event;
                e.cancelBubble = true;
                return true;
            };
        }

        Motif.Utility.attachEvent(this.min, "onclick", this._eventMin);
        Motif.Utility.attachEvent(this.max, "onclick", this._eventMax);
        Motif.Utility.attachEvent(this.exit, "onclick", this._eventExit);

        Motif.Utility.attachEvent(this.min, "onmousedown", this._eventReturn);
        Motif.Utility.attachEvent(this.max, "onmousedown", this._eventReturn);
        Motif.Utility.attachEvent(this.exit, "onmousedown", this._eventReturn);
    };

    /** Remove the events from the button objects */
    this._removeEvents = function() {
        if (!this._eventMin) {
            return;
        }

        Motif.Utility.detachEvent(this.min, "onclick", this._eventMin);
        Motif.Utility.detachEvent(this.max, "onclick", this._eventMax);
        Motif.Utility.detachEvent(this.exit, "onclick", this._eventExit);

        Motif.Utility.detachEvent(this.min, "onmousedown", this._eventReturn);
        Motif.Utility.detachEvent(this.max, "onmousedown", this._eventReturn);
        Motif.Utility.detachEvent(this.exit, "onmousedown", this._eventReturn);
    };

    /** Event fired when minimize button is clicked */
    this.onmin = function() {};
    /** Event fired when maximize button is clicked */
    this.onmax = function() {};
    /** Event fired when exit button is clicked */
    this.onexit = function() {};

    /** @ignore */
    this.main = function FormTitleBar_main(config) {
        this.element = document.createElement("table");
        var tbody = this.element.appendChild(document.createElement("tbody"));
        var tr = tbody.appendChild(document.createElement("tr"));
        this._td1 = tr.appendChild(document.createElement("td"));
        this._td2 = tr.appendChild(document.createElement("td"));

        this.element.className = this.getCssClassName();
        this.element.cellSpacing = 0;
        this.element.cellPadding = 0;
        this._td1.className = "Title";
        this._td2.className = "ControlBox";

        this.icon = this._td1.appendChild(document.createElement("img"));
        this.title = this._td1.appendChild(document.createElement("span"));
        this.min = this._td2.appendChild(document.createElement("img"));
        this.max = this._td2.appendChild(document.createElement("img"));
        this.exit = this._td2.appendChild(document.createElement("img"));

        this.icon.style.cssText = "display:none;";
        this.min.style.cssText = "display:none; cursor:default;";
        this.max.style.cssText = "display:none; cursor:default;";
        this.exit.style.cssText = "display:none; cursor:default;";

        this._addEvents();

        this.configure(config);
    };
    this.main(config);
};