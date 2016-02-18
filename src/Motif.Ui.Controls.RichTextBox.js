Motif.Page.include("Motif.Ui.Controls.WebBrowser.js");
Motif.Page.include("Motif.Ui.Controls.RichTextCommands.js");
Motif.Page.include("Motif.Ui.Xhtml.EmptyElements.js");
Motif.Page.include("Motif.Dom.Selection.js");

/**
 * Editable HTMLIframe element wich can be used to create HTML content by executing markup commands on textselections. 
 * @constructor 
 * @extends Motif.Ui.Controls.WebBrowser
 * @requires Motif.Ui.Controls.WebBrowser
 * @requires Motif.Delegate
 * @requires Motif.Ui.Xhtml.EmptyElements
 * @requires Motif.Dom.Selection
 * @author Rayraegah
 */
Motif.Ui.Controls.RichTextBox = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.WebBrowser");
    this.__class.push("Motif.Ui.Controls.RichTextBox");

    this.textarea = null;
    this.lastSelection = null;

    /** Execute a command on the document */
    this.execute = function RichTextBox_execute(command, param) {
        if (!this.isReady) {
            return;
        }
        if (this.fireEvent("onbeforeexecute", [command, param]) === true) {
            return;
        }

        if (command in Motif.Ui.Controls.RichTextCommands && Motif.Ui.Controls.RichTextCommands[command].parameter === true && typeof param == "undefined") {
            param = prompt();
        }

        var success = false;
        if (command == "ToggleSource") {
            this.toggleSource();
        } else {
            success = this.document.execCommand(command, false, param)
            this.document.body.focus();

        }

        if (success) {
            this.fireEvent("onchange");
            this.fireEvent("onexecute", [command, param]);
        }
    };

    /** Switch from or to source edit */
    this.toggleSource = function RichTextBox_toggleSource() {
        if (this.textarea.style.display == "none") {
            this.iframe.style.display = "none";
            this.textarea.style.display = "block";
            this.textarea.value = this.getXhtml();
        } else {

            this.textarea.style.display = "none";
            this.iframe.style.display = "block";
            this.document.body.innerHTML = this.textarea.value;

        }
    };

    /** Set the element for this object and adds a hidden input to the document */
    this.setElement = function RichTextBox_setElement(element) {
        Motif.Page.log.write("Motif.Ui.Controls.RichTextBox.setElement: Setting the element and invoking enableEdit.");
        this.Motif$Ui$Controls$WebBrowser.setElement(element);
        this.element.appendChild(this.textarea);
        setTimeout(this.referenceString() + ".enableEdit();", 500);
    };

    this._blur = function() {
        this.lastSelection = this.getSelection();
    };

    /** Event fired before execution of a command, might return true to cancel the process */
    this.onbeforeexecute = function(command, param) {
            return false;
        }
        /** Event fired at execution of a command */
    this.onexecute = function(command, param) {};
    /** Event fired when the data changes */
    this.onchange = function() {};
    /** Event fired when the iframe and content is loaded */
    this.onrichtextboxready = function() {};

    /** @ignore */
    this.main = function RichTextBox_main(config) {
        this.textarea = document.createElement("textarea");
        this.textarea.style.border = this.textarea.style.display = "none";
        this.textarea.style.width = this.textarea.style.height = "100%";

        this.attachEvent("onblur", this._blur);

        if (config) {
            this.configure(config);
        }

    };
    this.main(config);
};