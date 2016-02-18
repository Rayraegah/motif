Motif.Page.include("Motif.Data.ColumnCollection.js");
Motif.Page.include("Motif.Data.RowCollection.js");

/**
 * Data table object, joins rows and columns
 * @extends Motif.Object
 * @requires Motif.Object
 * @requires Motif.Data.ColumnCollection
 * @requires Motif.Data.RowCollection
 * @requires Motif.Data.TableCollection
 * @requires Motif.Object
 * @constructor
 * @author Rayraegah
 */
Motif.Data.Table = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Data.Table");

    /** Reference to a parent object if any @type Motif.Data.TableCollection */
    this.parent = null;
    /** Table name @type String */
    this.name = "";

    /** Column collection for this table @type Motif.Data.ColumnCollection */
    this.columns = new Motif.Data.ColumnCollection({
        parent: this
    });
    /** Row collection for this table @type Motif.Data.RowCollection */
    this.rows = new Motif.Data.RowCollection({
        parent: this
    });

    /** Configure this table object @type Motif.Data.TableConfig */
    this.configure = function Table_configure(config) {
        config = this.Motif$Object.configure(config);
        if (config.parent) {
            this.parent = config.parent;
        }
        if (config.name) {
            this.name = config.name;
        }
        return config;
    };

    /** @ignore */
    this.main = function Table_main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};

/**
 * Data table configuration object
 * @constructor
 * @author Rayraegah
 */
Motif.Data.TableConfig = function() {
    /** Reference to a parent object if any @type Motif.Data.TableCollection */
    this.parent = null;
    /** Table name @type String */
    this.name = "";
};