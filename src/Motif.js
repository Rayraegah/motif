/** Motif base package @singleton */
Motif = {
    __package: 1
};

/** Motif data package @singleton */
Motif.Data = {
    __package: 1
};

/** Motif DOM package @singleton */
Motif.Dom = {
    __package: 1
};

/** Checksum package @singleton */
Motif.Checksum = {
    __package: 1
};

/** Collection package @singleton */
Motif.Collections = {
    __package: 1
};

/** Drawing package @singleton */
Motif.Drawing = {
    __package: 1
};

/** Encryption package @singleton */
Motif.Encryption = {
    __package: 1
};

/** Network related object package @singleton */
Motif.Net = {
    __package: 1
};

/** Ui base package @singleton */
Motif.Ui = {
    __package: 1
};

/** Ui animations package @singleton */
Motif.Ui.Animations = {
    __package: 1
};

/** Ui controls package @singleton */
Motif.Ui.Controls = {
    __package: 1
};

/** Ui controls package @singleton */
Motif.Ui.Devices = {
    __package: 1
};

/** Ui element specific package @singleton */
Motif.Ui.Xhtml = {
    __package: 1
};

/**
 * Motif version
 * @singleton
 * @author Rayraegah
 */
Motif.Version = {
    /** @ignore */
    __class: ["Motif.Version"],
    /** Major version number, 1 @type Number */
    major: 1,
    /** Minor version number, 7 @type Number */
    minor: 7,
    /** Revision number, 14 @type Number */
    revision: 14
};

/**
 * Object registery maintains references to Motif.Object types using pointers which refer to a location in the object array.
 * This supplies the base functionality of global access for Motif.Object types.
 * @singleton
 * @author Rayraegah
 */
Motif.ObjectRegistry = {
    /** List of all registered object @type Motif.Object[] */
    objects: [],
    /** Add an object to the registry, and returns the pointer @type Number */
    add: function(obj) {
        if (Motif.ObjectRegistry.objects.length == 0) {
            Motif.Utility.attachEvent(window, "onunload", Motif.ObjectRegistry.dispose);
        }
        return Motif.ObjectRegistry.objects.push(obj) - 1;
    },

    /** Remove an object from the registry  */
    remove: function(obj) {
        try {
            return Motif.ObjectRegistry.objects.splice(obj.ptr, 1)[0];
        } catch (x) {}
        return null;
    },

    /** Clear the object array and dispose all objects, attached to a window.onunload event */
    dispose: function() {
        while (Motif.ObjectRegistry.objects.length > 0) {
            var obj = Motif.ObjectRegistry.objects.splice(0, 1)[0];
            if (obj && obj.dispose) {
                obj.dispose();
            }
        }
    }
};

/**
 * Base object, supplies event stacking and registration
 * @constructor
 * @author Rayraegah
 */
