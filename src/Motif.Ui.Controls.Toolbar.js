Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Collections.Hashtable.js");
Motif.Page.include("Motif.Ui.Controls.ToolbarButton.js");
Motif.Page.include("Motif.Dom.Utility.js");

/** 
 * A toolbar which can be used to support other controls with user events
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.ToolbarButton
 * @requires Motif.Collections.Hashtable
 * @requires Motif.Dom.Utility
 */
Motif.Ui.Controls.Toolbar = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.Toolbar");

    /** Hastable used to store buttons by name @type Motif.Collections.Hashtable */
    this._table = new Motif.Collections.Hashtable();

    /** Add a button to the toolbar, either a name value pair or Motif.Ui.Controls.ToolbarButton is expected as parameter @type Motif.Ui.Controls.ToolbarButton */
    this.add = function Toolbar_add() {
        var h = this.getHeight() - 2;
        var button = null;
        if (arguments.length == 1 && Motif.Type.isMotifType(arguments[0], "Motif.Ui.Controls.ToolbarButton")) {
            button = arguments[0];
        } else {
            if (arguments.length == 1 && Motif.Type.isElement(arguments[0]))
                button = new Motif.Ui.Controls.ToolbarButton({
                    element: arguments[0]
                });

            if (arguments.length == 1 && typeof arguments[0].name != "undefined")
                button = new Motif.Ui.Controls.ToolbarButton(arguments[0]);

            if (arguments.length == 2)
                button = new Motif.Ui.Controls.ToolbarButton({
                    name: arguments[0],
                    value: arguments[1],
                    width: h,
                    height: h
                });
        }

        Motif.Page.log.write("Motif.Ui.Controls.Toolbar: Added button to toolbar with name '" + button.getName() + "'.");
        this._table.add(button.getName(), button);

        if (this.element !== button.element.parentNode)
            this.element.appendChild(button.element);

        button.attachEvent("onclick", new Function(this.referenceString() + ".fireEvent(\"onbuttonclick\", [this]);"));
        button.attachEvent("onmousedown", new Function(this.referenceString() + ".fireEvent(\"onbuttonmousedown\", [this]);"));
        button.attachEvent("onmouseup", new Function(this.referenceString() + ".fireEvent(\"onbuttonmouseup\", [this]);"));
        return button;
    };

    /** Remove a button from the toolbar @type Motif.Ui.Controls.ToolbarButton */
    this.remove = function Toolbar_remove(name) {
        if (!this._table.containsKey(name)) {
            return null;
        }
        this._table[name].destroy();
        return this._table.remove(name);
    };

    /** Get all buttons from the toolbar in an array @type Motif.Ui.Controls.ToolbarButton[] */
    this.toArray = function() {
        this._table.toArray();
    };

    /** Load the toolbar from an element, tries to add buttons from child elements and prevents the loader from evaluating child nodes */
    this.load = function Toolbar_load(element) {
        var list = Motif.Dom.Utility.getChildElements(element, "div");
        while (element.childNodes.length > 0) {
            element.removeChild(element.childNodes[0]);
        }

        if (element.parentNode != null) {
            Motif.Page.log.write("Motif.Ui.Controls.Toolbar.load: Replacing element with control element.");
            Motif.Ui.Utility.copyAttributes(element, this.element);
            element.parentNode.replaceChild(this.element, element);
        }

        for (var i = 0; i < list.length; i++) {
            this.add(list[i]);
        }
        return null;
    };

    /** Event fired when a toolbar button is clicked */
    this.onbuttonclick = function(button) {};
    /** Event fired when a mouse button is pressed on the toolbar button */
    this.onbuttonmousedown = function(button) {};
    /** Event fired when a mouse button is released on the toolbar button */
    this.onbuttonmouseup = function(button) {};

    /** @ignore */
    this.main = function Toolbar_main(config) {
        if (config) {
            this.configure(config);
        }
        this.create();
    };
    this.main(config);
};