Motif.Page.include("Motif.Drawing.Rectangle.js");
Motif.Page.include("Motif.Drawing.Point.js");
Motif.Page.include("Motif.Ui.Css.js");
Motif.Page.include("Motif.Ui.Utility.js");
Motif.Page.include("Motif.Ui.Xhtml.BlockElements.js");
Motif.Page.include("Motif.Ui.Controls.Event.js");
Motif.Page.include("Motif.Dom.Utility.js");

/** 
 * The control class is the foundation of all controls it supplies HTMLElement event mapping and animations.
 * @constructor
 * @requires Motif.Object
 * @requires Motif.Ui.Css
 * @requires Motif.Ui.Utility
 * @requires Motif.Ui.Xhtml.BlockElements
 * @requires Motif.Ui.Controls.UserEvents
 * @requires Motif.Drawing.Rectangle
 * @requires Motif.Drawing.Point
 * @requires Motif.Dom.Utility
 * @extends Motif.Object
 */
Motif.Ui.Controls.Control = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Ui.Controls.Control");

    /** The animation which is used for showing and hiding a control @type Motif.Ui.Animations.Base */
    this.animation = null;
    /** The base HTMLElement which displays the control @type HTMLElement */
    this.element = null;

    /** Minimum width value for this control @type Number */
    this.minWidth = null;
    /** Maximum width value for this control @type Number */
    this.maxWidth = null;
    /** Minimum height value for this control @type Number */
    this.minHeight = null;
    /** Maximum width value for this control @type Number */
    this.maxHeight = null;

    /** Minimum left value for this control @type Number */
    this.minLeft = null;
    /** Maximum left value for this control @type Number */
    this.maxLeft = null;
    /** Minimum top value for this control @type Number */
    this.minTop = null;
    /** Maximum left value for this control @type Number */
    this.maxTop = null;

    /** Set the base element for the control and adds a CSS class name to it and maps the user events */
    this.setElement = function Control_setElement(element) {
        Motif.Page.log.write("Motif.Ui.Controls.Control.setElement: Binding the element to this control object.");
        var newElement = this.fireEvent("onbeforesetelement", [element]);
        if (newElement && newElement != element) {
            Motif.Page.log.write("Motif.Ui.Controls.Control.setElement: New element from onbeforesetelement.");
            if (element.parentNode != null) {
                element.parentNode.replaceChild(newElement, element);
            }
            element = newElement;
        }
        this.element = element;
        if (this.animation) {
            this.animation.configure({
                element: this.element,
                status: Motif.Ui.Css.getCurrentStyle(this.element, "display") == "none" ? 0 : 100
            });
        }

        this.element.setAttribute("motifptr", this.ptr.toString());
        var className = this.getCssClassName();
        if (!Motif.Ui.Css.containsClassName(this.element, className)) {
            Motif.Ui.Css.addClassName(this.element, className);
        }
        this._addEvents();
        this.fireEvent("onsetelement", [element]);
        return element;
    };

    /** Create the default element for this control type HTMLDiv */
    this.createElement = function() {
        return document.createElement("div");
    };

    /** Set the default element for this control using createElement */
    this.create = function() {
        this.setElement(this.createElement());
    };

    /** Get the id for this control @type String */
    this.getId = function Control_getId() {
        return this.element.id;
    };

    /** Set the id for this control */
    this.setId = function Control_setId(id) {
        this.element.id = id;
    };

    /** Get a CSS class name corresponding the control's type name @type String */
    this.getCssClassName = function Control_getCssClassName() {
        return this.getType().replace(/\./g, "-");
    };

    /** Map the element's user events to this control */
    this._addEvents = function Control_addEvents(element) {
        element = element || this.element;
        for (evt in Motif.Ui.Controls.UserEvents)
            Motif.Utility.attachEvent(element, evt, new Function("e", "e=e||event;" + this.referenceString() + ".fireEvent(\"" + evt + "\", [new Motif.Ui.Controls.Event({event:e, control: " + this.referenceString() + ", type:\"" + evt + "\"})]);"));

        for (evt in Motif.Ui.Controls.KeyEvents)
            Motif.Utility.attachEvent(element, evt, new Function("e", "e=e||event;" + this.referenceString() + ".fireEvent(\"" + evt + "\", [new Motif.Ui.Controls.KeyEvent({event:e, control: " + this.referenceString() + ", type:\"" + evt + "\"})]);"));

        for (evt in Motif.Ui.Controls.MouseEvents)
            Motif.Utility.attachEvent(element, evt, new Function("e", "e=e||event;" + this.referenceString() + ".fireEvent(\"" + evt + "\", [new Motif.Ui.Controls.MouseEvent({event:e, control: " + this.referenceString() + ", type:\"" + evt + "\"})]);"));

        if (Motif.BrowserInfo.gecko)
            Motif.Utility.attachEvent(element, "onDOMMouseScroll", new Function("e", "e=e||event;" + this.referenceString() + ".fireEvent(\"onmousewheel\", [new Motif.Ui.Controls.MouseEvent({event:e, control: " + this.referenceString() + ", type:\"onmousewheel\"})]);"));
    };

    /** Get the parent control @type Motif.Ui.Controls.Control */
    this.getParentControl = function Control_getParentControl() {
        var parent = this.parentNode;
        while (parent != null) {
            if (parent.getAttribute("motifptr") != null) {
                return Motif.Register.objects[parseInt(parent.getAttribute("motifptr"))];
            }
            parent = parent.parentNode;
        }

        return null;
    };

    /** Get the child controls @type Motif.Ui.Controls.Control[] */
    this.getChildControls = function Control_getChildControls() {
        var list = Motif.Dom.Utility.getChildElements(this.element, "*");
        var ret = [];
        for (e in list)
            if (list[e].getAttribute("motifptr") != null)
                ret.push(Motif.ObjectRegistry.objects[parseInt(list[e].getAttribute("motifptr"))]);

        return ret;
    };

    /** Open this control on the page */
    this.open = function Control_open(parent, hidden) {
        if (!parent) {
            parent = document.body;
        }
        if (parent.element) {
            parent = parent.element;
        }
        this.fireEvent("onbeforeopen");
        if (hidden === true || hidden === false) {
            this.element.style.display = hidden ? "none" : this.element.tagName.toLowerCase() in Motif.Ui.Xhtml.BlockElements ? "block" : "inline";
        }
        parent.appendChild(this.element);
        this.fireEvent("onopen");
    };

    /** Close the control, removes it from it's parent element */
    this.close = function Control_close() {
        if (this.element.parentNode == null) {
            return;
        }
        this.fireEvent("onbeforeclose");
        if (this.element.parentNode != null)
            this.element.parentNode.removeChild(this.element);
        this.fireEvent("onclose");
    };

    /** Show the control */
    this.show = function Control_show(skipAnimation) {
        if (this.element.style.display != "none") {
            return;
        }
        if (this.animation != null && skipAnimation !== true) {
            this._showAnimated();
            return;
        }
        this.fireEvent("onbeforeshow");
        this.element.style.display = this.element.tagName.toLowerCase() in Motif.Ui.Xhtml.BlockElements ? "block" : "inline";
        this.fireEvent("onshow");
    };

    /** Hide the control */
    this.hide = function Control_hide(skipAnimation) {
        if (this.element.style.display == "none") {
            return;
        }
        if (this.animation != null && skipAnimation !== true) {
            this._hideAnimated();
            return;
        }
        this.fireEvent("onbeforeshide");
        this.element.style.display = "none";
        this.fireEvent("onhide");
    };

    /** Toggle visibility */
    this.toggle = function Control_toggle() {
        if (this.element.style.display == "none") {
            this.show();
        } else {
            this.hide();
        }
    };

    /** Internal method which shows the control animated */
    this._showAnimated = function Control_showAnimated() {
        if (this.animation == null) {
            this.show();
            return;
        }
        if (this.animation.isPlaying) {
            this.animation.pause();
            this.animation.increment = 1;
            this.animation.play();
            return;
        }
        this.fireEvent("onbeforeshow");

        this.animation.increment = 1;
        this.animation.setStatus(1);
        this.element.style.display = this.element.tagName.toLowerCase() in Motif.Ui.Xhtml.BlockElements ? "block" : "inline";

        this.animation.play();
    };

    /** Internal method which hides the control animated */
    this._hideAnimated = function Control_hideAnimated() {
        if (this.animation == null) {
            this.show();
            return;
        }
        if (this.animation.isPlaying) {
            this.animation.pause();
            this.animation.increment = -1;
            this.animation.play();
            return;
        }
        this.fireEvent("onbeforehide");
        this.animation.increment = -1;
        this.animation.setStatus(99);
        this.animation.play();
    };

    /** Set the animation for this control */
    this.setAnimation = function Control_setAnimation(classString) {
        if (!Motif.Type.isString(classString)) {
            throw new Error("Motif.Ui.Controls.Control.setAnimation: String type expected as class definition.");
        }

        try {
            eval("this.animation = new " + classString);
        } catch (x) {
            throw new Error("Motif.Ui.Controls.Control.setAnimation: Failed to set animation to '" + classString + "'.\r\n" + x);
        }

        var config = {
            status: Motif.Ui.Css.getCurrentStyle(this.element, "display") == "none" ? 0 : 100,
            element: this.element
        };

        Motif.Page.log.write("Motif.Ui.Controls.Control.setAnimation: Configuring animation for this control, supplying status and element.");

        this.animation.configure(config);
        this.animation.attachEvent("oncomplete", new Function(this.referenceString() + "._animationComplete();"));
    };

    /** Internal event handler for show/hide animations */
    this._animationComplete = function Control_animationComplete() {
        if (this.animation.increment == 1) {
            this.fireEvent("onshow");
        } else {
            this.element.style.display = "none";
            this.fireEvent("onhide");
        }
    };

    /** Resize the control to specified width and/or height */
    this.resize = function Control_resize(w, h) {
        if (typeof w == "undefined" && typeof h == "undefined") {
            return;
        }
        w = parseInt(w);
        h = parseInt(h);

        if (isNaN(w) && isNaN(h)) {
            throw new Error("Motif.Ui.Controls.Control.resize: Incorrect parameter specified, w=" + w + "; h=" + h + ";");
        }

        w = this._widthByRange(w);
        h = this._heightByRange(h);
        if (w == this.getWidth() && h == this.getHeight()) {
            return;
        }

        this.fireEvent("onbeforeresize", [w, h]);
        var cssText = ";";
        if (!isNaN(w)) {
            cssText += "width: " + w.toString() + "px;";
        }
        if (!isNaN(h)) {
            cssText += "height: " + h.toString() + "px;";
        }
        if (cssText != ";") {
            this.element.style.cssText += cssText;
        }
        this.fireEvent("onresize", [w, h]);
    };

    /** Get the height between minHeight and maxHeight @type Number */
    this._heightByRange = function Control_heightByRange(h) {
        if (this.minHeight != null && h < this.minHeight) {
            h = this.minHeight;
        }
        if (this.maxHeight != null && h < this.maxHeight) {
            h = this.maxHeight;
        }
        return h;
    };

    /** Get the height between minWidth and maxWidth @type Number */
    this._widthByRange = function Control_widthByRange(w) {
        if (this.maxWidth != null && w > this.maxWidth) {
            w = this.maxWidth;
        }
        if (this.minWidth != null && w < this.minWidth) {
            w = this.minWidth;
        }
        return w;
    };

    /** Set the width for this control */
    this.setWidth = function Control_setWidth(w) {
        if (!Motif.Type.isNumber(w)) {
            throw new Error("Motif.Ui.Controls.Control.setWidth: Wrong parameter type, expected Number");
        }
        w = this._widthByRange(w);
        this.element.style.width = w.toString() + "px";
    };

    /** Get the width for this control @type Number */
    this.getWidth = function Control_getWidth() {
        if (this.element.style.width) {
            return Motif.Convert.toInt(this.element.style.width);
        }
        var rect = Motif.Ui.Utility.getRectangle(this.element);
        return rect.w;
    };

    /** Set the height for this control */
    this.setHeight = function Control_setHeight(h) {
        if (!Motif.Type.isNumber(h)) {
            throw new Error("Motif.Ui.Controls.Control.setWidth: Wrong parameter type, expected Number");
        }
        h = this._heightByRange(h);
        this.element.style.height = h.toString() + "px";
    };

    /** Get the height for this control @type Number */
    this.getHeight = function Control_getHeight() {
        if (this.element.style.height) {
            return Motif.Convert.toInt(this.element.style.height);
        }
        var rect = Motif.Ui.Utility.getRectangle(this.element);
        return rect.h;
    };

    /** Move this control to specified x and/or y coordinate */
    this.move = function Control_move(x, y) {
        if (typeof x == "undefined" && typeof y == "undefined") {
            return;
        }
        x = parseInt(x);
        y = parseInt(y);

        if (isNaN(x) && isNaN(y)) {
            throw new Error("Motif.Ui.Controls.Control.resize: Incorrect parameter specified, x=" + x + "; y=" + y + ";");
        }

        x = this._leftByRange(x);
        y = this._topByRange(y);
        if (x == this.getLeft() && y == this.getTop()) {
            return;
        }

        this.fireEvent("onbeforeremove", [x, y]);
        var cssText = ";";
        if (!isNaN(x)) {
            cssText += "left:" + x.toString() + "px;";
        }
        if (!isNaN(y)) {
            cssText += "top:" + y.toString() + "px;";
        }
        if (cssText != ";") {
            this.element.style.cssText += cssText;
        }
        this.fireEvent("onmove", [x, y]);
    };

    /** set the cssText for this control @type Motif.Ui.Controls.Control */
    this.setCssText = function Control_setCssText(css) {
        this.element.style.cssText += ";" + css;
        return this;
    };

    /** Get the left between minLeft and maxLeft @type Number */
    this._leftByRange = function Control_leftByRange(x) {
        if (this.maxLeft != null && x > this.maxLeft) {
            x = this.maxLeft;
        }
        if (this.minLeft != null && x < this.minLeft) {
            x = this.minLeft;
        }
        return x;
    };

    /** Get the top between minTop and maxTop @type Number */
    this._topByRange = function Control_topByRange(y) {
        if (this.minTop != null && y < this.minTop) {
            y = this.minTop;
        }
        if (this.maxTop != null && y < this.maxTop) {
            y = this.maxTop;
        }
        return y;
    };

    /** Set the top coordinate for this control */
    this.setTop = function Control_setTop(y) {
        if (!Motif.Type.isNumber(y)) {
            throw new Error("Motif.Ui.Controls.Control.setTop: Wrong parameter type, expected Number");
        }
        if (this.maxTop != null && y > this.maxTop) {
            return;
        }
        if (this.minTop != null && y < this.minTop) {
            return;
        }
        this.element.style.top = y.toString() + "px";
    };

    /** Get the top coordinate for this control @type Number */
    this.getTop = function Control_getTop() {
        return Motif.Convert.toInt(this.element.style.top);
    };

    /** Set the left coordinate for this control */
    this.setLeft = function Control_setLeft(x) {
        if (!Motif.Type.isNumber(x)) {
            throw new Error("Motif.Ui.Controls.Control.setLeft: Wrong parameter type, expected Number");
        }
        if (this.minLeft != null && x < this.minLeft) {
            return;
        }
        if (this.maxLeft != null && x > this.maxLeft) {
            return;
        }
        this.element.style.left = x.toString() + "px";
    };

    /** Get the left coordinate for this control @type Number */
    this.getLeft = function Control_getLeft() {
        return Motif.Convert.toInt(this.element.style.left);
    };

    /** Get rectangle object based on position and dimension of this control @type Motif.Drawing.Rectangle */
    this.getRectangle = function Control_getRectangle() {
        return Motif.Ui.Utility.getRectangle(this.element);
    };

    /** Get outer rectangle object based on position and dimension of this control @type Motif.Drawing.Rectangle */
    this.getOuterRectangle = function Control_getRectangle() {
        return Motif.Ui.Utility.getOuterRectangle(this.element);
    };

    /** Set the position and dimension for this control by specified rectangle */
    this.setRectangle = function Control_setRectangle(rect) {
        Motif.Ui.Utility.setRectangle(this.element, rect);
    };

    /** Load the control with an element */
    this.load = function Control_load(element, autoConfig) {
        this.fireEvent("onbeforeload", [element]);
        var newElement = this.setElement(element);
        if (autoConfig !== false) {
            this.configure(element.getAttribute("config"));
        }
        this.fireEvent("onload", [newElement]);
        return newElement;
    };

    /** Configure this control */
    this.configure = function Control_configure(config) {
        config = this.Motif$Object.configure(config);
        Motif.Page.log.write("Motif.Ui.Controls.Control.configure: Setting the control specific items from config.");

        if (Motif.Type.isElement(config.element)) {
            config.element = this.setElement(config.element);
        }

        if (Motif.Type.isString(config.animation)) {
            this.setAnimation(config.animation);
        }
        if (config.animationConfig) {
            this.animation.configure(config.animationConfig);
        }

        if (Motif.Type.isNumber(config.maxWidth)) {
            this.maxWidth = config.maxWidth;
        }
        if (Motif.Type.isNumber(config.maxHeight)) {
            this.maxHeight = config.maxHeight;
        }
        if (Motif.Type.isNumber(config.minWidth)) {
            this.minWidth = config.minWidth;
        }
        if (Motif.Type.isNumber(config.minHeight)) {
            this.minHeight = config.minHeight;
        }

        if (Motif.Type.isNumber(config.maxLeft)) {
            this.maxLeft = config.maxLeft;
        }
        if (Motif.Type.isNumber(config.maxTop)) {
            this.maxTop = config.maxTop;
        }
        if (Motif.Type.isNumber(config.minLeft)) {
            this.minLeft = config.minLeft;
        }
        if (Motif.Type.isNumber(config.minTop)) {
            this.minTop = config.minTop;
        }

        //next are element specific config properties, if not set then exit 
        if (this.element == null) {
            return config;
        }

        if (Motif.Type.isString(config.id)) {
            this.setId(config.id);
        }

        if (Motif.Type.isNumber(config.width)) {
            this.element.style.width = config.width.toString() + "px";
        }
        if (Motif.Type.isNumber(config.height)) {
            this.element.style.height = config.height.toString() + "px";
        }
        if (Motif.Type.isNumber(config.left)) {
            this.element.style.left = config.left.toString() + "px";
        }
        if (Motif.Type.isNumber(config.top)) {
            this.element.style.top = config.top.toString() + "px";
        }

        if (Motif.Type.isBoolean(config.visible)) {
            if (config.visible)
                this.element.style.display = this.element.tagName.toLowerCase() in Motif.Ui.Xhtml.BlockElements ? "block" : "inline";
            else
                this.element.style.display = "none";
        }
        return config;
    };

    /** Indication whether the control is bound to a HTMLBody element @type Boolean */
    this.isBound = function Control_isBound() {
        var parent = this.element;
        while (parent != null) {
            if (parent.nodeName.toLowerCase() == "body") {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    };

    /** Event fired before loading this control */
    this.onbeforeload = function() {}
        /** Event fired when loading this control */
    this.onload = function() {}
        /** Event fired when loader is done loading child nodes */
    this.onloadtree = function() {}
        /** Event fired before setting an element to this control */
    this.onbeforesetelement = function() {};
    /** Event fired when setting an element to this control */
    this.onsetelement = function() {};
    /** Event fired before opening this control */
    this.onbeforeopen = function() {};
    /** Event fired when opening this control */
    this.onopen = function() {};
    /** Event fired before closing this control */
    this.onbeforeclose = function() {};
    /** Event fired when closing this control */
    this.onclose = function() {};
    /** Event fired before showing this control */
    this.onbeforeshow = function() {};
    /** Event fired when showing this control */
    this.onshow = function() {};
    /** Event fired before hiding this control */
    this.onbeforehide = function() {};
    /** Event fired when hiding this control */
    this.onhide = function() {};
    /** Event fired when the control looses focus */
    this.onblur = function() {};
    /** Event fired when the control is clicked */
    this.onclick = function() {};
    /** Event fired when the contextmenu is requested */
    this.oncontextmenu = function() {};
    /** Event fired when the control is double clicked */
    this.ondblclick = function() {};
    /** Event fired when the control is dragged */
    this.ondrag = function() {};
    /** Event fired when the control drag ends */
    this.ondragend = function() {};
    /** Event fired when the control gets an element dragged into it*/
    this.ondragenter = function() {};
    /** Event fired when an element dragging leaves this control */
    this.ondragleave = function() {};
    /** Event fired when the control gets en element dragged over it*/
    this.ondragover = function() {};
    /** Event fired when the control is startign to be dragged  */
    this.ondragstart = function() {};
    /** Event fired when the control gets an element dropped into it */
    this.ondrop = function() {};
    /** Event fired when the control is focused */
    this.onfocus = function() {};
    /** Event fired when the control is getting a help signal */
    this.onhelp = function() {};
    this.onkeydown = function() {};
    this.onkeypress = function() {};
    this.onkeyup = function() {};
    this.onmousedown = function() {};
    this.onmousemove = function() {};
    this.onmouseout = function() {};
    this.onmouseover = function() {};
    this.onmouseup = function() {};
    this.onmousewheel = function() {};
    this.onmove = function() {};
    this.onmoveend = function() {};
    this.onmovestart = function() {};
    this.onresize = function() {};
    this.onresizeend = function() {};
    this.onresizestart = function() {};
    this.onscroll = function() {};
    this.onselectstart = function() {};

    /** @ignore */
    this.main = function Control_main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};

/** 
 * Control configuration object, list of possible configuration options
 * @constructor
 */
Motif.Ui.Controls.ControlConfig = function() {
    /** Control base element @type HTMLElement */
    this.element = null;
    /** Control animation class string @type String */
    this.animation = "";
    /** Control animation config object @type Object */
    this.animationConfig = {};
    /** Control maximum width @type Number */
    this.maxWidth = 0;
    /** Control maximum height @type Number */
    this.maxHeight = 0;
    /** Control minimum width @type Number */
    this.minWidth = 0
        /** Control minimum height @type Number */
    this.minHeight = 0;
    /** Control maximum left @type Number */
    this.maxLeft = 0;
    /** Control maximum top @type Number */
    this.maxTop = 0;
    /** Control minimum left @type Number */
    this.minLeft = 0;
    /** Control minimum top @type Number */
    this.minTop = 0;
    /** Control width @type Number */
    this.width = 0;
    /** Control height @type Number */
    this.height = 0;
    /** Control left @type Number */
    this.left = 0;
    /** Control top @type Number */
    this.top = 0;
    /** Control visibility @type Boolean */
    this.visible = false;
};