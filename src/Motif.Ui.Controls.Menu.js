Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Collections.Hashtable.js");
Motif.Page.include("Motif.Dom.Utility.js");
Motif.Page.include("Motif.Ui.Css.js");
Motif.Page.include("Motif.Ui.Utility.js");

/** 
 * Menu control for displaying clickable items
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.MenuItem
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Collections.Hashtable
 * @requires Motif.Dom.Utility
 */
Motif.Ui.Controls.Menu = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.Menu");

    this.parent = null;
    this.items = new Motif.Ui.Controls.MenuItemCollection({
        parent: this
    });

    this.load = function Menu_load(element) {
        this.Motif$Ui$Controls$Control.load(element);
        var items = Motif.Dom.Utility.getChildElements(element, "div", "Item");
        items = items.concat(Motif.Dom.Utility.getElementsByAttribute(element, "motifclass", "Motif.Ui.Controls.MenuItem"));

        for (var i = 0; i < items.length; i++) {
            var item = new Motif.Ui.Controls.MenuItem();
            item.load(items[i]);
            this.items.add(item);
        }

    };

    this.configure = function Menu_configure(config) {
        config = this.Motif$Ui$Controls$Control.configure(config);
        if (config.parent) {
            this.parent = config.parent;
        }
        return config;
    };

    this._blur = function Menu__blur() {
        if (this.parent == null) {
            var items = this.items.toArray()
            for (var i = 0; i < items.length; i++)
                items[i].deactivate();
        }
    };

    this._mouseOver = function() {
        if (this.parent == null) {
            this.element.tabIndex = -1;
            this.element.focus();
        }
    };

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }

        this.attachEvent("onmouseover", this._mouseOver);
        this.attachEvent("onblur", this._blur);

    };
    this.main(config);
};

Motif.Ui.Controls.MenuItem = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.MenuItem");

    this.parent = null;
    this.menu = null;
    this.name = "";
    this.active = false;

    this.load = function MenuItem_load(element) {
        this.Motif$Ui$Controls$Control.load(element);
        var menu = Motif.Dom.Utility.getChildElements(element, "div", "Menu")[0];
        if (!menu) {
            menu = Motif.Dom.Utility.getElementsByAttribute(element, "motifclass", "Motif.Ui.Controls.Menu")[0];
        }

        if (this.element.id != "") {
            this.name = this.element.id;
        }
        if (this.name.length == "" && this.element.name != "") {
            this.name = this.element.name;
        }
        if (this.name.length == "") {
            this.name = "MenuItem" + this.ptr.toString();
        }

        if (menu) {
            Motif.Page.log.write("Motif.Ui.Controls.MenuItem.load: Adding menu.");
            Motif.Ui.Css.removeClassName(menu, "Menu");
            menu.removeAttribute("motifClass");
            this.menu = new Motif.Ui.Controls.Menu({
                parent: this
            });
            this.menu.load(menu);
        }
    };

    this.getParentItems = function MenuItem_getParentItems() {
        var ret = [];
        var parent = this.parent;
        while (parent) {
            if (Motif.Type.isMotifType(parent, "Motif.Ui.Controls.MenuItem")) {
                ret.push(parent);
            }
            parent = parent.parent;
        }
        return ret;
    };

    this.getChildItems = function MenuItem_getChildItems() {
        var ret = [];
        if (this.menu) {
            var items = this.menu.items.toArray();
            ret = ret.concat(items);

            for (var i = 0; i < items.length; i++) {
                ret = ret.concat(items[i].getChildItems());
            }
        }
        return ret;
    };

    this.activate = function MenuItem_activate() {
        if (this.active === true) {
            return;
        }
        Motif.Page.log.write("Motif.Ui.Controls.MenuItem.activate: Activating '" + this.name + "'.");

        var cancel = this.fireEvent("onbeforeactivate");
        if (cancel === true) {
            return;
        }

        this.active = true;
        var items = this.parent.toArray();
        for (var i = 0; i < items.length; i++) {
            if (items[i] !== this) {
                items[i].deactivate();
            }
        }
        if (this.menu !== null) {
            if (this.menu.element.parentNode === this.element) {
                this.menu.close();
                this.menu.open();
            }
            var rect = this.getRectangle();
            this.menu.move(rect.x + rect.w, rect.y);
            this.menu.show();
        }
        this.fireEvent("onactivate");
    };

    this.deactivate = function() {
        if (this.active === false) {
            return;
        }
        Motif.Page.log.write("Motif.Ui.Controls.MenuItem.deactivate: Deactivating '" + this.name + "'.");

        var cancel = this.fireEvent("onbeforedeactivate");
        if (cancel === true) {
            return;
        }

        this.active = false;
        if (this.menu) {
            var items = this.getChildItems();
            for (var i = 0; i < items.length; i++) {
                items[i].deactivate();
            }
            this.menu.hide();
        }
        this.fireEvent("ondeactivate");
    };

    this._mouseOver = function(evt) {
        this.activate();
    };

    this.onbeforeactivate = function() {};
    this.onactivate = function() {};

    this.onbeforedeactivate = function() {};
    this.ondeactivate = function() {};

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }

        this.attachEvent("onmouseover", this._mouseOver);

    };
    this.main(config);
};

Motif.Ui.Controls.MenuItemCollection = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Collections.Hashtable");
    this.__class.push("Motif.Ui.Controls.Menu");

    this.parent = null;

    this.add = function MenuItemCollection_add(item) {
        item.parent = this;
        if (item.element.parentNode != this.parent.element)
            this.parent.element.appendChild(item.element);

        if (this.Motif$Collections$Hashtable.contains(item.name)) {
            this.Motif$Collections$Hashtable.remove(item.name);
        }
        this.Motif$Collections$Hashtable.add(item.name, item);
    };

    this.remove = function MenuItemCollection_remove(name) {
        if (name.name) {
            name = name.name;
        }
        var item = this.Motif$Collections$Hashtable.remove(name);
        if (item) {
            this.parent.element.removeChild(item.element);
            item.parent = null;
        }
        return item;
    };

    this.removeAll = function MenuItemCollection_removeAll() {
        var items = this.Motif$Collections$Hashtable.removeAll();
        for (var i = 0; i < items.length; i++) {
            this.parent.element.removeChild(items[i].element);
            items[i].parent = null;
        }

        return item;
    };

    this.configure = function MenuItemCollection_configure(config) {
        config = this.Motif$Collections$Hashtable.configure(config);
        if (config.parent) {
            this.parent = config.parent;
        }
        return config;
    };

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};