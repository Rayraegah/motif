Motif.Page.include("Motif.Ui.Controls.Control.js");

/**
 * Control utility
 * @singleton
 * @requires Motif.Ui.Controls.Control
 */
Motif.Ui.Controls.Utility = {
    /** Get controls from the HTMLDocument by element, element.id or pointer @type Motif.Ui.Controls.Control */
    getControl: function(element, controlClass) {
        if (Motif.Type.isNumber(element) && Motif.ObjectRegistry.objects[element]) {
            Motif.Page.log.write("Motif.Controls.Utility.getControl: Found control by pointer.");
            return Motif.ObjectRegistry.objects[element];
        }

        if (Motif.Type.isString(element)) {
            Motif.Page.log.write("Motif.Controls.Utility.getControl: Getting element by id.");
            element = document.getElementById(element);
        }
        if (element == null) {
            throw new Error("Motif.Controls.Utility.getControl: Element not found.");
        }
    

        if (Motif.Type.isElement(element)) {
        Motif.Page.log.write("Motif.Controls.Utility.getControl: Initializing new control with element.");
        if (!Motif.Type.isString(controlClass)) {
            controlClass = "Motif.Ui.Controls.Control";
        }

        var ctl = null;
        try {
            eval("ctl = new " + controlClass());
            }
            catch (x) {
                throw new Error("Motif.Controls.Utility.getControl: Failed initialize class '" + controlClass + "', reason: " + x.description);
            }
            ctl.setElement(element);
            return ctl;
        }
    }
};