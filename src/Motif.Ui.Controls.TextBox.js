Motif.Page.include("Motif.Ui.Controls.InputBoxIp4.js");
/** 
 * Textbox input type
 * @constructor
 * @base Motif.Ui.Controls.InputBoxIp4
 * @requires Motif.Ui.Utility
 * @author Rayraegah
 */
Motif.Ui.Controls.TextBox = function(config) {
    /** @ignore */
    this.inheritFrom = Motif.Ui.Controls.InputBoxIp4;
    this.inheritFrom();
    this.__class.push("Motif.Ui.Controls.TextBox");

    /** Get the current carret position @type Number */
    this.getCarretPosition = function() {
        return Motif.Ui.Utility.getCarretPosition(this.element);
    };

    /** Internal event handler for onconfigure */
    this._configureTextBox = function(config) {

    };

    /** Internal event handler for onload events */
    this._loadTextBox = function(element) {
        Motif.Page.log.write("Motif.Ui.Controls.TextBox._loadTextBox: Loading from page.");
        if (element.nodeName.toLowerCase() != "input") {
            Motif.Page.log.write("Motif.Ui.Controls.TextBox._loadTextBox: Wrong element type, replacing element.");
            var newElement = document.createElement("input");
            Motif.Ui.Utility.copyAttributes(element, newElement);
            element.parentNode.replaceChild(newElement, element)
            this.setElement(newElement);
        }
        if (!this.element.type || this.element.type.toLowerCase() != "text") {
            this.element.type = "text";
        }
    };

    /** @ignore */
    this.main = function(config) {
        this.attachEvent("onconfigure", this._configureTextBox);
        this.attachEvent("onload", this._loadTextBox);
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
}