Motif.Object = function() {
    /** Class identifier list @type string[] */
    this.__class = ["Motif.Object"];

    /** Incremental pointer to this object @type Number */
    this.ptr = Motif.ObjectRegistry.add(this);

    /** Global reference string @type String */
    this.ref = "Motif.ObjectRegistry.objects[" + this.ptr.toString() + "]";

    /** Global reference string @type String */
    this.referenceString = function() {
        return "Motif.ObjectRegistry.objects[" + this.ptr.toString() + "]";
    };

    /** Event by name collection, store the stack of Function objects by event name @type Function[] */
    this.events = {};

    /** Add a handler to an event by name */
    this.attachEvent = function(name, handler) {
        if (!Motif.Type.isFunction(handler)) {
            throw new Error("Motif.Object.attachEvent: Invalid parameter specified, expected: Function or Delegate");
        }
        if (!this.events[name] || !this.events[name].pop) {
            this.events[name] = [];
        }
        this.events[name].push(handler);
    };

    /** Insert a handler into the stack by next index or handler */
    this.insertEvent = function(name, handler, next) {
        if (!Motif.Type.isFunction(handler)) {
            throw new Error("Motif.Object.insertEvent: Invalid parameter specified, expected: Function or Delegate");
        }
        if (!this.events[name] || !this.events[name].pop) {
            this.events[name] = [];
        }
        var index = this.getEventIndex(name, next);
        if (index > -1) {
            var arr = this.events[name].splice(index, this.events[name].length - index);
            this.events[name] = this.events[name].concat(handler, arr);
            return;
        }
        this.events[name].push(handler);
    };

    /** Remove an event from the stack by index or handler @type Function */
    this.detachEvent = function(name, handler) {
        var index = this.getEventIndex(name, handler);
        while (index > -1) {
            this.events[name].splice(index, 1)[0];
            index = this.getEventIndex(name, handler);
        }
        return null;
    };

    /** Drop the entire stack of functions by event name @type Function[] */
    this.clearEvent = function(name) {
        if (this.events[name] && this.events[name].pop) {
            return this.events[name].splice(0, this.events[name].length);
        }
        return [];
    };

    /** Execute all functions by event name and returns the last result @type Object*/
    this.fireEvent = function(name, args) {
        if (!this.events[name]) {
            //Motif.Page.log.write("Motif.Object.fireEvent: Event '" + name + "' does not exist.");
            return;
        }

        args = args || [];
        this.onbeforeevent(name, args);
        var ret = null;

        if (args && !args.push) {
            throw new Error("Motif.Object.fireEvent: Invalid parameter specified for 'args', Array expected.\r\n events['" + name + "][" + i.toString() + "]");
        }

        var arr = this.events[name];
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            ret = arr[i].apply(this, args);
        }
        this.onevent(name, args);
        return ret;
    };

    /** Get an event index by name and handler @type Number */
    this.getEventIndex = function(name, handler) {
        if (!this.events[name] || !this.events[name].pop) {
            return -1;
        }

        var arr = this.events[name];
        var len = arr.length;

        for (var i = 0; i < len; i++)
            if (arr[i] == handler)
                return i;

        return -1;
    };

    /** Get the type name of the class @type String */
    this.getType = function() {
        return this.__class[this.__class.length - 1];
    };

    /** 
     * Configure this object with the supplied parameter.
     * Evaluates the parameter which can be of type object or string and if undefined an empty object is initialized.
     * When a string is specified it will be evaluated to object
     * Finally it scans for event declarations starting with 'on', if found and the event is declared as a function member it will be attached.
     */
    this.configure = function Object_configure(config) {
        if (typeof config == "undefined" || config == null) {
            config = {};
        }
        if (Motif.Type.isString(config)) {
            if (config.charCodeAt(0) != 123) {
                config = ["{", config, "}"].join("");
            }
            try {
                eval("config = " + config);
            } catch (x) {
                throw new Error("Motif.Object.configure: Failed to evaluate config string to object.\r\n" + x.description);
            }
        }

        //scanning for events
        for (m in config) {
            if (config[m] == Object.prototype[m]) {
                continue;
            }
            if (m.substr(0, 2) === "on") {
                var fn = config[m];
                if (Motif.Type.isString(fn)) {
                    try {
                        fn = new Function(fn);
                    } catch (x) {
                        throw new Error("Motif.Object.configure: Failed to initialize function, reason: " + x.description);
                    }
                }
                if (Motif.Type.isFunction(fn)) {
                    this.attachEvent(m, fn);
                    Motif.Page.log.write("Motif.Object.configure: Handler for event '" + m + "' added.");
                }
            }
        }

        this.fireEvent("onconfigure", [config]);
        return config;
    };

    /** Event fired when the object is configured */
    this.onconfigure = function(config) {};
    /** Event fired before the object fires an event */
    this.onbeforeevent = function(eventName, args) {};
    /** Event fired when the object fires an event */
    this.onevent = function(eventName, args) {};
};

/**
 * Delegated task executes a function in a certain context with optional parameters.
 * To delay execution specify a delay, for immidiate execution an autoexec can be defined constructinf the object.
 * @extends Motif.Object
 * @requires Motif.Object
 * @constructor
 * @author Rayraegah
 */
Motif.Delegate = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Delegate");

    /** Task to executed @type Function */
    this.task = null;
    /** Context object to which the task applies @type Object */
    this.context = null;
    /** Arguments for this task @type Object[] */
    this.arguments = [];
    /** Time in milliseconds to delay a task @type Number */
    this.delay = 0;
    /** Internal pointer to a timeout @type Object */
    this._timeout = null;

    /** Execute the task */
    this.execute = function() {
        this.fireEvent("onbeforeexecute");
        if (this._timeout != null) {
            window.clearTimeout(this._timeout);
            this._timeout = null;
        }
        this._timeout = setTimeout("var obj=" + this.referenceString() + "; obj.task.apply(obj.context, obj.arguments);", this.delay);
        this.fireEvent("onexecute");
    };

    /** Cancel the task */
    this.abort = function() {
        this.fireEvent("onbeforeabort");
        if (this._timeout != null) {
            window.clearTimeout(this._timeout);
            this._timeout = null;
        }
        this.fireEvent("onabort");
    };

    this.configure = function Delegate_configure(config) {

        config = this.Motif$Object.configure(config);

        if (Motif.Type.isFunction(config.task)) {
            this.task = config.task;
        }
        if (Motif.Type.isObject(config.context)) {
            this.context = config.context;
        }
        if (Motif.Type.isArray(config.arguments)) {
            this.arguments = config.arguments;
        }
        if (Motif.Type.isNumber(config.delay)) {
            this.delay = config.delay;
        }
        if (config.autoexec === true) {
            this.execute();
        }

        return config;
    };

    /** Event fired before execute */
    this.onbeforeexecute = function() {};
    /** Event fired on execute */
    this.onexecute = function() {};
    /** Event fired before cancel */
    this.onbeforecancel = function() {};
    /** Event fired on cancel */
    this.oncancel = function() {};

    /** @ignore */
    this.main = function Delegate_main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};
/**
 * Logger object which gathers log lines
 * @extends Motif.Object
 * @constructor
 * @author Rayraegah
 */
