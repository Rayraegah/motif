Motif.Page.include("Motif.Collections.List.js");
Motif.Page.include("Motif.Data.Row.js");
Motif.Page.include("Motif.Data.Table.js");

/**
 * Data row collection
 * @extends Motif.Collections.List
 * @requires Motif.Collections.List
 * @requires Motif.Data.Row
 * @requires Motif.Data.Table
 * @constructor
 * @author Rayraegah
 */
Motif.Data.RowCollection = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Collections.List");
    this.__class.push("Motif.Data.RowCollection");

    /** Reference to a parent object if any @type Motif.Data.Table */
    this.parent = null;

    /** Configure this row collection object @type Motif.Data.RowCollectionConfig */
    this.configure = function RowCollection_configure(config) {
        config = this.Motif$Collections$List.configure(config);
        if (config.parent) {
            this.parent = config.parent;
        }
        return config;
    };

    /** @ignore */
    this.main = function RowCollectionConfig_main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};

Motif.Data.RowCollectionConfig = function() {
    /** Reference to a parent object if any @type Motif.Data.Table */
    this.parent = null;
};