/** 
 * HTTP cookie object
 * @constructor 
 * @extends Motif.Object
 * @requires Motif.Object
 * @author Rayraegah
 */
Motif.Net.HttpCookie = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Net.HttpCookie");

    /** Reference name of the cookie @type String */
    this.name = "";
    /** Cookie value @type String */
    this.value = "";
    /** Expiration time @type Date */
    this.expires = null;
    /** Domain of the cookie @type String */
    this.domain = "";
    /** Path of the cookie @type String */
    this.path = "";
    /** Secure indication @type Boolean */
    this.secure = false;

    /** Load the properties from a string */
    this.fromString = function HttpCookie_fromstring(value) {
        var items = value.split(";");
        for (var i = 0; i < items.length; i++) {
            var name = "";
            var val = "";
            if (items[i].indexOf("=") != -1) {
                name = items[i].substr(0, items[i].indexOf("="));
                val = items[i].substr(items[i].indexOf("=") + 1);
            }
            name = name.toLowerCase();

            if (name == "expires") {
                this.expires = new Date(val);
            } else if (name == "secure") {
                this.secure = val != "" ? val === "true" : true;
            } else {
                this[name] = val;
            }
        }
    };

    /** Join the properties to string which is compatible with document.cookie @type String */
    this.toString = function HttpCookie_toString() {
        return this.name + "=" + escape(this.value) + ";" + (this.expires != null ? "expires=" + this.expires.toGMTString() + ";" : "") + (this.domain != "" ? "domain=" + this.domain + ";" : "") + (this.path != "" ? "path=" + this.path + ";" : "") + (this.secure ? "secure;" : "");
    };

    /** Configure this cookie @type Motif.Net.HttpCookieConfig */
    this.configure = function HttpCookie_configure(config) {
        config = this.Motif$Object.configure(config);
        if (config.name) {
            this.name = config.name;
        }
        if (config.value) {
            this.value = config.value;
        }
        if (config.expires) {
            if (Motif.Type.isDate(config.expires)) {
                this.expires = config.expires;
            } else {
                this.expires = new Date(config.expires);
            }
        }
        if (Motif.Type.isNumber(config.expirationDays)) {
            this.expires = new Date();
            this.expires.setDate(this.expires.getDate() + config.expirationDays);
        }
        if (config.path) {
            this.path = config.path;
        }
        if (config.secure) {
            this.secure = config.secure === true;
        }
        return config;
    };

    /** @ignore */
    this.main = function HttpCookie_main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};

/** 
 * Cookie configuration object
 * @constructor 
 * @author Rayraegah
 */
Motif.Net.HttpCookieConfig = function() {
    /** The name of the cookie @type String */
    this.name = "";
    /** The value of the cookie @type String */
    this.value = "";
    /** Expiration date @type String */
    this.expires = "";
    /** Amount of days at which the cookie will expire */
    this.expirationDays = 0;
    /** The domain of the cookie @type String */
    this.domain = "";
    /** The path of the cookie @type String */
    this.path = "";
    /** Indication whether it's a secure cookie or not @type Boolean */
    this.secure = false;

};