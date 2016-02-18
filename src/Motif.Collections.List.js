/** 
 * Object with advanced array manipulation options.
 * @extends Motif.Object
 * @requires Motif.Object
 * @constructor 
 * @author Rayraegah
 */
Motif.Collections.List = function(arr) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Collections.List");

    /** Internal data array @type Array */
    this.items = [];

    /** Amount of items in the list @type Number */
    this.count = 0;

    /** Add an object to the list and returns the added value @type Object */
    this.add = function(value) {
        var cancel = this.fireEvent("onbeforeadd", [value]);
        if (cancel === true) {
            return value;
        }
        this._insertRange(this.items.length, [value]);
        this.fireEvent("onadd", [value]);
        return value;
    };

    /** Add a range of object to the list and returns it @type Object[] */
    this.addRange = function(arr) {
        var cancel = this.fireEvent("onbeforeaddrange", [arr]);
        if (cancel === true) {
            return arr;
        }
        this._insertRange(this.items.length, arr);
        this.fireEvent("onaddrange", [arr]);
        return arr;
    };

    /** Insert a value at the specified index and retruns it @type Object */
    this.insert = function(index, value) {
        var cancel = this.fireEvent("onbeforeinsert", [index, value]);
        if (cancel === true) {
            return value;
        }
        this._insertRange(index, [value]);
        this.fireEvent("oninsert", [index, value]);
    };

    /** Insert a range of values at the specified index, the second argument should be an Array or ArrayList @type Object[] */
    this.insertRange = function(index, arr) {
        if (arr && arr.items) {
            arr = arr.items;
        }
        if (!Motif.Type.isArray(arr)) {
            throw new Error("Motif.Collections.insertRange: Invalid parameter specified.");
        }

        var cancel = this.fireEvent("onbeforeinsertrange", [index, arr]);
        if (cancel === true) {
            return arr;
        }
        this._insertRange(index, arr);
        this.fireEvent("oninsertrange", [index, arr]);
        return arr;
    };

    /** Insert a range of values at the specified index, the second argument should be an Array or ArrayList @type Object[] */
    this._insertRange = function(index, arr) {
        if (arr && arr.items) {
            arr = arr.items;
        }
        if (Motif.Type.isArray(arr)) {
            var arr1 = [];
            if (index < this.items.length) {
                arr1 = this.items.splice(index, this.items.length - index);
            }
            this.items = this.items.concat(arr, arr1);
        }
        this.count = this.items.length;
        return arr;
    };

    /** Clone the list @type Motif.Collections.List */
    this.clone = function() {
        return this.getRange(0, this.items.length);
    };

    /** Check the list for a certain object @type Boolean */
    this.contains = function(value) {
        return this.indexOf(value) != -1;
    };

    /** Get a portion of the list defined by start and count @type Motif.Collections.List */
    this.getRange = function(start, count) {
        return new Motif.Collections.List(this.items.slice(start, count));
    };

    /** Get an item by index, the substitute is returned if defined and the index is out of range @type Object*/
    this.getItem = function(index, substitute) {
        index = parseInt(index);
        if (isNaN(index)) {
            throw new Error("Motif.Collections.List.getItem: Incorrect parameter specified.");
        }
        if (index < 0 || index > this.items.count) {
            return substitute;
        }
        return this.items[index];
    };

    /** Get the index of an object in the list, returns -1 of not found @type Number */
    this.indexOf = function(value) {
        for (var i = 0; i < this.items.length; i++)
            if (this.items[i] === value)
                return i;

        return -1;
    };

    /** Remove one or more values from the list by index and count, returns a list of deleted items @type Motif.Collections.List */
    this.remove = function(index, count) {
        var cancel = this.fireEvent("onbeforeremove", [index, count]);
        if (cancel === true) {
            return new Motif.Collections.List([]);
        }
        count = count ? count : 1;
        var arr = this.items.splice(index, count);
        this.count = this.items.length;
        this.fireEvent("onremove", [arr]);
        return new Motif.Collections.List(arr);
    };

    /** Clear the list */
    this.removeAll = function() {
        var cancel = this.fireEvent("onbeforeremoveall");
        if (cancel === true) {
            return new Motif.Collections.List([]);
        }
        var arr = this.items.splice(0, this.items.length);
        this.count = 0;
        this.fireEvent("onremoveall", [arr]);
        return new Motif.Collections.List(arr);
    };

    /** Reverse the list */
    this.reverse = function() {
        var cancel = this.fireEvent("onbeforereverse");
        if (cancel === true) {
            return;
        }
        this.items = this.items.reverse();
        this.fireEvent("onreverse");
    };

    /** Sort the list */
    this.sort = function() {
        var cancel = this.fireEvent("onbeforeresort");
        if (cancel === true) {
            return;
        }
        var fn = new Function("a", "b", "if(a < b){return -1;} if(a > b){return 1;} return 0;");
        this.items.sort(fn);
        this.fireEvent("onsort");
    };

    /** Sort the list by an object's attribute */
    this.sortBy = function(attr) {
        var cancel = this.fireEvent("onbeforeresort");
        if (cancel === true) {
            return;
        }
        var fn = new Function(
            "a", "b",
            "if(a['" + attr + "'] < b['" + attr + "']){return -1}" + "if(a['" + attr + "'] > b['" + attr + "']){return 1}" + "return 0;"
        );
        this.items.sort(fn)
        this.fireEvent("onsort");
    };

    /** Get the array of the list @type Array */
    this.toArray = function() {
        return new Array(this.items);
    };

    /** Event fired before an item is added, if true it cancels the operation @type Boolean */
    this.onbeforeadd = function(value) {};
    /** Event fired when an item is added */
    this.onadd = function(value) {};
    /** Event fired before a range of items is added, if true it cancels the operation @type Boolean */
    this.onbeforeaddrange = function(values) {};
    /** Event fired when a range of items is added */
    this.onaddrange = function(values) {};
    /** Event fired before an item is inserted, if true it cancels the operation @type Boolean */
    this.onbeforeinsert = function(index, value) {};
    /** Event fired when an item is inserted */
    this.oninsert = function(index, value) {};
    /** Event fired before a range of items is inserted, if true it cancels the operation @type Boolean */
    this.onbeforeinsertrange = function(index, values) {};
    /** Event fired when a range of items is inserted */
    this.oninsertrange = function(index, values) {};
    /** Event fired before sorting items, if true it cancels the operation @type Boolean */
    this.onbeforesort = function() {};
    /** Event fired when sorting items */
    this.onsort = function() {};
    /** Event fired before an item is removed, if true it cancels the operation @type Boolean */
    this.onbeforeremove = function(index, count) {};
    /** Event fired when an item is removed */
    this.onremove = function(items) {};
    /** Event fired before all items are removed, if true it cancels the operation @type Boolean */
    this.onbeforeremoveall = function() {};
    /** Event fired when all items are removed */
    this.onremoveall = function(items) {};

    /** @ignore */
    this.main = function(arr) {
        this.addRange(arr);
    };
    this.main(arr);
};