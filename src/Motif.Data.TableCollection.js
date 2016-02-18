Motif.Page.include("Motif.Collections.Hashtable.js");
Motif.Page.include("Motif.Data.Source.js");
Motif.Page.include("Motif.Data.Table.js");

/**
 * Table collection
 * @extends Motif.Collections.Hashtable
 * @requires Motif.Collections.Hashtable
 * @requires Motif.Data.Source
 * @requires Motif.Data.Table
 * @constructor
 * @author Rayraegah
 */
Motif.Data.TableCollection = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Collections.Hastable");
    this.__class.push("Motif.Data.TableCollection");

    /** Reference to a parent object if any @type Motif.Data.Source */
    this.parent = null;

    /** Configure this table collection @type Motif.Data.TableCollectionConfig */
    this.configure = function TableCollection_configure(config) {
        config = this.Motif$Collections$Hashtable.configure(config);
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
 * Table collection configuration object
 * @constructor
 * @author Rayraegah
 */
Motif.Data.TableCollectionConfig = function() {
    /** Reference to a parent object if any @type Motif.Data.Source */
    this.parent = null;
};