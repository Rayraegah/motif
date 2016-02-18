Motif.Page.include("Motif.Collections.Hashtable.js");
Motif.Page.include("Motif.Data.RowCollection.js");

/**
 * Data row object
 * @extends Motif.Collections.Hashtable
 * @requires Motif.Collections.Hashtable
 * @requires Motif.Data.RowCollection
 * @constructor
 * @author Rayraegah
 */
Motif.Data.Row = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Collections.Hashtable");
    this.__class.push("Motif.Data.Row");

    /** Reference to a parent object @type Motif.Data.RowCollection */
    this.parent = null;

    /** Configure this row object @type Motif.Data.RowConfig */
    this.configure = function Row_configure(config) {
        config = this.Motif$Object.configure(config);
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

/**
 * Data row configuration object
 * @constructor
 * @author Rayraegah
 */
Motif.Data.RowConfig = function() {
    /** Reference to a parent object @type Motif.Data.RowCollection */
    this.parent = null;
};