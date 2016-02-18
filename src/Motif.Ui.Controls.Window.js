Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Ui.Css.js");
Motif.Page.include("Motif.Ui.Utility.js");
Motif.Page.include("Motif.Ui.Controls.WindowManager.js");
Motif.Page.include("Motif.Ui.Devices.Mouse.js");
Motif.Page.include("Motif.Collections.List.js");
Motif.Page.include("Motif.Dom.Utility.js");
/**
 * The window object is a movable and resizable HTMLTable element.
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Devices.Mouse
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.WindowManager
 * @requires Motif.Ui.Utility
 * @requires Motif.Ui.Css
 */
Motif.Ui.Controls.Window = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.Window");

    /** Object which contains references to the table's tr elements @type Object */
    this._trs = {
        top: null,
        center: null,
        bottom: null
    };
    /** Object which contains references to the table's td elements @type Object */
    this._tds = {
        nw: null,
        n: null,
        ne: null,
        w: null,
        body: null,
        e: null,
        sw: null,
        s: null,
        se: null
    };
    /** Object which contains references to the td's event handlers elements @type Object */
    this._handlers = {
        nw: null,
        n: null,
        ne: null,
        w: null,
        body: null,
        e: null,
        sw: null,
        s: null,
        se: null,
        mouseButtonChange: null,
        mousePositionChange: null
    };
    /** Internal action indication @type String */
    this._action = "";
    /** Internal borderSize indication @type Number */
    this._borderSize = 7;
    /** Internal tracking rectangle, set when action sets */
    this._rectTracking = null;

    /** The inner width of the object @type Number */
    this.innerWidth = 0;
    /** The inner height of the object @type Number */
    this.innerHeight = 0;
    /** List of supported window actions @type Motif.Collections.List */
    this.actions = new Motif.Collections.List(["", "nw-resize", "n-resize", "ne-resize", "w-resize", "move", "e-resize", "sw-resize", "s-resize", "se-resize"]);
    /** The body element of the window, to which all child elements should be appended @type HTMLTd */
    this._bodyWindow = null;

    /** Get the body element for this object */
    this.getBody = function Window_getBody() {
        return this._bodyWindow;
    };

    /** Create a new window base element @type HTMLTable */
    this._createElement = function Window_createElement() {
        Motif.Page.log.write("Motif.Ui.Controls.Window._createElement: Creating a new table element.");
        var table = document.createElement("table");
        var trs = {};
        var tds = {};
        table.cellSpacing = 0;
        table.cellPadding = 0;
        table.style.cssText = "table-layout:fixed;";

        var tbody = table.appendChild(document.createElement("tbody"));
        trs.top = tbody.appendChild(document.createElement("tr"));
        trs.center = tbody.appendChild(document.createElement("tr"));
        trs.bottom = tbody.appendChild(document.createElement("tr"));

        tds.nw = trs.top.appendChild(document.createElement("td"));
        tds.n = trs.top.appendChild(document.createElement("td"));
        tds.ne = trs.top.appendChild(document.createElement("td"));

        tds.w = trs.center.appendChild(document.createElement("td"));
        tds.body = trs.center.appendChild(document.createElement("td"));
        tds.e = trs.center.appendChild(document.createElement("td"));

        tds.sw = trs.bottom.appendChild(document.createElement("td"));
        tds.s = trs.bottom.appendChild(document.createElement("td"));
        tds.se = trs.bottom.appendChild(document.createElement("td"));

        tds.body.className = "body";

        return table;
    };

    /** Position this object centered on the screen */
    this.center = function() {
        var rectWindow = Motif.Ui.Utility.getRectangle(this.element);
        var rectScreen = Motif.Ui.Devices.Screen.getVisibleRectangle();

        Motif.Page.log.write("Motif.Ui.Controls.Window.center: Moving the window (" + rectWindow + ") to the center of the visible screen (" + rectScreen + ")");

        rectWindow.setCenter(rectScreen.getCenter());

        Motif.Page.log.write("Motif.Ui.Controls.Window.center: Moving the window (" + rectWindow + ")");

        this.setLeft(rectWindow.x);
        this.setTop(rectWindow.y);
    };

    /** Enable resizing for the object, adds event handlers to the outer td's */
    this.enableResizing = function Window_enableResize() {
        Motif.Page.log.write("Motif.Ui.Controls.Window.enableResize: Adding event handlers to the resize boxes.");
        for (e in this._tds) {
            if (e != "body") {
                var action = e + "-resize";
                if (!this._handlers[e]) {
                    this._handlers[e] = new Function(this.referenceString() + ".setAction('" + action + "')");
                }
                this._tds[e].style.cursor = action;
                Motif.Utility.attachEvent(this._tds[e], "onmousedown", this._handlers[e]);
            }
        }
    };

    /** Disable resizing of the object, removes the event handlers from the object */
    this.disableResizing = function Window_disableResize() {
        Motif.Page.log.write("Motif.Ui.Controls.Window.disableResize: Removing event handlers from resize boxes, if any.");
        for (e in this._tds) {
            if (e != "body") {
                this._tds[e].style.cursor = "default";
                if (Motif.Type.isFunction(this._handlers[e])) {
                    Motif.Utility.detachEvent(this._tds[e], "onmousedown", this._handlers[e]);
                }
            }
        }
    };

    /** Enable moving of the object, adds an event handler to the body element. */
    this.enableMoving = function Window_enableMove() {
        Motif.Page.log.write("Motif.Ui.Controls.Window.enableMove: Adding event handler to body for mousemove.");
        var action = "move";
        if (!Motif.Type.isFunction(this._handlers.body)) {
            this._handlers.body = new Function(this.referenceString() + ".setAction('" + action + "')");
        }
        this._bodyWindow.style.cursor = action;
        Motif.Utility.attachEvent(this._bodyWindow, "onmousedown", this._handlers.body);
    };

    /** Disable moving of the object, removes the event handler from the body object */
    this.disableMoving = function Window_disableMove() {
        Motif.Page.log.write("Motif.Ui.Controls.Window.disableMove: Removing event handler from body box.");
        if (Motif.Type.isFunction(this._handlers.body)) {
            this._tds.body.style.cursor = "default";
            Motif.Utility.detachEvent(this._tds.body, "onmousedown", this._handlers.body);
        }
    };

    /** Enable scrolling of content */
    this.enableScrolling = function() {
        this._bodyWindow.style.overflow = "auto";
    };

    /** Disable scrolling of content */
    this.disableScrolling = function() {
        this._bodyWindow.style.overflow = "hidden";
    }

    /** Set the action to supplied parameter */
    this.setAction = function Window_setAction(action) {
        if (this.actions.indexOf(action) == -1 || this._action == action) {
            return;
        }
        this.fireEvent("onbeforeactionchange", [this._action, action]);

        if (this._action.indexOf("resize") != -1) {
            this.fireEvent("onresizeend");
        }
        if (this._action == "move") {
            this.fireEvent("onmoveend");
        }
        if (action.indexOf("resize") != -1) {
            this.fireEvent("onresizestart");
        }
        if (action == "move") {
            this.fireEvent("onmovestart");
        }

        Motif.Page.log.write("Motif.Ui.Controls.Window.setAction: Action changed from '" + this._action + "' to '" + action + "'");
        this._action = action;
        this.fireEvent("onactionchange", [action]);
    };

    /** Get the current action */
    this.getAction = function Window_getAction() {
        return this._action;
    };

    /** Activate the window */
    this.activate = function() {
        if (Motif.Ui.Controls.WindowManager.activeWindow === this) {
            return;
        }
        this.fireEvent("onbeforeactivate");
        Motif.Ui.Controls.WindowManager.activate(this);
        this.fireEvent("onactivate");
    };

    /** Internal deactivation, deactivation is done by the window manager, act upon this with the ondeactivate event */
    this._deactivate = function() {
        this.fireEvent("ondeactivate");
    }

    /** Sets the width and height for the outer td elements */
    this.setBorderSize = function Window_setBorderSize(pixelAmount) {
        if (Motif.Type.isNumber(pixelAmount)) {
            this._borderSize = pixelAmount;
        }
        Motif.Page.log.write("Motif.Ui.Controls.Window.setBorderSize: Setting the border size to: " + this._borderSize.toString() + " pixels.");
        for (e in this._tds) {
            if (e.indexOf("n") != -1 || e.indexOf("s") != -1) {
                this._tds[e].style.height = this._borderSize.toString() + "px";
            }
            if (e.indexOf("e") != -1 || e.indexOf("w") != -1) {
                this._tds[e].style.width = this._borderSize.toString() + "px";
            }
        }
    };

    /** Get the curent bordersize set */
    this.getBorderSize = function Window_getBorderSize() {
        if (this._tds.e && this._tds.e.style.width) {
            return parseInt(this._tds.e.style.width);
        }
        return 0;
    };

    /** Internal method to get the tr elements from the current table @type HTMLTr[] */
    this._getTableRows = function Window_getTableRows(table) {
        var tbody = table.getElementsByTagName("tbody")[0];
        if (tbody == null) {
            return [];
        }
        return Motif.Dom.Utility.getChildElements(tbody, "tr");
    };

    /** Internal method to get the tr elements from the current table @type HTMLTd[] */
    this._getTableCells = function Window_getTableCells(table) {
        var tds = [];
        var trs = this._getTableRows(table);
        for (var i = 0; i < trs.length; i++)
            tds = tds.concat(Motif.Dom.Utility.getChildElements(trs[i], "td"));

        return tds;
    };

    /** Internal method which determines whether the supplied element can be used as window element @type Boolean */
    this._isWindowElement = function(element) {
        var trs = this._getTableRows(element);
        var tds = this._getTableCells(element);
        return (trs.length == 3 && tds.length == 9);
    };

    /** Intrnal event handler for onconfigure events */
    this.configure = function Window_configure(config) {
        config = this.Motif$Ui$Controls$Control.configure(config);
        Motif.Page.log.write("Motif.Ui.Controls.Window.configure: Setting the window specific items from config.");

        if (Motif.Type.isNumber(config.border)) {
            this.setBorderSize(config.border);
        }

        if (Motif.Type.isBoolean(config.center)) {
            if (config.center)
                this.center();
            else
                this.center();
        }

        if (Motif.Type.isBoolean(config.resizable)) {
            if (config.resizable)
                this.enableResizing();
            else
                this.disableResizing();
        }

        if (Motif.Type.isBoolean(config.movable)) {
            if (config.movable)
                this.enableMoving();
            else
                this.disableMoving();
        }

        if (Motif.Type.isBoolean(config.scrolling)) {
            if (config.scrolling)
                this.enableScrolling();
            else
                this.disableScrolling();
        }
        this._initDimension();
        return config;
    };

    /** Set the element for window object, replaces anything not like window HTMLTable object */
    this.setElement = function Window_setElement(element) {
        Motif.Page.log.write("Motif.Ui.Controls.Window.setElement: Binding the element to this window object.");

        if (!this._isWindowElement(element)) {
            Motif.Page.log.write("Motif.Ui.Controls.Window.setElement: Invalid element supplied, replacing it.");
            var newElement = this._createElement();
            Motif.Ui.Utility.copyAttributes(element, newElement);
            Motif.Ui.Css.addClassName(newElement, this.getCssClassName());
            var body = this._getTableCells(newElement)[4];
            for (var i = 0; i < element.childNodes.length; i++) {
                body.appendChild(element.childNodes[i].cloneNode(true));
            }
            if (element.parentNode != null) {
                element.parentNode.replaceChild(newElement, element);
            }
            element = newElement;
        }
        this.Motif$Ui$Controls$Control.setElement(element);

        var count = 0;
        var trs = this._getTableRows(this.element);
        var tds = this._getTableCells(this.element);

        for (e in this._trs) {
            this._trs[e] = trs[count];
            count++;
        }
        count = 0;
        for (e in this._tds) {
            this._tds[e] = tds[count];
            count++;
        }
        this._bodyWindow = this._tds.body;

        this.element.style.position = "absolute";
        this._bodyWindow.className = "Motif-Ui-Controls-Window-Body";
        this._bodyWindow.style.cssText = "overflow:hidden; padding:0px; margin:0px; vertical-align:top";
        this._bodyWindow.ondragstart = this._bodyWindow.onselectstart = this._bodyWindow.ondraggesture = function() {
            return false;
        };
        this.setBorderSize();
        this.enableResizing();
        this.enableMoving();
        this._initDimension();

        Motif.Utility.attachEvent(this.element, "onmousedown", new Function(this.referenceString() + ".activate()"));
        return element;
    };

    this._initDimension = function() {
        var w = this.getWidth();
        var h = this.getHeight();
        this._beforeResizeWindow(w < this.minWidth ? this.minWidth : w, h < this.minHeight ? this.minHeight : h);
    };

    /** Intrnal event handler for onbeforeresize events */
    this._beforeResizeWindow = function Window_beforeResizeWindow(w, h) {
        if (!this._margin) {
            this._margin = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            };
            for (e in this._margin) {
                var padding = parseInt(Motif.Ui.Css.getCurrentStyle(this._bodyWindow, "padding-" + e));
                var border = parseInt(Motif.Ui.Css.getCurrentStyle(this._bodyWindow, "border-" + e + "-width"));
                if (!isNaN(border)) {
                    this._margin[e] += border;
                }
                if (!isNaN(padding)) {
                    this._margin[e] += padding;
                }
                this._margin[e] += this.getBorderSize();
            }
        }

        if (!Motif.Type.isUndefined(w)) {
            this.innerWidth = w - (this._margin.left + this._margin.right);
            if (this.innerWidth > 0) {
                this._bodyWindow.style.width = this.innerWidth.toString() + "px";
            }
        }
        if (!Motif.Type.isUndefined(h)) {
            this.innerHeight = h - this.getBorderSize() * 2;
            if (this.innerHeight > 0) {
                this._bodyWindow.style.height = this.innerHeight.toString() + "px";
            }
        }
    };

    /** Internal event handler for window activation, sets the mouse listeners for actions */
    this._activateWindow = function Window_activateWindow() {
        Motif.Page.log.write("Motif.Ui.Controls.Window._activateWindow: Window activated, mouse events attached.");
        Motif.Ui.Devices.Mouse.attachEvent("onpositionchange", this._handlers.mousePositionChange);
        Motif.Ui.Devices.Mouse.attachEvent("onbuttonchange", this._handlers.mouseButtonChange);
    };

    /** Internal event handler for window deactivation, removes the mouse listeners for actions */
    this._deactivateWindow = function Window_deactivateWindow() {
        Motif.Ui.Devices.Mouse.detachEvent("onpositionchange", this._handlers.mousePositionChange);
        Motif.Ui.Devices.Mouse.detachEvent("onbuttonchange", this._handlers.mouseButtonChange);
    };

    /** Internal event handler for mouse button changes */
    this._mouseButtonChangeWindow = function Window_MouseButtonChangeWindow() {
        if (Motif.Ui.Devices.Mouse.button == Motif.Ui.Devices.MouseButtons.None) {
            this.setAction("");
            return;
        }
        this._rectTracking = Motif.Ui.Utility.getRectangle(this.element);
    };

    /** Internal event handler for mouse position changes */
    this._mousePositionChangeWindow = function Window_MouseButtonChangeWindow(diffX, diffY) {
        if (this._action == "") {
            return;
        }

        if (this._action == "move") {
            this._rectTracking.moveBy(diffX, diffY);
            this.move(this._rectTracking.x, this._rectTracking.y);
        }

        if (this._action.indexOf("resize") != -1) {
            var direction = this._action.split("-").shift();

            if (direction.indexOf("w") != -1) {
                this._rectTracking.resizeBy(diffX * -1, 0);
                this._rectTracking.moveBy(diffX, 0);
            }
            if (direction.indexOf("n") != -1) {
                this._rectTracking.resizeBy(0, diffY * -1);
                this._rectTracking.moveBy(0, diffY);
            }
            if (direction.indexOf("e") != -1) {
                this._rectTracking.resizeBy(diffX, 0);
            }
            if (direction.indexOf("s") != -1) {
                this._rectTracking.resizeBy(0, diffY);
            }
            //only sw-resize, w-resize, nw-resize, n-resize, ne-resize requires moving
            if (direction.indexOf("n") != -1 || this._action.indexOf("w") != -1) {
                this.move(this._rectTracking.x, this._rectTracking.y);
            }

            this.resize(this._rectTracking.w, this._rectTracking.h);
        }
    };

    /** Event fired when starting manual movement */
    this.onmovestart = function() {};
    /** Event fired when ending manual movement */
    this.onmoveend = function() {};
    /** Event fired when starting manual resize */
    this.onresizestart = function() {};
    /** Event fired when ending manual resize */
    this.onresizeend = function() {};

    /** @ignore */
    this.main = function Window_main(config) {
        if (!config) {
            config = {
                resizable: true,
                movable: true,
                width: 400,
                height: 200
            };
        }
        if (!config.element) {
            config.element = this._createElement();
        }

        this.attachEvent("onbeforeresize", this._beforeResizeWindow);
        this.attachEvent("onactivate", this._activateWindow);
        this.attachEvent("ondeactivate", this._deactivateWindow);

        this._handlers.mouseButtonChange = new Function(this.referenceString() + "._mouseButtonChangeWindow();");
        this._handlers.mousePositionChange = new Function("diffX", "diffY", this.referenceString() + "._mousePositionChangeWindow(diffX, diffY);");

        this.minWidth = 27;
        this.minHeight = 27;

        this.configure(config);
        this._rectTracking = Motif.Ui.Utility.getRectangle(this.element);

    };
    this.main(config);
};