Motif.Logger = function() {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.Logger");

    /** Indicator whether the log is enabled, logWrite() does not add lines until this is set to true @type Boolean */
    this.enabled = false;
    /** Internal log array to wich lines are added @type String[] */
    this.lines = [];
    /** Write an item to the log, time information will be added. */
    this.write = function Logger_write(line) {
        if (!this.enabled) {
            return;
        }
        this.lines.push(this._prefix() + " " + line);
    };
    /** Log line prefix, a time indicaton hh:mm:ss.fff @type String*/
    this._prefix = function Logger__prefix() {
        var dt = new Date();
        var ret = [dt.getHours().toString(), dt.getMinutes().toString(), dt.getSeconds().toString()];
        for (e in ret) {
            ret[e] = (ret[e].length == 1 ? "0" : "") + ret[e];
        }
        var ms = (dt.getMilliseconds()).toString();
        while (ms.length < 3) {
            ms = "0" + ms;
        }
        return ret.join(":") + "." + ms;
    };
    /** Clear the log */
    this.clear = function Logger_clear() {
        this.lines.splice(0, this.log.length);
    };
    /** Joins the lines to a string @type String */
    this.toString = function Logger_toString() {
        return this.lines.join("\r\n");
    }
};
/**
 * Logger which logs to a HTMLElement
 * @extends Motif.Logger
 * @constructor
 * @author Rayraegah
 */
Motif.PageLogger = function() {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Logger");
    this.__class.push("Motif.PageLogger");

    /** Array of lines written before the document.body was ready @type String[] */
    this._defered = [];
    /** A HTMLDiv to which lines are written @type HTMLDiv */
    this._logElement = null;
    this.isReady = false;
    /** Write a log line to the log element */
    this.write = function PageLogger_write(line) {
        if (this.enabled !== true) {
            return;
        }
        if (!this.isReady) {
            this._defered.push(line);
            return;
        }
        if (this._logElement == null) {
            this._logElement = document.getElementById("PageLogger");
            if (this._logElement == null) {
                this._logElement = document.body.appendChild(document.createElement("div"));
            }
            this._logElement.className = "Motif-PageLogger";
        }

        var div = document.createElement("div");
        div.className = this._logElement.childNodes.length % 2 == 0 ? "Even" : "Odd";
        this._logElement.insertBefore(div, this._logElement.firstChild).innerHTML = this._prefix() + " " + line;

    };

    /** Clear all lines from the log element */
    this.clear = function PageLogger_clear() {
        while (this._logElement.childNodes.length > 0) {
            this._logElement.removeChild(this._logElement.childNodes[0]);
        }
    };

    /** Writes the buffered lines after document.body ready */
    this._windowLoad = function PageLogger__windowLoad() {
        Motif.Page.log.write("Motif.PageLogger._writeDefered: Writing buffered lines.");
        this.isReady = true;

        for (e in this._defered) {
            this.write(this._defered[e]);
        }
    };

    /** @ignore */
    this.main = function PageLogger_main() {
        Motif.Utility.attachEvent(window, "onload", new Function(this.referenceString() + "._windowLoad()"));
    };
    this.main();
};

/**
 * XmlHttpRequest wrapper for asynchronous request
 * @extends Motif.Object
 * @constructor
 * @author Rayraegah
 */
Motif.AsyncRequest = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.AsyncRequest");

    /** Internal XMLHttpRequest object @type XMLHttpRequest */
    this.xhr = Motif.Utility.getXhr();
    /** URL used to get the information from @type String */
    this.url = "";
    /** HTTP request method @type String */
    this.method = "GET";
    /** State of the object, copy of the XMLHttpRequest.readyState property @type Number */
    this.state = 0;
    /** HTTP status code of the response @type Number */
    this.reponseStatus = 0;
    /** XMLDocument if the response contains XML @type XMLDocument */
    this.responseXML = null;
    /** Text from the response @type String */
    this.responseText = "";
    /** Data which is send using the send method, can be String or IStream types @type Object */
    this.requestData = null;

    this.requestHeaders = {};
    this.responseHeaders = {};

    /** Open the request */
    this.open = function(url, method, headers) {
        if (typeof url != "undefined") {
            this.url = url;
        }
        if (typeof method != "undefined") {
            this.method = method;
        }
        if (typeof headers == "object") {
            for (e in headers) {
                this.requestHeaders[e] = headers[e];
            }
        }

        this.xhr.open(this.method, this.url, true);

        for (e in this.requestHeaders) {
            this.xhr.setRequestHeader(e, this.requestHeaders[e]);
        }
    };
    /** Send the data to specified resource */
    this.send = function(data) {
        this.fireEvent("onbeforesend");
        this.xhr.onreadystatechange = new Function(this.referenceString() + "._statechange()");
        this.requestData = data || null;
        this.xhr.send(this.requestData);
        this.fireEvent("onsend");
    };
    /** Abort current request */
    this.abort = function() {
        this.xhr.onreadystatechange = function() {};
        this.xhr.abort();
        this.state = 0;
        this.fireEvent("onabort");
    };
    /** Internal method which tracks state changes */
    this._statechange = function() {
        this.state = this.xhr.readyState;
        if (this.xhr.readyState == 4) {
            var hdrs = this.xhr.getAllResponseHeaders();
            var list = hdrs.split("\n");
            for (var i = 0; i < list.length; i++) {
                var val = list[i].replace(/^\s+|\s+$/g, "");
                if (val.indexOf(":") != -1) {
                    var name = val.substr(0, val.indexOf(":")).replace(/^\s+|\s+$/g, "");
                    var value = val.substr(val.indexOf(":") + 1).replace(/^\s+|\s+$/g, "");
                    this.responseHeaders[name] = value;
                }
            }
            this.responseXML = this.xhr.responseXML;
            this.responseText = this.xhr.responseText;
            this.responseStatus = this.xhr.status;
            this.xhr.onreadystatechange = function() {};
            this.fireEvent("oncomplete");
        }
        this.fireEvent("onstatechange");
    };

    /** Configure this async request @type Object */
    this.configure = function AsyncRequest_configure(config) {
        config = this.Motif$Object.configure(config);
        if (config.url) {
            this.url = config.url;
        }
        if (config.method) {
            this.method = config.method;
        }
        if (config.data) {
            config.requesData = config.data;
        }
        if (config.requesData) {
            this.requestData = config.requestData;
        }
        if (config.headers) {
            config.requestHeaders = config.headers;
        }
        if (config.requestHeaders) {
            for (e in config.requestHeaders)
                this.requestHeaders[e] = config.requestHeaders[e];
        }

        return config;
    };

    /** Event fired when open method is called */
    this.onopen = function() {};
    /** Event fired before sending the data */
    this.onbeforesend = function() {};
    /** Event fired after sending the data */
    this.onsend = function() {};
    /** Event fired when request is complete */
    this.oncomplete = function() {};
    /** Event fired when request is aborted */
    this.onabort = function() {};
    /** Event fired when the state changes */
    this.onstatechange = function() {};

    /** @ignore */
    this.main = function AsyncRequest_Main(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};

