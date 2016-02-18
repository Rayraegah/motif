Motif.Page.include("Motif.Ui.Controls.Control.js");

/** 
 * Tab page represents a page and button used for the TabPane.
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Utility
 * @author Rayraegah
 */
Motif.Ui.Controls.TabPage = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.TabPage");

    /** Button element for the TabPane @type HTMLDiv */
    this.button = null;

    /** Set the title for this page */
    this.setTitle = function(title) {
        this.button.innerHTML = title;
    };

    /** Get title for this page @type String */
    this.getTitle = function() {
        return this.button.innerHTML;
    };

    /** Set the body for this page */
    this.setBody = function(body) {
        this.element.innerHTML = body;
    };

    /** Get body for this page @type String */
    this.getBody = function() {
        return this.element.innerHTML;
    };

    /** Remove this tabpage and it's button from DOM tree if attached */
    this.destroy = function() {
        if (this.element.parentNode != null) {
            this.element.parentNode.removeChild(this.element);
        }
        if (this.button.parentNode != null) {
            this.button.parentNode.removeChild(this.button);
        }
    };

    /** Configure this tabpage */
    this.configure = function(config) {
        Motif.Page.log.write("Motif.Ui.Controls.TabPage.configure: Configuring tabpage.");
        config = this.Motif$Ui$Controls$Control.configure(config);
        if (config.title) {
            this.setTitle(config.title);
        }
        return config;
    };

    /** Set the element for this tabpage and hides it */
    this.setElement = function(element) {
        element.style.display = "none";
        this.Motif$Ui$Controls$Control.setElement(element);
    };

    /** Event fired when the button is clicked */
    this.onbuttonclick = function() {};

    /** @ignore */
    this.main = function(config) {
        this.button = document.createElement("div");
        this.button.className = "Motif-Ui-Controls-TabButton";
        Motif.Utility.attachEvent(this.button, "onclick", new Function(this.referenceString() + ".fireEvent(\"onbuttonclick\");"));

        this.setElement(document.createElement("div"));

        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};