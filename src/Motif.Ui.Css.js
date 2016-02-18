/** 
 * Static class for CSS support functions, adds the possibility to add/remove rules and read current style values
 * @singleton
 * @author Rayraegah
 */
Motif.Ui.Css = {
    /** Index of the shared stylesheet for adding css rules to the document */
    _sharedStyleSheet: -1,
    /** Various possible opacity properties @type String[] */
    _opacityFlavors: ["opacity", "MozOpacity", "KHTMLOpacity", "filter"],
    /** Used opacity flavor @type String */
    _opacityFlavor: "",

    /** Add a class name to an element */
    addClassName: function Css_addClassName(element, className) {
        if (Motif.Ui.Css.containsClassName(element, className)) {
            return;
        }
        if (element.className.length == 0) {
            element.className = className;
            return;
        }
        element.className += " " + className;
    },

    /** Remove a class name from an element */
    removeClassName: function Css_removeClassName(element, className) {
        element.className = element.className.replace(className, "").replace(/^\s+|\s+$/g, "");
    },

    /** Check whether a CSS class name is contained in the element's className property */
    containsClassName: function(element, className) {
        var cssNames = element.className;
        return (" " + cssNames + " ").indexOf(" " + className + " ") != -1;
    },

    /** Get the max CSS z-index on the page */
    getMaxZIndex: function(element, maxZIndex) {
        maxZIndex = maxZIndex ? maxZIndex : 0;
        element = element ? element : document.body;

        var current = Motif.Ui.Css.getCurrentStyle(element, "z-index");
        if (current != "" && parseInt(current) > maxZIndex) {
            maxZIndex = parseInt(current);
        }

        var list = element.getElementsByTagName("*");
        for (var i = 0; i < list.length; i++) {
            maxZIndex = Motif.Ui.Css.getMaxZIndex(list[i], maxZIndex);
        }

        return maxZIndex;
    },

    /** Set the cssText for the element without overwriting unspecified values */
    setCssText: function Css_setCssText(element, text) {
        if (!Motif.Type.isElement(element)) {
            throw new Error("Motif.Ui.Css.setCssText: Incorrect parameter specified for 'element', expected HTMLElement.");
        }
        if (!Motif.Type.isString(text)) {
            throw new Error("Motif.Ui.Css.setCssText: Incorrect parameter specified for 'text', expected String.");
        }

        element.style.cssText += ";" + text;
        Motif.Page.log.write("Motif.Ui.Css.setText: Changed the value for [" + element.style.cssText + "]");
    },
    /** Get the opacity flavor for this browser type @type String */
    getOpacityFlavor: function Css_getOpacityFlavor() {
        if (Motif.Ui.Css._opacityFlavor != "") {
            return Motif.Ui.Css._opacityFlavor;
        }
        for (e in this._opacityFlavors) {
            if (typeof document.body.style[this._opacityFlavors[e]] != "undefined") {
                Motif.Ui.Css._opacityFlavor = this._opacityFlavors[e];
                return Motif.Ui.Css._opacityFlavor;
            }
        }
    },
    /** Set the opacity for an element, IE browsers require the element to have a defined width and height */
    setOpacity: function Css_setOpacity(element, percentage) {
        percentage = parseInt(percentage);
        if (isNaN(percentage)) {
            return;
        }
        percentage = percentage < 0 ? 0 : percentage;
        percentage = percentage > 100 ? 100 : percentage;

        var flavor = Motif.Ui.Css.getOpacityFlavor();
        if (flavor == "filter") {
            element.style[flavor] = "alpha(opacity=" + percentage.toString() + ")";
        } else {
            element.style[flavor] = parseFloat(percentage / 100);
        }
    },
    /** Get the element's opacity */
    getOpacity: function Css_getOpacity(element) {
        var flavor = Motif.Ui.Css.getOpacityFlavor();
        var ret = 100;
        var value = Motif.Ui.Css.getCurrentStyle(element, flavor);
        if (value == "") {
            return ret;
        }
        if (flavor == "filter") {
            ret = parseInt(value.substr(value.toLowerCase().indexOf("opacity=") + 8));
        } else {
            ret = parseInt(parseFloat(value) * 100);
        }

        return isNaN(ret) || ret < 0 || ret > 100 ? 100 : ret;
    },
    /** Get the shared stylesheet wich is also used for adding rules @type HTMLStyle */
    getSharedStyleSheet: function Css_getSharedStyleSheet() {
        if (this._sharedStyleSheet == -1) {
            var elm = document.createElement("style");
            elm.type = "text/css";
            document.getElementsByTagName("head")[0].appendChild(elm);
            this._sharedStyleSheet = document.styleSheets.length - 1;
        }
        return document.styleSheets[this._sharedStyleSheet];
    },
    /** Insert a CSS style rule at a specified index */
    insertRule: function Css_insertRule(verb, rule, index) {
        var sheet = this.getSharedStyleSheet();
        if (!index) {
            index = sheet.rules ? sheet.rules.length : sheet.cssRules.length;
        }

        if (sheet.insertRule)
            sheet.insertRule(verb + "{" + rule + "}", index);
        else
            sheet.addRule(verb, rule, index);

        return index;
    },
    getRule: function Css_getRule(verb) {
        var sheet = Motif.Ui.Css.getSharedStyleSheet();
        var rules = sheet.rules ? sheet.rules.length : sheet.cssRules.length;
        for (var i = 0; i < rules.length; i++)
            Motif.Page.log.write(rule);
    },
    /** Append a rule to the stylesheet */
    addRule: function Css_addRule(verb, rule) {
        return this.insertRule(verb, rule);
    },
    /** Remove the rule add the specified index */
    removeRule: function Css_removeRule(index) {
        var sheet = this.getSharedStyleSheet();
        if (sheet.removeRule)
            sheet.removeRule(index);
        else
            sheet.deleteRule(index);

    },
    /** Clear the shared stylesheet */
    removeAllRules: function Css_removeAllRules() {
        var sheet = this.getSharedStyleSheet();
        if (sheet.ownerNode)
            sheet.ownerNode.innerHTML = "";
        else
            sheet.cssText = "";
    },
    /** Add text to the stylesheet */
    addText: function Css_addText(sText) {
        var sheet = this.getSharedStyleSheet();
        if (sheet.ownerNode)
            sheet.ownerNode.innerHTML += sText;
        else
            sheet.cssText += sText;
    },
    /** Get the current style property value of an element @type String */
    getCurrentStyle: function Css_getCurrentStyle(element, name) {
        if (!element || !name) {
            return "";
        }
        var ret = null;

        name = name.toLowerCase();

        if (typeof element.currentStyle != "undefined") {
            if (name.indexOf("-") != -1) {
                var arr = name.split("-");
                for (var i = 1; i < arr.length; i++) {
                    arr[i] = arr[i].substr(0, 1).toUpperCase() + arr[i].substr(1);
                }
                name = arr.join("");
            }

            ret = element.currentStyle[name];
        } else if (typeof document.defaultView.getComputedStyle != "undefined") {
            ret = document.defaultView.getComputedStyle(element, "").getPropertyValue(name);
        }

        return ret ? ret : "";
    },
    /** Get the padding values for the specified element @type Object */
    getPadding: function Css_getPadding(element) {
        var padding = {
            left: Motif.Ui.Css.getCurrentStyle(element, "padding-left"),
            right: Motif.Ui.Css.getCurrentStyle(element, "padding-right"),
            top: Motif.Ui.Css.getCurrentStyle(element, "padding-top"),
            bottom: Motif.Ui.Css.getCurrentStyle(element, "padding-bottom")
        };
        for (e in padding) {
            padding[e] = padding[e].indexOf("px") == -1 ? 0 : parseInt(padding[e]);
        }
        return padding;
    },
    /** Get the margin values for the specified element @type Object*/
    getMargin: function Css_getMargin(element) {
        var margin = {
            left: Motif.Ui.Css.getCurrentStyle(element, "margin-left"),
            top: Motif.Ui.Css.getCurrentStyle(element, "margin-top"),
            right: Motif.Ui.Css.getCurrentStyle(element, "margin-right"),
            bottom: Motif.Ui.Css.getCurrentStyle(element, "margin-bottom")
        };
        for (e in margin) {
            margin[e] = margin[e].indexOf("px") == -1 ? 0 : parseInt(margin[e]);
        }
        return margin;
    },
    /** Get the border values for the specified element @type Object*/
    getBorder: function Css_getBorder(element) {
        var border = {
            left: Motif.Ui.Css.getCurrentStyle(element, "border-left-width"),
            top: Motif.Ui.Css.getCurrentStyle(element, "border-top-width"),
            right: Motif.Ui.Css.getCurrentStyle(element, "border-right-width"),
            bottom: Motif.Ui.Css.getCurrentStyle(element, "border-bottom-width")
        };
        for (e in border) {
            border[e] = border[e].indexOf("px") == -1 ? 0 : parseInt(border[e]);
        }
        return border;
    },
    /** Add a stylesheet by url */
    addStyleSheet: function Css_addStyleSheet(url) {
        var elm = document.createElement("link");
        elm.type = "text/css";
        elm.rel = "stylesheet";
        elm.href = url;
        document.getElementsByTagName("head")[0].appendChild(elm);
    }
};