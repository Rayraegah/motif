Motif.Page.include("Motif.Collections.Hashtable.js");
Motif.Page.include("Motif.Data.Column.js");
Motif.Page.include("Motif.Data.Table.js");

/**
 * Data column collection
 * @extends Motif.Collection.Hashtable
 * @requires Motif.Collection.Hashtable
 * @requires Motif.Data.Column
 * @requires Motif.Data.Table
 * @constructor
 * @author Rayraegah
 */
Motif.Data.ColumnCollection = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Collections.Hashtable");
    this.__class.push("Motif.Data.ColumnCollection");

    /** Reference to a parent object @type Motif.Data.Table */
    this.parent = null;

    /** Add a column to this collection @type Motif.Data.Column */
    this.add = function ColumnCollection_add(name, column) {
        column = column || new Motif.Data.Column({
            name: name
        });
        column.parent = this;
        return this.Motif$Collections$Hastable.add(name, column);
    };

    /** Configure this column collection @type Motif.Data.ColumnCollectionConfig */
    this.configure = function ColumnCollection_configure(config) {
        config = this.Motif$Collections$Hashtable.configure(config);
        if (config.parent) {
            this.parent = config.parent;
        }
        return config;
    };

    /** @ignore */
    this.main = function ColumnCollection_main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};