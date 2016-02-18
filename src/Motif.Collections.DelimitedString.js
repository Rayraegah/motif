Motif.Page.include("Javascript.Prototype.String.js");
Motif.Page.include("Motif.Collections.Hashtable.js");

/** 
 * The delimited string provides string to hastable mapping
 * @constructor
 * @extends Motif.Collections.Hashtable
 * @requires Motif.Collections.Hashtable
 * @author Rayraegah
 */
Motif.Collections.DelimitedString = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Collections.Hashtable");
    this.__class.push("Motif.Collections.DelimitedString");

    /** Delimiter string @type String */
    this.delimiter = ";";

    /** Assignment string @type String */
    this.assigner = "=";

    /** Loads the string into the collection, splitted by delimiter and assinger. The second boolean argument indicates whether keys should be appended on true else the collection is cleared. */
    this.fromString = function(value, append) {
        if (!append) {
            this.removeAll();
        }
        if (!Motif.Type.isString(value)) {
            return;
        }
        var vals = value.split(this.delimiter);
        for (var i = 0; i < vals.length; i++) {
            if (vals[i].indexOf(this.assigner) != -1) {
                var key = vals[i].substr(0, vals[i].indexOf(this.assigner));
                var value = vals[i].substr(vals[i].indexOf(this.assigner) + 1);

                if (Motif.Type.isString(key) && key.length > 0) {
                    this.add(key.trim(), value);
                }
            }
        }
    };

    /** Joins the values with assinger and delimiter @type String */
    this.toString = function() {
        var arr = [];
        for (e in this.item) {
            arr.push(e + this.assigner + this.item[e]);
        }
        return arr.join(this.delimiter);
    };

    /** Configure this object @type Motif.Collection.DelimitedStringConfig */
    this.configure = function(config) {
        config = this.Motif$Collections$Hastable.configure(config);

        if (config.delimiter) {
            this.delimiter = config.delimiter;
        }
        if (config.assigner) {
            this.assigner = config.assigner;
        }
        if (config.value) {
            this.fromString(config.value);
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
 * The delimited string configuration object
 * @constructor
 * @author Rayraegah
 */
Motif.Collections.DelimitedStringConfig = function() {
    /** Delimiter char @type String */
    this.delimiter = "";
    /** Assigning char @type String */
    this.assigner = "";
    /** Delimted string value which will be loaded with the fromString method @type String */
    this.value = "";
};