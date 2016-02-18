/** 
 * The ControlLoader searches the parameter, which defaults to document.body, for elements with a 'motifClass' attribute.
 * This attribute should contain a class string wich will be evaluated to an object. The created object should have 
 * a 'load' method wich is called with the element as parameter. If the element contains an 'id' attribute it is added to the
 * ControlLoader's objects collection.
 * @singleton
 * @author Rayraegah
 */
Motif.Ui.Controls.Loader = {
    /** Collection of object references by id type Object*/
    objects: {},
    /** Load an element recursive for loading, checks the tagName property for motif class */
    load: function Loader_load(startElement) {
        var resume = null;
        var control = null;
        var childElements = [];
        if (typeof startElement == "undefined") {
            startElement = document.body;
            Motif.Page.log.write("Motif.Ui.Controls.Loader.load: Element set to document.body");
        }

        for (var i = 0, len = startElement.childNodes.length; i < len; i++)
            if (startElement.childNodes[i].nodeType == 1)
                childElements.push(startElement.childNodes[i]);

        if (startElement.getAttribute("motifClass") != null) {
            var motifClass = startElement.getAttribute("motifClass");
            startElement.attributes.removeNamedItem("motifClass");

            Motif.Page.log.write("Motif.Ui.Controls.Loader.load: Class resolved as '" + motifClass + ".");

            try {
                eval("control = new " + motifClass + ";");
            } catch (X) {
                throw new Error("Motif.Ui.Controls.Loader.load: Failed to initialize '" + motifClass + "'.\r\n" + X.message);
            }

            resume = control.load(startElement);

            Motif.Page.log.write("Motif.Ui.Controls.Loader.load: Control loaded.");

            if (startElement.getAttribute("id")) {
                this.objects[startElement.getAttribute("id")] = control;
                Motif.Page.log.write("Motif.Ui.Controls.Loader.load: Control added to the oject collection with id '" + startElement.getAttribute("id") + "'.");
            }
            if (Motif.Type.isElement(resume) && resume != startElement) {
                Motif.Page.log.write("Motif.Ui.Controls.Loader.load: Resuming used for loader.");
                startElement = resume;
                childElements = Motif.Ui.Controls.Loader._getChildElements(startElement);

            }
            if (resume === null) {
                Motif.Page.log.write("Motif.Ui.Controls.Loader.load: Aborting tree walk.");
                startElement = null;
            }
        }

        if (startElement != null && childElements.length > 0)
            for (var i = 0; i < childElements.length; i++)
                Motif.Ui.Controls.Loader.load(childElements[i]);

        if (control != null) {
            control.fireEvent("onloadtree");
        }

    },

    _getChildElements: function(element) {
        var ret = [];
        for (var i = 0, len = element.childNodes.length; i < len; i++)
            if (element.childNodes[i].nodeType == 1)
                ret.push(element.childNodes[i]);
    }
};