/**
 * Loader for compiling scripts
 * @extends Motif.Object
 * @constructor
 * @author Rayraegah
 */
Motif.ScriptLoader = function(dependencyFilter) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Object");
    this.__class.push("Motif.ScriptLoader");

    /** Initial script name used for setting dependency path @type String */
    this.bootScript = "Motif.js";
    /** Path to dependency files @type String */
    this.path = "";
    /** Script loading or loaded with this loader @type Object */
    this.scripts = {};
    /** Filter to match dependency inclusion @type RegExp */
    this.dependencyFilter = dependencyFilter || /^[\w{1,}\.]{1,}include\("([\w\.]{1,})"\);$/igm;

    /** Method for including scripts, the first call will set the path and adds current scripts from the HTML head @type Motif.Script */
    this.include = function(scriptName) {
        if (scriptName == null || scriptName == "") {
            return null;
        }
        if (scriptName.toLowerCase() in this.scripts) {
            Motif.Page.log.write("Motif.ScriptLoader.include: Script '" + scriptName + "' in collection exiting.");
            return this.scripts[scriptName.toLowerCase()];
        }

        if (this.path.length == 0) {
            var list = document.documentElement.getElementsByTagName("script");
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i].src.length != 0) {
                    Motif.Page.log.write("Motif.ScriptLoader.include: Script added from HTMLHead '" + name + "'");
                    var name = list[i].src.split("/").pop();
                    if (!name.toLowerCase() in this.scripts) {
                        this.scripts[name.toLowerCase()] = new Motif.Script(name, loader, true);
                        this.scripts[name.toLowerCase()].text = list[i].text;
                    }
                    if (name.toLowerCase() == this.bootScript.toLowerCase()) {
                        this.path = list[i].src.substr(0, list[i].src.length - this.bootScript.length);
                        Motif.Page.log.write("Motif.ScriptLoader.include: Path set to '" + this.path + "'");
                    }
                }
            }
        }

        Motif.Page.log.write("Motif.ScriptLoader.include: New script created for loading '" + scriptName + "'");
        var script = new Motif.Script({
            name: scriptName,
            loader: this
        });

        script.attachEvent("oncomplete", new Function(this.referenceString() + ".fireEvent(\"onscriptcomplete\", [this]);"));
        script.open(this.path + scriptName);
        script.send();
        this.scripts[scriptName.toLowerCase()] = script;

        return script;
    };

    /** Get the list of script objects @type Motif.Script[] */
    this.getList = function() {
        var arr = [];
        for (e in this.scripts) {
            this.scripts[e]._appended = false;
        }
        for (e in this.scripts) {
            arr = arr.concat(this._getScriptRecursive(this.scripts[e]));
        }
        return arr;
    };

    /** Get the full script loaded with this loader @type String */
    this.getScript = function() {
        var arr = this.getList();
        for (e in arr) {
            arr[e] = arr[e].text;
        }
        return arr.join(";\r\n");
    };

    /** Internal method to align scripts and dependencies @type Motif.Script[] */
    this._getScriptRecursive = function(script) {
        var arr = [];
        if (script._appended) {
            return [];
        }
        script._appended = true;

        for (var i = 0; i < script.dependencies.length; i++)
            if (!script.dependencies[i]._appended)
                arr = arr.concat(this._getScriptRecursive(script.dependencies[i]));

        arr.push(script);
        return arr;
    }

    /** Event handler fired after a script complete event. */
    this._scriptComplete = function(script) {
        if (this._timerComplete) {
            window.clearTimeout(this._timerComplete);
        }
        this._timerComplete = window.setTimeout(this.referenceString() + "._checkComplete();", 150);
    };

    /** Internal method which checks script whether they are downloaded or not, if all scripts are ready it will fire the oncomplete event for this object */
    this._checkComplete = function() {
        for (e in this.scripts) {
            if (!this.scripts[e].isLoaded) {
                Motif.Page.log.write("Motif.ScriptLoader._checkComplete: Waiting for '" + e + "'  to load, escaping oncomplete");
                return;
            }
        }
        Motif.Page.log.write("Motif.ScriptLoader._checkComplete: All scripts loaded invoking oncomplete");

        this.fireEvent("oncomplete");
    };

    /** Event fired when a script doenload completes */
    this.onscriptcomplete = function() {};
    /** Event fired when all scripts are downloaded */
    this.oncomplete = function() {};

    /** @ignore */
    this.main = function() {
        this.attachEvent("onscriptcomplete", this._scriptComplete);
    };
    this.main();
};

