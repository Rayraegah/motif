Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Ui.Devices.Mouse.js");
Motif.Page.include("Motif.Ui.Utility.js");
Motif.Page.include("Motif.Ui.Css.js");
Motif.Page.include("Motif.Ui.Devices.Keymap.js");

/**
 * SelectBox control, supplies scrolling through a list of items 
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @author Rayraegah
 */
Motif.Ui.Controls.SelectBox = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.SelectBox");

    this._trackPosition = false;
    this._mouseTracker = new Motif.Ui.Devices.MouseTracker();
    this._optionPositions = [];
    this._optionValues = [];
    this._props = {
        scroll: "scrollLeft",
        dimension: "w"
    };

    this.options = [];
    this.selected = [];
    this.type = Motif.Ui.Controls.SelectBoxType.Horizontal;
    this.scrollAmount = 30;

    this.setValue = function SelectBox_setValue(list) {
        if (!Motif.Type.isArray(list)) {
            throw new Error("Motif.Ui.Controls.SelectBox.setValue: Incorrect parameter specified, expected Array.");
        }

        this.selected.splice(0, this.selected.length);
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < this._optionValues.length; j++) {
                if (list[i] === this._optionValues[j]) {
                    this.select(i);
                    break;
                }
            }
        }
    };

    this.getValue = function SelectBox_getValue() {
        var list = [];
        for (var i = 0; i < this.selected.length; i++)
            if (this._optionValues[this.selected[i]])
                list.push(this._optionValues[this.selected[i]]);

        return list;
    };

    /** Get the position of an option by index {x,y} @type Object */
    this.getPositionByIndex = function SelectBox_getPositionByIndex(index) {
        if (index < 0 && index < this._optionPositions.length) {
            return null;
        }
        return this._optionPositions[index];
    };

    /** Get the option value by index @type String */
    this.getValueByIndex = function SelectBox_getValueByIndex(index) {
        if (index < 0 && index < this._optionPositions.length) {
            return "";
        }
        return this._optionValues[index];
    };

    /** Get index for a value @type Number */
    this.getIndexByValue = function SelectBox_getIndexByValue(value, exact) {
        exact = exact != false;
        var list = [];
        for (var i = 0; i < this._optionValues.length; i++)
            if (value === this._optionValues[i] || !exact && this._optionValues[i].replace(new RegExp("'" + value + "'", "ig"), "").length < this._optionValues[i].length)
                list.push(i);

        return list;
    };

    /** Set the type for this selectbox, and refreshes it @type Motif.Ui.Controls.SelectBox */
    this.setType = function SelectBox_setType(value) {
        if (this.type === value) {
            return;
        }
        this.type = value;
        this.refresh();
        return this;
    };

    /** Select an option by index @type Motif.Ui.Controls.SelectBox */
    this.select = function SelectBox_select(index) {
        if (index < 0 || index > this.options.length) {
            throw new Error("Motif.Ui.Controls.SelectBox.select: Index out of range.");
        }

        if (this.multiselect) {
            var selected = this.getSelectedIndex(index);
            if (selected == -1) {
                Motif.Ui.Css.addClassName(this.options[index], "Selected");
                this.selected.push(index);
            } else {
                Motif.Ui.Css.removeClassName(this.options[index], "Selected");
                this.selected.splice(selected, 1);
            }
        } else {
            if (this.getSelectedIndex(index) != -1) {
                return;
            }
            for (var i = 0; i < this.options.length; i++)
                Motif.Ui.Css.removeClassName(this.options[i], "Selected");

            Motif.Ui.Css.addClassName(this.options[index], "Selected");
            this.selected.splice(0, this.selected.length);
            this.selected.push(index);
        }

        var scroll = this.element.scrollLeft;

        this.options[index].focus();

        this.element.scrollLeft = scroll;

        this.fireEvent("onchange", [index]);
        return this;
    };

    this.getSelectedIndex = function SelectBox_isSelected(index) {
        for (var i = 0; i < this.selected.length; i++)
            if (index === this.selected[i])
                return i;

        return -1;
    };

    /** Resets the selectbox depending on the child elements and type */
    this.refresh = function SelectBox_refresh() {
        var total = {
            w: 0,
            h: 0
        };
        this.element.scrollLeft = this.element.scrollTop = 0;
        for (var i = 0, len = this.inner.childNodes.length; i < len; i++) {
            var node = this.inner.childNodes[i];
            node.tabIndex = this.ptr + i;
            this.options.push(node);

            node.onselectstart = function(e) {
                e = e || event;
                e.cancelBubble = true;
                return false;
            }
            node.ondragstart = function(e) {
                e = e || event;
                e.cancelBubble = true;
                return false;
            }
            node.style.MozUserSelect = "none";
            node.onclick = null;
            node.onkeypress = null;
            Motif.Utility.attachEvent(node, "onmouseup", new Function(this.referenceString() + "._itemSelect(" + i.toString() + ");"));
            Motif.Utility.attachEvent(node, "onkeypress", new Function("e", "e=e||event; if(e.keyCode == Motif.Ui.Devices.Keymap.Space){" + this.referenceString() + "._itemSelect(" + i.toString() + ");}"));

            var dim = Motif.Ui.Utility.getOuterDimension(node);
            total.w += dim.w;
            total.h += dim.h;

            this._optionPositions.push({
                x: total.w,
                y: total.h
            });

            var value = node.getAttribute("motifvalue");
            this._optionValues.push(value || "");
        }

        if (this.type === Motif.Ui.Controls.SelectBoxType.Horizontal) {
            Motif.Ui.Css.removeClassName(this.element, "Vertical");
            Motif.Ui.Css.addClassName(this.element, "Horizontal");
            this.inner.style.width = total.w.toString() + "px";
            this._props.scroll = "scrollLeft";
            this._props.dimension = "w";
        }
        if (this.type === Motif.Ui.Controls.SelectBoxType.Vertical) {
            Motif.Ui.Css.removeClassName(this.element, "Horizontal");
            Motif.Ui.Css.addClassName(this.element, "Vertical");
            this.inner.style.height = total.h.toString() + "px";
            this._props.scroll = "scrollTop";
            this._props.dimension = "h";
        }

    };

    this.shiftPrevious = function SelectBox_shiftPrevious() {
        this.shiftBy(this.scrollAmount * -1);
    };

    this.shiftNext = function SelectBox_shiftNext() {
        this.shiftBy(this.scrollAmount);
    };

    /** Shift the inner element by the specified amount of pixels, returns true when changed @Boolean */
    this.shift = function SelectBox_shift(amount) {
        if (!Motif.Type.isNumber(amount)) {
            throw new Error("Motif.Ui.Controls.SelectBox.shift: Invalid parameter specified.");
        }

        if (amount == this.element[this._props.scroll]) {
            return false;
        }

        var inner = Motif.Ui.Utility.getDimension(this.inner);
        var outer = Motif.Ui.Utility.getDimension(this.element);

        var min = 0,
            max = (inner[this._props.dimension] - outer[this._props.dimension]);

        if (amount < min) {
            amount = min;
        }
        if (amount > max) {
            amount = max;
        }

        if (amount != this.element[this._props.scroll]) {
            this.element[this._props.scroll] = amount;
            return true;
        }
        return false;
    };

    /** Shift the inner element by the specified amount of pixels, returns true when changed @type Boolean */
    this.shiftBy = function SelectBox_shiftBy(amount) {
        return this.shift(this.element[this._props.scroll] - amount);
    };

    /** Sets the control element and adds the inner element to it's element */
    this.setElement = function SelectBox_setElement(element) {
        this.Motif$Ui$Controls$Control.setElement(element);
        this.element.appendChild(this.inner);
        this.refresh();
        this.attachEvent("onmousedown", this._mouseDown);
        return this.element;
    };

    this.enableWheel = function() {
        this.attachEvent("onmousewheel", this._mouseWheel);
    };

    this.disableWheel = function() {
        this.detachEvent("onmousewheel", this._mouseWheel);
    }

    this.load = function SelectBox_load(element) {
        var list = [];
        for (var i = element.childNodes.length - 1; i >= 0; i--) {
            var node = element.removeChild(element.childNodes[i]);
            if (node.nodeType === 1) {
                list.push(node);
            }
        }
        list.reverse();
        this.Motif$Ui$Controls$Control.load(element);

        for (var i = 0; i < list.length; i++) {
            this.inner.appendChild(list[i]);
        }
        this.refresh();
    };

    this.configure = function SelectBox_configure(config) {
        config = this.Motif$Ui$Controls$Control.configure(config);
        if (config.wheel === true) {
            this.enableWheel();
        }
        if (config.wheel === false) {
            this.disableWheel();
        }
        if (Motif.Type.isNumber(config.scrollAmount)) {
            this.scrollAmount = config.scrollAmount;
        }

        return config;
    };

    this._trackerButtonChange = function SelectBox__trackerButtonChange() {
        this._mouseTracker.stop();
    };

    this._trackerPositionChange = function(oldx, oldy, newx, newy, diffx, diffy) {
        var change = this.type == Motif.Ui.Controls.SelectBoxType.Vertical ? diffy : diffx;
        if (change !== 0)
            if (this.shiftBy(change))
                this._positionChanged = true;
    };

    this._itemSelect = function SelectBox__itemSelect(index) {
        if (this._positionChanged === true) {
            return;
        }
        this.select(index);
    };

    this._mouseDown = function SelectBox__mouseDown(evt) {
        this._positionChanged = false;
        this._mouseTracker.start(evt.srcEvent);
    };

    this._mouseWheel = function SelectBox_mouseWheel(evt) {
        if (evt.wheelDelta > 0) {
            this.shiftNext();
        }
        if (evt.wheelDelta < 0) {
            this.shiftPrevious();
        }
        evt.cancel();
    };

    /** Event fired when the selection changes */
    this.onchange = function(index) {};

    /** @ignore */
    this.main = function SelectBox_main(config) {
        this.inner = document.createElement("div");
        this.inner.className = "Inner";

        this._mouseTracker.attachEvent("onbuttonchange", new Function(this.referenceString() + "._trackerButtonChange()"));
        this._mouseTracker.attachEvent("onpositionchange", new Function("oldx", "oldy", "newx", "newy", "diffx", "diffy", this.referenceString() + "._trackerPositionChange(oldx, oldy, newx, newy, diffx, diffy)"));

        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};

Motif.Ui.Controls.SelectBoxType = {
    Horizontal: 0,
    Vertical: 1
};