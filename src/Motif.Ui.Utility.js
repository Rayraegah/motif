Motif.Page.include("Motif.Ui.Css.js");
Motif.Page.include("Motif.Drawing.Rectangle.js");
Motif.Page.include("Motif.Ui.Xhtml.BlockElements.js");
Motif.Page.include("Motif.Ui.Devices.Screen.js");

/** 
 * Static UI util class wich suplies basic element display functions.
 * @singleton
 * @requires Motif.Drawing.Rectangle
 * @requires Motif.Ui.Devices.Screen
 * @author Rayraegah
 */
Motif.Ui.Utility = {
    /** Element used for requiring text metrics @type HTMLDiv */
    _elementText: null,
    _swfObjects: [],

    getCarretPosition: function Utility_getCarretPosition(element) {
        if (element.selectionStart) {
            return element.selectionStart;
        }
        if (!document.selection) {
            return 0;
        }
        return Math.abs(document.selection.createRange().moveStart('character', -1000000));
    },

    /** Get the size of an element with the suplied text and returns the width as w and height as h property of an object @type Object */
    getTextMetrics: function Utility_getTextMetrics(text, width) {
        if (!this._elementText) {
            this._elementText = document.createElement("div");
            this._elementText.style.position = "absolute";
            this._elementText.style.visibility = "hidden";
            this._elementText.style.top = elm.style.left = "-2500px";
            document.body.appendChild(this._elementText);
        }
        this._elementText.style.width = "auto";
        if (width && !isNaN(width)) {
            this._elementText.style.width = width.toString() + "px";
        }
        this._elementText.innerHTML = text;
        return {
            w: this._elementText.clientWidth,
            h: this._elementText.clientHeight
        };
    },
    /** Get a copy of the supplied element @type HTMLDiv */
    getElementMask: function Utility_getElementMask(element) {
        var rect = this.getRectangle(element);
        var elm = document.createElement("div");
        this.setRectangle(elm, rect);
        elm.style.position = "absolute";
        elm.style.border = "solid #AAAAAA 1px";
        elm.style.background = "#FFFFFF";
        return elm;
    },
    /** Get the absolute position of an element using offsetParent @type Object*/
    getOffsetPosition: function Utility_getOffsetPosition(element) {
        var point = {
            x: 0,
            y: 0
        };
        var parent = element;

        while (parent != null) {
            if (!isNaN(parent.offsetLeft)) {
                point.x += parent.offsetLeft;
            }
            if (!isNaN(parent.offsetTop)) {
                point.y += parent.offsetTop;
            }
            try {
                parent = parent.offsetParent;
            } catch (x) {
                parent = null;
            }
        }
        return point;
    },
    /** Get the absolute position of an element using style @type Object*/
    getStylePosition: function Utility_getStylePosition(element) {
        if (Motif.Ui.Css.getCurrentStyle(element, "position") != "absolute") {
            return {
                x: 0,
                y: 0
            };
        }
        var point = {
            x: Motif.Ui.Css.getCurrentStyle(element, "left"),
            y: Motif.Ui.Css.getCurrentStyle(element, "top")
        };
        point.x = point.x.indexOf("px") == -1 ? 0 : parseInt(point.x);
        point.y = point.y.indexOf("px") == -1 ? 0 : parseInt(point.y);
        return point;
    },

    /** Get the absolute position of an element using getClientRects() @type Object*/
    getClientPosition: function Utility_getClientPosition(element) {
        var point = {
            x: 0,
            y: 0
        };
        var col = element.getClientRects();

        if (col && col.length > 0) {
            point.x = col[0].left;
            point.y = col[0].top;
        }
        return point;
    },

    getOffsetDimension: function Utility_getOffsetDimension(element) {
        var dim = {
            w: 0,
            h: 0
        };
        dim.w = element.offsetWidth;
        dim.h = element.offsetHeight;
        return dim;
    },

    getStyleDimension: function Utility_getStyleDimension(element) {
        var dim = {
            w: Motif.Ui.Css.getCurrentStyle(element, "width"),
            h: Motif.Ui.Css.getCurrentStyle(element, "height")
        };
        dim.w = dim.w.indexOf("px") == -1 ? 0 : parseInt(dim.w);
        dim.h = dim.h.indexOf("px") == -1 ? 0 : parseInt(dim.h);
        return dim;
    },

    getClientDimension: function Utility_getClientDimension(element) {
        var dim = {
            w: 0,
            h: 0
        };
        var col = element.getClientRects();
        if (col && col.length > 0) {
            var y = col[0].top;
            dim.h = col[col.length - 1].bottom - y;

            for (var i = 0, len = col.length; i < len; i++) {
                var w = col[i].right - col[i].left;
                if (w > dim.w) {
                    dim.w = w;
                }
            }
        }
        return dim;
    },

    getBorderSize: function Utility_getBorderSize(element) {
        var size = {
            top: null,
            right: null,
            bottom: null,
            left: null
        };
        size.top = Motif.Ui.Css.getCurrentStyle(element, "border-top-width");
        size.right = Motif.Ui.Css.getCurrentStyle(element, "border-right-width");
        size.bottom = Motif.Ui.Css.getCurrentStyle(element, "border-bottom-width");
        size.left = Motif.Ui.Css.getCurrentStyle(element, "border-left-width");

        size.top = size.top.indexOf("px") == -1 ? 0 : parseInt(size.top);
        size.right = size.right.indexOf("px") == -1 ? 0 : parseInt(size.right);
        size.bottom = size.bottom.indexOf("px") == -1 ? 0 : parseInt(size.bottom);
        size.left = size.left.indexOf("px") == -1 ? 0 : parseInt(size.left);
        return size;
    },

    getPaddingSize: function Utility_getPaddingSize(element) {
        var size = {
            top: null,
            right: null,
            bottom: null,
            left: null
        };
        size.top = Motif.Ui.Css.getCurrentStyle(element, "padding-top");
        size.right = Motif.Ui.Css.getCurrentStyle(element, "padding-right");
        size.bottom = Motif.Ui.Css.getCurrentStyle(element, "padding-bottom");
        size.left = Motif.Ui.Css.getCurrentStyle(element, "padding-left");

        size.top = size.top.indexOf("px") == -1 ? 0 : parseInt(size.top);
        size.right = size.right.indexOf("px") == -1 ? 0 : parseInt(size.right);
        size.bottom = size.bottom.indexOf("px") == -1 ? 0 : parseInt(size.bottom);
        size.left = size.left.indexOf("px") == -1 ? 0 : parseInt(size.left);
        return size;
    },

    getMarginSize: function Utility_getMarginSize(element) {
        var size = {
            top: null,
            right: null,
            bottom: null,
            left: null
        };
        size.top = Motif.Ui.Css.getCurrentStyle(element, "margin-top");
        size.right = Motif.Ui.Css.getCurrentStyle(element, "margin-right");
        size.bottom = Motif.Ui.Css.getCurrentStyle(element, "margin-bottom");
        size.left = Motif.Ui.Css.getCurrentStyle(element, "margin-left");

        size.top = size.top.indexOf("px") == -1 ? 0 : parseInt(size.top);
        size.right = size.right.indexOf("px") == -1 ? 0 : parseInt(size.right);
        size.bottom = size.bottom.indexOf("px") == -1 ? 0 : parseInt(size.bottom);
        size.left = size.left.indexOf("px") == -1 ? 0 : parseInt(size.left);
        return size;
    },

    /** 
     * Get a rectangle object of the supplied element accordion to CSS layout properties. 
     * @type Motif.Drawing.Rectangle
     */
    getRectangle: function Utility_getRectangle(element) {
        if (!Motif.Type.isElement(element)) {
            throw new Error("Motif.Ui.Utility.getRectangle: Incorrect parameter specified, expected HTMLElement");
        }

        var props = {
            display: Motif.Ui.Css.getCurrentStyle(element, "display"),
            visibility: Motif.Ui.Css.getCurrentStyle(element, "visibility")
        };
        if (props.display == "none") {
            element.style.visibility = "hidden";
            element.style.display = (element.nodeName.toLowerCase() in Motif.Ui.Xhtml.BlockElements) ? "block" : "inline";
        }

        var pos = Motif.Ui.Utility.getStylePosition(element);
        if (pos.x == 0 || pos.y == 0) {
            pos = Motif.Ui.Utility.getClientPosition(element);
        }
        if (pos.x == 0 || pos.y == 0) {
            pos = Motif.Ui.Utility.getOffsetPosition(element);
        }
        pos.x += Motif.Ui.Devices.Screen.getScrollLeft();
        pos.y += Motif.Ui.Devices.Screen.getScrollTop();

        var dim = Motif.Ui.Utility.getStyleDimension(element);
        if (dim.w == 0 || dim.h == 0) {
            dim = Motif.Ui.Utility.getClientDimension(element);
            if (dim.w == 0 || dim.h == 0) {
                dim = Motif.Ui.Utility.getOffsetDimension(element);
            }
            var pad = Motif.Ui.Utility.getPaddingSize(element);
            var bor = Motif.Ui.Utility.getBorderSize(element);
            dim.w = dim.w - pad.left - pad.right - bor.left - bor.right;
            dim.h = dim.h - pad.top - pad.bottom - bor.top - bor.bottom;
        }

        if (element.style.display != props.display) {
            element.style.display = props.display;
            element.style.visibility = props.visibility;
        }

        return new Motif.Drawing.Rectangle({
            x: pos.x,
            y: pos.y,
            w: dim.w,
            h: dim.h
        });
    },

    getOuterRectangle: function Utility_getOuterRectangle(element) {
        var border = Motif.Ui.Utility.getBorderSize(element);
        var padding = Motif.Ui.Utility.getPaddingSize(element);
        var rect = Motif.Ui.Utility.getRectangle(element);
        rect.inflateBy(border.left + border.right + padding.left + padding.right, border.top + border.bottom + padding.top + padding.bottom);
        return rect;
    },

    getDimension: function Utility_getDimension(element) {
        var dim = Motif.Ui.Utility.getStyleDimension(element);
        if (dim.w == 0 || dim.h == 0) {
            dim = Motif.Ui.Utility.getClientDimension(element);
            if (dim.w == 0 || dim.h == 0) {
                dim = Motif.Ui.Utility.getOffsetDimension(element);
            }
            var pad = Motif.Ui.Utility.getPaddingSize(element);
            var bor = Motif.Ui.Utility.getBorderSize(element);
            dim.w = dim.w - pad.left - pad.right - bor.left - bor.right;
            dim.h = dim.h - pad.top - pad.bottom - bor.top - bor.bottom;
        }
        return dim;
    },

    getOuterDimension: function Utility_getDimension(element) {
        var dim = Motif.Ui.Utility.getDimension(element);
        var pad = Motif.Ui.Utility.getPaddingSize(element);
        var bor = Motif.Ui.Utility.getBorderSize(element);
        dim.w = dim.w + pad.left + pad.right + bor.left + bor.right;
        dim.h = dim.h + pad.top + pad.bottom + bor.top + bor.bottom;
        return dim;
    },

    /** Set the suplied rectangle properties to the corresponding element's style properties */
    setRectangle: function Utility_setRectangle(element, rect) {
        if (!Motif.Type.isElement(element)) {
            throw new Error("Motif.Ui.Utility.setRectangle: Incorrect parameter specified, expected HTMLElement");
        }
        var cssText = [""];
        if (rect.x != null && !isNaN(rect.x)) {
            cssText.push("left:" + rect.x.toString() + "px");
        }
        if (rect.y != null && !isNaN(rect.y)) {
            cssText.push("top:" + rect.y.toString() + "px");
        }
        if (rect.w != null && !isNaN(rect.w)) {
            cssText.push("width:" + rect.w.toString() + "px");
        }
        if (rect.h != null && !isNaN(rect.h)) {
            cssText.push("height:" + rect.h.toString() + "px");
        }

        if (cssText.length > 1) {
            element.style.cssText += cssText.join(";");
        }
    },
    /** Center the element on the screen */
    centerElement: function Utility_centerElement(element) {
        var rect = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        rect.w = element.clientWidth;
        rect.h = element.clientHeight;
        rect.x = Motif.Ui.Devices.Screen.getVisibleWidth() / 2 - rect.w / 2 + Motif.Ui.Devices.Screen.getScrollLeft();
        rect.y = Motif.Ui.Devices.Screen.getVisibleHeight() / 2 - rect.h / 2 + Motif.Ui.Devices.Screen.getScrollTop();
        rect.w = null;
        rect.h = null;
        if (element.style.position != "absolute") {
            element.style.position = "absolute";
        }
        this.setRectangle(element, rect);
    },

    getRectangle2: function() {
        if (!element || element.nodeType != 1) {
            throw new Error("Motif.Ui.Utility.getRectangle: Supplied parameter is not a HTMLElement");
        }

        var props = {
            position: Motif.Ui.Css.getCurrentStyle(element, "position"),
            display: Motif.Ui.Css.getCurrentStyle(element, "display"),
            visibility: Motif.Ui.Css.getCurrentStyle(element, "visibility")
        };

        if (props.display == "none") {
            element.style.position = "absolute";
            element.style.visibility = "hidden";
            element.style.display = "block";
        };

        var style = Motif.Ui.Utility.getStyleRectangle(element);

        if (style.x == 0 || style.y == 0 || style.w == 0 || style.h == 0) {
            var client = Motif.Ui.Utility.getClientRectangle(element);
            var padding = Motif.Ui.Css.getPadding(element);
            var margin = Motif.Ui.Css.getMargin(element);
            var border = Motif.Ui.Css.getBorder(element);

            if (style.x === 0 && client.x !== 0) {
                style.x = client.x - margin.left;
            }
            if (style.y === 0 && client.y !== 0) {
                style.y = client.y - margin.top;
            }
            if (style.w === 0 && client.w !== 0) {
                style.w = client.w - (padding.left + padding.right + border.left + border.right);
            }
            if (style.h === 0 && client.h !== 0) {
                style.h = client.h - (padding.top + padding.bottom + border.top + border.bottom);
            }
        }

        if (props.display == "none") {
            element.style.position = props.position;
            element.style.visibility = props.visibility;
            element.style.display = props.display;
        };

    },

    /** Copy the attributes from a Source element to a target element */
    copyAttributes: function Utility_copyAttributes(source, target) {
        Motif.Page.log.write("Motif.Ui.Utility.copyAttributes: Copying " + source.attributes.length.toString() + " attributes from source to target.");
        if (source.style.cssText != "") {
            target.style.cssText = source.style.cssText;
        }
        for (var i = 0; i < source.attributes.length; i++) {
            var name = source.attributes[i].nodeName;
            var value = source.attributes[i].nodeValue;

            if (value != null) {
                switch (name.toLowerCase()) {
                    case "class":
                        {
                            target.className = value;
                            break;
                        }
                    case "id":
                        {
                            break;
                        }
                    case "style":
                        {
                            target.style.cssText = value;
                            break;
                        }
                    case "maxlength":
                        {
                            target.maxLength = parseInt(value);
                        }
                    default:
                        {
                            if (name.toLowerCase().substr(0, 2) == "on") {
                                try {
                                    Motif.Utility.attachEvent(target, name, new Function(value));
                                    break;
                                } catch (x) {
                                    Motif.Page.log.write("Motif.Ui.Utilityity.copyAttributes: Failed to attach event " + name + ".");
                                }
                            }
                            target.setAttribute(name, value);
                            break;
                        }
                }
            }
        }
    },
    /** Get HTMLObject element for flash movies @type HTMLObject */
    createSwfObject: function Utility_createSwfObject(attributes, parameters) {
        if (!attributes) {
            attributes = {};
        }
        if (!parameters) {
            parameters = {};
        }

        parameters.movie = parameters.src || attributes.data || parameters.movie;
        parameters.allowscriptaccess = "always";
        if (parameters.src) {
            delete parameters.src;
        }

        attributes.name = attributes.name || attributes.id;
        if (!attributes.name) {
            attributes.id = "swf" + Motif.Ui.Utility._swfObjects.length.toString();
            attributes.name = attributes.id;
        }

        attributes.data = parameters.movie;
        attributes.type = "application/x-shockwave-flash";
        attributes.pluginspage = "http://www.macromedia.com/go/getflashplayer";
        if (attributes.classid) {
            delete attributes.classid;
        }

        var obj = document.createElement("object");
        var attrString = [],
            paramString = [];

        for (e in attributes) {
            if (attributes[e] == Object.prototype[e]) {
                continue;
            }
            obj.setAttribute(e, attributes[e]);

            attrString.push(e + "=\"" + attributes[e] + "\"");
        }

        for (e in parameters) {
            if (parameters[e] == Object.prototype[e]) {
                continue;
            }
            var prm = document.createElement("param");
            prm.setAttribute("name", e);
            prm.setAttribute("value", parameters[e]);
            obj.appendChild(prm);

            paramString.push("<param name=\"" + e + "\" value=\"" + parameters[e] + "\"></param>");
        }

        if (Motif.BrowserInfo.internetExplorer) {
            if (!this._swfContainer) {
                var div = document.createElement("div");
                div.style.display = "none";
                document.body.appendChild(div);
                this._swfContainer = div;
            }
            this._swfContainer.innerHTML = "<object " + attrString.join(" ") + ">" + paramString.join("") + "</object>";
            obj = document.getElementById(attributes.id);
        }

        if (Motif.Ui.Utility._swfObjects.length == 0) {
            Motif.Utility.attachEvent(window, "onunload", Motif.Ui.Utility._removeSwfObjects);
        }

        Motif.Ui.Utility._swfObjects.push(obj);
        return obj;
    },
    /** Remove all swf object created with the utility object */
    _removeSwfObjects: function Utility_removeSwfObjects() {
        for (var i = 0; i < Motif.Ui.Utility._swfObjects.length; i++) {
            var obj = Motif.Ui.Utility._swfObjects[i];
            for (e in obj) {
                if (typeof obj[e] == "function") {
                    obj[e] = null;
                }
            }
            if (obj && obj.parentNode) {
                obj.parentNode.removeChild(obj);
            }
        }
        Motif.Ui.Utility._swfObjects.splice(0, Motif.Ui.Utility._swfObjects.length);
    }
};