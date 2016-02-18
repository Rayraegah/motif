Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Ui.Xhtml.EmptyElements.js");
Motif.Page.include("Motif.Dom.Selection.js");
Motif.Page.include("Motif.Dom.Utility.js");
/**
 * HTMLIframe element for browsing the web. 
 * @constructor 
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Delegate
 * @requires Motif.Ui.Xhtml.EmptyElements
 * @requires Motif.Dom.Selection
 * @author Rayraegah
 */
Motif.Ui.Controls.WebBrowser = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.WebBrowser");

    /** Default content of the iframe document @type String */
    this.defaultContent = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><title></title><style type='text/css'>body{margin: 0px; padding: 2px;}</style></head><body></body></html>";
    /** Iframe element @type HTMLIframe */
    this.iframe = null;
    /** Window object of the iframe @type Window */
    this.window = null;
    /** Document object of the iframe @type HTMLDocument */
    this.document = null;
    /** Indication whether the control is ready for usage @type Boolean */
    this.isReady = false;
    /** Indication wheter the content can be edited @type Boolean */
    this.isEditable = false;
    /** Queue of method+parameters objects to be executed when the object is ready @type Object[] */
    this._execQueue = [];

    /** Set the iframe element once the base element is bound to the DOM */
    this._setIframe = function WebBrowser__setIframe() {
        if (!this.isBound()) {
            Motif.Page.log.write("Motif.Ui.Controls.WebBrowser._setIframe: Element not bound, defering method.");
            setTimeout(this.referenceString() + "._setIframe()", 100);
            return;
        }

        Motif.Page.log.write("Motif.Ui.Controls.WebBrowser._setIframe: Adding iframe and setting references.");
        this.element.appendChild(this.iframe);
        this._setWindow();
    };

    /** Set the window and document properties from the iframe when they are available. Once set, it loads the document and fires the onready event where after the queued methods are executed. */
    this._setWindow = function WebBrowser__setWindow() {
        if (!this.iframe.contentWindow) {
            Motif.Page.log.write("Motif.Ui.Controls.WebBrowser._setWindow: Window not set, defering method.");
            setTimeout(this.referenceString() + "._setWindow()", 100);
            return;
        }
        this.window = this.iframe.contentWindow;
        this._setDocument();
    };

    this._setDocument = function WebBrowser__setDocument() {

        if (!this.window.document) {
            Motif.Page.log.write("Motif.Ui.Controls.WebBrowser._setDcoument: Document not set, defering method.");
            setTimeout(this.referenceString() + "._setDocument()", 100);
            return;
        }
        this.document = this.window.document;

        this.document.open();
        this.document.write(this.defaultContent);
        this.document.close();

        this.isReady = true;
        this.fireEvent("onready");

        Motif.Page.log.write("Motif.Ui.Controls.WebBrowser._setDocument: Adding user events for iframe window.");
        for (evt in Motif.Ui.Controls.UserEvents) {
            Motif.Utility.attachEvent(this.window, evt, new Function("window.top." + this.referenceString() + ".fireEvent(\"" + evt + "\");"));
        }

        Motif.Page.log.write("Motif.Ui.Controls.WebBrowser._setDocument: Executing from _execQueue.");
        for (var i = 0; i < this._execQueue.length; i++) {
            var obj = this._execQueue[i];
            if (this[obj.method]) {
                if (!obj.parameters) {
                    obj.parameters = [];
                }
                this[obj.method].apply(this, obj.parameters);
            }
        }
        if (this._execQueue.length > 0) {
            this._execQueue.splice(0, this._execQueue.length);
        }
    };

    /** Get the current selected element @type HTMLElement */
    this.getSelectedElement = function WebBrowser_getSelectedElement() {
        if (!this.isReady) {
            return null;
        }
        Motif.Page.log.write("Motif.Ui.Controls.WebBrowser._getSelectedElement: Getting selection to retreive selected element.");
        return this.getSelection().element;
    };

    /** Get the current selection @type Motif.Dom.Selection */
    this.getSelection = function WebBrowser_getSelection() {
        if (!this.isReady) {
            return null;
        }
        Motif.Page.log.write("Motif.Ui.Controls.WebBrowser._getSelecion: Getting selection from window.");
        return new Motif.Dom.Selection(this.window);
    };

    /** Add a stylesheet to the window object */
    this.addStylesheet = function WebBrowser_addSylesheet(url) {
        if (this.document == null) {
            setTimeout(this.referenceString() + ".addStylesheet('" + url + "');", 200);
            return;
        }

        Motif.Page.log.write("Motif.Ui.Controls.WebBrowser.addStylesheet: Adding stylesheet to document.");

        var head = this.document.getElementsByTagName("head")[0];
        if (!head) {
            throw new Error("Motif.Ui.Controls.WebBrowser.addStylesheet: Adding stylesheet failed, HTMLHead not available.");
        }
        var link = this.document.createElement("link");
        link.type = "text/css";
        link.href = url;
        link.rel = "stylesheet"
        head.appendChild(link);
    };

    /** Add a script to the window object */
    this.addScript = function WebBrowser_addScript(url) {
        if (this.document == null) {
            setTimeout(this.referenceString() + ".addScript('" + url + "');", 200);
            return;
        }

        var head = this.document.getElementsByTagName("head")[0];
        if (!head) {
            throw new Error("Motif.Ui.Controls.WebBrowser.addScript: Adding script failed, HTMLHead not available.");
        }
        var script = this.document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        head.appendChild(script);
    };

    /** Allow page editting */
    this.enableEdit = function WebBrowser_enableEdit() {
        if (this.isReady !== true) {
            this._execQueue.push({
                method: "enableEdit"
            });
        }
        Motif.Page.log.write("Motif.Ui.Controls.WebBrowser._enableEdit: Enabling content edit.");

        if (Motif.BrowserInfo.internetExplorer) {
            this.document.body.disabled = true;
            this.document.body.contentEditable = true;
            this.document.body.removeAttribute("disabled");
        } else {
            this.document.designMode = "on";
        }

        this.isEditable = Motif.BrowserInfo.internetExplorer ? this.document.body.contentEditable : this.document.designMode == "on";
        if (this.isEditable === false) {
            Motif.Page.log.write("Motif.Ui.Controls.WebBrowser._enableEdit: Defer content editable.");
            new Motif.Delegate(this.enableEdit, [], this, 100, true);
        }
    };

    /** Disallow page editting */
    this.disableEdit = function WebBrowser_disableEdit() {
        if (!this.isReady) {
            this._execQueue.push({
                method: "disableEdit"
            });
        }
        Motif.Page.log.write("Motif.Ui.Controls.WebBrowser._disableEdit: Disabeling content edit.");

        if (Motif.BrowserInfo.internetExplorer) {
            this.document.body.disabled = true;
            this.document.body.contentEditable = false;
            this.document.body.removeAttribute("disabled");
        } else {
            this.document.designMode = "off";
        }

        this.isEditable = Motif.BrowserInfo.internetExplorer ? this.document.body.contentEditable : this.document.designMode == "on";

        if (this.isEditable === true) {
            Motif.Page.log.write("Motif.Ui.Controls.WebBrowser._disableEdit: Defered disabling content edit.");
            new Motif.Delegate(this.disableEdit, [], this, 100, true);
        }
    };

    /** Get the XHTML source @type String */
    this.getXhtml = function WebBrowser_getXhtml() {
        var xhtml = Motif.Dom.Utility.getXhtml(this.document.body, -1, {
            body: "div",
            em: "i",
            strong: "b"
        }, {
            contenteditable: "",
            topmargin: "",
            rightmargin: "",
            bottommargin: "",
            leftmargin: ""
        });
        xhtml = xhtml.replace(/^\s+|\s+$/g, "");
        xhtml = xhtml.substr(5);
        xhtml = xhtml.substr(0, xhtml.length - 6);
        return xhtml;
    };

    /** Display a searchengine page with the specified criterium, a searchengine uri can be obtained from the Netxion.Web.SearchEngines object */
    this.search = function WebBrowser_search(criterium, searchEngineUrl) {
        if (!this.isReady) {
            this._execQueue.push({
                method: "search",
                parameters: [criterium, searchEngineUrl]
            });
            return;
        }
        this.window.location.href = searchEngineUrl + escape(criterium);
        this.onsearch();
    };

    /** Navigate to a page */
    this.navigate = function WebBrowser_navigate(url) {
        if (!this.isReady) {
            this._execQueue.push({
                method: "navigate",
                parameters: [url]
            });
            return;
        }
        this.window.location.href = url;
        this.fireEvent("onnavigate", [url]);
    };

    /** Refresh the current page */
    this.refresh = function WebBrowser_refresh() {
        if (!this.isReady) {
            this._execQueue.push({
                method: "refresh"
            });
            return;
        }
        this.window.location.reload();
        this.fireEvent("onrefresh");
    };

    /** Go to the previous page in history */
    this.goBack = function WebBrowser_goBack() {
        if (!this.isReady) {
            this._execQueue.push({
                method: "goBack"
            });
            return;
        }
        this.window.history.go(-1);
        this.fireEvent("ongoback");
    };

    /** Go to the previous page in history */
    this.goForward = function WebBrowser_goForward() {
        if (!this.isReady) {
            this._execQueue.push({
                method: "goForward"
            });
            return;
        }
        this.window.history.go(1);
        this.fireEvent("ongoforward");
    };

    /** Stop the page from loading and force it displaying the current content */
    this.stop = function WebBrowser_stop() {
        if (!this.isReady) {
            this._execQueue.push({
                method: "stop"
            });
            return;
        }
        this.document.close();
        this.fireEvent("onstop");
    };

    /** Configure the webbrowser */
    this.configure = function WebBrowser_configure(config) {
        config = this.Motif$Ui$Controls$Control.configure(config);
        if (config.enableEdit === true) {
            this.enableEdit();
        }
        if (config.enableEdit === false) {
            this.disableEdit();
        }
        if (config.url) {
            this.navigate(config.url);
        }
        if (config.stylesheet) {
            if (typeof config.stylesheet.pop != "undefined") {
                for (e in config.stylesheet) {
                    this.addStylesheet(config.stylesheet[e]);
                }
            } else {
                this.addStylesheet(config.stylesheet);
            }
        }
        if (config.script) {
            if (typeof config.script.pop != "undefined") {
                for (e in config.stylesheet) {
                    this.addScript(config.script[e]);
                }
            } else {
                this.addScript(config.script);
            }
        }
        return config;
    };

    /** Load the control and add contents to the defaultContent property. Child elements will not be loaded. */
    this.load = function WebBrowser_load(element) {
        Motif.Page.log.write("Motif.Ui.Controls.WebBrowser.load: Loading webbrowser control.");
        if (element.innerHTML.length > 0) {
            this.defaultContent = this.defaultContent.replace("<body></body>", "<body>" + element.innerHTML + "</body>");
        }
        while (element.childNodes.length > 0) {
            element.removeChild(element.childNodes[0]);
        }
        this.Motif$Ui$Controls$Control.load(element);
        return null;
    };

    /** Set the element for the WebBrowser control */
    this.setElement = function WebBrowser_setElement(element) {
        Motif.Page.log.write("Motif.Ui.Controls.WebBrowser.setElement: Setting the element and adding the iframe to it.");
        this.Motif$Ui$Controls$Control.setElement(element);
        this._setIframe();
    };

    /** Event fired when the control is ready for usage */
    this.onready = function() {};
    /** Event fired when naviagtion occurs */
    this.onnavigate = function() {};
    /** Event fired when page refresh occurs */
    this.onrefresh = function() {};
    /** Event fired when the browser moves to the previous page */
    this.ongoback = function() {};
    /** Event fired when the browser moves the next page */
    this.ongoforward = function() {};
    /** Event fired when page loading is canceled */
    this.onstop = function() {};

    /** @ignore */
    this.main = function WebBrowser_main(config) {
        this.iframe = document.createElement("iframe");
        this.iframe.style.cssText = "width:100%; height:100%; border:none;";
        this.iframe.border = 0;
        this.iframe.frameBorder = "no";
        if (Motif.BrowserInfo.internetExplorer) {
            this.iframe.src = "javascript: void(0);";
        }

        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};