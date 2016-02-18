/**
 * List animations 
 * @constructor
 */
Motif.Ui.Animations.List = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Ui.Animations.List");

    this._list = [];

    this.element = null;
    this.status = 0;
    this.current = 0;
    this.isPaused = false;
    this.isPlaying = false;

    this.play = function() {

    };

    this.pause = function() {

    };

    this.stop = function() {

    };

    this.add = function(animation) {
        animation.index = this._list.push(animation) - 1;
        if (this.element != null) {
            animation.setElement(this.element);
        }
    };

    this.remove = function(index) {
        if (!Motif.Type.isNumber(index)) {
            throw new Error("Motif.Ui.Animations.List.remove: Wrong parameter type, Number expected.");
        }
        if (index >= this._list.length || index < 0) {
            throw new Error("Motif.Ui.Animations.List.remove: Parameter index out of range.");
        }

    };

    this.setElement = function(element) {
        this.element = element;
        for (var i = 0; i < this._list.items.length; i++) {
            this._list.items.setElement(element);
        }
    };

    /** @ignore */
    this.main = function(config) {
        this.configure(config);
    };
    this.main(config);
};