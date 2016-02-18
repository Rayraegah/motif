/**
 * Image control 
 * @constructor
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @author Rayraegah
 */
Motif.Ui.Controls.Image = function(config) {
    /** @ignore */
    this.inheritFrom = Motif.Ui.Controls.Control;
    this.inheritFrom();
    this.__class.push("Motif.Ui.Controls.Image");

    /** Get url for the image @type String */
    this.getUrl = function Image_getUrl() {
        return this._image.src;
    };

    /** Set the url for the image */
    this.setUrl = function Image_setUrl(url) {
        this._image.src = url;
    };

    /** Get the alignment for the image @type String */
    this.getAlignment = function Image_getAlignment() {
        return this._image.align;
    };
    /** Set the alignment for the image */
    this.setAlignment = function Image_setAlignment(alignment) {
        this._image.align = alignment;
    };

    /** Internal event handler fired when the element is set */
    this._setElementImage = function Image_setElementImage() {
        Motif.Utility.attachEvent(this.element, "onload", new Function(this.referenceString() + ".fireEvent(\"onload\");"));
    };

    this._configureImage = function Image_configureImage(config) {
        if (!config) {
            return;
        }
        if (config.src) {
            this.setUrl(config.src);
        }
        if (config.url) {
            this.setUrl(config.url);
        }

    };

    /** Event fired when the image is loaded */
    this.onload = function() {};

    /** @ignore */
    this.main = function Image_main(config) {
        this.attachEvent("onsetelement", this._setElementImage);
        this.attachEvent("onconfigure", this._configureImage);
        this.setElement(document.createElement("img"));
        this.configure(config);
    };
    this.main(config);
}