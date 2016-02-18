Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Dom.Utility.js");
Motif.Page.include("Motif.Ui.Devices.Mouse.js");

/** 
 * Divided panes with a movable vertical or horizontal handle
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Ui.Dom
 * @requires Motif.Ui.Devices.Mouse
 * @author Rayraegah
 */
Motif.Ui.Controls.SplitPane = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.SplitPane");

    /** List of handlers for internal events @type Object */
    this._handlers = {};

    this._mouseTracker = new Motif.Ui.Devices.MouseTracker();
    /** Split pane type, one of the Motif.Ui.Controls.SplitPaneType enumeration @type Motif.Ui.Controls.SplitPaneType */
    this.splitPaneType = Motif.Ui.Controls.SplitPaneType.Horizontal;
    /** Size of the splitter bar @type Number */
    this.splitterSize = 6;

    /** First pane @type HTMLTd */
    this.firstPane = null;
    /** Second pane @type HTMLTd */
    this.secondPane = null;
    /** Splitter bar @type HTMLTd */
    this.splitter = null;

    /** Set the element for this control */
    this.setElement = function(element) {
        this.Motif$Ui$Controls$Control.setElement(element);
        this._setCells();
    };

    /** Load this splitpane */
    this.load = function SplitPane_load(element) {
        var newElement = this.createElement();
        if (element.parentNode != null) {
            element.parentNode.replaceChild(newElement, element);
        }

        Motif.Ui.Utility.copyAttributes(element, newElement);
        newElement.removeAttribute("motifClass");

        var source = {
            first: Motif.Dom.Utility.getElementsByClassName(element, "First")[0],
            second: Motif.Dom.Utility.getElementsByClassName(element, "Second")[0]
        }
        var target = {
            first: Motif.Dom.Utility.getElementsByClassName(newElement, "First")[0],
            second: Motif.Dom.Utility.getElementsByClassName(newElement, "Second")[0]
        }

        if (source.first) {
            Motif.Ui.Utility.copyAttributes(source.first, target.first);
            for (var i = 0; i < source.first.childNodes.length; i++)
                target.first.appendChild(source.first.childNodes[i]);
        }
        if (source.second) {
            Motif.Ui.Utility.copyAttributes(source.second, target.second);
            for (var i = 0; i < source.second.childNodes.length; i++)
                target.second.appendChild(source.second.childNodes[i]);
        }
        element = newElement;
        this.Motif$Ui$Controls$Control.load(element);
        return element;
    };

    /** Configure this splitpane */
    this.configure = function(config) {
        config = this.Motif$Ui$Controls$Control
            .configure(config);
        if (config.type === Motif.Ui.Controls.SplitPaneType.Horizontal) {
            this.setSplitPaneType(Motif.Ui.Controls.SplitPaneType.Horizontal);
        }
        if (config.type === Motif.Ui.Controls.SplitPaneType.Vertical) {
            this.setSplitPaneType(Motif.Ui.Controls.SplitPaneType.Vertical);
        }
    };

    /** Create the element for this control */
    this.createElement = function SplitPane_creatElement() {
        var table = document.createElement("table");
        table.cellSpacing = table.cellPadding = 0;

        var tbody = table.appendChild(document.createElement("tbody"));
        var tr = tbody.appendChild(document.createElement("tr"));
        var td = tr.appendChild(document.createElement("td"));
        td.className = "First";

        tr = tbody.appendChild(document.createElement("tr"));
        td = tr.appendChild(document.createElement("td"));
        td.className = "Splitter";

        tr = tbody.appendChild(document.createElement("tr"));
        td = tr.appendChild(document.createElement("td"));
        td.className = "Second";

        return table;
    };

    /** Change the splitter size */
    this.setSplitterSize = function SplitPane_setSplitterSize(size) {
        size = parseInt(size);
        if (isNaN(size)) {
            throw new Error("Motif.Ui.Controls.SplitPane.setSplitterSize: Incorrect parameter specified.");
        }

        if (size === this.splitterSize) {
            return;
        }
        this.fireEvent("onbeforesplittersizechange", [size, this.splitterSize]);

        this.splitterSize = size;
        if (this.splitter) {

            if (this.splitPaneType === Motif.Ui.Controls.SplitPaneType.Horizontal) {
                this.splitter.style.height = this.splitterSize.toString() + "px";
            } else {
                this.splitter.style.width = this.splitterSize.toString() + "px";
            }
        }

        this.fireEvent("onsplittersizechange", [this.splitterSize]);
    };

    /** Set the splitpane type and alters the table accorrding to the new type */
    this.setSplitPaneType = function SplitPane_setSplitPaneType(type) {
        var isType = false;
        for (e in Motif.Ui.Controls.SplitPaneType) {
            if (Motif.Ui.Controls.SplitPaneType[e] === type) {
                isType = true;
                break;
            }
        }
        if (isType === false) {
            throw new Error("Motif.Ui.Controls.SplitPane.setSplitPaneType: Incorrect parameter specified, expected Motif.Ui.Controls.SplitPaneType.");
        }
        if (type === this.splitPaneType) {
            return;
        }

        this.fireEvent("onbeforetypechange", [type, this.splitPaneType]);
        this.splitPaneType = type;

        this._setCells();

        this.fireEvent("ontypechange", [this.splitPaneType]);
    };

    /** Change the element layout according to the splitPaneType property */
    this._setCells = function SplitPane__setCells() {
        if (this.element == null) {
            return;
        }
        var tds = {
            first: Motif.Dom.Utility.getElementsByClassName(this.element, "First")[0],
            splitter: Motif.Dom.Utility.getElementsByClassName(this.element, "Splitter")[0],
            second: Motif.Dom.Utility.getElementsByClassName(this.element, "Second")[0]
        };

        for (e in tds) {
            if (typeof tds[e] == "undefined") {
                return;
            }
        }

        for (e in tds) {
            tds[e] = tds[e].parentNode.removeChild(tds[e]);
        }

        var tbody = Motif.Dom.Utility.getChildElements(this.element, "tbody")[0];
        while (tbody.childNodes.length > 0) {
            tbody.removeChild(tbody.childNodes[0]);
        }

        Motif.Utility.detachEvent(tds.splitter, "onmousedown", this._handlers.mousedownSplitter);
        Motif.Utility.attachEvent(tds.splitter, "onmousedown", this._handlers.mousedownSplitter);
        tds.splitter.ondragstart = tds.splitter.onselectstart = tds.splitter.ondraggesture = function() {
            return false;
        };

        if (this.splitPaneType === Motif.Ui.Controls.SplitPaneType.Horizontal) {
            tds.splitter.style.height = this.splitterSize.toString() + "px";
            tds.splitter.style.cursor = "n-resize";
            for (e in tds) {
                var tr = tbody.appendChild(document.createElement("tr"));
                tr.appendChild(tds[e]);
            }

            var height = {
                total: this.getHeight(),
                splitter: this.splitterSize,
                first: parseInt(Motif.Ui.Css.getCurrentStyle(tds.first, "height")),
                second: parseInt(Motif.Ui.Css.getCurrentStyle(tds.second, "height"))
            };

            if (isNaN(height.first) && isNaN(height.second) || height.first == height.second && height.first + height.second + height.splitter != height.total) {
                height.first = Math.ceil((height.total - height.splitter) / 2);
                height.second = Math.floor((height.total - height.splitter) / 2);
            }

            var total = 0;
            for (e in height) {
                if (isNaN(height[e])) {
                    height[e] = 20;
                    total += height[e];
                }
            }
            if (height.total != total * 2) {
                height.second = height.total - (height.first + height.splitter);
            }
            tds.first.style.height = height.first.toString() + "px";
            tds.second.style.height = height.second.toString() + "px";

            Motif.Page.log.write("Motif.Ui.Controls.SplitPane._setCells: Setting cell height using: total=" + height.total.toString() + "; first=" + height.first.toString() + "; second=" + height.second.toString() + ";");
        } else {
            tds.splitter.style.width = this.splitterSize.toString() + "px";
            tds.splitter.style.cursor = "e-resize";
            var tr = tbody.appendChild(document.createElement("tr"));
            for (e in tds) {
                tr.appendChild(tds[e]);
            }
            var totalWidth = this.getWidth();
            var firstWidth = parseInt(Motif.Ui.Css.getCurrentStyle(tds.first, "width"));
            var secondWidth = parseInt(Motif.Ui.Css.getCurrentStyle(tds.second, "width"));

            Motif.Page.log.write("Motif.Ui.Controls.SplitPane._setCells: Setting cell width using totalWidth=" + totalWidth.toString() + "; firstPaneWidth=" + firstWidth.toString() + "; secondPaneWidth=" + secondWidth.toString() + ";");

            if (!isNaN(firstWidth) && firstWidth > 0) {
                tds.second.style.width = (totalWidth - firstWidth - this.splitterSize).toString() + "px";
            } else if (!isNaN(secondWidth) && secondWidth > 0) {
                tds.first.style.width = (totalWidth - secondWidth - this.splitterSize).toString() + "px";
            } else {
                tds.first.style.width = Math.ceil((totalWidth - this.splitterSize) / 2).toString() + "px";
                tds.second.style.width = Math.floor((totalWidth - this.splitterSize) / 2).toString() + "px";
            }
        }
        this.firstPane = tds.first;
        this.splitter = tds.splitter;
        this.secondPane = tds.second;
    };

    /** Handler for onmousedown events of the splitter, focus the splitter and attaches the mouse position events */
    this._mousedownSplitter = function(evt) {
        this.splitter.focus();
        this._oldCursor = document.body.style.cursor;
        document.body.style.cursor = this.splitter.style.cursor;
        this._mouseTracker.start(evt);
    }

    /** Handler for the mousepositionchange events, updates the first and second pane with the new dimensions */
    this._mousePositionChange = function(oldx, oldy, newx, newy, diffx, diffy) {

        if (this.splitPaneType === Motif.Ui.Controls.SplitPaneType.Horizontal) {
            var firstHeight = parseInt(this.firstPane.style.height) + diffy;
            var secondHeight = parseInt(this.secondPane.style.height) - diffy;

            if (isNaN(firstHeight) || isNaN(secondHeight) || firstHeight <= 20 || secondHeight <= 20) {
                return;
            }

            this.firstPane.style.height = firstHeight.toString() + "px";
            this.secondPane.style.height = secondHeight.toString() + "px";
        } else {
            var firstWidth = parseInt(Motif.Ui.Css.getCurrentStyle(this.firstPane, "width")) + diffx;
            var secondWidth = parseInt(Motif.Ui.Css.getCurrentStyle(this.secondPane, "width")) - diffx;

            if (isNaN(firstWidth) || isNaN(secondWidth) || firstWidth <= 5 || secondWidth <= 5) {
                return;
            }

            this.firstPane.style.width = firstWidth.toString() + "px";
            this.secondPane.style.width = secondWidth.toString() + "px";
        }
    };

    /** Handler for the mousebuttonchange events, when a mousebutton is released it will detach the mouseposition change event handler */
    this._mouseButtonChange = function() {
        document.body.style.cursor = this._oldCursor;
        this._mouseTracker.stop();
    };

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }
        this._handlers.mousedownSplitter = new Function("e", "e=e||event; " + this.referenceString() + "._mousedownSplitter(e);");
        this._handlers.mouseButtonChange = new Function(this.referenceString() + "._mouseButtonChange();");
        this._handlers.mousePositionChange = new Function("oldx", "oldy", "newx", "newy", "diffx", "diffy", this.referenceString() + "._mousePositionChange(oldx, oldy, newx, newy, diffx, diffy);");

        this._mouseTracker.attachEvent("onpositionchange", this._handlers.mousePositionChange);
        this._mouseTracker.attachEvent("onbuttonchange", this._handlers.mouseButtonChange);

    };
    this.main(config);
};

/** 
 * Split panel type enumeration
 * @singleton
 * @author Rayraegah
 */
Motif.Ui.Controls.SplitPaneType = {
    Horizontal: 0,
    Vertical: 1
};