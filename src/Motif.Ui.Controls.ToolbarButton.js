Motif.Page.include("Motif.Ui.Controls.Control.js");

/**
 * Button object for the toolbar
 * @constructor
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Utility
 */
Motif.Ui.Controls.ToolbarButton = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.ToolbarButton");

    /** Set the value for this button */
    this.setValue = function(value) {
        this.fireEvent("onbeforevaluechange", [this.value, value]);
        this.element.innerHTML = value;
        this.fireEvent("onvaluechange", [this.value]);
    };

    /** Get the value of this object @type String */
    this.getValue = function() {
        return this.element.innerHTML;
    };

    /** Set the name for this object */
    this.setName = function(name) {
        this.fireEvent("onbeforenamechange", [this.name, name]);
        this.element.id = name;
        this.fireEvent("onnamechange", [this.name]);
    };

    /** Get the name of this object @type String */
    this.getName = function() {
        return this.element.id;
    };

    /** Remove the element from DOM */
    this.destroy = function() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    };

    /** Set the element for this button */
    this.setElement = function(element) {
        Motif.Page.log.write("Motif.Ui.Controls.ToolbarButton.setElement: Setting toolbar element.");
        this.Motif$Ui$Controls$Control.setElement(element);
        this.element.style.cssText = "float:left";
    };

    /** Configure the toolbarbutton @type Object */
    this.configure = function(config) {
        Motif.Page.log.write("Motif.Ui.Controls.ToolbarButton.configure: Configuring toolbarbutton");
        config = this.Motif$Ui$Controls$Control.configure(config);
        if (config.name) {
            this.setName(config.name);
        }
        if (config.value) {
            this.setValue(config.value);
        }
        return config;
    };

    /** Event fired before the name changes */
    this.onbeforenamechange = function(oldName, newName) {};
    /** Event fired when the name changes */
    this.onnamechange = function(newName) {};
    /** Event fired before the value changes */
    this.onbeforevaluechange = function(oldValue, newValue) {};
    /** Event fired when the value changes */
    this.onvaluechange = function(newValue) {};

    /** @ignore */
    this.main = function(config) {
        if (!config || !config.element) {
            this.setElement(document.createElement("div"));
        }
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};