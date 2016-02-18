Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Ui.Devices.Mouse.js");
Motif.Page.include("Motif.Drawing.Rectangle.js");

/**
 * Test control 
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @author Rayraegah
 */
Motif.Ui.Controls.TestControl = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.handleSize = 8;
    this.isMovable = true;
    this.isResizable = true;

    this._mouseTracker = new Motif.Ui.Devices.MouseTracker();
    this._mouseGrid = null;
    this._mouseAction = "";
    this._mouseRect = null;

    this._elementMousedown = function(evt) {
        if (this._mouseAction == "") {
            return;
        }
        this._mouseTracker.start(evt);

    };

    this._elementMouseout = function(evt) {
        if (this._mouseTracker.isTracking) {
            return;
        }
        this.setMouseAction("");
    };

    this._elementMousemove = function(evt) {
        if (this._mouseTracker.isTracking) {
            return;
        }

        if (this._mouseRect == null) {
            this._mouseRect = this.getRectangle();
        }

        if (this._mouseGrid == null) {
            var rect = this._mouseRect;
            this._mouseGrid = {
                move: new Motif.Drawing.Rectangle({
                    x: this.handleSize,
                    y: this.handleSize,
                    w: rect.w - this.handleSize * 2,
                    h: rect.h - this.handleSize * 2
                }),
                n: new Motif.Drawing.Rectangle({
                    x: this.handleSize,
                    y: 0,
                    w: rect.w - this.handleSize * 2,
                    h: this.handleSize
                }),
                ne: new Motif.Drawing.Rectangle({
                    x: rect.w - this.handleSize,
                    y: 0,
                    w: this.handleSize,
                    h: this.handleSize
                }),
                e: new Motif.Drawing.Rectangle({
                    x: rect.w - this.handleSize,
                    y: this.handleSize,
                    w: this.handleSize,
                    h: rect.h - this.handleSize * 2
                }),
                se: new Motif.Drawing.Rectangle({
                    x: rect.w - this.handleSize,
                    y: rect.h - this.handleSize,
                    w: this.handleSize,
                    h: this.handleSize
                }),
                s: new Motif.Drawing.Rectangle({
                    x: this.handleSize,
                    y: rect.h - this.handleSize,
                    w: rect.w - this.handleSize * 2,
                    h: this.handleSize
                }),
                sw: new Motif.Drawing.Rectangle({
                    x: 0,
                    y: rect.h - this.handleSize,
                    w: this.handleSize,
                    h: this.handleSize
                }),
                w: new Motif.Drawing.Rectangle({
                    x: 0,
                    y: this.handleSize,
                    w: this.handleSize,
                    h: rect.h - this.handleSize * 2
                }),
                nw: new Motif.Drawing.Rectangle({
                    x: 0,
                    y: 0,
                    w: this.handleSize,
                    h: this.handleSize
                })
            }
        }

        var offset = {
            x: evt.clientX - this._mouseRect.x,
            y: evt.clientY - this._mouseRect.y
        }

        var action = "";
        for (e in this._mouseGrid) {
            if (this._mouseGrid[e].containsPoint(offset)) {
                action = e;
                break;
            }
        }

        this.element.style.cursor = "default";
        if (this.isMovable === true && action == "move") {
            this.element.style.cursor = "move";
        }
        if (this.isResizable === true && action != "" && action != "move") {
            this.element.style.cursor = action + "-resize";
        }
        this.setMouseAction(this.element.style.cursor == "default" ? "" : this.element.style.cursor);

        //Motif.Page.log.write("elementMousemove action=" + action);
    };

    this.setMouseAction = function Control_setMouseAction(action) {
        if (this._mouseAction == action) {
            return;
        }
        this.fireEvent("onbeforemouseactionchange", [this._mouseAction, action]);
        this._mouseAction = action;
        this.fireEvent("onmouseactionchange", [this._mouseAction]);
    };

    this._resize = function() {
        this.grid = null;
    };

    this.setElement = function(element) {
        this.Motif$Ui$Controls$Control.setElement(element);
        Motif.Utility.attachEvent(this.element, "onmousemove", this.handlers.ElementMousemove);
        Motif.Utility.attachEvent(this.element, "onmouseout", this.handlers.ElementMouseout);
        Motif.Utility.attachEvent(this.element, "onmousedown", this.handlers.ElementMousedown);
    };

    this._mouseTrackerStart = function() {
        this._backup = {};
        this._backup.documentCursor = document.style.cursor;
        document.style.cursor = this.element.style.cursor;
    };

    /** @ignore */
    this.main = function(config) {

        this.handlers = {};
        this.handlers.ElementMousemove = new Function("e", "e=e||event; " + this.referenceString() + "._elementMousemove(e);");
        this.handlers.ElementMouseout = new Function("e", "e=e||event; " + this.referenceString() + "._elementMouseout(e);");
        this.handlers.ElementMousedown = new Function("e", "e=e||event; " + this.referenceString() + "._elementMousedown(e);");

        this.attachEvent("onmouseactionchange", function(action) {
            Motif.Page.log.write("Mouse action changed to: " + action);
        });

        this._mouseTracker.attachEvent("onbuttonchange", function() {
            this.stop();
        });
        this._mouseTracker.attachEvent("onpositionchange", function() {
            Motif.Page.log.write("Tracker changed: " + this);
        });

        this.configure(config);
    };
    this.main(config);
}