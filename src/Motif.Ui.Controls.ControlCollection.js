Motif.Page.include("Motif.Collections.List.js");

/**
 * Control collection object
 * @constructor
 * @extends Motif.Collections.List
 * @requires Motif.Collections.List
 * @author Rayraegah
 */
Motif.Ui.Controls.ControlCollection = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Collections.List");
    this.__class.push("Motif.Ui.Controls.ControlCollection");

    this.parentElement = null;

    this.enableDomUpdate = function() {
        var events = ["onadd", "onaddrange", "oninsert", "oninsertrange", "onremove", "onremoveall"];
        for (var i = 0; i < events.length; i++) {
            this.attachEvent(events[i], this.domhandlers[events[i]]);
        }
    };

    this.disableDomUpdate = function() {
        var events = ["onadd", "onaddrange", "oninsert", "oninsertrange", "onremove", "onremoveall"];
        for (var i = 0; i < events.length; i++) {
            this.detachEvent(events[i], this.domhandlers[events[i]]);
        }
    };

    this.configure = function ControlCollection_configure(config) {
        config = this.Motif$Collections$List.configure(config);
        if (config.parentElement) {
            this.parentElement = config.parentElement;
        }
        if (config.domUpdate === true) {
            this.enableDomUpdate();
        }
        if (config.domUpdate === false) {
            this.disableDomUpdate();
        }
        return config;
    };

    /** @ignore */
    this.main = function ControlCollection_main(config) {
        this.domhandlers = {};
        this.domhandlers.onadd = function ControlCollection_onadd(value) {
            if (this.parentElement == null) {
                return;
            }
            if (value.element && value.element.parentNode !== this.parentElement)
                this.parentElement.appendChild(value.element);
        };
        this.domhandlers.onaddrange = function ControlCollection_onaddrange(items) {
            if (this.parentElement == null) {
                return;
            }
            for (var i = 0; i < items.length; i++)
                if (items[i].element && items[i].element.parentNode !== this.parentElement)
                    this.parentElement.appendChild(items[i].element);
        };
        this.domhandlers.oninsert = function ControlCollection_oninsert(index, value) {
            if (this.parentElement == null) {
                return;
            }
            var next = this.getItem(index + 1, null);
            if (value.element && value.element.parentNode !== this.parentElement)
                this.parentElement.insertBefore(value.element, next);
        };
        this.domhandlers.oninsertrange = function ControlCollection_oninsertrange(index, items) {
            if (this.parentElement == null) {
                return;
            }
            var next = this.getItem(index + 1, null);
            for (var i = 0; i < items.length; i++)
                if (items[i].element && items[i].element.parentNode !== this.parentElement)
                    this.parentElement.insertBefore(items[i].element, next);
        };
        this.domhandlers.onremove = function ControlCollection_onremove(items) {
            if (this.parentElement == null) {
                return;
            }
            for (var i = 0; i < items.length; i++)
                if (items[i].element && items[i].element.parentNode === this.parentElement)
                    this.parentElement.removeChild(items[i].element);
        };
        this.domhandlers.onremoveall = function ControlCollection_onremoveall(items) {
            if (this.parentElement == null) {
                return;
            }
            for (var i = 0; i < items.length; i++)
                if (items[i].element && items[i].element.parentNode !== this.parentElement)
                    this.parentElement.removeChild(items[i].element);
        };
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};