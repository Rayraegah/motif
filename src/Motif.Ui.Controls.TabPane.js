Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Collections.Hashtable.js");
Motif.Page.include("Motif.Ui.Controls.TabPage.js");
Motif.Page.include("Motif.Ui.Css.js");

/** 
 * Tab control for tabbed display of data.
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.TabPage
 * @requires Motif.Ui.Css
 * @author Rayraegah
 */
Motif.Ui.Controls.TabPane = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.TabPane");

    /** TabPage collection by title @type Motif.Collections.Hastable */
    this.pages = new Motif.Collections.Hashtable();

    /** Element for displaying tab buttons @type HTMLDiv */
    this.strip = null;

    /** Current active page @type Motif.Ui.Controls.TabPage */
    this.active = null;

    /** Add a TabPage to this TabPane */
    this.add = function(tabPage) {
        this.pages.set(tabPage.getTitle(), tabPage);
        tabPage.hide();
        tabPage.clearEvent("onbuttonclick");
        tabPage.clearEvent("onhide");

        tabPage.attachEvent("onbuttonclick", new Function(this.referenceString() + ".activate(\"" + tabPage.getTitle() + "\")"));
        tabPage.attachEvent("onhide", new Function(this.referenceString() + "._showActivePage()"));

        this.element.appendChild(tabPage.element);
        this.strip.appendChild(tabPage.button);
    };

    /** Remove a page by title from this TabPane @type Motif.Ui.Controls.TabPane */
    this.remove = function(title) {
        if (pages.contains(title)) {
            var page = pages.remove(title);
            page.destroy();
            return page;
        }
        return null;

    };

    /** Remove all pages from this TabPane @type Motif.Ui.Controls.TabPane[] */
    this.removeAll = function() {
        for (e in this.pages.item) {
            this.pages.item[e].destroy();
        }

        return this.pages.removeAll();
    };

    /** Activate a TabPage, set the new active page and hides the current active page */
    this.activate = function(title) {
        if (!this.pages.contains(title)) {
            throw new Error("Motif.Ui.Controls.TabPane.activate: Can't activate a non existing page.");
        }
        var page = this.pages.get(title);
        if (page === this.active) {
            return;
        }

        this.fireEvent("onbeforeactivate", [page]);

        var previous = this.active;
        this.active = page;
        if (previous != null) {
            previous.hide();
            Motif.Ui.Css.removeClassName(this.active.button, "Active");
            return page;
        }
        this._showActivePage();

        return page;
    };

    /** Activate the first page in the page collection */
    this.activateFirstPage = function() {
        var first = this.pages.getKeys()[0];
        if (typeof first != "undefined") {
            this.activate(first);
        } else {
            this.attachEvent("onaddpage", this._activateFirstPage);
        }
    };

    this._activateFirstPage = function() {
        Motif.Page.log.write("Motif.Ui.Control.TabPane._activateFirstPage: Showing first page and removing handler.");
        this.activateFirstPage();
        this.detachEvent("onaddpage", this._activateFirstPage);
    };

    /** Internal event handler for page 'onhide' events */
    this._showActivePage = function() {
        if (this.active == null) {
            return;
        }
        this.active.show();
        Motif.Ui.Css.addClassName(this.active.button, "Active");
        this.fireEvent("onactivate", [this.active]);
    };

    /** Set the element for this control and adds the button strip element to it */
    this.setElement = function(element) {
        this.Motif$Ui$Controls$Control.setElement(element);
        this.element.appendChild(this.strip);
    };

    /** Load this tabpane and tabpages if any @type HTMLElement */
    this.load = function(element) {
        var list = [];
        while (element.childNodes.length > 0) {
            var node = element.removeChild(element.childNodes[0]);
            if (node.nodeType == 1 && node.getAttribute("motifClass") == "Motif.Ui.Controls.TabPage") {
                node.removeAttribute("motifClass");
                list.push(node);
            }
        }
        Motif.Page.log.write("Motif.Ui.Controls.TabPane.load: Found '" + list.length.toString() + "' TabPages.");

        this.Motif$Ui$Controls$Control.load(element, false);
        for (var i = 0; i < list.length; i++) {
            var page = new Motif.Ui.Controls.TabPage();
            page.load(list[i]);
            this.add(page);
        }

        this.configure(element.getAttribute("config"));
        return element;
    };

    /** Configure this tabpane, checks the configuration option 'activateFirstPage', when true it calls the 'activateFirstPage' method. @type Object */
    this.configure = function(config) {
        config = this.Motif$Ui$Controls$Control
            .configure(config);
        if (config.activateFirstPage === true) {
            this.activateFirstPage();
        }
        return config;
    };

    /** Event fired before a page is activated */
    this.onbeforeactivate = function(tabPage) {};
    /** Event fired when a page is activated */
    this.onactivate = function(tabPage) {};

    this.onremovepage = function() {};
    this.onaddpage = function() {};

    /** @ignore */
    this.main = function(config) {
        this.strip = document.createElement("div");
        this.strip.className = "Motif-Ui-Controls-TabStrip";

        if (config) {
            this.configure(config);
        }

        this.pages.attachEvent("onadd", new Function("page", this.referenceString() + ".fireEvent(\"onaddpage\", [page]);"));
        this.pages.attachEvent("onremove", new Function("page", this.referenceString() + ".fireEvent(\"onremovepage\", [page]);"));
    };
    this.main(config);
};