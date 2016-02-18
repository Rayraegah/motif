Motif.Page.include("Motif.Ui.Controls.Window.js");
Motif.Page.include("Motif.Ui.Controls.FormTitleBar.js");

/**
 * Form object
 * @constructor
 * @extends Motif.Ui.Controls.Window
 * @requires Motif.Ui.Controls.Window
 * @requires Motif.Ui.Controls.FormTitleBar
 * @requires Motif.Ui.Controls.FormStatusBar
 */
Motif.Ui.Controls.Form = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Window");
    this.__class.push("Motif.Ui.Controls.Form");

    /** Internal reference to the body element @type HTMLDiv */
    this._bodyForm = null;
    /** Titlebar object for this form @type Motif.Ui.Controls.FormTitleBar */
    this.titleBar = null;

    /** Set the title text for this form */
    this.setTitle = function Form_setTitle(title) {
        this.titleBar.title.innerHTML = title;
    };

    /** Get the title text of this form @type String */
    this.getTitle = function Form_getTitle() {
        return this.titleBar.title.innerHTML;
    };

    /** Set the element for this form and adds a body element */
    this.setElement = function(element) {
        Motif.Page.log.write("Motif.Ui.Controls.Form.setElement: Binding the element to this form object.");
        this.Motif$Ui$Controls$Window.setElement(element);
        var arr = [];
        while (this._bodyWindow.childNodes.length > 0) {
            arr.push(this._bodyWindow.childNodes[0].cloneNode(true));
            this._bodyWindow.removeChild(this._bodyWindow.childNodes[0]);
        }
        this._bodyWindow.appendChild(this.titleBar.element);
        this._bodyForm = this._bodyWindow.appendChild(document.createElement("div"));
        this._bodyForm.className = "Motif-Ui-Controls-Form-Body";;
        this._bodyForm.style.cssText = "overflow:hidden; padding:0px; margin:0px; cursor:default;";
        this._bodyForm.onmousedown = function(e) {
            e = e || event;
            e.cancelBubble = true;
            return true;
        };

        for (var i = 0; i < arr.length; i++) {
            this._bodyForm.appendChild(arr[i]);
        }
        this._initDimension();
        this._fitBody();
    };

    /** Get the body element of the form @type HTMLDiv */
    this.getBody = function Form_getBody() {
        return this._bodyForm;
    };

    /** Minimize the form */
    this.minimize = function Form_minimize() {

    };

    /** Maximize the form */
    this.maximize = function Form_maximize() {

    };

    /** Enable scrolling of the body content */
    this.enableScrolling = function() {
        this._bodyForm.style.overflow = "auto";
    };

    /** Disable scrolling of the body content */
    this.disableScrolling = function() {
        this._bodyForm.style.overflow = "hidden";
    };

    /** Configure the form element */
    this.configure = function Form_configure(config) {
        config = this.Motif$Ui$Controls$Window.configure(config);
        Motif.Page.log.write("Motif.Ui.Controls.Form.configure: Setting the form specific items from config.");
        if (config.titleBar) {
            this.titleBar.configure(config.titleBar);
        }
        if (config.title) {
            this.setTitle(config.title);
        }

        this._initDimension();
        this._fitBody();
    };

    /** Internal event handler for resize events which sets the body dimension */
    this._beforeResizeForm = function Form_beforeResizeFrom() {
        this._fitBody();
    };

    /** Set the body dimension to fit the window body including titlebar */
    this._fitBody = function Form__fitBody() {
        if (!this._bodyForm) {
            return;
        }
        if (!this.innerWidth || !this.innerHeight) {
            var rect = Motif.Ui.Utility.getRectangle(this._windowBody);
            this.innerWidth = rect.w;
            this.innerHeight = rect.h;
        }
        var rectTitle = Motif.Ui.Utility.getRectangle(this.titleBar.element);
        this._bodyForm.style.height = (this.innerHeight - rectTitle.h).toString() + "px";
        this._bodyForm.style.width = this.innerWidth.toString() + "px";
    };

    /** Load an element for this form, loads the window and titlebar. Returns the body element for the loader to resume with @type HTMLElement */
    this.load = function Form_load(element) {
        this.Motif$Ui$Controls$Window.load(element);
        var list = Motif.Dom.Utility.getElementsByClassName(this.element, "Motif-Ui-Controls-FormTitleBar");
        if (list.length > 1) {
            this.titleBar.load(list[1]);
        }
        return this._bodyForm;
    };

    /** @ignore */
    this.main = function Form_main(config) {
        this.titleBar = new Motif.Ui.Controls.FormTitleBar();
        this.titleBar.attachEvent("onexit", new Function(this.referenceString() + ".hide();"));
        this.titleBar.attachEvent("onmin", new Function(this.referenceString() + ".minimize();"));
        this.titleBar.attachEvent("onmax", new Function(this.referenceString() + ".maximize();"));

        this.minWidth = 114;
        this.minHeight = 114;
        this.attachEvent("onbeforeresize", this._beforeResizeForm);

        this.configure(config);
    };
    this.main(config);
};