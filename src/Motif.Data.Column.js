Motif.Page.include("Motif.Data.ColumnCollection.js");

/**
 * The data column object describes a single data item
 * @extends Motif.Object
 * @requires Motif.Object
 * @requires Motif.Data.ColumnCollection
 * @constructor
 * @author Rayraegah
 */
Motif.Data.Column = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Data.Column");

    /** Reference to a parent column collection object if any @type Motif.Data.ColumnCollection */
    this.parent = null;
    /** Ordinal position @type Number */
    this.ordinal = -1;
    /** Name of the column @type String */
    this.name = "";
    /** Label of the column, a user friendly name @type String */
    this.label = "";
    /** Column description @type String */
    this.description = "";
    /** Datatype of the column @type String */
    this.datatype = "varchar";
    /** Value of the column @type Object */
    this.value = null;
    /** Default value of the column @type Object */
    this.default = null;

    /** Configure this column object @type Motif.Data.ColumnConfig */
    this.configure = function Column_configure(config) {
        config = this.Motif$Object.configure(config);
        if (config.parent) {
            this.parent = config.parent;
        }
        if (Motif.Type.isNumber(config.ordinal)) {
            this.ordinal = config.ordinal;
        }
        if (config.name) {
            this.name = config.name;
        }
        if (config.label) {
            this.label = config.label;
        }
        if (config.description) {
            this.description = config.description;
        }
        if (config.datatype) {
            this.datatype = config.datatype;
        }
        if (config.value) {
            this.value = config.value;
        }
        if (config.default) {
            this.default = config.default;
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
 * Data column configuration object
 * @constructor
 * @author Rayraegah
 */
Motif.Data.ColumnConfig = function() {
    /** Reference to a parent column collection object if any @type Motif.Data.ColumnCollection */
    this.parent = null;
    /** Ordinal position @type Number */
    this.ordinal = -1;
    /** Name of the column @type String */
    this.name = "";
    /** Label of the column, a user friendly name @type String */
    this.label = "";
    /** Column description @type String */
    this.description = "";
    /** Datatype of the column @type String */
    this.datatype = "";
    /** Value of the column @type Object */
    this.value = null;
}