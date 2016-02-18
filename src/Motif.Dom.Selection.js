/** 
 * Selection wrapper for crossbrowser usage. Loads a selection object from a window object.
 * @requires Motif.BrowserInfo
 * @requires Motif.Object
 * @extends Motif.Object
 * @constructor
 * @author Rayraegah
 */
Motif.Dom.Selection = function(win) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Dom.Selection");

    /** Selection type, 'text' or 'control' @type String */
    this.type = null;
    /** Selected element @type HTMLElement */
    this.element = null;
    /** Reference to a window object of which the selection is active @type Window */
    this._window = null;
    /** Reference to the original selection */
    this._selection = null;

    /** Load object with specified window */
    this.load = function(win) {
        this._window = win;
        if (Motif.BrowserInfo.internetExplorer)
            this._loadExplorer();
        else
            this._loadGecko();
    };

    /** Reload the values */
    this.reload = function() {
        this.load(this._window);
    };

    /** Internal method for loading from Internet Explorer browsers */
    this._loadExplorer = function() {
        Motif.Page.log.write("Motif.Dom.Selection.loadExplorer: Starting explorer loading.");
        this.element = null;
        this.type = null;
        this.selection = null;
        var range = null;

        try {
            this.selection = this._window.document.selection;
            range = this.selection.createRange();
        } catch (x) {
            Motif.Page.log.write("Motif.Dom.Selection.loadExplorer: Failed to create range from selection.\r\n" + x.description);
            return;
        }
        if (this.selection) {
            this.type = this.selection.type.toLowerCase();
            Motif.Page.log.write("Motif.Dom.Selection.loadExplorer: Selection set, type determined '" + this.type + "'.");

            if (this.type == "control" && range && range.item) {
                Motif.Page.log.write("Motif.Dom.Selection.loadExporer: Type 'control using range.item(0) for element.");
                this.element = range.item(0);
            } else {
                Motif.Page.log.write("Motif.Dom.Selection.loadExplorer: Type 'text' using parentElement() for element.");
                this.element = range.parentElement();
            }
        }
    };

    /** Internal method for loading from Gecko browsers */
    this._loadGecko = function() {
        Motif.Page.log.write("Motif.Dom.Selection.loadGecko: Starting gecko loading.");
        this.selection = this._window.getSelection();
        this.type = null;
        this.element = null;
        if (this.selection && this.selection.rangeCount == 1) {
            Motif.Page.log.write("Motif.Dom.Selection.loadGecko: Selection and rangeCount.");
            //set type and element by first range
            var range = this.selection.getRangeAt(0);
            if (range.startContainer == range.endContainer && (range.endOffset - range.startOffset) == 1) {
                Motif.Page.log.write("Motif.Dom.Selection.loadGecko: Type 'control' determined, getting element from anchorNode.");
                this.type = "control";
                this.element = this.selection.anchorNode.childNodes[this.selection.anchorOffset];
            } else {
                Motif.Page.log.write("Motif.Dom.Selection.loadGecko: Type 'text' determined getting parent from anchorNode.");
                this.type = "text";
                var node = this.selection.anchorNode;
                while (node && node.nodeType != 1) {
                    node = node.parentNode;
                }
                this.element = node;
            }
        }
    };

    /** @ignore */
    this.main = function(win) {
        if (win) {
            this.load(win);
        }
    };
    this.main(win);
};