/**
 * Extends Motif.AsyncRequest and is used for loading scripts asynchronously.
 * After receiving the script it will remove the comments and filter out the the dependencies.
 * @extends Motif.AsyncRequest
 * @requires Motif.AsyncRequest
 * @constructor
 * @author Rayraegah
 */
Motif.Script = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.AsyncRequest");
    this.__class.push("Motif.Script");

    /** Array of scripts on which this script depends @type Motif.Script[] */
    this.dependencies = [];
    /** Name of the script file @type String */
    this.name = "";
    /** Script text, without references and comments @type String */
    this.text = "";
    /** Indication whether the script is loaded or not @type Boolean */
    this.isLoaded = false;
    /** Reference to the Motif.ScriptLoader object which created this object @type Motif.ScriptLoader */
    this.loader = null;

    /** Event handler for the 'oncomplete', removes comments and ads dependencies @type Function */
    this._completed = function Script__completed() {
        this.isLoaded = true;
        this.text = this.responseText;
        //this.text = this.text.replace(/\/\*[^*]*\*+([^\/][^*]*\*+)*\//ig,"");

        var arr = this.text.match(this.loader.dependencyFilter);
        this.text = this.text.replace(this.loader.dependencyFilter, "");

        Motif.Page.log.write("Motif.Script._oncomplete: Loading of '" + this.name + "' completed, status=" + this.responseStatus.toString());

        if (arr == null) {
            return;
        }

        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].replace(this.loader.dependencyFilter, "$1");
            var obj = this.loader.include(arr[i]);
            if (obj != null) {
                this.dependencies.push(obj);
            }
        }
        Motif.Page.log.write("Motif.Script._oncomplete: Dependencies for '" + this.name + "' ('" + arr.join("','") + "') added.");
    };

    /** Configure this script @type Object */
    this.configure = function Script_configure(config) {
        config = this.Motif$AsyncRequest.configure(config);
        if (config.name) {
            this.name = config.name;
        }
        if (config.loader) {
            this.loader = config.loader;
        }
        if (config.loaded) {
            config.isLoaded = config.loaded;
        }
        if (config.isLoaded === true || config.isLoaded === false) {
            this.isLoaded = config.isLoaded;
        }
        return config;
    };

    /** @ignore */
    this.main = function Script_main(config) {
        if (config) {
            this.configure(config);
        }
        this.attachEvent("oncomplete", this._completed);
        this.requestHeaders["Accept"] = "application/x-javascript";
    };
    this.main(config);
};

/**
 * Type evaluation object
 * @singleton
 * @author Rayraegah
 */
Motif.Type = {
    /** @ignore */
    __class: ["Motif.Type"],
    /** Tests the parameter for a Function type @type Boolean */
    isFunction: function(test) {
        return test instanceof Function;
    },
    /** Tests the parameter for a Date type @type Boolean */
    isDate: function(test) {
        return test instanceof Date;
    },
    /** Tests the parameter for a Number type @type Boolean */
    isNumber: function(test) {
        return typeof test == "number";
    },
    /** Tests the parameter for a Array type @type Boolean */
    isArray: function(test) {
        return test instanceof Array;
    },
    /** Tests the parameter for a String type @type Boolean */
    isString: function(test) {
        return typeof test == "string";
    },
    /** Tests the parameter for a Object type @type Boolean */
    isObject: function(test) {
        return typeof test == "object";
    },
    /** Tests the parameter for a Error type @type Boolean */
    isError: function(test) {
        return test instanceof Error;
    },
    /** Tests the parameter for a null value @type Boolean */
    isNull: function(test) {
        return test == null;
    },
    /** Tests the parameter for Boolean type @type Boolean */
    isBoolean: function(test) {
        return typeof test == "boolean";
    },
    /** Tests the parameter for a HtmlElement type @type Boolean */
    isElement: function(test) {
        return test && test.nodeType == 1;
    },
    /** Tests the parameter for 'undefined' type @type Boolean */
    isUndefined: function(test) {
        return (typeof test == "undefined");
    },
    /** Tests the parameter for a undefined value @type Boolean */
    isDefinedType: function(typeName) {
        try {
            return eval("(typeof " + typeName + " != \"undefined\")");
        } catch (x) {
            return false;
        }
    },
    /** Tests the parameter for a Motif type, determined by __class @type Boolean */
    isMotifType: function(test, typeName) {
        if (test && Motif.Type.isArray(test.__class)) {
            for (i = test.__class.length; i >= 0; i--)
                if (test.__class[i] == typeName)
                    return true;
        }
        return false;
    }
};

