Motif.Page.include("Motif.Dom.Utility.js");
Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Ui.Controls.Toolbar.js");
Motif.Page.include("Motif.Ui.Controls.RichTextBox.js");

/**
 * Richtext editor control, enables users to edit HTML wysiwyg style.
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Toolbar
 * @requires Motif.Ui.Controls.RichTextBox
 * @requires Motif.Dom.Utility
 * @author Rayraegah
 */
Motif.Ui.Controls.RichTextEditor = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.RichTextEditor");

    /** Input type for form data @type HTMLInput */
    this.input = null;
    /** Toolbar object for user intraction with the richtextbox @type Motif.Ui.Controls.Toolbar */
    this.toolbar = null;
    /** RichTextBox for displaying the editable HTML @type Motif.Ui.Controls.RichTextbox */
    this.editor = null;

    /** Load this object from an element, calls the richtextbox load method witht he same element and loads the toolbar if defined. */
    this.load = function RichTextEditor_load(element) {
        Motif.Page.log.write("Motif.Ui.Controls.RichTextEditor.load: Loading editor from element.");
        var toolbar = Motif.Dom.Utility.getElementsByAttribute(element, "motifClass", "Motif.Ui.Controls.Toolbar")[0];

        if (toolbar) {
            Motif.Page.log.write("Motif.Ui.Controls.RichTextEditor.load: Loading toolbar from element.");
            element.removeChild(toolbar);
            this.toolbar.load(toolbar);
        }

        Motif.Page.log.write("Motif.Ui.Controls.RichTextEditor.load: Loading richtextbox from element.");
        Motif.Ui.Css.removeClassName(element, "Motif-Ui-Controls-RichTextEditor");
        this.editor.load(element.cloneNode(true));

        var tabindex = element.getAttribute("tabindex");
        if (tabindex) {
            element.removeAttribute("tabindex");
            this.editor.element.tabIndex = tabindex;
        }

        this.Motif$Ui$Controls$Control.load(element);
        return null;
    };

    /** Set the element for the editor and adds the toolbar and richtextbox elements to it. */
    this.setElement = function RichTextEditor_setElement(element) {
        Motif.Page.log.write("Motif.Ui.Controls.RichTextEditor.setElement: Setting the element.");
        this.Motif$Ui$Controls$Control.setElement(element);
        while (this.element.childNodes.length > 0) {
            this.element.removeChild(this.element.childNodes[0]);
        }
        this.element.appendChild(this.toolbar.element);
        this.element.appendChild(this.editor.element);
        this._setEditorHeight();

        if (this.element.parentNode != null) {
            this.input.name = this.element.id;
            this.element.parentNode.insertBefore(this.input, this.element);
        }
    };

    /** Execute a formatting command on the editor */
    this.execute = function RichTextEditor_execute(name, param) {
        this.editor.execute(name, param);
    };

    /** Get the value of the object @type String */
    this.getValue = function RichTextEditor_getValue() {
        return this.editor.getXhtml();
    };

    /** Set a value for this object */
    this.setValue = function RichTextEditor_setValue(value) {
        if (!this.editor.isReady) {
            new Motif.Delegate(this.setValue, [value], this, 250, true);
            return;
        }
        this.document.body.innerHTML = value;
        this.input.value = value;
    };

    /** Method for setting the editor height depending on the height of the toolbar and container height */
    this._setEditorHeight = function RichTextEditor__setEditorHeight() {
        this.editor.setHeight(this.getHeight() - this.toolbar.getHeight());
    };

    /** Event handler for mousedown events from the toolbar, executes the button name as rich text command */
    this._toolbarMousedown = function RichTextEditor__toolbarMousedown(button) {
        this.editor.execute(button.getName());
    };

    /** Event handler for mouseup events from the toolbar, sets the focus back to the window */
    this._toolbarMouseup = function RichTextEditor__toolbarMousedown(button) {
        this.editor.window.focus();
    };

    /** Internal event handler which copies the element data to the form input */
    this._updateInput = function RichTextBox__updateInput() {
        this.input.value = this.editor.getXhtml();
    };

    /** @ignore */
    this.main = function RichTextEditor_main(config) {
        this.input = document.createElement("input");
        this.input.type = "hidden";

        this.toolbar = new Motif.Ui.Controls.Toolbar();
        this.toolbar.attachEvent("onbuttonmousedown", new Function("button", this.referenceString() + "._toolbarMousedown(button);"));
        this.toolbar.attachEvent("onbuttonmouseup", new Function("button", this.referenceString() + "._toolbarMouseup(button);"));

        this.editor = new Motif.Ui.Controls.RichTextBox();
        this.editor.attachEvent("onblur", new Function(this.referenceString() + "._updateInput();"));
        this.editor.attachEvent("onready", new Function(this.referenceString() + "._updateInput();"));

        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};