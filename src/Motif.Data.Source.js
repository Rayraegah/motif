Motif.Page.include("Motif.Data.TableCollection.js");

/**
 * Data source object
 * @requires Motif.Data.TableCollection
 * @constructor
 * @author Rayraegah
 */
Motif.Data.Source = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Data.Source");

    /** Collection of tables in this data source @type Motif.Data.TableCollection */
    this.tables = new Motif.Data.TableCollection();

    /** @ignore */
    this.main = function Source_main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};