/**
 * Type conversion 
 * @singleton
 * @author Rayraegah
 */
Motif.Convert = {
    /** @ignore */
    __class: ["Motif.Convert"],
    /** Convert the supplied parameter to a String type @type String */
    toString: function(val) {
        if (val.toString) {
            return val.toString();
        }
        return new String(val);
    },
    /** Convert the supplied parameter to a Number type using parseInt @type Number */
    toInt: function(val) {
        var ret = 0;
        try {
            ret = parseInt(val);
        } catch (e) {
            ret = 0;
        }
        if (isNaN(ret)) {
            return 0;
        }
        return ret;
    },
    /** Convert the supplied parameter to a Number type using parseFloat @type Number */
    toFloat: function(val) {
        var ret = 0;
        try {
            ret = parseFloat(val);
        } catch (e) {
            ret = 0;
        }
        if (isNaN(ret)) {
            return 0;
        }
        return ret;
    },
    /** Convert the supplied parameter to a Number type using parseFloat @type Number */
    toNumber: function(val) {
        return Motif.Convert.toFloat(val);
    },
    /** Convert the supplied parameter to a Date type @type Date */
    toDate: function(val) {
        return new Date(val);
    }
};

/**
 * Global utility which supplies object extension and crossbrowser features 
 * @singleton
 * @author Rayraegah
 */
Motif.Utility = {
    /** Build a namespace */
    createNamespace: function(namespace) {
        var names = namespace.split(".");
        var current = window;
        for (var i = 0; i < names.length; i++) {
            if (typeof current[names[i]] != "object") {
                current[names[i]] = {};
            }
            current = current[names[i]];
        }
    },
    /** Add the functions from the base class to the supplied object */
    extend: function(newObject, baseString) {
        if (!baseString) {
            return;
        }

        var baseName = baseString.replace(/\./g, "$");
        newObject[baseName] = newObject.__$base = {};
        newObject[baseName].__$derived = newObject;

        try {
            eval("newObject.__$base.__$inherit = " + baseString + ";");
        } catch (x) {
            throw new Error("Motif.Utility.extend: Failed to initialize the base class '" + baseString + "'.\r\n" + x.description);
        }
        newObject.__$base.__$inherit();
        for (e in newObject.__$base) {
            if (e != baseName && e.substr(0, 3) != "__$") {
                newObject[e] = newObject.__$base[e];
                if (newObject.__$base[e] && newObject.__$base[e].apply) {
                    newObject.__$base["__$" + e] = newObject[e];
                    newObject.__$base[e] = new Function(
                        "var args = [];" + "for(var i=0; i<arguments.length; i++){args.push(arguments[i]);}" + "var ret = this[\"__$" + e + "\"].apply(this.__$derived, args);" + "if(ret){return ret;}"
                    );
                }
            }
        }

        var current = newObject.__$base;

        while (current) {
            current.__$derived = newObject;
            delete current.__$inherit;
            current = current.__$base;
        }
        newObject.ptr = Motif.ObjectRegistry.add(newObject);
    },
    /** Get a XMLHttpRequest for various browsers @type XMLHttpRequest */
    getXhr: function() {
        if (Motif.BrowserInfo.internetExplorer) {
            var progids = ["MsXml2.XmlHttp.6.0", "MsXml2.XmlHttp.4.0", "MsXml2.XmlHttp.3.0", "Microsoft.XmlHttp"];
            for (var i = 0; i < progids.length; i++) {
                try {
                    obj = new ActiveXObject(progids[i]);
                    return obj;
                } catch (x) {}
            }
        } else {
            return new XMLHttpRequest();
        }
    },
    /** Get a XMLDomDocument for various browsers @type XMLDomDocument */
    getDom: function(xml) {
        if (xml && typeof DOMParser != "undefined") {
            return DOMParser.parseFromString(xml, "text/xml");
        }
        if (Motif.BrowserInfo.internetExplorer) {
            var progids = ["MsXml2.DomDocument.6.0", "MsXml2.DomDocument.4.0", "MsXml2.DomDocument.3.0", "Microsoft.XmlDom"];
            for (var i = 0; i < progids.length; i++) {
                try {
                    var obj = new ActiveXObject(progids[i]);
                } catch (x) {}
            }

            if (obj && xml) {
                try {
                    obj.loadXML(xml);
                } catch (x) {
                    this.log.write("Motif.Utility.getDom: Failed to load xml.\r\n" + obj.parseError.reason);
                }
            }
            return obj;
        } else {
            return document.implementation.createDocument("", "", null);
        }
    },

    /** Attach an event handler to an object, returns true on success @type Boolean */
    attachEvent: function(obj, evt, handler) {
        if (typeof handler.apply == "undefined") {
            throw new Error("Motif.Utility.attachEvent: Incorrect parameter 'handler'");
        }
        if (typeof evt.indexOf == "undefined") {
            throw new Error("Motif.Utility.attachEvent: Incorrect parameter 'evt'");
        }

        if (typeof obj.attachEvent != "undefined") {
            obj.attachEvent(evt, handler);
            return true;
        }

        if (typeof obj.addEventListener != "undefined") {
            obj.addEventListener(evt.substr(2), handler, false);
            return true;
        }
        return false;
    },
    /** Remove an event handler from an object, returns true on success @type Boolean */
    detachEvent: function(obj, evt, handler) {
        if (typeof handler.apply == "undefined") {
            throw new Error("Motif.Utility.attachEvent: Incorrect parameter 'handler'");
        }
        if (typeof evt.indexOf == "undefined") {
            throw new Error("Motif.Utility.attachEvent: Incorrect parameter 'evt'");
        }

        if (typeof obj.detachEvent != "undefined") {
            obj.detachEvent(evt, handler);
            return true;
        }
        if (typeof obj.removeEventListener != "undefined") {
            obj.removeEventListener(evt.substr(2), handler, false);
            return true;
        }
        return false;
    }
};

