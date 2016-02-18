
Motif.Page.include("Motif.Collections.Hashtable.js");
Motif.Page.include("Motif.Net.HttpCookie.js");

/** 
 * Collection of cookies, loads document.cookie into an 'item' object 
 * @constructor 
 * @extends Motif.Collections.Hashtable
 * @requires Motif.Collections.Hashtable
 * @requires Motif.Net.HttpCookie
 * @author Rayraegah
 */
Motif.Net.HttpCookieCollection = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Collections.Hashtable");
    this.__class.push("KWik.Net.HttpCookieCollection");

    /** Sets the new cookie or overwrites an existing @type Motif.Net.HttpCookie */
    this.add = function HttpCookieCollection_setCookie(cookie) {
        document.cookie = cookie.toString();
        this.Motif$Collections$Hashtable.add(cookie.name, cookie);
    };

    /** Remove a cookie */
    this.remove = function HttpCookieCollection_remove(name) {
        var cookie = this.Motif$Collections$Hashtable.remove(cookie.name, cookie);
        cookie.value = "";
        cookie.expires = new Date(1800, 1, 1);
        document.cookie = cookie.toString();
    };

    /** Remove all cookies from the collection @type Motif.Net.HttpCookie[] */
    this.removeAll = function() {
        var cookies = this.Motif$Collections$Hashtable.removeAll();
        for (var i = 0; i < cookies.length; i++) {
            cookies[i].value = "";
            cookies[i].expires = new Date(1800, 1, 1);
            document.cookie = cookies[i].toString();
        }
        return cookies;
    };

    /** Get the integer value of a cookie @type Boolean */
    this.getInt = function(key) {
        var ret = this.getItem(key, null);
        ret = ret != null ? parseInt(ret.value) : 0;
        return isNaN(ret) ? 0 : ret;
    };

    /** Get the float value of a cookie @type Boolean */
    this.getFloat = function(key) {
        var ret = this.getItem(key, null);
        ret = ret != null ? parseFloat(ret.value) : 0;
        return isNaN(ret) ? 0 : ret;
    };

    /** Get the boolean value of a cookie @type Boolean */
    this.getBoolean = function(key) {
        var ret = this.getItem(key, null);
        if (ret == null) {
            return false;
        }
        if (ret.value == "true" || this.getInt(key) != 0) {
            return true;
        }
        return false;
    };

    /** Clone this cookie collection @type Motif.Net.HttpCookieCollection */
    this.clone = function() {
        return new Motif.Net.HttpCookieCollection({
            items: this.items
        });
    };

    /** @ignore */
    this.main = function HttpCookieCollection_main(config) {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var name = cookies[i].substr(0, cookies[i].indexOf("="));
            var value = cookies[i].substr(cookies[i].indexOf("=") + 1);
            this.items[name] = new Motif.Net.HttpCookie({
                name: name,
                value: unescape(value)
            });
        };
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};