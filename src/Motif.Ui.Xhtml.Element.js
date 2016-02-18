Motif.Ui.Xhtml.Element = function() {
    Motif.Utility.extend(this, "Motif.Object");

    this._element = null;
    this.setElement = function(element) {
        this._element = element;
    };

    this.getElement = function() {
        return this._element;
    };
};