/**
 * Browser info object
 * @singleton
 * @author Rayraegah
 */
Motif.BrowserInfo = {
    /** @ignore */
    __class: ["Motif.BrowserInfo"],

    /** Browser supports ActiveX @type Boolean */
    activeXControls: navigator.appName.toLowerCase().indexOf("microsoft") != -1,
    /** Browser supports background sounds (not implemented) @type Boolean */
    backgroundSounds: false,
    /** Browser is a Beta version @type Boolean */
    beta: navigator.appName.toLowerCase().indexOf("beta") != -1,
    /** Browser name @type String */
    browser: navigator.userAgent,
    /** Browser supports CDF (not implemented) @type Boolean */
    CDF: false,
    /** Browser's current charset @type String */
    charset: document.defaultCharset,
    /** Browser's CLR version (not implemented) @type Object */
    clrVersion: null,
    /** Browser's compatibillity mode @type String */
    compatMode: document.compatMode,
    /** Browser operates in strict mode @type Boolean */
    //strictMode        : document.compatMode.toLowerCase().indexOf("backward")==-1,
    /** Browser support cookies @type Boolean */
    cookies: navigator.cookieEnabled,
    /** Platform CPU class @type String */
    cpu: navigator.cpuClass,
    /** Browser is a crawler @type String */
    crawler: navigator.appName.toLowerCase().indexOf("crawler") != -1 || navigator.appName.toLowerCase().indexOf("bot") != -1,
    /** Browser's ecmascript version (not implemented) @type Number */
    ecmaScriptVersion: 0,

    /** Browser supports frames @type Boolean */
    frames: window.frames != undefined,
    /** Browser supports java applets @type Boolean */
    javaApplets: navigator.javaEnabled(),
    /** Browser language @type String */
    language: navigator.userLanguage,
    /** Browser major version @type Number */
    majorVersion: navigator.appVersion,
    /** Browser minor version @type Number */
    minorVersion: navigator.appMinorVersion,
    /** Browser MS XML DOM version (not implemented) @type Number */
    msDomVersion: 0,
    /** Operating system @type String */
    platform: navigator.platform,
    /** Browser supports HTMLTable types (not implemented) @type Boolean */
    tables: true,
    /** Browser supports VBScript (not implemented) @type Boolean */
    vbScript: false,
    /** Browser W3C DOM version (not implemented) @type Number */
    W3CDomVersion: 0,
    /** Browser platform is windows 16-bit @type Boolean */
    win16: navigator.platform == "Win16",
    /** Browser platform is windows 32-bit @type Boolean */
    win32: navigator.platform == "Win32",

    /** Browser is AOL @type Boolean */
    aol: navigator.appName.indexOf("AOL") != -1,
    /** Browser is Gecko based @type Boolean */
    gecko: navigator.userAgent.indexOf("Gecko") != -1,
    /** Browser is Firefox @type Boolean */
    firefox: navigator.userAgent.indexOf("Firefox") != -1,
    /** Browser is MS Intrnet Explorer @type Boolean */
    internetExplorer: navigator.userAgent.indexOf("MSIE") != -1,
    /** Browser is Konqeror @type Boolean */
    konqueror: navigator.vendor && navigator.vendor.indexOf("KDE") != -1,
    /** Browser is NS Navigator @type Boolean */
    netscapeNavigator: navigator.userAgent.indexOf("Netscape") != -1,
    safari: navigator.vendor && navigator.vendor.indexOf("Apple") != -1,
    chrome: navigator.userAgent.indexOf("Chrome") != -1,
    omniweb: navigator.userAgent.indexOf("Omniweb") != -1,
    opera: window.opera && true
};

