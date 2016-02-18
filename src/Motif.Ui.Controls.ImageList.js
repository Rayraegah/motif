Motif.Page.include("Motif.Collections.List.js");

Motif.Ui.Controls.ImageList = function(config) {
    /** @ignore */
    this.inheritFrom = Motif.Object;
    this.inheritFrom();
    this.__class.push("Motif.Ui.Controls.ImageList");

    this.images = new Motif.Collections.List;

    this.add = function() {

    };

    this.main = function ImageList_main(config) {

    };
    this.main(config);
};