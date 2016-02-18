/** 
 * Simple object collection wich holds key / value pairs. 
 * The object's constructor takes 1 argument of type Object of wich all members will be added as item.
 * @extends Motif.Object
 * @requires Motif.Object
 * @constructor 
 */
Motif.Collections.Hashtable = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Collections.Hashtable");

    /** Item object with the keys as property @type Object */
    this.items = {};

    /** Represents the amount of collected items @type Number */
    this.count = 0;

    /** Get a value form the collection by key @type Object */
    this.getItem = function(key, substitute) {
        return key in this.items ? this.items[key] : substitute;
    };

    /** Get a value form the collection by key parsed to Number @type Number */
    this.getInt = function(key) {
        var ret = parseInt(this.items[key]);
        return isNaN(ret) ? 0 : ret;
    };

    /** Get a value form the collection by key parsed to Number @type Number */
    this.getFloat = function(key) {
        var ret = parseFloat(this.items[key]);
        return isNaN(ret) ? 0 : ret;
    };

    /** Get a value form the collection by key parsed to Boolean @type Boolean */
    this.getBoolean = function(key) {
        if (this.items[key] === false || this.items[key] == "false") {
            return false;
        }
        if (this.items[key] === true || this.items[key] == "true") {
            return true;
        }
        return this.getInt(key) != 0;
    };

    /** Set the value of an item in the collection referenced by key. Returns the add object @type Object */
    this.add = function(key, value) {
        var add = !this.contains(key);
        if (add) {
            this.fireEvent("onadd", [key, value]);
            this.count++;
        } else {
            this.fireEvent("onchange", [key, this.items[key], value]);
        }
        this.items[key] = value;
        return value;
    };

    /** Get the items as array, same as getValues @type Object[] */
    this.toArray = function() {
        return this.getValues();
    };

    /** Get the items as array @type Object[] */
    this.getValues = function() {
        var ret = [];
        for (e in this.items) {
            if (this.items[e] == Object.prototype[e]) {
                continue;
            }
            ret.push(this.items[e]);
        }
        return ret;
    };

    /** Get the keys as array @type String[] */
    this.getKeys = function() {
        var ret = [];
        for (e in this.items) {
            if (this.items[e] == Object.prototype[e]) {
                continue;
            }
            ret.push(e);
        }
        return ret;
    };

    /** Sort the collection by keys */
    this.sort = function() {
        var keys = this.getKeys();
        var values = [];
        keys.sort();
        for (var i = 0; i < keys.length; i++)
            values.push(this.items[keys[i]]);

        this.removeAll();
        this.count = keys.length;

        for (var i = 0; i < keys.length; i++)
            this.items[keys[i]] = values[i];
    };

    /** Remove an item from the collection */
    this.remove = function(key) {
        var ret = null;
        if (this.contains(key)) {
            this.fireEvent("onremove", [key, this.items[key]]);
            ret = this.items[key]
            delete this.items[key];
            this.count--;
        }
        return ret;
    };

    /** Remove all items from the collection */
    this.removeAll = function() {
        var ret = [];
        for (e in this.items) {
            if (this.items[e] == Object.prototype[e]) {
                continue;
            }
            ret.push(this.items[e]);
        }
        this.fireEvent("onremoveall", ret);
        this.items = {};
        this.count = 0;
        return ret;
    };

    /** Indication whether a key remains with the collection */
    this.contains = function(key) {
        return key in this.items;
    };

    /** Loops through the items, if the parameter equals a key it returns it at first occurence @type String */
    this.indexOf = function(value) {
        for (e in this.items)
            if (this.items[e] === value)
                return e;
    };

    /** Loops through the items, if the parameter equals a key it will by added to the result array @type String[] */
    this.search = function(value) {
        var ret = [];
        for (e in this.items) {
            if (this.items[e] == Object.prototype[e]) {
                continue;
            }
            if (this.items[e] === value) {
                ret.push(e);
            }
        }
        return ret;
    };

    /** Clone the hastable @type Motif.Collections.HashTable */
    this.clone = function() {
        return new Motif.Collections.Hashtable({
            items: this.items
        });
    };

    /** Rename a key */
    this.rename = function(oldKey, newKey) {
        if (!this.contains(oldKey) || this.contains(newKey) || oldKey == newKey) {
            return;
        }
        this.items[newKey] = this.items[oldKey];
        delete this.items[oldKey];
    };

    /** Configure this hashtable @type Motif.Collections.HashtableConfig */
    this.configure = function(config) {
        config = this.Motif$Object.configure(config);
        if (config.items) {
            for (e in config.items) {
                if (config.items[e] == Object.prototype[e]) {
                    continue;
                }
                this.items[e] = config.items[e];
                this.count++;
            }
        }
        return config;
    };

    /** Event that fires when a new key / value pair is added */
    this.onadd = function(key, value) {};

    /** Event that fires when a value changed */
    this.onchange = function(key, value) {};

    /** Event that fires when an item is removed */
    this.onremove = function(key, value) {};

    /** Event that fires when an item is removed */
    this.onremoveall = function(values) {};

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};