/**
 * Page object of which the onload function should be overridden to use it's functionality when ready.
 * @requires Motif.PageLogger
 * @requires Motif.ScriptLoader
 * @singleton
 * @author Rayraegah
 */
Motif.Page = {
    /** Indication whether the loader completed loading of scripts */
    _isLoaderComplete: false,
    /** Indication whether the window.document is ready */
    _isWindowComplete: false,
    /** List of scripts loaded by the loader @type Motif.Script[] */
    _scriptList: [],
    /** List of script URL's which where loaded @type String[] */
    _scriptListLoaded: [],
    /** Page logger used for debugging @type Motif.PageLogger */
    log: new Motif.PageLogger(),
    /** Reference to the HTMLHead element @type HTMLElement */
    head: null,
    /** Reference to the HTMLTitle element @type HTMLElement */
    title: null,
    /** Reference to the HTMLBody element @type HTMLElement */
    body: null,
    /** Script loader for Motif.Page.include option @type Motif.ScriptLoader */
    scriptLoader: new Motif.ScriptLoader(/^Motif\.Page\.include\("([\w\.]{1,})"\);$/igm),

    /** Include a script */
    include: function(scriptName) {
        if (this._loaderTimer) {
            clearTimeout(this._loaderTimer);
        }
        Motif.Page.scriptLoader.include(scriptName);
    },
    /** Triggered when all loading has completed */
    onload: function() {},

    /** Internal method which set environment and invokes the onload function */
    _pageLoad: function() {
        Motif.Page.log.write("Motif.Page._pageLoad: Page initialization starting.");

        Motif.Page._scriptList = Motif.Page.scriptLoader.getList();
        if (Motif.Page._scriptList.length > 0) {
            for (e in Motif.Page._scriptList) {
                var script = this.head.appendChild(document.createElement("script"));
                script.type = "text/javascript";
                if (Motif.Page.debug) {
                    script.onload = function() {
                        Motif.Page._scriptLoad(this)
                    };
                    script.src = Motif.Page._scriptList[e].url;
                } else {
                    script.text = Motif.Page._scriptList[e].text;
                }
            }
        }

        if (!Motif.Page.debug) {
            Motif.Page.log.write("Motif.Page._pageLoad: Page initialization complete, invoking onload().");
            Motif.Page.onload();
        }
    },

    /** Event handler for script.onload while debugging */
    _scriptLoad: function(script) {
        Motif.Page.log.write("Motif.Page._scriptLoad: Loading script by source complete, " + script.src);
        Motif.Page._scriptListLoaded.push(script.src);
        if (Motif.Page._scriptListLoaded.length == Motif.Page._scriptList.length) {
            Motif.Page.log.write("Motif.Page._scriptLoad: Scripts loaded, invoking onload().");
            Motif.Page.onload();
        }
    },

    /** Event handler for loader.onscriptcomplete */
    _scriptComplete: function() {
        if (Motif.Page._loaderTimer) {
            window.clearTimeout(Motif.Page._loaderTimer);
            Motif.Page.log.write("Motif.Page._scriptComplete: Loader idle time tester cleared.");
        }
        Motif.Page.scriptLoader.detachEvent("onscriptcomplete", Motif.Page._scriptComplete);
    },

    /** Event handler for loader.oncomplete */
    _loaderComplete: function() {
        Motif.Page.log.write("Motif.Page._loaderComplete: Script loader completed.");
        Motif.Page._isLoaderComplete = true;
        if (Motif.Page._isWindowComplete) {
            Motif.Page._pageLoad();
        }
    },

    /** Event handler for window.onload */
    _windowComplete: function() {
        Motif.Page.log.write("Motif.Page._windowComplete: Window object loaded.");
        Motif.Page._isWindowComplete = true;
        Motif.Page.head = document.getElementsByTagName("head")[0];
        Motif.Page.title = Motif.Page.head.getElementsByTagName("title")[0];
        Motif.Page.body = document.getElementsByTagName("body")[0];
        if (Motif.Page._isLoaderComplete) {
            Motif.Page._pageLoad();
        }
    },

    /** Creates a textarea with the current loaded script */
    writeFullScript: function() {
        if (!Motif.Page._fullScriptArea) {
            Motif.Page._fullScriptArea = document.createElement("textarea");
            Motif.Page._fullScriptArea.style.cssText = "width: 100%; height:200px;";
            document.body.appendChild(Motif.Page._fullScriptArea);
        }

        Motif.Page._fullScriptArea.value = this.scriptLoader.getScript();
    },

    /** @ignore */
    init: function() {
        Motif.Page.scriptLoader.attachEvent("oncomplete", Motif.Page._loaderComplete);
        Motif.Page.scriptLoader.attachEvent("onscriptcomplete", Motif.Page._scriptComplete);
        Motif.Utility.attachEvent(window, "onload", Motif.Page._windowComplete);

        //Motif.Utility.attachEvent(window, "onerror", new Function("Motif.Page.log.write(\"ERROR\");"));
        Motif.Page._loaderTimer = window.setTimeout("Motif.Page._loaderComplete()", 500);
    }
};
Motif.Page.init();