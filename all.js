/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/// <reference path="jsnlog_interfaces.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
function JL(loggerName) {
    // If name is empty, return the root logger
    if (!loggerName) {
        return JL.__;
    }
    // Implements Array.reduce. JSNLog supports IE8+ and reduce is not supported in that browser.
    // Same interface as the standard reduce, except that 
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (callback, initialValue) {
            var previousValue = initialValue;
            for (var i = 0; i < this.length; i++) {
                previousValue = callback(previousValue, this[i], i, this);
            }
            return previousValue;
        };
    }
    var accumulatedLoggerName = '';
    var logger = ('.' + loggerName).split('.').reduce(function (prev, curr, idx, arr) {
        // if loggername is a.b.c, than currentLogger will be set to the loggers
        // root   (prev: JL, curr: '')
        // a      (prev: JL.__, curr: 'a')
        // a.b    (prev: JL.__.__a, curr: 'b')
        // a.b.c  (prev: JL.__.__a.__a.b, curr: 'c')
        // Note that when a new logger name is encountered (such as 'a.b.c'),
        // a new logger object is created and added as a property to the parent ('a.b').
        // The root logger is added as a property of the JL object itself.
        // It is essential that the name of the property containing the child logger
        // contains the full 'path' name of the child logger ('a.b.c') instead of
        // just the bit after the last period ('c').
        // This is because the parent inherits properties from its ancestors.
        // So if the root has a child logger 'c' (stored in a property 'c' of the root logger),
        // then logger 'a.b' has that same property 'c' through inheritance.
        // The names of the logger properties start with __, so the root logger 
        // (which has name ''), has a nice property name '__'.              
        // accumulatedLoggerName evaluates false ('' is falsy) in first iteration when prev is the root logger.
        // accumulatedLoggerName will be the logger name corresponding with the logger in currentLogger.
        // Keep in mind that the currentLogger may not be defined yet, so can't get the name from
        // the currentLogger object itself. 
        if (accumulatedLoggerName) {
            accumulatedLoggerName += '.' + curr;
        }
        else {
            accumulatedLoggerName = curr;
        }
        var currentLogger = prev['__' + accumulatedLoggerName];
        // If the currentLogger (or the actual logger being sought) does not yet exist, 
        // create it now.
        if (currentLogger === undefined) {
            // Set the prototype of the Logger constructor function to the parent of the logger
            // to be created. This way, __proto of the new logger object will point at the parent.
            // When logger.level is evaluated and is not present, the JavaScript runtime will 
            // walk down the prototype chain to find the first ancestor with a level property.
            //
            // Note that prev at this point refers to the parent logger.
            JL.Logger.prototype = prev;
            currentLogger = new JL.Logger(accumulatedLoggerName);
            prev['__' + accumulatedLoggerName] = currentLogger;
        }
        return currentLogger;
    }, JL.__);
    return logger;
}
var JL;
(function (JL) {
    JL.enabled;
    JL.maxMessages;
    JL.defaultAjaxUrl;
    JL.clientIP;
    JL.defaultBeforeSend;
    // Initialise requestId to empty string. If you don't do this and the user
    // does not set it via setOptions, then the JSNLog-RequestId header will
    // have value "undefined", which doesn't look good in a log.
    //
    // Note that you always want to send a requestId as part of log requests,
    // otherwise the server side component doesn't know this is a log request
    // and may create a new request id for the log request, causing confusion
    // in the log.
    JL.requestId = '';
    /**
    Copies the value of a property from one object to the other.
    This is used to copy property values as part of setOption for loggers and appenders.

    Because loggers inherit property values from their parents, it is important never to
    create a property on a logger if the intent is to inherit from the parent.

    Copying rules:
    1) if the from property is undefined (for example, not mentioned in a JSON object), the
       to property is not affected at all.
    2) if the from property is null, the to property is deleted (so the logger will inherit from
       its parent).
    3) Otherwise, the from property is copied to the to property.
    */
    function copyProperty(propertyName, from, to) {
        if (from[propertyName] === undefined) {
            return;
        }
        if (from[propertyName] === null) {
            delete to[propertyName];
            return;
        }
        to[propertyName] = from[propertyName];
    }
    /**
    Returns true if a log should go ahead.
    Does not check level.

    @param filters
        Filters that determine whether a log can go ahead.
    */
    function allow(filters) {
        // If enabled is not null or undefined, then if it is false, then return false
        // Note that undefined==null (!)
        if (!(JL.enabled == null)) {
            if (!JL.enabled) {
                return false;
            }
        }
        // If maxMessages is not null or undefined, then if it is 0, then return false.
        // Note that maxMessages contains number of messages that are still allowed to send.
        // It is decremented each time messages are sent. It can be negative when batch size > 1.
        // Note that undefined==null (!)
        if (!(JL.maxMessages == null)) {
            if (JL.maxMessages < 1) {
                return false;
            }
        }
        try {
            if (filters.userAgentRegex) {
                if (!new RegExp(filters.userAgentRegex).test(navigator.userAgent)) {
                    return false;
                }
            }
        }
        catch (e) {
        }
        try {
            if (filters.ipRegex && JL.clientIP) {
                if (!new RegExp(filters.ipRegex).test(JL.clientIP)) {
                    return false;
                }
            }
        }
        catch (e) {
        }
        return true;
    }
    /**
    Returns true if a log should go ahead, based on the message.

    @param filters
        Filters that determine whether a log can go ahead.

    @param message
        Message to be logged.
    */
    function allowMessage(filters, message) {
        // If the regex contains a bug, that will throw an exception.
        // Ignore this, and pass the log item (better too much than too little).
        try {
            if (filters.disallow) {
                if (new RegExp(filters.disallow).test(message)) {
                    return false;
                }
            }
        }
        catch (e) {
        }
        return true;
    }
    // If logObject is a function, the function is evaluated (without parameters)
    // and the result returned.
    // Otherwise, logObject itself is returned.
    function stringifyLogObjectFunction(logObject) {
        if (typeof logObject == "function") {
            if (logObject instanceof RegExp) {
                return logObject.toString();
            }
            else {
                return logObject();
            }
        }
        return logObject;
    }
    var StringifiedLogObject = (function () {
        // * msg - 
        //      if the logObject is a scalar (after possible function evaluation), this is set to
        //      string representing the scalar. Otherwise it is left undefined.
        // * meta -
        //      if the logObject is an object (after possible function evaluation), this is set to
        //      that object. Otherwise it is left undefined.
        // * finalString -
        //      This is set to the string representation of logObject (after possible function evaluation),
        //      regardless of whether it is an scalar or an object. An object is stringified to a JSON string.
        //      Note that you can't call this field "final", because as some point this was a reserved
        //      JavaScript keyword and using final trips up some minifiers.
        function StringifiedLogObject(msg, meta, finalString) {
            this.msg = msg;
            this.meta = meta;
            this.finalString = finalString;
        }
        return StringifiedLogObject;
    })();
    // Takes a logObject, which can be 
    // * a scalar
    // * an object
    // * a parameterless function, which returns the scalar or object to log.
    // Returns a stringifiedLogObject
    function stringifyLogObject(logObject) {
        // Note that this works if logObject is null.
        // typeof null is object.
        // JSON.stringify(null) returns "null".
        var actualLogObject = stringifyLogObjectFunction(logObject);
        var finalString;
        switch (typeof actualLogObject) {
            case "string":
                return new StringifiedLogObject(actualLogObject, null, actualLogObject);
            case "number":
                finalString = actualLogObject.toString();
                return new StringifiedLogObject(finalString, null, finalString);
            case "boolean":
                finalString = actualLogObject.toString();
                return new StringifiedLogObject(finalString, null, finalString);
            case "undefined":
                return new StringifiedLogObject("undefined", null, "undefined");
            case "object":
                if ((actualLogObject instanceof RegExp) || (actualLogObject instanceof String) || (actualLogObject instanceof Number) || (actualLogObject instanceof Boolean)) {
                    finalString = actualLogObject.toString();
                    return new StringifiedLogObject(finalString, null, finalString);
                }
                else {
                    return new StringifiedLogObject(null, actualLogObject, JSON.stringify(actualLogObject));
                }
            default:
                return new StringifiedLogObject("unknown", null, "unknown");
        }
    }
    function setOptions(options) {
        copyProperty("enabled", options, this);
        copyProperty("maxMessages", options, this);
        copyProperty("defaultAjaxUrl", options, this);
        copyProperty("clientIP", options, this);
        copyProperty("requestId", options, this);
        copyProperty("defaultBeforeSend", options, this);
        return this;
    }
    JL.setOptions = setOptions;
    function getAllLevel() {
        return -2147483648;
    }
    JL.getAllLevel = getAllLevel;
    function getTraceLevel() {
        return 1000;
    }
    JL.getTraceLevel = getTraceLevel;
    function getDebugLevel() {
        return 2000;
    }
    JL.getDebugLevel = getDebugLevel;
    function getInfoLevel() {
        return 3000;
    }
    JL.getInfoLevel = getInfoLevel;
    function getWarnLevel() {
        return 4000;
    }
    JL.getWarnLevel = getWarnLevel;
    function getErrorLevel() {
        return 5000;
    }
    JL.getErrorLevel = getErrorLevel;
    function getFatalLevel() {
        return 6000;
    }
    JL.getFatalLevel = getFatalLevel;
    function getOffLevel() {
        return 2147483647;
    }
    JL.getOffLevel = getOffLevel;
    function levelToString(level) {
        if (level <= 1000) {
            return "trace";
        }
        if (level <= 2000) {
            return "debug";
        }
        if (level <= 3000) {
            return "info";
        }
        if (level <= 4000) {
            return "warn";
        }
        if (level <= 5000) {
            return "error";
        }
        return "fatal";
    }
    // ---------------------
    var Exception = (function () {
        // data replaces message. It takes not just strings, but also objects and functions, just like the log function.
        // internally, the string representation is stored in the message property (inherited from Error)
        //
        // inner: inner exception. Can be null or undefined. 
        function Exception(data, inner) {
            this.inner = inner;
            this.name = "JL.Exception";
            this.message = stringifyLogObject(data).finalString;
        }
        return Exception;
    })();
    JL.Exception = Exception;
    // Derive Exception from Error (a Host object), so browsers
    // are more likely to produce a stack trace for it in their console.
    //
    // Note that instanceof against an object created with this constructor
    // will return true in these cases:
    // <object> instanceof JL.Exception);
    // <object> instanceof Error);
    Exception.prototype = new Error();
    // ---------------------
    var LogItem = (function () {
        // l: level
        // m: message
        // n: logger name
        // t (timeStamp) is number of milliseconds since 1 January 1970 00:00:00 UTC
        //
        // Keeping the property names really short, because they will be sent in the
        // JSON payload to the server.
        function LogItem(l, m, n, t) {
            this.l = l;
            this.m = m;
            this.n = n;
            this.t = t;
        }
        return LogItem;
    })();
    JL.LogItem = LogItem;
    // ---------------------
    var Appender = (function () {
        // sendLogItems takes an array of log items. It will be called when
        // the appender has items to process (such as, send to the server).
        // Note that after sendLogItems returns, the appender may truncate
        // the LogItem array, so the function has to copy the content of the array
        // in some fashion (eg. serialize) before returning.
        function Appender(appenderName, sendLogItems) {
            this.appenderName = appenderName;
            this.sendLogItems = sendLogItems;
            this.level = JL.getTraceLevel();
            // set to super high level, so if user increases level, level is unlikely to get 
            // above sendWithBufferLevel
            this.sendWithBufferLevel = 2147483647;
            this.storeInBufferLevel = -2147483648;
            this.bufferSize = 0; // buffering switch off by default
            this.batchSize = 1;
            // Holds all log items with levels higher than storeInBufferLevel 
            // but lower than level. These items may never be sent.
            this.buffer = [];
            // Holds all items that we do want to send, until we have a full
            // batch (as determined by batchSize).
            this.batchBuffer = [];
        }
        Appender.prototype.setOptions = function (options) {
            copyProperty("level", options, this);
            copyProperty("ipRegex", options, this);
            copyProperty("userAgentRegex", options, this);
            copyProperty("disallow", options, this);
            copyProperty("sendWithBufferLevel", options, this);
            copyProperty("storeInBufferLevel", options, this);
            copyProperty("bufferSize", options, this);
            copyProperty("batchSize", options, this);
            if (this.bufferSize < this.buffer.length) {
                this.buffer.length = this.bufferSize;
            }
            return this;
        };
        /**
        Called by a logger to log a log item.
        If in response to this call one or more log items need to be processed
        (eg., sent to the server), this method calls this.sendLogItems
        with an array with all items to be processed.

        Note that the name and parameters of this function must match those of the log function of
        a Winston transport object, so that users can use these transports as appenders.
        That is why there are many parameters that are not actually used by this function.

        level - string with the level ("trace", "debug", etc.) Only used by Winston transports.
        msg - human readable message. Undefined if the log item is an object. Only used by Winston transports.
        meta - log object. Always defined, because at least it contains the logger name. Only used by Winston transports.
        callback - function that is called when the log item has been logged. Only used by Winston transports.
        levelNbr - level as a number. Not used by Winston transports.
        message - log item. If the user logged an object, this is the JSON string.  Not used by Winston transports.
        loggerName: name of the logger.  Not used by Winston transports.
        */
        Appender.prototype.log = function (level, msg, meta, callback, levelNbr, message, loggerName) {
            var logItem;
            if (!allow(this)) {
                return;
            }
            if (!allowMessage(this, message)) {
                return;
            }
            if (levelNbr < this.storeInBufferLevel) {
                // Ignore the log item completely
                return;
            }
            logItem = new LogItem(levelNbr, message, loggerName, (new Date).getTime());
            if (levelNbr < this.level) {
                // Store in the hold buffer. Do not send.
                if (this.bufferSize > 0) {
                    this.buffer.push(logItem);
                    // If we exceeded max buffer size, remove oldest item
                    if (this.buffer.length > this.bufferSize) {
                        this.buffer.shift();
                    }
                }
                return;
            }
            if (levelNbr < this.sendWithBufferLevel) {
                // Want to send the item, but not the contents of the buffer
                this.batchBuffer.push(logItem);
            }
            else {
                // Want to send both the item and the contents of the buffer.
                // Send contents of buffer first, because logically they happened first.
                if (this.buffer.length) {
                    this.batchBuffer = this.batchBuffer.concat(this.buffer);
                    this.buffer.length = 0;
                }
                this.batchBuffer.push(logItem);
            }
            if (this.batchBuffer.length >= this.batchSize) {
                this.sendBatch();
                return;
            }
        };
        // Processes the batch buffer
        Appender.prototype.sendBatch = function () {
            if (this.batchBuffer.length == 0) {
                return;
            }
            if (!(JL.maxMessages == null)) {
                if (JL.maxMessages < 1) {
                    return;
                }
            }
            // If maxMessages is not null or undefined, then decrease it by the batch size.
            // This can result in a negative maxMessages.
            // Note that undefined==null (!)
            if (!(JL.maxMessages == null)) {
                JL.maxMessages -= this.batchBuffer.length;
            }
            this.sendLogItems(this.batchBuffer);
            this.batchBuffer.length = 0;
        };
        return Appender;
    })();
    JL.Appender = Appender;
    // ---------------------
    var AjaxAppender = (function (_super) {
        __extends(AjaxAppender, _super);
        function AjaxAppender(appenderName) {
            _super.call(this, appenderName, AjaxAppender.prototype.sendLogItemsAjax);
        }
        AjaxAppender.prototype.setOptions = function (options) {
            copyProperty("url", options, this);
            copyProperty("beforeSend", options, this);
            _super.prototype.setOptions.call(this, options);
            return this;
        };
        AjaxAppender.prototype.sendLogItemsAjax = function (logItems) {
            try {
                // Only determine the url right before you send a log request.
                // Do not set the url when constructing the appender.
                //
                // This is because the server side component sets defaultAjaxUrl
                // in a call to setOptions, AFTER the JL object and the default appender
                // have been created. 
                var ajaxUrl = "/jsnlog.logger";
                // This evaluates to true if defaultAjaxUrl is null or undefined
                if (!(JL.defaultAjaxUrl == null)) {
                    ajaxUrl = JL.defaultAjaxUrl;
                }
                if (this.url) {
                    ajaxUrl = this.url;
                }
                var json = JSON.stringify({
                    r: JL.requestId,
                    lg: logItems
                });
                // Send the json to the server. 
                // Note that there is no event handling here. If the send is not
                // successful, nothing can be done about it.
                var xhr = this.getXhr(ajaxUrl);
                // call beforeSend callback
                // first try the callback on the appender
                // then the global defaultBeforeSend callback
                if (typeof this.beforeSend === 'function') {
                    this.beforeSend(xhr);
                }
                else if (typeof JL.defaultBeforeSend === 'function') {
                    JL.defaultBeforeSend(xhr);
                }
                xhr.send(json);
            }
            catch (e) {
            }
        };
        // Creates the Xhr object to use to send the log request.
        // Sets out to create an Xhr object that can be used for CORS.
        // However, if there seems to be no CORS support on the browser,
        // returns a non-CORS capable Xhr.
        AjaxAppender.prototype.getXhr = function (ajaxUrl) {
            var xhr = new XMLHttpRequest();
            // Check whether this xhr is CORS capable by checking whether it has
            // withCredentials. 
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            if (!("withCredentials" in xhr)) {
                // Just found that no XMLHttpRequest2 available.
                // Check if XDomainRequest is available.
                // This only exists in IE, and is IE's way of making CORS requests.
                if (typeof XDomainRequest != "undefined") {
                    // Note that here we're not setting request headers on the XDomainRequest
                    // object. This is because this object doesn't let you do that:
                    // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
                    // This means that for IE8 and IE9, CORS logging requests do not carry request ids.
                    var xdr = new XDomainRequest();
                    xdr.open('POST', ajaxUrl);
                    return xdr;
                }
            }
            // At this point, we're going with XMLHttpRequest, whether it is CORS capable or not.
            // If it is not CORS capable, at least will handle the non-CORS requests.
            xhr.open('POST', ajaxUrl);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('JSNLog-RequestId', JL.requestId);
            return xhr;
        };
        return AjaxAppender;
    })(Appender);
    JL.AjaxAppender = AjaxAppender;
    // ---------------------
    var ConsoleAppender = (function (_super) {
        __extends(ConsoleAppender, _super);
        function ConsoleAppender(appenderName) {
            _super.call(this, appenderName, ConsoleAppender.prototype.sendLogItemsConsole);
        }
        ConsoleAppender.prototype.clog = function (logEntry) {
            console.log(logEntry);
        };
        ConsoleAppender.prototype.cerror = function (logEntry) {
            if (console.error) {
                console.error(logEntry);
            }
            else {
                this.clog(logEntry);
            }
        };
        ConsoleAppender.prototype.cwarn = function (logEntry) {
            if (console.warn) {
                console.warn(logEntry);
            }
            else {
                this.clog(logEntry);
            }
        };
        ConsoleAppender.prototype.cinfo = function (logEntry) {
            if (console.info) {
                console.info(logEntry);
            }
            else {
                this.clog(logEntry);
            }
        };
        // IE11 has a console.debug function. But its console doesn't have 
        // the option to show/hide debug messages (the same way Chrome and FF do),
        // even though it does have such buttons for Error, Warn, Info.
        //
        // For now, this means that debug messages can not be hidden on IE.
        // Live with this, seeing that it works fine on FF and Chrome, which
        // will be much more popular with developers.
        ConsoleAppender.prototype.cdebug = function (logEntry) {
            if (console.debug) {
                console.debug(logEntry);
            }
            else {
                this.cinfo(logEntry);
            }
        };
        ConsoleAppender.prototype.sendLogItemsConsole = function (logItems) {
            try {
                if (!console) {
                    return;
                }
                var i;
                for (i = 0; i < logItems.length; ++i) {
                    var li = logItems[i];
                    var msg = li.n + ": " + li.m;
                    // Only log the timestamp if we're on the server
                    // (window is undefined). On the browser, the user
                    // sees the log entry probably immediately, so in that case
                    // the timestamp is clutter.
                    if (typeof window === 'undefined') {
                        msg = new Date(li.t) + " | " + msg;
                    }
                    if (li.l <= JL.getDebugLevel()) {
                        this.cdebug(msg);
                    }
                    else if (li.l <= JL.getInfoLevel()) {
                        this.cinfo(msg);
                    }
                    else if (li.l <= JL.getWarnLevel()) {
                        this.cwarn(msg);
                    }
                    else {
                        this.cerror(msg);
                    }
                }
            }
            catch (e) {
            }
        };
        return ConsoleAppender;
    })(Appender);
    JL.ConsoleAppender = ConsoleAppender;
    // --------------------
    var Logger = (function () {
        function Logger(loggerName) {
            this.loggerName = loggerName;
            // Create seenRexes, otherwise this logger will use the seenRexes
            // of its parent via the prototype chain.
            this.seenRegexes = [];
        }
        Logger.prototype.setOptions = function (options) {
            copyProperty("level", options, this);
            copyProperty("userAgentRegex", options, this);
            copyProperty("disallow", options, this);
            copyProperty("ipRegex", options, this);
            copyProperty("appenders", options, this);
            copyProperty("onceOnly", options, this);
            // Reset seenRegexes, in case onceOnly has been changed.
            this.seenRegexes = [];
            return this;
        };
        // Turns an exception into an object that can be sent to the server.
        Logger.prototype.buildExceptionObject = function (e) {
            var excObject = {};
            if (e.stack) {
                excObject.stack = e.stack;
            }
            else {
                excObject.e = e;
            }
            if (e.message) {
                excObject.message = e.message;
            }
            if (e.name) {
                excObject.name = e.name;
            }
            if (e.data) {
                excObject.data = e.data;
            }
            if (e.inner) {
                excObject.inner = this.buildExceptionObject(e.inner);
            }
            return excObject;
        };
        // Logs a log item.
        // Parameter e contains an exception (or null or undefined).
        //
        // Reason that processing exceptions is done at this low level is that
        // 1) no need to spend the cpu cycles if the logger is switched off
        // 2) fatalException takes both a logObject and an exception, and the logObject
        //    may be a function that should only be executed if the logger is switched on.
        //
        // If an exception is passed in, the contents of logObject is attached to the exception
        // object in a new property logData.
        // The resulting exception object is than worked into a message to the server.
        //
        // If there is no exception, logObject itself is worked into the message to the server.
        Logger.prototype.log = function (level, logObject, e) {
            var i = 0;
            var compositeMessage;
            var excObject;
            // If we can't find any appenders, do nothing
            if (!this.appenders) {
                return this;
            }
            if (((level >= this.level)) && allow(this)) {
                if (e) {
                    excObject = this.buildExceptionObject(e);
                    excObject.logData = stringifyLogObjectFunction(logObject);
                }
                else {
                    excObject = logObject;
                }
                compositeMessage = stringifyLogObject(excObject);
                if (allowMessage(this, compositeMessage.finalString)) {
                    // See whether message is a duplicate
                    if (this.onceOnly) {
                        i = this.onceOnly.length - 1;
                        while (i >= 0) {
                            if (new RegExp(this.onceOnly[i]).test(compositeMessage.finalString)) {
                                if (this.seenRegexes[i]) {
                                    return this;
                                }
                                this.seenRegexes[i] = true;
                            }
                            i--;
                        }
                    }
                    // Pass message to all appenders
                    // Note that these appenders could be Winston transports
                    // https://github.com/flatiron/winston
                    //
                    // These transports do not take the logger name as a parameter.
                    // So add it to the meta information, so even Winston transports will
                    // store this info.
                    compositeMessage.meta = compositeMessage.meta || {};
                    compositeMessage.meta.loggerName = this.loggerName;
                    i = this.appenders.length - 1;
                    while (i >= 0) {
                        this.appenders[i].log(levelToString(level), compositeMessage.msg, compositeMessage.meta, function () {
                        }, level, compositeMessage.finalString, this.loggerName);
                        i--;
                    }
                }
            }
            return this;
        };
        Logger.prototype.trace = function (logObject) {
            return this.log(getTraceLevel(), logObject);
        };
        Logger.prototype.debug = function (logObject) {
            return this.log(getDebugLevel(), logObject);
        };
        Logger.prototype.info = function (logObject) {
            return this.log(getInfoLevel(), logObject);
        };
        Logger.prototype.warn = function (logObject) {
            return this.log(getWarnLevel(), logObject);
        };
        Logger.prototype.error = function (logObject) {
            return this.log(getErrorLevel(), logObject);
        };
        Logger.prototype.fatal = function (logObject) {
            return this.log(getFatalLevel(), logObject);
        };
        Logger.prototype.fatalException = function (logObject, e) {
            return this.log(getFatalLevel(), logObject, e);
        };
        return Logger;
    })();
    JL.Logger = Logger;
    function createAjaxAppender(appenderName) {
        return new AjaxAppender(appenderName);
    }
    JL.createAjaxAppender = createAjaxAppender;
    function createConsoleAppender(appenderName) {
        return new ConsoleAppender(appenderName);
    }
    JL.createConsoleAppender = createConsoleAppender;
    // -----------------------
    // In the browser, the default appender is the AjaxAppender.
    // Under nodejs (where there is no "window"), use the ConsoleAppender instead.
    var defaultAppender = new AjaxAppender("");
    if (typeof window === 'undefined') {
        defaultAppender = new ConsoleAppender("");
    }
    // Create root logger
    //
    // Note that this is the parent of all other loggers.
    // Logger "x" will be stored at
    // JL.__.x
    // Logger "x.y" at
    // JL.__.x.y
    JL.__ = new JL.Logger("");
    JL.__.setOptions({
        level: JL.getDebugLevel(),
        appenders: [defaultAppender]
    });
})(JL || (JL = {}));
// Support CommonJS module format 
var exports;
if (typeof exports !== 'undefined') {
    exports.JL = JL;
}
// Support AMD module format
var define;
if (typeof define == 'function' && define.amd) {
    define('jsnlog', [], function () {
        return JL;
    });
}
// If the __jsnlog_configure global function has been
// created, call it now. This allows you to create a global function
// setting logger options etc. inline in the page before jsnlog.js
// has been loaded.
if (typeof __jsnlog_configure == 'function') {
    __jsnlog_configure(JL);
}
//# sourceMappingURL=jsnlog.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
__webpack_require__(2);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(11);
__webpack_require__(12);
__webpack_require__(13);
__webpack_require__(14);
__webpack_require__(15);
__webpack_require__(16);
__webpack_require__(17);
__webpack_require__(18);
__webpack_require__(19);
__webpack_require__(20);
module.exports = __webpack_require__(21);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	Kailash Nadh (http://nadh.in)

	localStorageDB v 2.3.1
	A simple database layer for localStorage

	v 2.3.1 Mar 2015
	v 2.3 Feb 2014 Contribution: Christian Kellner (http://orange-coding.net)
	v 2.2 Jan 2014 Contribution: Andy Hawkins (http://a904guy.com) 
	v 2.1 Nov 2013
	v 2.0 June 2013
	v 1.9 Nov 2012

	License	:	MIT License
*/

!(function (_global, undefined) {
	function localStorageDB(db_name, engine) {
		var db_prefix = 'db_',
			db_id = db_prefix + db_name,
			db_new = false,	// this flag determines whether a new database was created during an object initialisation
			db = null;

			try {
				var storage = (engine == sessionStorage ? sessionStorage: localStorage);
			} catch(e) { // ie8 hack
				var storage = engine;
			}

		// if the database doesn't exist, create it
		db = storage[ db_id ];
		if( !( db && (db = JSON.parse(db.replace("\"[", '[').replace("]\"", ']').replace(/\\"/g, '"'))) && db.tables && db.data ) ) {
			if(!validateName(db_name)) {
				error("The name '" + db_name + "' contains invalid characters");
			} else {
				db = {tables: {}, data: {}};
				commit();
				db_new = true;
			}
		}


		// ______________________ private methods

		// _________ database functions
		// drop the database
		function drop() {
			if(storage.hasOwnProperty(db_id)) {
				delete storage[db_id];
			}
			db = null;
		}

		// number of tables in the database
		function tableCount() {
			var count = 0;
			for(var table in db.tables) {
				if( db.tables.hasOwnProperty(table) ) {
					count++;
				}
			}
			return count;
		}

		// _________ table functions

		// returns all fields in a table.
		function tableFields(table_name) {
			return db.tables[table_name].fields;
		}

		// check whether a table exists
		function tableExists(table_name) {
			return db.tables[table_name] ? true : false;
		}

		// check whether a table exists, and if not, throw an error
		function tableExistsWarn(table_name) {
			if(!tableExists(table_name)) {
				error("The table '" + table_name + "' does not exist");
			}
		}

		// check whether a table column exists
		function columnExists(table_name, field_name) {
			var exists = false;
			var table_fields = db.tables[table_name].fields;
			for(var field in table_fields){
				if(table_fields[field] == field_name)
				{
					exists = true;
					break;
				}
			}
			return exists;
		}

		// create a table
		function createTable(table_name, fields) {
			db.tables[table_name] = {fields: fields, auto_increment: 1};
			db.data[table_name] = {};
		}

		// drop a table
		function dropTable(table_name) {
			delete db.tables[table_name];
			delete db.data[table_name];
		}

		// empty a table
		function truncate(table_name) {
			db.tables[table_name].auto_increment = 1;
			db.data[table_name] = {};
		}

		//alter a table
		function alterTable(table_name, new_fields, default_values){
			db.tables[table_name].fields = db.tables[table_name].fields.concat(new_fields);

			// insert default values in existing table
			if(typeof default_values != "undefined") {
				// loop through all the records in the table
				for(var ID in db.data[table_name]) {
					if( !db.data[table_name].hasOwnProperty(ID) ) {
						continue;
					}
					for(var field in new_fields) {
						if(typeof default_values == "object") {
							db.data[table_name][ID][new_fields[field]] = default_values[new_fields[field]];
						} else {
							db.data[table_name][ID][new_fields[field]] = default_values;
						}
					}
				}
			}
		}

		// number of rows in a table
		function rowCount(table_name) {
			var count = 0;
			for(var ID in db.data[table_name]) {
				if( db.data[table_name].hasOwnProperty(ID) ) {
					count++;
				}
			}
			return count;
		}

		// insert a new row
		function insert(table_name, data) {
			data.ID = db.tables[table_name].auto_increment;
			db.data[table_name][ db.tables[table_name].auto_increment ] = data;
			db.tables[table_name].auto_increment++;
			return data.ID;
		}

		// select rows, given a list of IDs of rows in a table
		function select(table_name, ids, start, limit, sort, distinct) {
			var ID = null, results = [], row = null;

			for(var i=0; i<ids.length; i++) {
				ID = ids[i];
				row = db.data[table_name][ID];
				results.push( clone(row) );
			}

			// there are sorting params
			if(sort && sort instanceof Array) {
				for(var i=0; i<sort.length; i++) {
					results.sort(sort_results(sort[i][0], sort[i].length > 1 ? sort[i][1] : null));
				}
			}
			
			// distinct params
			if(distinct && distinct instanceof Array) {
				for(var j=0; j<distinct.length; j++) {
					var seen = {}, d = distinct[j];

					for(var i=0; i<results.length; i++) {
						if(results[i] === undefined) {
							continue;
						}

						if(results[i].hasOwnProperty(d) && seen.hasOwnProperty(results[i][d])) {
							delete(results[i]);
						} else {
							seen[results[i][d]] = 1;
						}
					}
				}

				// can't use .filter(ie8)
				var new_results = [];
				for(var i=0; i<results.length; i++) {
					if(results[i] !== undefined) {
						new_results.push(results[i]);
					}
				}

				results = new_results;
			}

			// limit and offset
			start = start && typeof start === "number" ? start : null;
			limit = limit && typeof limit === "number" ? limit : null;

			if(start && limit) {
				results = results.slice(start, start+limit);
			} else if(start) {
				results = results.slice(start);
			} else if(limit) {
				results = results.slice(start, limit);
			}

			return results;
		}

		// sort a result set
		function sort_results(field, order) {
			return function(x, y) {
				// case insensitive comparison for string values
				var v1 = typeof(x[field]) === "string" ? x[field].toLowerCase() : x[field],
					v2 = typeof(y[field]) === "string" ? y[field].toLowerCase() : y[field];

				if(order === "DESC") {
					return v1 == v2 ? 0 : (v1 < v2 ? 1 : -1);
				} else {
					return v1 == v2 ? 0 : (v1 > v2 ? 1 : -1);
				}
			};
		}

		// select rows in a table by field-value pairs, returns the IDs of matches
		function queryByValues(table_name, data) {
			var result_ids = [],
				exists = false,
				row = null;

			// loop through all the records in the table, looking for matches
			for(var ID in db.data[table_name]) {
				if( !db.data[table_name].hasOwnProperty(ID) ) {
					continue;
				}

				row = db.data[table_name][ID];
				exists = true;

				for(var field in data) {
					if( !data.hasOwnProperty(field) ) {
						continue;
					}

					if(typeof data[field] == 'string') {	// if the field is a string, do a case insensitive comparison
						if( row[field].toString().toLowerCase() != data[field].toString().toLowerCase() ) {
							exists = false;
							break;
						}
					} else {
						if(row[field] != data[field]) {
							exists = false;
							break;
						}
					}
				}
				if(exists) {
					result_ids.push(ID);
				}
			}

			return result_ids;
		}

		// select rows in a table by a function, returns the IDs of matches
		function queryByFunction(table_name, query_function) {
			var result_ids = [],
				exists = false,
				row = null;

			// loop through all the records in the table, looking for matches
			for(var ID in db.data[table_name]) {
				if( !db.data[table_name].hasOwnProperty(ID) ) {
					continue;
				}

				row = db.data[table_name][ID];

				if( query_function( clone(row) ) == true ) {	// it's a match if the supplied conditional function is satisfied
					result_ids.push(ID);
				}
			}

			return result_ids;
		}

		// return all the IDs in a table
		function getIDs(table_name) {
			var result_ids = [];

			for(var ID in db.data[table_name]) {
				if( db.data[table_name].hasOwnProperty(ID) ) {
					result_ids.push(ID);
				}
			}
			return result_ids;
		}

		// delete rows, given a list of their IDs in a table
		function deleteRows(table_name, ids) {
			for(var i=0; i<ids.length; i++) {
				if( db.data[table_name].hasOwnProperty(ids[i]) ) {
					delete db.data[table_name][ ids[i] ];
				}
			}
			return ids.length;
		}

		// update rows
		function update(table_name, ids, update_function) {
			var ID = '', num = 0;

			for(var i=0; i<ids.length; i++) {
				ID = ids[i];

				var updated_data = update_function( clone(db.data[table_name][ID]) );

				if(updated_data) {
					delete updated_data['ID']; // no updates possible to ID

					var new_data = db.data[table_name][ID];
					// merge updated data with existing data
					for(var field in updated_data) {
						if( updated_data.hasOwnProperty(field) ) {
							new_data[field] = updated_data[field];
						}
					}

					db.data[table_name][ID] = validFields(table_name, new_data);
					num++;
				}
			}
			return num;
		}

		// commit the database to localStorage
		function commit() {
			try {
				storage.setItem(db_id, JSON.stringify(db));
				return true;
			} catch(e) {
				return false;
			}
		}

		// serialize the database
		function serialize() {
			return JSON.stringify(db);
		}

		// throw an error
		function error(msg) {
			throw new Error(msg);
		}

		// clone an object
		function clone(obj) {
			var new_obj = {};
			for(var key in obj) {
				if( obj.hasOwnProperty(key) ) {
					new_obj[key] = obj[key];
				}
			}
			return new_obj;
		}

		// validate db, table, field names (alpha-numeric only)
		function validateName(name) {
			return name.toString().match(/[^a-z_0-9]/ig) ? false : true;
		}

		// given a data list, only retain valid fields in a table
		function validFields(table_name, data) {
			var field = '', new_data = {};

			for(var i=0; i<db.tables[table_name].fields.length; i++) {
				field = db.tables[table_name].fields[i];

				if (data[field] !== undefined) {
					new_data[field] = data[field];
				}
			}
			return new_data;
		}

		// given a data list, populate with valid field names of a table
		function validateData(table_name, data) {
			var field = '', new_data = {};
			for(var i=0; i<db.tables[table_name].fields.length; i++) {
				field = db.tables[table_name].fields[i];
				new_data[field] = (data[field] === null || data[field] === undefined) ? null : data[field];
			}
			return new_data;
		}

		// ______________________ public methods

		return {
			// commit the database to localStorage
			commit: function() {
				return commit();
			},

			// is this instance a newly created database?
			isNew: function() {
				return db_new;
			},

			// delete the database
			drop: function() {
				drop();
			},

			// serialize the database
			serialize: function() {
				return serialize();
			},

			// check whether a table exists
			tableExists: function(table_name) {
				return tableExists(table_name);
			},

			// list of keys in a table
			tableFields: function(table_name) {
				return tableFields(table_name);
			},

			// number of tables in the database
			tableCount: function() {
				return tableCount();
			},

			columnExists: function(table_name, field_name){
				return columnExists(table_name, field_name);
			},

			// create a table
			createTable: function(table_name, fields) {
				var result = false;
				if(!validateName(table_name)) {
					error("The database name '" + table_name + "' contains invalid characters.");
				} else if(this.tableExists(table_name)) {
					error("The table name '" + table_name + "' already exists.");
				} else {
					// make sure field names are valid
					var is_valid = true;
					for(var i=0; i<fields.length; i++) {
						if(!validateName(fields[i])) {
							is_valid = false;
							break;
						}
					}

					if(is_valid) {
						// cannot use indexOf due to <IE9 incompatibility
						// de-duplicate the field list
						var fields_literal = {};
						for(var i=0; i<fields.length; i++) {
							fields_literal[ fields[i] ] = true;
						}
						delete fields_literal['ID']; // ID is a reserved field name

						fields = ['ID'];
						for(var field in fields_literal) {
							if( fields_literal.hasOwnProperty(field) ) {
								fields.push(field);
							}
						}

						createTable(table_name, fields);
						result = true;
					} else {
						error("One or more field names in the table definition contains invalid characters");
					}
				}

				return result;
			},

			// Create a table using array of Objects @ [{k:v,k:v},{k:v,k:v},etc]
			createTableWithData: function(table_name, data) {
				if(typeof data !== 'object' || !data.length || data.length < 1) {
					error("Data supplied isn't in object form. Example: [{k:v,k:v},{k:v,k:v} ..]");
				}

				var fields = Object.keys(data[0]);

				// create the table
				if( this.createTable(table_name, fields) ) {
					this.commit();

					// populate
					for (var i=0; i<data.length; i++) {
						if( !insert(table_name, data[i]) ) {
							error("Failed to insert record: [" + JSON.stringify(data[i]) + "]");
						}
					}
					this.commit();
				}
				return true;
			},

			// drop a table
			dropTable: function(table_name) {
				tableExistsWarn(table_name);
				dropTable(table_name);
			},

			// empty a table
			truncate: function(table_name) {
				tableExistsWarn(table_name);
				truncate(table_name);
			},

			// alter a table
			alterTable: function(table_name, new_fields, default_values) {
				var result = false;
				if(!validateName(table_name)) {
					error("The database name '" + table_name + "' contains invalid characters");
				} else {
					if(typeof new_fields == "object") {
						// make sure field names are valid
						var is_valid = true;
						for(var i=0; i<new_fields.length; i++) {
							if(!validateName(new_fields[i])) {
								is_valid = false;
								break;
							}
						}

						if(is_valid) {
							// cannot use indexOf due to <IE9 incompatibility
							// de-duplicate the field list
							var fields_literal = {};
							for(var i=0; i<new_fields.length; i++) {
								fields_literal[ new_fields[i] ] = true;
							}
							delete fields_literal['ID']; // ID is a reserved field name

							new_fields = [];
							for(var field in fields_literal) {
								if( fields_literal.hasOwnProperty(field) ) {
									new_fields.push(field);
								}
							}

							alterTable(table_name, new_fields, default_values);
							result = true;
						} else {
							error("One or more field names in the table definition contains invalid characters");
						}
					} else if(typeof new_fields == "string") {
						if(validateName(new_fields)) {
							var new_fields_array = [];
							new_fields_array.push(new_fields);
							alterTable(table_name, new_fields_array, default_values);
							result = true;
						} else {
							error("One or more field names in the table definition contains invalid characters");
						}
					}
				}

				return result;
			},

			// number of rows in a table
			rowCount: function(table_name) {
				tableExistsWarn(table_name);
				return rowCount(table_name);
			},

			// insert a row
			insert: function(table_name, data) {
				tableExistsWarn(table_name);
				return insert(table_name, validateData(table_name, data) );
			},

			// insert or update based on a given condition
			insertOrUpdate: function(table_name, query, data) {
				tableExistsWarn(table_name);

				var result_ids = [];
				if(!query) {
					result_ids = getIDs(table_name);				// there is no query. applies to all records
				} else if(typeof query == 'object') {				// the query has key-value pairs provided
					result_ids = queryByValues(table_name, validFields(table_name, query));
				} else if(typeof query == 'function') {				// the query has a conditional map function provided
					result_ids = queryByFunction(table_name, query);
				}

				// no existing records matched, so insert a new row
				if(result_ids.length == 0) {
					return insert(table_name, validateData(table_name, data) );
				} else {
					var ids = [];
					for(var n=0; n<result_ids.length; n++) {
						update(table_name, result_ids, function(o) {
							ids.push(o.ID);
							return data;
						});
					}

					return ids;
				}
			},

			// update rows
			update: function(table_name, query, update_function) {
				tableExistsWarn(table_name);

				var result_ids = [];
				if(!query) {
					result_ids = getIDs(table_name);				// there is no query. applies to all records
				} else if(typeof query == 'object') {				// the query has key-value pairs provided
					result_ids = queryByValues(table_name, validFields(table_name, query));
				} else if(typeof query == 'function') {				// the query has a conditional map function provided
					result_ids = queryByFunction(table_name, query);
				}
				return update(table_name, result_ids, update_function);
			},

			// select rows
			query: function(table_name, query, limit, start, sort, distinct) {
				tableExistsWarn(table_name);

				var result_ids = [];
				if(!query) {
					result_ids = getIDs(table_name, limit, start); // no conditions given, return all records
				} else if(typeof query == 'object') {			// the query has key-value pairs provided
					result_ids = queryByValues(table_name, validFields(table_name, query), limit, start);
				} else if(typeof query == 'function') {		// the query has a conditional map function provided
					result_ids = queryByFunction(table_name, query, limit, start);
				}

				return select(table_name, result_ids, start, limit, sort, distinct);
			},

			// alias for query() that takes a dict of params instead of positional arrguments
			queryAll: function(table_name, params) {
				if(!params) {
					return this.query(table_name)
				} else {
					return this.query(table_name,
						params.hasOwnProperty('query') ? params.query : null,
						params.hasOwnProperty('limit') ? params.limit : null,
						params.hasOwnProperty('start') ? params.start : null,
						params.hasOwnProperty('sort') ? params.sort : null,
						params.hasOwnProperty('distinct') ? params.distinct : null
					);
				}
			},

			// delete rows
			deleteRows: function(table_name, query) {
				tableExistsWarn(table_name);

				var result_ids = [];
				if(!query) {
					result_ids = getIDs(table_name);
				} else if(typeof query == 'object') {
					result_ids = queryByValues(table_name, validFields(table_name, query));
				} else if(typeof query == 'function') {
					result_ids = queryByFunction(table_name, query);
				}
				return deleteRows(table_name, result_ids);
			}
		}
	}

	_global['localStorageDB'] = localStorageDB;

}(window));


/***/ }),
/* 3 */
/***/ (function(module, exports) {

//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

/*global window, require, define */
(function(_window) {
  'use strict';

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required
  var _rng, _mathRNG, _nodeRNG, _whatwgRNG, _previousRoot;

  function setupBrowser() {
    // Allow for MSIE11 msCrypto
    var _crypto = _window.crypto || _window.msCrypto;

    if (!_rng && _crypto && _crypto.getRandomValues) {
      // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
      //
      // Moderately fast, high quality
      try {
        var _rnds8 = new Uint8Array(16);
        _whatwgRNG = _rng = function whatwgRNG() {
          _crypto.getRandomValues(_rnds8);
          return _rnds8;
        };
        _rng();
      } catch(e) {}
    }

    if (!_rng) {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var  _rnds = new Array(16);
      _mathRNG = _rng = function() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) { r = Math.random() * 0x100000000; }
          _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return _rnds;
      };
      if ('undefined' !== typeof console && console.warn) {
        console.warn("[SECURITY] node-uuid: crypto not usable, falling back to insecure Math.random()");
      }
    }
  }

  if (_window) {
    setupBrowser();
  } else {
    // setupNode();
  }

  // Buffer class to use
  var BufferClass = ('function' === typeof Buffer) ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = (options.clockseq != null) ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = (options.msecs != null) ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = (options.nsecs != null) ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

    // **`v4()` - Generate random UUID**

    // See https://github.com/broofa/node-uuid for API details
    function v4(options, buf, offset) {
        // Deprecated - 'format' argument, as supported in v1.2
        var i = buf && offset || 0;

        if (typeof(options) === 'string') {
            buf = (options === 'binary') ? new BufferClass(16) : null;
            options = null;
        }

        options = options || {};

        var rnds = options.random || (options.rng || _rng)();

        // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
        rnds[6] = (rnds[6] & 0x0f) | 0x40;
        rnds[8] = (rnds[8] & 0x3f) | 0x80;

        // Copy bytes to buffer, if provided
        if (buf) {
            for (var ii = 0; ii < 16; ii++) {
                buf[i + ii] = rnds[ii];
            }
        }

        return buf || unparse(rnds);
    }

    // Export public API
    var uuid = v4;
    uuid.v1 = v1;
    uuid.v4 = v4;
    uuid.parse = parse;
    uuid.unparse = unparse;
    uuid.BufferClass = BufferClass;
    uuid._rng = _rng;
    uuid._mathRNG = _mathRNG;
    uuid._nodeRNG = _nodeRNG;
    uuid._whatwgRNG = _whatwgRNG;


    // Publish as global (in browsers)
    _previousRoot = _window.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
        _window.uuid = _previousRoot;
        return uuid;
    };

    _window.uuid = uuid;

})('undefined' !== typeof window ? window : null);


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (pool, math) {
//
// The following constants are related to IEEE 754 limits.
//
var global = this,
    width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}
math['seed' + rngname] = seedrandom;

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    if (nodecrypto) { return tostring(nodecrypto.randomBytes(width)); }
    var out = new Uint8Array(width);
    (global.crypto || global.msCrypto).getRandomValues(out);
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

// End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);


/***/ }),
/* 5 */
/***/ (function(module, exports) {

﻿window["appConfig"] = {};

(function (context) {

    // #[PRIVATE METHODS] ------------------------------------

    var fbApiVersion = "v2.12";
    var channelUrl = "https://plugins.soclminer.com.br/v3/assets/channel.min.html";

    // #[PUBLIC METHODS] ------------------------------------

    context.source = {
        Mobile: "Mobile",
        Web: "Web"
    };

    context.pluginType = {
        LightBox: { Name: "LightBox", Id: "6" },
        ConnectWithMail: { Name: "ConnectWithMail", Id: "10" },
        Connect: { Name: "Connect", Id: "3" },
        SocialShare: { Name: "SocialShare", Id: "7" },
        SocialBounce: { Name: "SocialBounce", Id: "8" },
        SocialBar: { Name: "SocialBar", Id: "9" },
        SocialBox: { Name: "SocialBox", Id: "2" },
        SocialPush: { Name: "SocialPush", Id: "11" },
        SocialBounceImage: { Name: "SocialBounceWithImage", Id: "12" },
        OnSite: { Name: "OnSite", Id: "13" },
        SocialBounceSurvey: { Name: "SocialBounceWithSurvey", Id: "20" },
        SocialBounceQuiz: { Name: "SocialBounceWithQuiz", Id: "21" },
        LightboxText: {Name: "LightboxText", Id: "22"},
        LightboxImage: {Name: "LightboxImage", Id: "23"}
    };

    context.Customer = {
        SocialMiner: { Id: "064B7A45-4372-4155-A286-A06A97C7D626", Name: "SocialMiner", ProdAppId: "1443650659203895", DevAppId: "1474359889466305" },
    };

    context.GetFbApiVersion = function () {
        return fbApiVersion;
    };

    context.GetChannelUrl = function () {
        return channelUrl;
    };

    context.GetGAPageName = function (appName, name) {
        return appName + name;
    };

    context.GetGAPageTitle = function (appName, plugin) {
        return appName + " " + plugin;
    };

    context.IsMobile = function () {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    context.IsApple = function () {
        return (/iPhone|iPad|iPod/i.test(navigator.userAgent));
    };

    context.IsSupportPush = function () { //TODO: remove after migrate all push chromes
        return !(/webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    context.IsAndroid = function () {
        return (/Android/i.test(navigator.userAgent));
    };

    context.IsChrome = function () {
        if (context.IsMobile())
            return !!window.chrome;

        // please note, 
        // that IE11 now returns undefined again for window.chrome
        // and new Opera 30 outputs true for window.chrome
        // but needs to check if window.opr is not undefined
        // and new IE Edge outputs to true now for window.chrome
        // and if not iOS Chrome check
        // so use the below updated condition
        var isChromium = window.chrome;
        var winNav = window.navigator;
        var vendorName = winNav.vendor;
        var isOpera = typeof window.opr !== "undefined";
        var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
        var isIOSChrome = winNav.userAgent.match("CriOS");

        if (isIOSChrome)
            return true;
        else if 
        (
          isChromium !== null &&
          typeof isChromium !== "undefined" &&
          vendorName === "Google Inc." &&
          isOpera === false &&
          isIEedge === false
        )
            return true;
        else
            return false;
    };

})(appConfig);


/***/ }),
/* 6 */
/***/ (function(module, exports) {

﻿/// <reference path="../bower_components/jsnlog/jsnlog.min.js" />

/**
 * Create a XHR Object
 *
 * @param string   method   http verb
 * @param string   url      the url to resource
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();

    try {
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }

        return xhr;
    } catch (e) {
        //JL("ajaxAppender").fatalException({
        //    "msg": "XMLHttpRequest Exception",
        //    "errorMsg": "Error calling createCORSRequest method",
        //}, e);
    }
};

/**
 * Create params object to request
 *
 * @param string   method   http verb
 * @param string   url      the url to resource
 */
function createParams(data) {
    var params = '';

    for (key in data) {
        params = params + '&' + key + '=' + data[key];
    }

    params = params.substr(1, params.length);

    return params;
};

/**
 * Make GET requests
 *
 * @param string   url      the url to retrieve
 * @param mixed    data     data to send along with the get request [optional]
 * @param function callback function to call on successful result [optional]
 */
window["getCORS"] = function getCORS(url, data, callback) {
    var xhr = createCORSRequest('GET', url);
    if (xhr) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4 || xhr.responseText === "") { return; }

            callback(JSON.parse(xhr.responseText), 'success');
        };
        xhr.onerror = function () {
            //JL("ajaxAppender").fatal({
            //    "msg": "XMLHttpRequest Exception",
            //    "errorMsg": "Error calling getCORS method",
            //});
        };

        xhr.send();
    }
    else {
        //console.log('CORS not supported');
        return;
    }
};

/**
 * Make POSTs requests
 *
 * @param string   url      the url to post to
 * @param mixed    data     additional data to send [optional]
 * @param function callback a function to call on success [optional]
 */
window["postCORS"] = function postCORS(url, data, callback) {
    var xhr = createCORSRequest('POST', url);

    if (xhr) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4 || xhr.responseText === "") { return; }

            callback(JSON.parse(xhr.responseText), 'success');
        };

        xhr.onerror = function () {
            //JL("ajaxAppender").fatal({
            //    "msg": "XMLHttpRequest Exception",
            //    "errorMsg": "Error calling postCORS method",
            //});
        };

        params = createParams(data);

        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    }
    else {
        //console.log('CORS not supported');
        return;
    }
};

function isGuid(field) {
    return soclHelper.guidValidation(soclHelper.replaceAll("-", "", field))
}

var isOptionalGuidFieldValid = function (field) {
    return !(field && !isGuid(field));
}

var isValidEvent = function (event) {
    // public Guid ConfigurationId { get; set; }
    // public Guid PersonId { get; set; }
    // public Guid ChannelId { get; set; }
    // public Guid TransitionId { get; set; }
    // public Guid ClientId { get; set; }
    if (!event.type || !isGuid(event.customerId) ||
        !isOptionalGuidFieldValid(event.personId) ||
        !isOptionalGuidFieldValid(event.channelId) ||
        !isOptionalGuidFieldValid(event.clientId)) {
        console.error('invalid event');
        console.log(event);
        return false;
    }

    return true;
};


var isValidBehavior = function (behavior) {
    // public Guid ? CustomerId { get; set; }
    // public Guid ? PersonId { get; set; }
    // public Guid ? ClientId { get; set; }
    if (!isOptionalGuidFieldValid(behavior.customerId) ||
        !isOptionalGuidFieldValid(behavior.personId) ||
        !isOptionalGuidFieldValid(behavior.clientId)) {
        console.error('invalid behavior');
        console.log(behavior);
        return false;
    }

    return true;
};

/**
 * Make POSTs requests
 *
 * @param string   url      the url to post to
 * @param mixed    data     additional data to send [optional]
 * @param function callback a function to call on success [optional]
 */
window["postJsonCORS"] = function postJsonCORS(url, data, callback) {
    var hasObjectList = data && ((data.events && data.events.length) || (data.behaviors && data.behaviors.length));

    if (!hasObjectList)
        return;

    if (data.events) {
        for (var i = 0; i < data.events.length; i++) {
            var event =  data.events[i];

            if (!isValidEvent(event))
                return;
        }
    }

    if (data.behaviors) {
        for (var i = 0; i < data.behaviors.length; i++) {
            var behavior = data.behaviors[i];

            if (!isValidBehavior(behavior))
                return;
        }
    }

    var xhr = createCORSRequest('POST', url);

    if (xhr) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4 || xhr.responseText === "") { return; }

            callback && callback(JSON.parse(xhr.responseText), 'success');
        };

        xhr.onerror = function () {
            //JL("ajaxAppender").fatal({
            //    "msg": "XMLHttpRequest Exception",
            //    "errorMsg": "Error calling postJsonCORS method",
            //});
        };

        xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify(data).replace("\"[", '[').replace("]\"", ']').replace(/\\"/g, '"'));
    }
    else {
        //console.log('CORS not supported');
        return;
    }
};

/**
 * Make PUTs requests
 *
 * @param string   url      the url to post to
 * @param mixed    data     additional data to send [optional]
 * @param function callback a function to call on success [optional]
 */
window["putCORS"] = function putCORS(url, data, callback) {
    var xhr = createCORSRequest('PUT', url);

    if (xhr) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4 || xhr.responseText === "") { return; }

            callback(JSON.parse(xhr.responseText), 'success');
        };
        xhr.onerror = function () {
            //JL("ajaxAppender").fatal({
            //    "msg": "XMLHttpRequest Exception",
            //    "errorMsg": "Error calling putCORS method",
            //});
        };

        params = createParams(data);

        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    }
    else {
        //console.log('CORS not supported');
        return;
    }
};

/**
 * Make DELETEs requests
 *
 * @param string   url      the url to post to
 * @param mixed    data     additional data to send [optional]
 * @param function callback a function to call on success [optional]
 */
window["deleteCORS"] = function deleteCORS(url, data, callback) {
    var xhr = createCORSRequest('DELETE', url);

    if (xhr) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) { return; }

            callback(JSON.parse(xhr.responseText), 'success');
        };
        xhr.onerror = function () {
            //JL("ajaxAppender").fatal({
            //    "msg": "XMLHttpRequest Exception",
            //    "errorMsg": "Error calling deleteCORS method",
            //});
        };

        params = createParams(data);

        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    }
    else {
        //console.log('CORS not supported');
        return;
    }
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

﻿
window["soclPerfCounter"] = {};

(function (context) {

    // #[PRIVATE METHODS] ------------------------------------
   
    var computeHit = function (data, callback) {
        postCORS(apiUrl + "/plugins/" + data['pluginId'] + "/performance/" + data['actionTypeId'] + "?format=json",
         { pluginTypeId: data['pluginTypeId'], customerId: data['customerId'] },
         function (data) {
             callback(true);
         });
    }

    var computeABTest = function (data, callback) {
        postCORS(apiUrl + "/plugins/" + data['pluginId'] + "/performance/abtest?format=json",
         { pluginTypeId: data['pluginTypeId'], customerId: data['customerId'] },
         function (data) {
             callback(true);
         });
    };

    // #[PUBLIC METHODS] ------------------------------------

    context.type = {
        Click: 1,
        View: 2,
        Impression: 3,
        PushBlocked: 7,
        PushErrorWhileGetToken: 8
    };

    context.event = function (pluginId, actionTypeId, pluginTypeId, customerId) {
        var data = {
            "pluginId": pluginId,
            "actionTypeId": actionTypeId,
            "pluginTypeId": pluginTypeId,
            "customerId": customerId
        };

        computeHit(data, function (response) { });

        if (actionTypeId === context.type.Click) {
            computeABTest(data, function (response) { });
        }
    };

})(soclPerfCounter);

/***/ }),
/* 8 */
/***/ (function(module, exports) {

﻿
window["soclCookie"] = {};

(function (context) {

    // #[PRIVATE METHODS] ------------------------------------


    // #[PUBLIC METHODS] -------------------------------------

    context.createCookie = function (name, value, days, expiration) {
        var expires = "";

        if (days || expiration) {
            var date = new Date();
            date.setTime(date.getTime() + (expiration || (days * 24 * 60 * 60 * 1000)));
            expires = "; expires=" + date.toGMTString();
        }

        document.cookie = name + "=" + value + expires + "; path=/";
    }

    context.removeCookie = function (name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    context.createCookieOnSite = function (name, value, miliseconds) {
        var expires = "";

        if (miliseconds) {
            var date = new Date();
            date.setTime(date.getTime() + miliseconds);
            expires = "; expires=" + date.toGMTString();
        }

        document.cookie = name + "=" + value + expires + "; path=/";
    }

    context.getCookie = function (cookieName) {
        var name = cookieName + "=";
        var listCookies = document.cookie.split(';');

        for (var i = 0; i < listCookies.length; i++) {
            var cookie = listCookies[i];

            while (cookie.charAt(0) == ' ') cookie = cookie.substring(1);

            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }

        return "";
    }

})(soclCookie);

/***/ }),
/* 9 */
/***/ (function(module, exports) {

﻿/// <reference path="corsWrapper.js" />
/// <reference path="../plugins/performance-counter.js" />
/// <reference path="../plugins/social-connect.js" />

window["soclHelper"] = {};
var environment = '';

(function (context) {

    // #[CONSTANT VARIABLES] ------------------------------------

    var TIMEOUT_PORTHOLE = 5
        , TIMEOUT_GET_CID = 2
        , TIMEOUT_GET_PID = 2
        , TIMEOUT_SHOWPLUGIN = 2
        , TIMEOUT_GET_PUSH_ENDPOINT = 1
        , TIMEOUT_GET_PUSH_ENDPOINT_BY_CID = 1
        , TIMEOUT_GET_FB_OPTIN = 1
        , TIMEOUT_GET_PURL = 2
        , TIMEOUT_GET_TAGS = 2
        , TIMEOUT_GET_CLOSE_URL = 2
        , TIMEOUT_GET_PARAM_ON_SESSION = 1

    var channelType = {
        Desktop: 3,
        Mobile: 7
    };

    var EVENTS_COOKIE = {
        KEY: "smeventssent_",
        INTERVAL: 120000 // 2m in miliseconds
    };

    var systemType = {
        Enterprise: 1,
        Engage: 2
    };

    var paramsConcurrentImpact = ["utm_", "gclid"];

    context.getParamsConcurrentImpact = function () {
        return paramsConcurrentImpact;
    };

    var getEnvironment = function () {
        return environment;
    };

    context.getEnvironment = function () {
        return getEnvironment();
    }

    context.getEventsCookieInfo = function () {
        return EVENTS_COOKIE;
    };

    // #[PRIVATE METHODS] ------------------------------------

    //var JS_URI = "http://localhost:1660/sdk/plugins/assets/js/";
    //var JS_URI = "https://beta-plugins.soclminer.com.br/v3/assets/js/";
    var JS_URI = "https://" + context.getEnvironment() + "plugins.soclminer.com.br/v3/assets/js/";

    var controlGroupType = {
        Plugins: 1
    };

    var escapeRegExp = function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };

    var existsPortholeObj = function (callback) {
        var interval = window.setInterval(function () {
            try {
                if (typeof Porthole != "undefined") {
                    window.clearInterval(interval);
                    callback(true);
                } else {
                    TIMEOUT_PORTHOLE--;
                    if (TIMEOUT_PORTHOLE == 0) {
                        window.clearInterval(interval);
                        callback(false);
                    };
                };
            } catch (e) { };
        }, 1000);
    };

    var getCGSettings = function (customerId, typeId, callback) {
        getCORS(apiUrl + "/customers/" + customerId + "/cgsettings/" + typeId + "?format=json", null,
            function (data) {
                callback(data);
            }
        );
    };

    // #[PUBLIC METHODS] -------------------------------------

    //context.PROXY_URI = "http://localhost:1660/sdk/plugins/assets/proxy.min.html";
    //context.PROXY_URI = "https://beta-plugins.soclminer.com.br/v3/assets/proxy.min.html";
    context.PROXY_URI = "https://" + context.getEnvironment() + "plugins.soclminer.com.br/v3/assets/proxy.min.html";

    context.replaceAll = function (find, replace, str) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    };

    context.isMobile = function () {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    context.formatDate = function (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    context.getNow = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hour = today.getHours();
        var minute = today.getMinutes();
        var second = today.getSeconds();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        return yyyy + '-' + mm + '-' + dd + " " + hour + ":" + minute + ":" + second;
    };

    context.contains = function (source, target) {
        return source.indexOf(target) != -1;
    };

    context.getQueryStringParams = function (param) {
        var pageURL = window.location.search.substring(1);
        var urlVariables = pageURL.split('&');

        for (var i = 0; i < urlVariables.length; i++) {
            var parameterName = urlVariables[i].split('=');

            if (parameterName[0] == param) {
                return parameterName[1];
            }
        }
    };

    context.toGUID = function (value) {
        var result = "";

        if (value !== "") {
            result = result + value.substring(0, 8);
            result = result + "-" + value.substring(8, 12);
            result = result + "-" + value.substring(12, 16);
            result = result + "-" + value.substring(16, 20);
            result = result + "-" + value.substring(20, 32);
        }

        return result;
    };

    context.hasClass = function (target, className) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
    }

    // #[API METHODS] -------------------------------------

    context.updateAccessToken = function (customerId) {
        if (!customerId) 
            return;

        var isExchangeToken = soclCookie.getCookie("smextoken_" + customerId);

        if (isExchangeToken)
            return;

        soclConnect.getStatus(function (connected) {
            if (!connected)
                return;

            soclConnect.getFbCurrentAccessToken(function (token) {
                if (!token)
                    return;

                soclConnect.getId(customerId, function (smId) {
                    if (!smId)
                        return;

                    getCORS(apiUrl + "/fb/exchangeToken/" + customerId + "/" + token + "/?format=json", null,
                        function (data) {
                            postCORS(apiUrl + "/users/profile/" + data.response.accessToken + "/?format=json", { customerId: customerId, userId: smId },
                                function (data) {
                                    soclCookie.createCookie("smextoken_" + customerId, true, 7);
                                }
                            );
                        }
                    );
                });
            });
        });
    };

    context.formatUrlBy = function (id, plugin_type, urls, callback) {
        if (urls) {
            var endPointPieces = [apiUrl + "/customers/" + id + "/formaturl?format=json&pluginType=" + plugin_type];
            endPointPieces = endPointPieces.concat(urls);

            var endPoint = endPointPieces.join('&url=');

            getCORS(endPoint, null,
                function (data) {
                    callback(data);
                }
            );
        }
    };

    context.findLocalItems = function (query) {
        var i, results = [];
        for (i in localStorage) {
            if (localStorage.hasOwnProperty(i)) {
                if (i.match(query) || (!query && typeof i === 'string')) {
                    value = JSON.parse(localStorage.getItem(i));
                    results.push(i);
                }
            }
        }
        return results;
    }

    context.getCustomerInfo = function (id, url, callback) {
        context.getParamOnSession(function (param) {
            var referrer = (document.referrer !== "") ? encodeURIComponent(document.referrer) : "";

            var isMinerLandingUrl = referrer.indexOf('minerlanding') !== -1;

            if (isMinerLandingUrl) {
                referrer = 'https://minerlanding.soclminer.com.br';
            }

            var onsites = context.findLocalItems("onsiteview_");
            var onSiteParams = '';

            onsites.forEach(function (item) {
                onSiteParams += "&OnsiteViewed=" + item;
            });

            getCORS(apiUrl + "/customers/" + id + "?format=json&url=" + url + "&referrer=" + referrer + "&paramOnSession=" + param + "&isMobile=" + context.isMobile() + onSiteParams, null,
                function (data) {
                    callback(data);
                }
            );
        });
    };

    context.createSessionHash = function (customerId) {
        return toSha1(customerId + soclConnect.generateRndGuidV4() + new Date().toISOString());
    };

    context.getSessionHash = function () {
        var SESSION_HASH_KEY = "session-guid";
        return context.getSessionStorageValue(SESSION_HASH_KEY);
    }

    var isStringifiedObjectOrArray = function (str) {
        return str && str.length && (str[0] === '{' || str[0] === '[');
    };

    var simpleParse = function (str) {
        if (isStringifiedObjectOrArray(str)) {
            var obj = JSON.parse(str);
            if (obj instanceof Array)
                return obj.map(function (item) {
                    return simpleParse(item);
                });

            return Object.entries(obj)
                .reduce(function (unescapedObj, entry) {
                    var key = entry[0];
                    var value = entry[1];

                    var item = {};
                    item[key] = simpleParse(value);

                    return Object.assign({}, unescapedObj, item);
                },
                {});
        }

        return str;
    };

    var getLogDB = function (customerId, prefix) {
        var formattedCustomerID = soclHelper.replaceAll("-", "", customerId);
        var dbName = context.replaceAll("{0}", formattedCustomerID, (prefix || "logs") + "_{0}");
        return soclTracking.getLocalDB(dbName);
    }

    var currentPageIsPurchase = function (purchaseUrls) {
        var currentUrl = document.location.href.replace(/^(http|https):\/\//i, '');

        return purchaseUrls.some(function (purchaseUrl) {
            purchaseUrl = purchaseUrl.replace(/^(http|https):\/\//i, '');
            return soclHelper.contains(currentUrl, purchaseUrl);
        });
    };

    context.getMetadata = function () {
        var metadata = window.sm__dataLayer || {};
        for (i in metadata) {
            metadata[i] = metadata[i] instanceof Array ? metadata[i].toString() : metadata[i];
        }

        return metadata;
    };

    context.postBehaviors = function (customerId, clientId, byPass, personId) {
        var SEND_BEHAVIORS_INTERVAL = 120000; // 2m in miliseconds
        var BEHAVIORS_COOKIE_KEY = "smbehaviorssent_" + context.replaceAll("-", "", customerId);

        var postBehaviors = function () {
            var behaviorsBuffer = getBehaviorsBuffer(customerId, clientId, personId);

            var endpoint = "https://" + getEnvironment() + "wonka.socialminer.com/ursa/enterprise/behaviors";

            behaviorsBuffer.forEach(function (behavior) {
                behavior.userAgent = navigator.userAgent;
                postJsonCORS(endpoint, behavior);
            });

            soclCookie.createCookie(BEHAVIORS_COOKIE_KEY, "true", null, SEND_BEHAVIORS_INTERVAL);
        };

        if (byPass) {
            postBehaviors();
        }
        else {
            var shouldSendBehaviors = !soclCookie.getCookie(BEHAVIORS_COOKIE_KEY);
            soclHelper.getPurchaseUrl(function (listPurchaseUrl) {
                var isPurchasePage = currentPageIsPurchase(listPurchaseUrl)
                if (shouldSendBehaviors || isPurchasePage) {
                    postBehaviors();
                }
            });
        }
    };

    context.setCustomerInfoToLocalStorage = function (customerInfo) {
        var CUSTOMER_INFO_KEY = "smCustomerInfo_" + context.replaceAll("-", "", customerInfo.id);
        return context.setLocalStorageValue(CUSTOMER_INFO_KEY, customerInfo);
    };

    context.getCustomerInfoFromLocalStorage = function (customerId) {
        var CUSTOMER_INFO_KEY = "smCustomerInfo_" + context.replaceAll("-", "", customerId);
        return context.getLocalStorageValue(CUSTOMER_INFO_KEY);
    };

    var getBehaviorsBuffer = function (customerId, clientId, personId) {
        var BUFFER_SIZE = 10;
        var CUT_DATE = new Date("2019-07-01 00:00:00")
        var LOGS_TABLE_NAME = "items";
        var behaviorsBuffer = [];

        var aggregateBehaviorsBySessionHash = function (acc, cur) {
            var ABSENT_SESSION_HASH_KEY = "00000000-0000-0000-0000-000000000000";

            if (new Date(cur.date) < CUT_DATE) {
                return acc;
            }

            var behavior = {
                customerId: customerId,
                clientId: cur.clientId || clientId,
                personId: personId,
                metadata: cur.metadata || {},
                url: encodeURIComponent(cur.url),
                referer: (cur.referrer !== "") ? encodeURIComponent(cur.referrer) : ""
            };

            behavior.metadata = sanitazeMetadataToBehavior(behavior.metadata)

            var sessionHashKey = cur.sessionHash || ABSENT_SESSION_HASH_KEY;
            var aggregatedBehaviors = acc[sessionHashKey] || [];

            aggregatedBehaviors.push(behavior);

            acc[sessionHashKey] = aggregatedBehaviors;
            return acc;
        };

        var logDB = getLogDB(customerId);

        if (logDB.tableExists(LOGS_TABLE_NAME)) {
            var query = { limit: BUFFER_SIZE };
            var logs = logDB.queryAll(LOGS_TABLE_NAME, query);

            if (logs && logs.length) {
                var logsBuffer = logs.slice(0, BUFFER_SIZE);
                var aggregatedBehaviorsBySessionHash = logsBuffer.reduce(aggregateBehaviorsBySessionHash, {});
                behaviorsBuffer = Object.keys(aggregatedBehaviorsBySessionHash)
                    .map(function (sessionHash) {
                        return {
                            behaviors: aggregatedBehaviorsBySessionHash[sessionHash],
                            sessionHash: sessionHash
                        };
                    });

                var rowsCount = 0;
                logDB.deleteRows(LOGS_TABLE_NAME, function (row) {
                    return ++rowsCount <= BUFFER_SIZE;
                });
                logDB.commit();
            }
        };

        return behaviorsBuffer;
    };

    var sanitazeMetadataToBehavior = function (metadata) {
        if (!metadata) {
            return {}
        }

        delete metadata['price']
        delete metadata['notAvailable']

        return metadata
    }

    context.createEvent = function (eventObj) {
        soclHelper.getCID(function (cid) {
            if ((cid !== 0 || eventObj.customerId) && eventObj && eventObj.type && eventObj.type.trim().length > 0) {
                var smObj = context.getOrCreateSMObj(cid || eventObj.customerId);
                var formattedCID = soclHelper.replaceAll("-", "", cid || eventObj.customerId);

                var sessionHash = context.getOrCreateSessionHash();

                var event = {
                    type: eventObj.type,
                    step: eventObj.step,
                    channelId: eventObj.channelId,
                    customerId: cid || eventObj.customerId,
                    clientId: smObj.clientId,
                    systemId: systemType.Enterprise,
                    dateTime: context.getNow(),
                    personId: eventObj.personId || soclHelper.getStoreValue("smid_" + eventObj.customerId),
                    additionalData: encodeURI(JSON.stringify(eventObj.additionalData || {}))
                };

                var eventDBName = "events_" + formattedCID;
                soclTracking.insertEventItem(eventDBName, { sessionHash: sessionHash, event: event });
                socl.emmit.onEvent(event);
            }
        });
    };

    context.shouldSendEvents = function (formattedCID) {
        return !soclCookie.getCookie(EVENTS_COOKIE.KEY + formattedCID);
    }

    context.sendEvents = function (formattedCID, bypass) {
        if (context.shouldSendEvents(formattedCID) || bypass) {
            var eventsBuffer = getEventsBuffer(formattedCID);

            var endpoint = "https://" + context.getEnvironment() + "wonka.socialminer.com/ursa/enterprise/events";

            eventsBuffer.forEach(function (event) {
                postJsonCORS(endpoint, event);
            });

            soclCookie.createCookie(EVENTS_COOKIE.KEY + formattedCID, "true", null, EVENTS_COOKIE.INTERVAL);
        }
    };

    var getEventsBuffer = function (formattedCustomerId) {
        var BUFFER_SIZE = 5;
        var eventsBuffer = [];
        var LOGS_TABLE_NAME = "items";

        var aggregateEventsBySessionHash = function (acc, cur) {
            var event = {
                type: cur.event.type,
                step: cur.event.step,
                channelId: cur.event.channelId,
                customerId: cur.event.customerId,
                clientId: cur.event.clientId,
                systemId: cur.event.systemId,
                dateTime: cur.event.dateTime,
                personId: cur.event.personId,
                additionalData: cur.event.additionalData
            };

            var sessionHashKey = cur.sessionHash;
            var aggregatedEvents = acc[sessionHashKey] || [];

            aggregatedEvents.push(event);

            acc[sessionHashKey] = aggregatedEvents;
            return acc;
        };

        var logDB = getLogDB(formattedCustomerId, "events");

        if (logDB.tableExists(LOGS_TABLE_NAME)) {
            var query = { limit: BUFFER_SIZE };
            var logs = logDB.queryAll(LOGS_TABLE_NAME, query);

            if (logs && logs.length) {
                var logsBuffer = logs.slice(0, BUFFER_SIZE);
                var aggregatedEventsBySessionHash = logsBuffer.reduce(aggregateEventsBySessionHash, {});

                eventsBuffer = Object.keys(aggregatedEventsBySessionHash)
                    .map(function (sessionHash) {
                        return {
                            events: aggregatedEventsBySessionHash[sessionHash],
                            sessionHash: sessionHash
                        };
                    });

                var rowsCount = 0;

                logDB.deleteRows(LOGS_TABLE_NAME, function (row) {
                    return ++rowsCount <= BUFFER_SIZE;
                });

                logDB.commit();
            }
        };

        return eventsBuffer;
    };

    context.getPluginSettingsByType = function (customerId, featureId, pluginType, callback) {
        getCORS(apiUrl + "/customers/" + customerId + "/feature/" + featureId + "?format=json&pluginType=" + pluginType, null,
            function (data) {
                callback(data);
            }
        );
    };

    context.getPluginSettings = function (customerId, featureId, callback) {
        getCORS(apiUrl + "/customers/" + customerId + "/feature/" + featureId + "?format=json", null,
            function (data) {
                callback(data);
            }
        );
    };

    var toSha1 = function (msg, base64) {
        function rotateLeft(n, s) {
            return (n << s) | (n >>> (32 - s));
        }

        var hexToBase64 = function (str) {
            return btoa(
                String.fromCharCode.apply(
                    null,
                    str
                        .replace(/\r|\n/g, '')
                        .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
                        .replace(/ +$/, '')
                        .split(' ')
                )
            );
        };

        var cvtHex = function (val) {
            var str = '';
            var i;
            var v;
            for (i = 7; i >= 0; i--) {
                v = (val >>> (i * 4)) & 0x0f;
                str += v.toString(16);
            }
            return str;
        };

        var utf8Encode = function (string) {
            string = string.replace(/\r\n/g, '\n');
            var utftext = '';
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if (c > 127 && c < 2048) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };

        var blockstart,
            i,
            j,
            W = new Array(80),
            H0 = 0x67452301,
            H1 = 0xefcdab89,
            H2 = 0x98badcfe,
            H3 = 0x10325476,
            H4 = 0xc3d2e1f0,
            A,
            B,
            C,
            D,
            E,
            temp;

        msg = utf8Encode(msg);
        var msgLen = msg.length,
            wordArray = [];

        for (i = 0; i < msgLen - 3; i += 4) {
            j =
                (msg.charCodeAt(i) << 24) |
                (msg.charCodeAt(i + 1) << 16) |
                (msg.charCodeAt(i + 2) << 8) |
                msg.charCodeAt(i + 3);
            wordArray.push(j);
        }

        switch (msgLen % 4) {
            case 0:
                i = 0x080000000;
                break;
            case 1:
                i = (msg.charCodeAt(msgLen - 1) << 24) | 0x0800000;
                break;
            case 2:
                i = (msg.charCodeAt(msgLen - 2) << 24) | (msg.charCodeAt(msgLen - 1) << 16) | 0x08000;
                break;
            case 3:
                i =
                    (msg.charCodeAt(msgLen - 3) << 24) |
                    (msg.charCodeAt(msgLen - 2) << 16) |
                    (msg.charCodeAt(msgLen - 1) << 8) |
                    0x80;
                break;
        }

        wordArray.push(i);
        while (wordArray.length % 16 != 14) wordArray.push(0);
        wordArray.push(msgLen >>> 29);
        wordArray.push((msgLen << 3) & 0x0ffffffff);

        for (blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
            for (i = 0; i < 16; i++) W[i] = wordArray[blockstart + i];
            for (i = 16; i <= 79; i++) W[i] = rotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
            A = H0;
            B = H1;
            C = H2;
            D = H3;
            E = H4;
            for (i = 0; i <= 19; i++) {
                temp = (rotateLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotateLeft(B, 30);
                B = A;
                A = temp;
            }
            for (i = 20; i <= 39; i++) {
                temp = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotateLeft(B, 30);
                B = A;
                A = temp;
            }
            for (i = 40; i <= 59; i++) {
                temp = (rotateLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8f1bbcdc) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotateLeft(B, 30);
                B = A;
                A = temp;
            }
            for (i = 60; i <= 79; i++) {
                temp = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotateLeft(B, 30);
                B = A;
                A = temp;
            }
            H0 = (H0 + A) & 0x0ffffffff;
            H1 = (H1 + B) & 0x0ffffffff;
            H2 = (H2 + C) & 0x0ffffffff;
            H3 = (H3 + D) & 0x0ffffffff;
            H4 = (H4 + E) & 0x0ffffffff;
        }
        temp = cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4);

        if (base64) return hexToBase64(temp.toLowerCase());

        return temp.toLowerCase();
    };

    context.getPluginSettingsDemo = function (customerId, featureId, pluginType, identifier, callback) {
        getCORS(apiUrl + "/customers/" + customerId + "/feature/" + featureId + "?format=json&pluginType=" + pluginType + "&pluginIdentifier=" + identifier, null,
            function (data) {
                callback(data);
            }
        );
    };

    context.listCampaignsBy = function (customerId, callback) {
        var channelId = context.isMobile() ? channelType.Mobile : channelType.Desktop;

        var url = apiUrl + "/customers/" + customerId + "/campaign/?format=json&channelType=" + channelId;

        getCORS(url, null, function (data) {
            callback(data);
        });
    };

    // #[CLIENT METHODS] -------------------------------------

    context.setSessionValue = function (key, value) {
        try {
            window.sessionStorage.setItem(key, value);
        } catch (e) { }
    };

    context.setStoreValue = function (key, value) {
        try {
            window.localStorage.setItem(key, value.replace("\"[", '[').replace("]\"", ']').replace(/\\"/g, '"'));
        } catch (e) { }
    };

    context.setCookie = function (name, value, exdays) {
        try {
            soclCookie.createCookie(name, value, exdays);
        } catch (e) { }
    };

    context.getSessionValue = function (key) {
        var value = null;

        try {
            value = window.sessionStorage.getItem(key, value);
        } catch (e) { }

        return value;
    };

    var prefix = "sm__";
    var prefixAsRegex = new RegExp("^" + prefix);

    var addPrefix = function (key) {
        return prefix + key.replace(prefixAsRegex, '');
    }

    context.getLocalStorageValue = function (key) {
        var value = window.localStorage.getItem(addPrefix(key));

        return value && (value[0] === '[' || value[0] === '{') ? simpleParse(value) : value;
    };

    context.setLocalStorageValue = function (key, value) {
        window.localStorage.setItem(addPrefix(key), typeof value === 'object' ? JSON.stringify(value) : value);

        return value;
    };

    context.getSessionStorageValue = function (key) {
        var value = window.sessionStorage.getItem(addPrefix(key));

        return value && (value[0] === '[' || value[0] === '{') ? JSON.parse(value) : value;
    };

    context.setSessionStorageValue = function (key, value) {
        window.sessionStorage.setItem(addPrefix(key), typeof value === 'object' ? JSON.stringify(value) : value);

        return value;
    };

    context.getStoreValue = function (key) {
        var value = null;

        try {
            value = window.localStorage.getItem(key);
        } catch (e) { }

        return value;
    };

    context.removeSessionValue = function (key) {
        try {
            window.sessionStorage.removeItem(key);
        } catch (e) { }
    };

    context.removeStoreValue = function (key) {
        try {
            window.localStorage.removeItem(key);
        } catch (e) { }
    };

    context.clearSession = function () {
        try {
            window.sessionStorage.clear();
        } catch (e) { }
    };

    context.clearStore = function () {
        try {
            window.localStorage.clear();
        } catch (e) { }
    };

    context.computePluginHit = function (actionType, pluginType) {
        soclHelper.getCID(function (cid) {
            if (cid !== 0) {
                soclHelper.getPID(pluginType, function (pid) {
                    if (pid !== 0) {
                        soclPerfCounter.event(pid, actionType, pluginType, cid);
                    }
                });
            }
        });
    };

    context.getCID = function (callback) {
        var id = soclHelper.getStoreValue("smcid");

        if (id !== null && id !== '') {
            callback(id);
        } else {
            setTimeout(function () {
                TIMEOUT_GET_CID--;
                if (TIMEOUT_GET_CID > 0) {
                    context.getCID(callback);
                } else {
                    callback(0);
                }
            }, 1000);
        }
    };

    context.isInControlGroup = function (randomNumber, percentRange) {
        return randomNumber && percentRange && (randomNumber <= percentRange);
    };

    context.isInSuppressionGroup = function (customerId, pluginId) {
        if (!pluginId) {
            return false;
        }

        try {
            var customerInfo = soclHelper.getCustomerInfoFromLocalStorage(customerId);
            var smObj = soclHelper.getOrCreateSMObj(customerId);
            var feature = customerInfo.features.find(function (item) {
                return item.pluginId == pluginId;
            });

            return feature && soclHelper.isInControlGroup(smObj.randomNumber, feature.controlGroupPercentage || 0);
        }
        catch (e) {
            console.log(e)
        }
    };

    var generateRndNumber = function (maxNumber) {
        return Math.floor((Math.random() * maxNumber) + 1);
    };

    context.getOrCreateSMObj = function (customerId) {
        var MAX_NUMBER = 100;

        var smObjIdKey = soclConnect.getSMObjIdKey(customerId);
        var rawSmObj = context.getLocalStorageValue(smObjIdKey) || {};

        if (!rawSmObj.clientId || !rawSmObj.randomNumber) {
            rawSmObj.clientId = rawSmObj.clientId || soclConnect.generateRndGuidV4();
            rawSmObj.randomNumber = rawSmObj.randomNumber || generateRndNumber(MAX_NUMBER);

            context.setLocalStorageValue(smObjIdKey, rawSmObj);
        }

        return rawSmObj;
    };

    context.getOrCreateSessionHash = function (customerId) {
        var SESSION_HASH_KEY = "session-guid";

        return context.getSessionStorageValue(SESSION_HASH_KEY) ||
            context.setSessionStorageValue(SESSION_HASH_KEY, context.createSessionHash(customerId));
    };

    context.getPID = function (pluginType, callback) {
        var id = soclHelper.getStoreValue("smpid_" + pluginType);

        if (id !== null && id !== '') {
            callback(id);
        } else {
            setTimeout(function () {
                TIMEOUT_GET_PID--;
                if (TIMEOUT_GET_PID > 0) {
                    context.getPID(callback);
                } else {
                    callback(0);
                }
            }, 1000);
        }
    };

    context.getParamOnSession = function (callback) {
        var param = soclHelper.getSessionValue("paramOnSession");

        if (param !== null && param !== '') {
            callback(param);
        } else {
            setTimeout(function () {
                TIMEOUT_GET_PARAM_ON_SESSION--;
                if (TIMEOUT_GET_PARAM_ON_SESSION > 0) {
                    context.getParamOnSession(callback);
                } else {
                    callback("");
                }
            }, 1000);
        }
    };

    context.getPurchaseUrl = function (callback) {
        var url = soclHelper.getStoreValue("smpurl");

        if (url !== null && url !== '' && url !== 'undefined') {
            callback(url.split(","));
        } else {
            setTimeout(function () {
                TIMEOUT_GET_PURL--;
                if (TIMEOUT_GET_PURL > 0) {
                    context.getPurchaseUrl(callback);
                } else {
                    callback([]);
                }
            }, 1000);
        }
    };

    context.getTagsParameter = function (callback) {
        var tags = soclHelper.getStoreValue("smtp");

        if (tags !== null && tags !== '' && tags !== 'undefined') {
            callback(JSON.parse(tags));
        } else {
            setTimeout(function () {
                TIMEOUT_GET_TAGS--;
                if (TIMEOUT_GET_TAGS > 0) {
                    context.getTagsParameter(callback);
                } else {
                    callback(new Array());
                }
            }, 1000);
        }
    };

    context.getPushEndpoint = function (callback) {
        var endpoint = soclHelper.getStoreValue("pushendpoint");

        if (endpoint !== null && endpoint !== '') {
            callback(endpoint);
        } else {
            setTimeout(function () {
                TIMEOUT_GET_PUSH_ENDPOINT--;
                if (TIMEOUT_GET_PUSH_ENDPOINT > 0) {
                    context.getPushEndpoint(callback);
                } else {
                    callback("");
                }
            }, 1000);
        }
    };

    context.hasPushOptInBy = function (customerId, callback) {
        var hasPushOptIn = soclHelper.getStoreValue("smpushoptin_" + customerId);
        var smid = soclHelper.getStoreValue("smid_" + customerId);

        if (hasPushOptIn !== null && hasPushOptIn !== '' && smid != 0) {
            callback(hasPushOptIn);
        } else {
            setTimeout(function () {
                TIMEOUT_GET_PUSH_ENDPOINT_BY_CID--;
                if (TIMEOUT_GET_PUSH_ENDPOINT_BY_CID > 0) {
                    context.hasPushOptInBy(customerId, callback);
                } else {
                    callback(false);
                }
            }, 1000);
        }
    };

    context.guidValidation = function (value) {
        var pattern = /^[0-9a-f]{8}[0-9a-f]{4}[1-5][0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12}$/i;
        return pattern.test(value);
    }

    context.hasFBOptIn = function (callback) {
        var hasFBOptIn = soclHelper.getStoreValue("userConnected");

        if (hasFBOptIn !== null && hasFBOptIn !== '') {
            callback(true);
        } else {
            setTimeout(function () {
                TIMEOUT_GET_FB_OPTIN--;
                if (TIMEOUT_GET_FB_OPTIN > 0) {
                    context.hasFBOptIn(callback);
                } else {
                    callback(false);
                }
            }, 1000);
        }
    };

    context.getCloseUrl = function (callback) {
        var url = soclHelper.getStoreValue("smcloseurl");

        if (url !== null && url !== '' && url !== 'undefined') {
            callback(url);
        } else {
            setTimeout(function () {
                TIMEOUT_GET_CLOSE_URL--;
                if (TIMEOUT_GET_CLOSE_URL > 0) {
                    context.getCloseUrl(callback);
                } else {
                    callback("");
                }
            }, 1000);
        }
    };

    context.getRedirectUrl = function (callback) {
        var url = soclHelper.getStoreValue("smredirecturl");

        if (url !== null && url !== '' && url !== 'undefined') {
            callback(url);
        } else {
            setTimeout(function () {
                TIMEOUT_GET_CLOSE_URL--;
                if (TIMEOUT_GET_CLOSE_URL > 0) {
                    context.getCloseUrl(callback);
                } else {
                    callback("");
                }
            }, 1000);
        }
    };

    context.getPosition = function () {
        var h = document.documentElement,
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';

        return percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
    }

    context.CGSplitTraffic = function (threshold, callback) {
        var rng = new Math.seedrandom();

        result = rng.quick();

        if (result <= threshold) {
            callback(true);
        }
        else {
            callback(false);
        }
    };

    context.userInControlGroup = function (customerInfo, callback) {
        if (customerInfo.cgActive) {
            getCGSettings(customerInfo.id, controlGroupType.Plugins, function (data) {
                context.CGSplitTraffic(data.response.threshold, function (result) {
                    callback(result);
                });
            });
            soclHelper.setSessionValue("controlGroupActive", true);
        }
        else {
            callback(false);
        }
    };

    context.showPlugin = function (customerId, storyId, callback) {
        var smid = soclHelper.getStoreValue(soclConnect.createSMIdKey(customerId));

        var userAlreadyConnected = soclHelper.getStoreValue(customerId);
        var viewedBounce = soclCookie.getCookie("viewedOuibounceModal_" + storyId);

        if ((userAlreadyConnected !== null && userAlreadyConnected !== "") || viewedBounce === 'true') {
            callback(false);
        } else {
            setTimeout(function () {
                TIMEOUT_SHOWPLUGIN--;
                if (TIMEOUT_SHOWPLUGIN > 0) {
                    context.showPlugin(customerId, storyId, callback);
                } else {
                    callback(true);
                }
            }, 1000);
        }
    };

    context.createBaseIframe = function () {
        var iframe = document.createElement("iframe");

        iframe.frameBorder = '0';
        iframe.marginWidth = '0';
        iframe.marginHeight = '0';
        iframe.scrolling = 'no';
        iframe.width = 1;
        iframe.height = 1;

        return iframe;
    };

    context.injectDiv = function (id, display) {
        if (document.getElementById(id)) { return; }
        var div = document.createElement('div');
        div.id = id;
        div.style.display = display;
        document.body.insertBefore(div, document.body.childNodes[0]);
    };

    context.injectManifest = function (uri, file) {
        var link, ref = document.getElementsByTagName('script')[0];
        link = document.createElement('link');
        link.href = uri + file;
        link.rel = "manifest";
        ref.parentNode.insertBefore(link, ref);
    };

    context.injectCSS = function (uri, style) {
        var css, ref = document.getElementsByTagName('script')[0];
        css = document.createElement('link');
        css.href = uri + style;
        css.rel = "stylesheet";
        ref.parentNode.insertBefore(css, ref);
    };

    context.injectPAJS = function (callback) {
        if (!document.getElementById("pajs")) {
            var p, ref = document.getElementsByTagName('script')[0];
            p = document.createElement('script');
            p.id = "pajs";
            p.src = JS_URI + "pajs.min.js";
            p.type = "text/javascript";
            ref.parentNode.insertBefore(p, ref);
        }

        existsPortholeObj(callback);
    };

    context.injectScrollJS = function () {
        if (!document.getElementById("scroll")) {
            var p, ref = document.getElementsByTagName('script')[0];
            p = document.createElement('script');
            p.id = "scroll";
            p.src = JS_URI + "scroll.min.js";
            p.type = "text/javascript";
            ref.parentNode.insertBefore(p, ref);
        }

        //existsPortholeObj(callback);
    };

    context.injectOUIBounce = function () {
        if (!document.getElementById("pajs_b")) {
            var b, ref = document.getElementsByTagName('script')[0];
            b = document.createElement('script');
            b.id = "pajs_b";
            b.src = JS_URI + "ouibounce.min.js";
            b.type = "text/javascript";
            ref.parentNode.insertBefore(b, ref);
        }
    };

    context.injectCrawler = function (customerId, callback) {
        var CRAWLER_TAG_ID = "sm_crawler";
        var crawlerUri = "https://" + getEnvironment() + "static.socialminer.com/customers/" +
            customerId + "/crawler/crawler.js";

        if (!document.getElementById(CRAWLER_TAG_ID)) {
            var resource = document.createElement("script");

            var doCallback = function () {
                callback && callback();
                callback = null;
            }

            document.addEventListener("crawler-finished", doCallback);

            resource.onerror = function () {
                console.error("Crawler not loaded: ", crawlerUri)
                doCallback();
            }

            resource.id = CRAWLER_TAG_ID;
            resource.type = "text/javascript";
            resource.src = crawlerUri;

            var ref = document.getElementsByTagName('script')[0];
            ref.parentNode.insertBefore(resource, ref);
        }
        else {
            callback && setTimeout(callback, 1);
        }
    };

    context.IsGAEnabled = function (isGAEnabled) {
        return (isGAEnabled !== null && isGAEnabled !== '' && isGAEnabled !== 'undefined' && isGAEnabled === "true");
    };

    context.checkGA = function () {
        return (typeof ga === 'function');
    };

    context.convertMS = function (milliseconds) {
        var day, hour, minute, seconds, decimalDay;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        decimalDay = (milliseconds / 1000 / 60 / 60 / 24).toFixed(2);
        return {
            day: day,
            hour: hour,
            minute: minute,
            seconds: seconds,
            decimalDay: decimalDay
        };
    }

})(soclHelper);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(JL) {﻿/// <reference path="bower_components/jsnlog/jsnlog.min.js" />
/// <reference path="common/helper.js" />

window["soclError"] = {};

(function (context) {

    // #[PRIVATE METHODS] ------------------------------------

    var listDomain = ["soclminer.com.br"];

    var extractDomain = function (url) {
        var domain;
        //find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        }
        else {
            domain = url.split('/')[0];
        }

        //find & remove port number
        domain = domain.split(':')[0];

        return domain;
    }

    var isValidDomain = function (url, listDomain) {
        for (var i = 0; i < listDomain.length; i++) {
            if (soclHelper.contains(url, listDomain[i])) {
                return true;
            }
        }
        return false;
    };

    // #[JSNLog SETTINGS] ------------------------------------

    var ajaxAppender = JL.createAjaxAppender("ajaxAppender");
    //var consoleAppender = JL.createConsoleAppender('consoleAppender');

    var env = "";

    if (soclHelper)
        env = soclHelper.getEnvironment();
    
    var apiUrl = "https://" + env + "api.soclminer.com.br/v2.1/client/error";

    ajaxAppender.setOptions({
        "bufferSize": 3,
        "storeInBufferLevel": JL.getErrorLevel(),
        "level": JL.getFatalLevel(),
        "sendWithBufferLevel": JL.getFatalLevel(),
        //"url": "http://localhost:2834/client/error"
        //"url": "https://beta-api.soclminer.com.br/v2.1/client/error"
        "url": apiUrl
    });

    // #[PUBLIC METHODS] -------------------------------------

    window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
        //if (isValidDomain(extractDomain(url), listDomain)) {
        //    JL("ajaxAppender").fatalException({
        //        "msg": "Exception",
        //        "errorMsg": errorMsg,
        //        "url": url,
        //        "line number": lineNumber,
        //        "column": column
        //    }, errorObj);
        //}

        // Tell browser to run its own error handler as well   
        return false;
    }

    context.setAppender = function () {
        JL().setOptions({ "appenders": [ajaxAppender] });
    };

})(soclError);

soclError.setAppender();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)["JL"]))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

﻿/// <reference path="../bower_components/localStorageDB/localstoragedb.js" />
/// <reference path="../common/helper.js" />
/// <reference path="../common/corsWrapper.js" />
/// <reference path="../common/uuid.js" />
/// <reference path="../plugins/social-connect.js" />
/// <reference path="../plugins/push-messaging/firebase-init.js" />
/// <reference path="../start.js" />

window["soclTracking"] = {};

(function (context) {

    // #[PRIVATE METHODS] ----------------------------------------------

    var windowProxyTracking;

    var SOURCE_ID_CONNECTED_USER = 5;
    //var BASE_URI = "/sdk/tracking/html/";
    //var BASE_URI = "https://beta-plugins.soclminer.com.br/v3/sdk/tracking/html/";
    var BASE_URI = "https://" + soclHelper.getEnvironment() + "plugins.soclminer.com.br/v3/sdk/tracking/html/";

    var ruleType = {
        GetValueById: 5,
        GetValueByClass: 6,
        GetValueByName: 7,
        GetValueByTagName: 8
    };

    var tagType = {
        PriceTag: 3,
        AvailableTag: 4
    };

    var deviceType = {
        Desktop: 1,
        Mobile: 2
    };

    var PRESALES_EVENT = {
        Type: {
            Presales_LastClick: "Presales.LastClick"
        }
    };

    var formatUrl = function (url) {
        if (soclHelper.contains(url, "&amp;")) {
            url = soclHelper.replaceAll("&amp;", "|", url);
        }
        else {
            url = soclHelper.replaceAll("&", "|", url);
        }

        return url;
    };

    var formatHtml = function (value) {

        if (soclHelper.contains(value, "&amp;")) {
            value = soclHelper.replaceAll("&amp;", "|", value);
        }
        else {
            value = soclHelper.replaceAll("&", "|", value);
        }

        return value;
    }

    var checkUrl = function (url) {
        if (url === "" || url === undefined) {
            return document.referrer;
        }
        return url;
    };

    var injectDependencies = function (callback) {
        try {
            createProxy();
            callback(true);
        } catch (e) {
            console.warn("SM - [Ursa Enterprise]", e);
            callback(false);
        }
    };

    var logViewBatch = function (soclId, offlineLogs, dbName) {
        context.actionBatch(soclId, offlineLogs, function (response) {
            if (response) {
                localStorage.removeItem('db_' + dbName);
            }
        });
    };

    var urlIsPurchase = function (url, list) {
        url = url.replace(/^(http|https):\/\//i, '');
        list = list.replace(/^(http|https):\/\//i, '');

        return soclHelper.contains(url, list);
    };

    var currentPageIsPurchase = function (listUrl, callback) {
        if (listUrl.length > 0) {
            for (var i = 0; i < listUrl.length; i++) {
                if (urlIsPurchase(document.location.href, listUrl[i])) {
                    callback(true);
                    return;
                }
            }
        }
        callback(false);
    };

    var saveOfflineLogs = function (smId, data) {
        if (soclHelper.guidValidation(smId)) {
            var offlineLogs = [];

            if (data.logs.constructor == String) {
                data.logs = JSON.parse(data.logs);
            }

            for (var i = 0; i < data.logs.length; i++) {
                offlineLogs.push(JSON.stringify({
                    'Url': encodeURIComponent(data.logs[i].url),
                    'Referrer': encodeURIComponent(data.logs[i].referrer),
                    'Date': data.logs[i].date,
                    'CustomerId': data.customerId,
                    'Price': data.logs[i].metadata.price !== undefined ? formatHtml(data.logs[i].metadata.price) : '',
                    'IsAvailable': data.logs[i].metadata.notAvailable !== undefined ? formatHtml(data.logs[i].metadata.notAvailable) : ''
                }));
            }

            logViewBatch(smId, offlineLogs, data.dbName);

            try {
                var smObj = soclHelper.getOrCreateSMObj(data.customerId);
                soclHelper.postBehaviors(data.customerId, smObj.clientId, true, smId);
            } catch (e) {
                console.log(e);
            }
        }
    };

    var getHTMLContent = function (rule, value) {
        var elements, content = undefined;

        switch (rule) {
            case ruleType.GetValueByClass:
                {
                    elements = document.getElementsByClassName(value);
                    content = elements.length > 0 ? elements[0].innerHTML : content;
                    break;
                }
            case ruleType.GetValueById:
                {
                    var element = document.getElementById(value);
                    content = element !== null ? element.innerHTML : content;
                    break;
                }
            case ruleType.GetValueByTagName:
                {
                    elements = document.getElementsByTagName(value);
                    content = elements.length > 0 ? elements[0].innerHTML : content;
                    break;
                }
            case ruleType.GetValueByName:
                {
                    elements = document.getElementsByName(value);
                    content = elements.length > 0 ? elements[0].innerHTML : content;
                    break;
                }
        }

        return content;
    };

    var searchForTags = function (callback) {
        soclHelper.getTagsParameter(function (tagList) {

            if (tagList.constructor == String) {
                tagList = JSON.parse(tagList);
            }

            var content, result = {};
            for (var i = 0; i < tagList.length; i++) {
                switch (tagList[i].type) {
                    case tagType.PriceTag:
                        {
                            content = getHTMLContent(tagList[i].rule, tagList[i].value);

                            if (content !== undefined) {
                                result.key = tagType.PriceTag
                                result.value = getHTMLContent(tagList[i].rule, tagList[i].value);
                            }
                            break;
                        }
                    case tagType.AvailableTag:
                        {
                            content = getHTMLContent(tagList[i].rule, tagList[i].value);

                            if (content !== undefined) {
                                result.key = tagType.AvailableTag
                                result.value = getHTMLContent(tagList[i].rule, tagList[i].value);
                            }
                            break;
                        }
                }

                if (result.key !== undefined) {
                    callback(result);
                    break;
                }
            }

            if (result.key === undefined) {
                callback(null);
            }
        });
    };

    var createProxy = function () {
        windowProxyTracking = new soclPorthole.WindowProxy(soclHelper.PROXY_URI, "sm-tracking-iframe");
        windowProxyTracking.addEventListener(onMessage);
    };

    var onMessage = function (messageEvent) {
        if (messageEvent.data["tracking"] !== undefined) {
            soclHelper.getPurchaseUrl(function (listPurchaseUrl) {
                currentPageIsPurchase(listPurchaseUrl, function (isPurchasePage) {
                    var customerId = messageEvent.data["tracking"];
                    var database = soclHelper.replaceAll("{0}", customerId, "logs_{0}");
                    var logs = context.getLocalDB(database);

                    if (isPurchasePage) {
                        if (logs.tableExists("items")) {
                            var allRows = logs.queryAll("items");

                            windowProxyTracking.post({
                                'logs': allRows,
                                'anonymous': soclHelper.getStoreValue("smanonymous"),
                                'isPurchase': isPurchasePage
                            });
                        }
                    }
                    else {
                        searchForTags(function (result) {
                            if (result !== null) {

                                var tableItemExists = logs.tableExists("items");

                                if (tableItemExists) {
                                    logs.update("items", { ID: logs.rowCount("items") }, function (row) {
                                        if (tagType.PriceTag === result.key) {
                                            row.metadata.price = result.value.replace(/"/g, '').replace(/\s/g, "");
                                        }
                                        else {
                                            row.metadata.notAvailable = result.value;
                                        }
                                        return row;
                                    });

                                    logs.commit();
                                }

                                else {
                                    logs.createTable("items", ["url", "referrer", "date", "metadata"]);
                                    logs.commit();
                                }
                            }

                            if (logs.tableExists("items")) {
                                windowProxyTracking.post({
                                    'logs': logs.queryAll("items"),
                                    'anonymous': soclHelper.getStoreValue("smanonymous"),
                                    'isPurchase': isPurchasePage
                                });
                            }
                        });
                    }
                });
            });
        };

        if (messageEvent.data["smid"] !== undefined) {
            soclConnect.getId(messageEvent.data["customerId"], function (id) {
                var database = soclHelper.replaceAll("{0}", messageEvent.data["customerId"], "logs_{0}");

                if (id == 0 && messageEvent.data["smid"] != 0) {
                    soclHelper.setStoreValue(soclConnect.createSMIdKey(messageEvent.data["customerId"]), messageEvent.data["smid"]);
                    soclHelper.setStoreValue("soclId", messageEvent.data["smid"]);
                }

                if (messageEvent.data["checkOrganicPushNative"] !== undefined && messageEvent.data["checkOrganicPushNative"] === true) {
                    soclHelper.hasPushOptInBy(messageEvent.data["customerId"], function (pushConnected) {
                        var data = {
                            "customerId": messageEvent.data["customerId"],
                            "logs": context.getLocalDB(database).queryAll("items"),
                            "dbName": database
                        }

                        if (pushConnected || id != 0) {
                            saveOfflineLogs(id, data);
                        }
                    });
                }

                else {
                    var data = {
                        "customerId": messageEvent.data["customerId"],
                        "logs": context.getLocalDB(database).queryAll("items"),
                        "dbName": database
                    }

                    if (id !== 0) {
                        saveOfflineLogs(id, data);
                    }
                }
            });
        };

        if (messageEvent.data["smAnonymousId"] !== undefined) {
            soclConnect.getId(messageEvent.data["customerId"], function (id) {
                if (id !== 0) {
                    windowProxyTracking.post({ 'smAnonymousId': id });
                }
            });
        };

        if (messageEvent.data["smUserIdFromPushNative"] !== undefined) {
            windowProxyTracking.post({ 'smUserIdFromPushNative': id });
        }
    }

    var checkIfUserIsOrganic = function (data, callback) {
        soclConnect.getFbId(function (fbId) { //CHECK IF USER IS CONNECTED WITH FB
            if (fbId > 0) {
                context.setSMIdByFbId(fbId, data.customerId, function (id) {
                    if (id !== 0) {
                        callback(id, true); //CHECK IF USER IS CONNECTED WITH PUSH AT CALLBACK VIA PORTHOLE
                    }

                    else {
                        soclConnect.registerConnectedUser(fbId, data.customerId, SOURCE_ID_CONNECTED_USER, null, function (userId) { //REGISTER USER ALREADY CONNECTED WITH FB APP
                            callback(userId, true);
                        });
                    }
                });
            }
            else {
                callback(0, true); //CHECK IF USER IS CONNECTED WITH PUSH AT CALLBACK VIA PORTHOLE
            }
        });
    };

    var checkUserOptin = function (data, callback) {
        soclHelper.hasFBOptIn(function (fbConnected) {
            if (fbConnected) {
                soclHelper.hasPushOptInBy(data.customerId, function (pushConnected) {
                    if (pushConnected) {
                        saveOfflineLogs(id, data);
                        callback(id, false);
                    }
                    else {
                        checkIfUserIsOrganic(data, function (id, checkPushOrganic) {
                            callback(id, checkPushOrganic);
                        });
                    }
                });
            }
            else {
                checkIfUserIsOrganic(data, function (id, checkPushOrganic) {
                    callback(id, checkPushOrganic);
                });
            }
        })
    }

    var setSMId = function (customerId, data, callback) {
        if (data.response.id !== "00000000000000000000000000000000") {
            soclHelper.setStoreValue(soclConnect.createSMIdKey(customerId), data.response.id);
            soclHelper.setStoreValue("soclId", data.response.id); //TODO: Just to maintain compatibility, remove when implement the new bounce.
            callback(data.response.id);
        }
        else {
            callback(0);
        }
    };

    var saveTagList = function (tagsParameter) {
        var tagsList = [];

        if (tagsParameter.constructor == String) {
            tagsParameter = JSON.parse(tagsParameter);
        }

        for (var i = 0; i < tagsParameter.length; i++) {
            tagsList.push({
                "type": tagsParameter[i].type.id,
                "rule": tagsParameter[i].rule.id,
                "value": tagsParameter[i].value
            });
        }

        soclHelper.setStoreValue("smtp", JSON.stringify(tagsList));
    };

    // #[PUBLIC METHODS] ----------------------------------------------

    // #[LOCAL STORAGE DB METHODS] ------------------------------------

    context.getLocalDB = function (database) {
        return new localStorageDB(database, localStorage);
    }

    context.createLogDB = function (database) {
        var LOGS_TABLE_NAME = "items";
        try {
            var logs = context.getLocalDB(database);
            var logsColumns = ["url", "referrer", "date", "metadata", "clientId", "sessionHash"];

            if (logs.isNew()) {
                logs.createTable(LOGS_TABLE_NAME, logsColumns);
                logs.commit();

                var localStorageParsed = localStorage.getItem("db_" + database).replace("\"[", '[').replace("]\"", ']').replace(/\\"/g, '"')
                localStorage.setItem('db_' + database, localStorageParsed);
            }
            else {
                if (!logs.tableExists(LOGS_TABLE_NAME)) {
                    logs.createTable(LOGS_TABLE_NAME, logsColumns);
                    logs.commit();
                }
                
                if (!logs.columnExists(LOGS_TABLE_NAME, "clientId")) {
                    logs.alterTable(LOGS_TABLE_NAME, ["clientId", "sessionHash"]);
                    logs.commit();
                }
            }

            if (!logs.tableExists(LOGS_TABLE_NAME)) {
                logs.createTable(LOGS_TABLE_NAME, logsColumns);
                logs.commit();
            }

        } catch (e) {
            console.log("creation of table items error => " + database);
            localStorage.removeItem('db_' + database);
        }
    };

    context.createEventDB = function (dbName) {
        var LOGS_TABLE_NAME = "items";
        try {
            var logs = context.getLocalDB(dbName);
            var logsColumns = ["sessionHash", "event"];

            if (logs.isNew()) {
                logs.createTable(LOGS_TABLE_NAME, logsColumns);
                logs.commit();

                var localStorageParsed = localStorage.getItem("db_" + dbName).replace("\"[", '[').replace("]\"", ']').replace(/\\"/g, '"');
                localStorage.setItem('db_' + dbName, localStorageParsed);
            }

            if (!logs.tableExists(LOGS_TABLE_NAME)) {
                logs.createTable(LOGS_TABLE_NAME, logsColumns);
                logs.commit();
            }
        } catch (e) {
            console.log("creation of table items error => " + dbName);
            localStorage.removeItem('db_' + dbName);
        }
    };

    context.insertLogItem = function (database, logItem) {
        try {
            var logs = context.getLocalDB(database);
            var tableItemExists = logs.tableExists("items");

            if (!tableItemExists) {
                context.createLogDB(database);
            }

            logs.insert("items", logItem);
            logs.commit();

            var localStorageParsed = localStorage.getItem("db_" + database).replace("\"[", '[').replace("]\"", ']').replace(/\\"/g, '"')
            localStorage.setItem('db_' + database, localStorageParsed);

        } catch (e) {
            localStorage.removeItem('db_' + database);
            context.createLogDB(database);
        }
    };

    context.insertEventItem = function (database, logItem) {
        try {
            var logs = context.getLocalDB(database);
            var tableItemExists = logs.tableExists("items");

            if (!tableItemExists) {
                context.createEventDB(database);
            }

            logs.insert("items", logItem);
            logs.commit();

            var localStorageParsed = localStorage.getItem("db_" + database).replace("\"[", '[').replace("]\"", ']').replace(/\\"/g, '"');
            localStorage.setItem('db_' + database, localStorageParsed);

        } catch (e) {
            localStorage.removeItem('db_' + database);
            context.createEventDB(database);
        }
    };

    // #[SET SM ID METHODS] -------------------------------------------

    context.setSMIdToAnonymousUser = function (customerId, smid) {
        if (smid !== null && smid !== '' && smid !== 'undefined' && smid !== undefined) {
            soclHelper.setStoreValue(soclConnect.createSMIdKey(customerId), smid);
        }
    };

    context.setSMIdByUrl = function (customerId) {
        var smid = soclHelper.getQueryStringParams("smuid");

        if (smid !== null && smid !== '' && smid !== 'undefined' && smid !== undefined) {
            soclHelper.setStoreValue(soclConnect.createSMIdKey(customerId), smid);
        }
    };

    context.setSMIdByPush = function (customerId, endpoint, callback) {
        getCORS(apiUrl + "/users/push/?format=json&customerId=" + customerId + "&endpoint=" + endpoint, null,
            function (data) {
                setSMId(customerId, data, callback);
            }
        );
    };

    context.setSMIdByPushOrganic = function (customerId, endpoint, callback) {
        postCORS(apiUrl + "/users/push", { customerId: customerId, pushEndpoint: endpoint, isMobile: soclHelper.isMobile() },
            function (data) {
                setSMId(customerId, data, callback);
            }
        );
    };

    context.setSMIdByFbId = function (fbId, customerId, callback) {
        getCORS(apiUrl + "/users/social/" + fbId + "/?format=json&customerId=" + customerId, null,
            function (data) {
                setSMId(customerId, data, callback);
            }
        );
    };

    // #[SAVE LOG METHODS] -------------------------------------------

    context.createDataObj = function (smId, url, referrer, customerId) {
        var dataObject =
        {
            "soclId": smId,
            "url": formatUrl(checkUrl(url)),
            "referrer": referrer,
            "customerId": customerId
        };

        return dataObject;
    };

    context.actionBatch = function (soclId, logs, callback) {
        if (logs.length > 0) {
            postCORS(apiUrl + "/users/" + soclId + "/action/batch?format=json",
                { Logs: logs },
                function (data) {
                    callback(true);
                }
            );
        }
    };

    context.action = function (data, callback) {
        postCORS(apiUrl + "/users/" + data['soclId'] + "/action/?format=json",
            { customerId: data['customerId'], url: data['url'], referrer: data['referrer'] },
            function (data) {
                callback(true);
            }
        );
    };

    context.event = function (eventName, parameters) {
        soclHelper.getCID(function (customerId) {
            if (customerId !== 0) {
                soclConnect.getId(customerId, function (id) {
                    if (id !== 0) {

                        var isParamsOk = true;

                        parameters = (parameters !== null && parameters !== "" && parameters !== undefined && parameters !== 'undefined') ? parameters : {}

                        for (var key in parameters) {
                            isParamsOk = !!parameters[key];

                            if (!isParamsOk) {
                                break;
                            }
                        }

                        postCORS(apiUrl + "/users/" + id + "/event/?format=json",
                            { customerId: customerId, eventName: eventName, parameters: (isParamsOk) ? JSON.stringify(parameters) : JSON.stringify({}), url: document.location.href, referrer: document.referrer },
                            function (response) {
                                /* console.log(response); */
                            }
                        );

                        try {
                            var smObj = soclHelper.getOrCreateSMObj(customerId);
                            soclHelper.postBehaviors(customerId, smObj.clientId, true, id);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    else {
                        try {
                            if (eventName && eventName.toLowerCase().includes("purchase")) {
                                var smObj = soclHelper.getOrCreateSMObj(customerId);
                                var customerInfo = soclHelper.getCustomerInfoFromLocalStorage(customerId);

                                if (customerInfo && smObj && customerInfo.sendAnonymousData && soclHelper.isInControlGroup(smObj.randomNumber, customerInfo.baseSizePercent)) {
                                    soclHelper.postBehaviors(customerId, smObj.clientId, true);
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }

                    try {
                        var smImpactCookie = soclCookie.getCookie("sm_event_impact");

                        if (smImpactCookie) {
                            var additionalData = {
                                ImpactType: "smid=" + smImpactCookie
                            };

                            var eventObj = {
                                type: PRESALES_EVENT.Type.Presales_LastClick,
                                additionalData: additionalData
                            };

                            soclHelper.createEvent(eventObj);

                            var formattedCID = soclHelper.replaceAll("-", "", customerId);
                            soclHelper.sendEvents(formattedCID, true);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        });
    };

    context.logViewToConnectedUser = function (data, callback) {
        soclConnect.getId(data.customerId, function (id) {
            if (id !== 0) {
                data.dbName = soclHelper.replaceAll("{0}", data.customerId, "logs_{0}");

                if (data.pushNativeEnabled == "true") {
                    checkUserOptin(data, function (id, checkPushOrganic) {
                        callback(id, checkPushOrganic);
                    });
                }
                else {
                    checkIfUserIsOrganic(data, function (id, checkPushOrganic) {
                        callback(id, checkPushOrganic);
                    });
                }
            }
            else {
                checkIfUserIsOrganic(data, function (id, checkPushOrganic) {
                    if (data.pushNativeEnabled == "true") {
                        callback(id, checkPushOrganic);
                    }

                    else {
                        callback(id, false);
                    }
                });
            }
        });
    };

    //TODO: Remove this method after upgrade pushes optin HTML to new version
    context.setPushOptInBy = function (customerId, hasOptIn) {
        return;
    };


    // #[INIT TRACKING] ---------------------------------------------

    context.init = function (customerInfo) {
        soclHelper.injectDiv("sm-tracking", "none");

        injectDependencies(function (response) {
            if (response) {
                var element = document.getElementById("sm-tracking");

                if (element !== null) {
                    var iframe = soclHelper.createBaseIframe();

                    iframe.setAttribute("src", BASE_URI + "view.min.html?appId=" + customerInfo.appId + "&id=" + customerInfo.id + "&gaEnabled=" + customerInfo.gaEnabled + "&pushNativeEnabled=" + customerInfo.isPushNativeEnabled + "&smuid=" + soclHelper.getQueryStringParams("smuid") + "&v=106");
                    iframe.setAttribute("id", "sm-tracking-iframe");
                    iframe.setAttribute("name", "sm-tracking-iframe");

                    element.appendChild(iframe);
                }
            }
        });

        soclHelper.setStoreValue("smcid", customerInfo.id);
        soclHelper.setStoreValue("smpurl", customerInfo.purchaseUrl);
        saveTagList(customerInfo.tagsParameter);
    };

})(soclTracking);

/***/ }),
/* 12 */
/***/ (function(module, exports) {

﻿/// <reference path="start.js" />
/// <reference path="../common/corsWrapper.js" />
/// <reference path="../common/helper.js" />
/// <reference path="../tracking/tracking.js" />
/// <reference path="assets/js/config.js" />

window["soclConnect"] = {};

(function (context) {

    var appId, scope, channelUrl, returnUri, windowPushNativeProxy;
    var fbApiVersion = "v2.12";

    // #[CONSTANT VARIABLES] ------------------------------------ 

    //var BASE_URI = "/playground/widgets/connect/";
    var BASE_URI = "https://widgets.soclminer.com.br/v2/social/js/widgets/connect/";
    var TIMEOUT_USER_ID = 2, TIMEOUT_FB = 4;

    var BOUNCE_EVENT = {
        Type: {
            Channel_Step_View: "Channel.Step.View",
            Channel_Step_Conclusion: "Channel.Step.Conclusion",
            Channel_Step_Rejection: "Channel.Step.Rejection",
            Channel_Step_ConclusionWithRejection: "Channel.Step.ConclusionWithRejection",
        },
        Step: {
            Empty: "",
            OS_LightBox_FBConnect: "OS.LightBox.0.FBConnect",
        }
    };

    // #[PRIVATE METHODS] ------------------------------------

    var redirect = function (callback) {
        if (this.returnUri != 'none' && this.returnUri !== undefined) {
            window.location = this.returnUri;
        }
        else {
            callback(true);
        }
    };

    var createProxyPushNative = function () {
        var element = document.getElementById("sm-tracking");
        if (element !== null) {
            windowPushNativeProxy = new Porthole.WindowProxy(soclHelper.PROXY_URI, "sm-tracking-iframe");
        }
    };

    var registerUser = function (customerId, sourceId, accessToken, facebookId, callback) {
        var customerIdParsed = customerId.split('-').join('');
        var userPushMessagingId = soclHelper.getStoreValue('smid_' + customerIdParsed);

        var user = { customerId: customerId, sourceId: sourceId, facebookId: facebookId, accessToken: accessToken };

        if (userPushMessagingId != null && userPushMessagingId != undefined && userPushMessagingId != 0) {
            user = { customerId: customerId, sourceId: sourceId, facebookId: facebookId, accessToken: accessToken, userPushMessagingId: userPushMessagingId };
        }

        postCORS(apiUrl + '/users?format=json', user,
            function (data) {
                var userId = data.response.id;
                soclHelper.setStoreValue(context.createSMIdKey(soclHelper.replaceAll("-", "", customerId)), userId);
                soclHelper.setStoreValue("soclId", userId); //TODO: Just to maintain compatibility, remove when implement the new bounce.

                var dataLog = soclTracking.createDataObj(userId, document.referrer, document.referrer, customerId);

                soclTracking.action(dataLog, function (response) {
                    redirect(function (response) {
                        callback(response, userId);
                    });
                });
            });
    };

    var updateUser = function (data, callback) {
        postCORS(apiUrl + '/users/' + data['userId'] + '?format=json', data,
            function (data) {
                callback(data.response.id !== "00000000000000000000000000000000");
            }
        );
    };

    var renderButton = function (elements, folderName, customerId) {
        for (var i = 0; i < elements.length; i++) {
            createIframe(elements[i], folderName, customerId);
        }
    };

    var createIframe = function (element, folderName, customerId) {
        var iframe = soclHelper.createBaseIframe();

        iframe.width = element.getAttribute("data-width");
        iframe.height = element.getAttribute("data-height");
        iframe.setAttribute("src", BASE_URI + folderName + "/index.html?scope=" + element.getAttribute("data-scope") + "&id=" + customerId);

        element.appendChild(iframe);
    };

    var createRootElement = function () {
        if (document.getElementById("fb-root")) {
            return;
        }
        var fbRoot = document.createElement('div'); fbRoot.id = 'fb-root';
        document.body.insertBefore(fbRoot, document.body.childNodes[0]);
    };

    // #[SM PUBLIC METHODS] -------------------------------------

    context.generateRndGuid = function () {
        return uuid.v1();
    };

    context.generateRndGuidV4 = function () {
        return uuid.v4();
    };

    context.createSMIdKey = function (customerId) {
        return "smid" + "_" + soclHelper.replaceAll("-", "", customerId);
    };

    context.getSMObjIdKey = function (customerId) {
        return "smObj-" + soclHelper.replaceAll("-", "", customerId);
    };

    context.render = function (customerInfo) {
        var folderName = customerInfo.featureSettings.folderName;
        var elements = document.getElementsByClassName("sm-connect");

        if (elements !== null && elements.length > 0) {
            renderButton(elements, folderName, customerInfo.id);
        }
    };

    context.signIn = function (customerId, sourceId, scope, returnUri, callback) {
        this.scope = scope = "email,public_profile"; //Hard code permissions to get just basic data
        var pluginId = soclHelper.getQueryStringParams("pluginId");

        var pluginTypeId = 0;

        try {
            var urlParts = document.location.href.split("social/");
            urlParts = urlParts[1].split("/");

            if (urlParts && urlParts.length > 0)
                pluginTypeId = urlParts[0];
                
        } catch (e) {
            console.log(e);
        }

        try {
            var eventObj = {
                type: BOUNCE_EVENT.Type.Channel_Step_View,
                step: BOUNCE_EVENT.Step.OS_LightBox_FBConnect.replace("0", pluginTypeId),
                channelId: pluginId
            };

            if (eventObj.channelId)
                soclBounce.createEventProxy(eventObj);
                
        } catch (e) {
            console.log(e);
        }

        context.fbEnsureInit(function (response) {
            if (response !== null) {
                FB.login(function (response) {
                    if (response.authResponse) { // connected
                        if (returnUri != 'none') {
                            this.returnUri = returnUri;
                        }

                        try {
                            if (response.authResponse.grantedScopes) {
                                if (response.authResponse.grantedScopes.includes("email")) {
                                    var eventObj = {
                                        type: BOUNCE_EVENT.Type.Channel_Step_Conclusion,
                                        step: BOUNCE_EVENT.Step.OS_LightBox_FBConnect.replace("0", pluginTypeId),
                                        channelId: pluginId,
                                        customerId: customerId
                                    };
                    
                                    if (eventObj.channelId)
                                        soclBounce.createEventProxy(eventObj);
                                }
                                else {
                                    var eventObj = {
                                        type: BOUNCE_EVENT.Type.Channel_Step_ConclusionWithRejection,
                                        step: BOUNCE_EVENT.Step.OS_LightBox_FBConnect.replace("0", pluginTypeId),
                                        channelId: pluginId,
                                        customerId: customerId
                                    };
                    
                                    if (eventObj.channelId)
                                        soclBounce.createEventProxy(eventObj);
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }

                        registerUser(customerId, sourceId, response.authResponse.accessToken, response.authResponse.userID, function (response) {
                            callback(response);
                        });
                    } else { // cancelled
                        try {
                            var eventObj = {
                                type: BOUNCE_EVENT.Type.Channel_Step_Rejection,
                                step: BOUNCE_EVENT.Step.OS_LightBox_FBConnect.replace("0", pluginTypeId),
                                channelId: pluginId,
                                customerId: customerId
                            };
            
                            if (eventObj.channelId)
                                soclBounce.createEventProxy(eventObj);

                        } catch (e) {
                            console.log(e);
                        }

                        callback(false);
                    }
                }, { scope: scope, return_scopes: true });
            }
        });
    };

    context.signInWithMail = function (parameters, callback) {
        postCORS(apiUrl + '/users?format=json', parameters,
            function (data) {
                var userId = data.response.id;
                soclHelper.setStoreValue(context.createSMIdKey(soclHelper.replaceAll("-", "", parameters["customerId"])), userId);
                soclHelper.setStoreValue("soclId", userId); //TODO: Just to maintain compatibility with bounce, remove when implement the new  with email.

                var dataLog = soclTracking.createDataObj(userId, parameters["url"], parameters["referrer"], parameters["customerId"]);

                soclTracking.action(dataLog, function (response) {
                    callback(response);
                });
            }
        );
    };

    context.signInWithPush = function (customerId, sourceId, endpoint, deviceType, callback) {
        if (endpoint && !soclHelper.getStoreValue("pushendpoint")) {

            var smid = soclHelper.getStoreValue("smid_" + customerId);
            var pattern = /^[0-9a-f]{8}[0-9a-f]{4}[1-5][0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12}$/i;

            if (smid && !pattern.test(smid)) {
                soclHelper.removeStoreValue("smid_" + customerId);
                callback(false);
            }

            var payload = {
                customerId: customerId,
                sourceId: sourceId,
                endpoint: endpoint,
                deviceType: deviceType
            };

            if (smid && smid != 0) {
                payload.userPushMessagingId = smid;
            }

            postCORS(apiUrl + '/users?format=json', payload,
                function (data) {

                    var userId = data.response.id;
                    soclHelper.setStoreValue(context.createSMIdKey(soclHelper.replaceAll("-", "", customerId)), userId);
                    soclHelper.setStoreValue("soclId", userId); //TODO: Just to maintain compatibility, remove when implement the new bounce.

                    callback(userId);
                }
            );
        }
    };

    context.registerAnonymousUser = function (customerId, userId, isControlGroup, callback) {

        var smKey = soclHelper.getStoreValue(context.createSMIdKey(soclHelper.replaceAll("-", "", customerId)));

        if (smKey != null || smKey != '') {
            postCORS(apiUrl + '/users/' + userId + '/anonymous?format=json', {
                customerId: customerId, userId: userId, isControlGroup: isControlGroup
            },
                function (data) {
                    soclHelper.setStoreValue(smKey, userId);

                    var dataLog = soclTracking.createDataObj(userId, document.location.href, document.referrer, customerId);

                    soclTracking.action(dataLog, function (response) {
                        callback(response);
                    });
                }
            );
        }
    };

    context.registerConnectedUser = function (fbId, customerId, sourceId, pushEndpoint, callback) {
        if (fbId > 0) {
            context.getFbCurrentAccessToken(function (accessToken) {
                if (accessToken !== "") {
                    registerUser(customerId, sourceId, accessToken, fbId, function (response, userId) {
                        callback(userId);
                    });
                } else {
                    callback(false);
                }
            });
        } else {
            callback(false);
        }
    };

    context.updateConnectedUser = function (data, callback) {
        updateUser(data, function (response) {
            callback(response);
        });
    };

    context.userExists = function (customerId, callback) {
        context.getFbId(function (fbId) {
            if (fbId > 0) {
                getCORS(apiUrl + "/users/social/" + fbId + "/?format=json&customerId=" + customerId, null,
                    function (data) {
                        if (data.response.id !== "00000000000000000000000000000000") {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    }
                );
            } else {
                callback(false);
            }
        });
    };

    context.getId = function (customerId, callback) {
        var response = soclHelper.getStoreValue(context.createSMIdKey(customerId));

        if (response !== null && response !== "") {
            callback(response);
        } else {
            setTimeout(function () {
                TIMEOUT_USER_ID--;
                if (TIMEOUT_USER_ID > 0) {
                    context.getId(customerId, callback);
                } else {
                    callback(0);
                }
            }, 1000);
        }
    };

    // #[FB API PUBLIC METHODS] -------------------------------------

    context.getStatus = function (callback) {
        context.fbEnsureInit(function (response) {
            if (response !== null) {
                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        // connected
                        callback(true);
                    } else if (response.status === 'not_authorized') {
                        // not_authorized
                        callback(false);
                    } else {
                        // not_logged_in
                        callback(false);
                    }
                });
            }
        });
    };

    context.getFbCurrentAccessToken = function (callback) {
        context.fbEnsureInit(function (response) {
            if (response !== null) {
                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        callback(response.authResponse.accessToken);
                    } else {
                        callback("");
                    }
                });
            }
        });
    };

    context.getFbId = function (callback) {
        context.fbEnsureInit(function (response) {
            if (response !== null) {
                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        callback(response.authResponse.userID);
                    } else {
                        callback(0);
                    }
                });
            }
            else {
                callback(0);
            }
        });
    };

    context.getFbPermissions = function (callback) {
        context.fbEnsureInit(function (response) {
            if (response !== null) {
                FB.api('/me/permissions', function (response) {
                    callback(response);
                });
            }
        });
    };

    context.fbEnsureInit = function (callback) {
        if (!window.fbApiInit) {
            setTimeout(function () {
                TIMEOUT_FB--;
                if (TIMEOUT_FB > 0) {
                    context.fbEnsureInit(callback);
                } else {
                    callback(null);
                }
            }, 1000);
        } else {
            if (callback) {
                callback();
            }
        }
    };

    context.fbSettings = function (appId, channel) {
        if (appId == "undefined") {
            appId = undefined;
        }

        if (appId) {
            this.appId = appId;
            this.channelUrl = channel;

            // Additional JS functions here
            window.fbAsyncInit = function () {
                FB.init({
                    appId: appId, // App ID
                    channelUrl: channelUrl, // Channel File
                    status: true, // check login status
                    cookie: true, // enable cookies to allow the server to access the session
                    xfbml: true,  // parse XFBML
                    version: fbApiVersion
                });

                fbApiInit = true; //init flag
            };

            // Load the SDK Asynchronously
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            createRootElement();
        }
    };

})(soclConnect);

/***/ }),
/* 13 */
/***/ (function(module, exports) {

﻿/// <reference path="signIn.js" />
/// <reference path="../common/helper.js" />
/// <reference path="../common/cookie.js" />
/// <reference path="performance-counter.js" />
/// <reference path="../bower_components/jsnlog/jsnlog.min.js" />
/// <reference path="../bower_components/seedrandom/seedrandom.min.js" />

window["soclBounce"] = {};

(function (context) {
    Element.prototype.SoclRemoveTag = function () {
        this.parentElement.removeChild(this);
    };

    NodeList.prototype.SoclRemoveTag = HTMLCollection.prototype.SoclRemove = function () {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    };

    // #[CONSTANT VARIABLES] ------------------------------------

    var TIMEOUT_OUIBOUNCE = 10;

    // #[PRIVATE METHODS] ------------------------------------

    var windowProxyBounce, PLUGIN_TYPE;

    var BOUNCE_EVENT = {
        Type: {
            Channel_View: "Channel.View",
            Channel_Conclusion: "Channel.Conclusion",
            Channel_Rejection: "Channel.Rejection",
            Channel_Suppression: "Channel.Suppression",
            Channel_Step_View: "Channel.Step.View",
            Channel_Step_Conclusion: "Channel.Step.Conclusion",
            Channel_Step_Rejection: "Channel.Step.Rejection",
            Channel_Step_ConclusionWithRejection: "Channel.Step.ConclusionWithRejection",
            Channel_ConclusionWithRejection: "Channel.ConclusionWithRejection"
        },
        Step: {
            Empty: "",
            OS_LightBox: "OS.LightBox.0",
            OS_LightBox_Email: "OS.LightBox.0.Email",
            OS_LightBox_FBConnect: "OS.LightBox.0.FBConnect",
            
        }
    };

    var pluginId;
    var customerId;
    var storyId;
    var forceRedirect = false;
    var lastLoadPriority = 0;
    //var BASE_URI = "/playground/client/{CID}/social/{PTID}/{PID}";
    //var CSS_URI = "/sdk/plugins/assets/css/";
    //var BASE_URI = "https://beta-plugins.soclminer.com.br/v3/client/{CID}/social/{PTID}/{PID}";
    //var CSS_URI = "https://beta-plugins.soclminer.com.br/v3/assets/css/";
    var BASE_URI = "https://" + soclHelper.getEnvironment() + "plugins.soclminer.com.br/v3/client/{CID}/social/{PTID}/{PID}";
    var CSS_URI = "https://" + soclHelper.getEnvironment() + "plugins.soclminer.com.br/v3/assets/css/";

    var bounceType = {
        Default: 1,
        Image: 3,
        Survey: 10,
        Quiz: 11,
        LightBoxText: 12,
        LightBoxImage: 13
    };

    var deviceType = {
        Old: 0,
        Desktop: 3,
        Mobile: 7
    };

    var bounce;
    var bounceIsOpened = false;

    var parameters;

    var injectDependencies = function (PLUGIN_TYPE, callback) {

        BOUNCE_EVENT.Step.OS_LightBox = BOUNCE_EVENT.Step.OS_LightBox.replace("0", PLUGIN_TYPE);
        BOUNCE_EVENT.Step.OS_LightBox_Email = BOUNCE_EVENT.Step.OS_LightBox_Email.replace("0", PLUGIN_TYPE);
        BOUNCE_EVENT.Step.OS_LightBox_FBConnect = BOUNCE_EVENT.Step.OS_LightBox_FBConnect.replace("0", PLUGIN_TYPE);

        if (PLUGIN_TYPE === bounceType.Default) {
            soclHelper.injectCSS(CSS_URI, "socialbounce.min.css");
        }
        else if (PLUGIN_TYPE === bounceType.Survey || PLUGIN_TYPE === bounceType.Quiz) {
            soclHelper.injectCSS(CSS_URI, "bounce-survey.min.css");
        }
        else if(PLUGIN_TYPE === bounceType.LightBoxText || PLUGIN_TYPE === bounceType.LightBoxImage) {
	        soclHelper.injectCSS(CSS_URI, "plugin-lightbox.min.css");
        }
        else {
            soclHelper.injectCSS(CSS_URI, "bounce-image.min.css");
        }

        try {
            createProxy();
            callback(true);
        } catch (e) {
            console.warn("SM - [Ursa Enterprise]", e);
            callback(false);
        }
    };

    var createProxy = function () {
        windowProxyBounce = new soclPorthole.WindowProxy(soclHelper.PROXY_URI, "social-lightBox-iframe");
        windowProxyBounce.addEventListener(onMessage);
    };

    var onMessage = function (messageEvent) {
        if (messageEvent.data["activeBounce"] == "on") {
            var element = document.getElementById("sm-bounce");

            if (element != null) {
                initBounce(element);
            }
        }

        if (messageEvent.data["closeAndRedirect"] == "on") {
            soclHelper.getCloseUrl(function (url) {
                if (url !== "") {

                    try {
                        var eventObjs = [];

                        eventObjs.push({
                            type: BOUNCE_EVENT.Type.Channel_ConclusionWithRejection,
                            step: BOUNCE_EVENT.Step.OS_LightBox,
                            channelId: pluginId
                        });

                        for (i = 0; i < eventObjs.length; i++)
                            if (eventObjs[i].channelId)
                                soclHelper.createEvent(eventObjs[i]);

                    } catch (e) {
                        console.log(e);
                    }

                    soclBounce.closeBox(false, "2");
                    window.location.href = url;
                }
                else {
                    soclBounce.closeBox(false, "2");
                }
            });
        }

        if (messageEvent.data["close"] == "on") {
            if (soclHelper.getSessionValue("controlGroupActive") !== null && soclHelper.getSessionValue("controlGroupActive") !== "") {
                soclHelper.getCID(function (cid) {
                    soclConnect.registerAnonymousUser(cid, soclConnect.generateRndGuid(), false, function (response) {
                        soclHelper.setStoreValue("smanonymous", JSON.stringify({ "IsControlGroup": false, "Active": response }));
                        soclBounce.closeBox(true, "1");
                    });
                });
            }
            else {

                try {
                    var eventObj = {
                        type: BOUNCE_EVENT.Type.Channel_Rejection,
                        step: BOUNCE_EVENT.Step.OS_LightBox,
                        channelId: pluginId
                    };

                    if (eventObj.channelId)
                        soclHelper.createEvent(eventObj);

                } catch (e) {
                    console.log(e);
                }

                soclBounce.closeBox(false, "1");
            }

        }

        if (messageEvent.data["userConnected"] !== undefined) {
            soclHelper.setStoreValue(messageEvent.data["userConnected"], "connected");
        }

        if (messageEvent.data["click"] !== undefined) {
            soclCookie.createCookie("smClickBounce", true, 3);
            soclHelper.setStoreValue("smInteractBounce_" + storyId, true);
            socl.emmit.onClick({ "id": pluginId, "type": "bounce-1" });
        }

        if (messageEvent.data["concluded"] == "on") {
            soclHelper.getRedirectUrl(function (url) {
                socl.emmit.onClick({ "id": pluginId, "type": "bounce-2" });
                window.location.href = url;
            });

            try {

                var eventObjs = [];

                eventObjs.push({
                    type: BOUNCE_EVENT.Type.Channel_Conclusion,
                    step: BOUNCE_EVENT.Step.OS_LightBox,
                    channelId: pluginId
                });

                for (i = 0; i < eventObjs.length; i++)
                    if (eventObjs[i].channelId)
                        soclHelper.createEvent(eventObjs[i]);

            } catch (e) {
                console.log(e);
            }
        }

        if (messageEvent.data["loaded"] !== undefined) {
            onLoad(messageEvent.data["loaded"], 1000);
        }

        if (messageEvent.data["createEvent"] !== undefined) {
            try {
                var eventObj = messageEvent.data["createEvent"];

                if (eventObj.channelId)
                    soclHelper.createEvent(eventObj);

            } catch (e) {
                console.log(e);
            }
        }
    }

    var onLoad = function (redirectUrl, loadPriority) {
        if (lastLoadPriority < loadPriority) {
            lastLoadPriority = loadPriority;
            var urls = [];

            if (redirectUrl !== 'on') {
                urls.push(encodeURIComponent(redirectUrl));
            }

            if (forceRedirect) {
                urls.push(encodeURIComponent(document.location.href));
            }

            soclHelper.formatUrlBy(pluginId, PLUGIN_TYPE, urls, function (response) {
                var index = 0;

                if (redirectUrl !== 'on') {
                    soclHelper.setStoreValue("smredirecturl", response.url[index++]);
                }

                if (forceRedirect) {
                    soclHelper.setStoreValue("smcloseurl", response.url[index++]);
                }
            });
        }
    }

    var initBounce = function (element) {

        var bounceView = soclHelper.getStoreValue("smViewBounce_" + storyId);
        var cookieExpire;

        if (!soclHelper.isMobile() && parameters.DeviceType == deviceType.Mobile) {
            return;
        }
        
        
        if (parameters.DeviceType == deviceType.Old || isNaN(parameters.DeviceType) //Support old Bounces
            || (!isNaN(bounceView) && (bounceView < parameters.PluginViewBefore || soclHelper.getStoreValue("smInteractBounce_" + storyId)))) {
            cookieExpire = element.getAttribute("daysToExpire");
        }else{
            cookieExpire = soclHelper.convertMS(parameters.TimeToShowIfNoHaveInteraction).decimalDay;
            soclHelper.removeStoreValue("smViewBounce_"+storyId);
            soclHelper.removeStoreValue("smInteractBounce_"+storyId);
        }

        if (cookieExpire == null) {
            cookieExpire = 3
        }

        var interval = window.setInterval(function () {
            try {
                if (typeof soclOuibounce != "undefined") {
                    window.clearInterval(interval);

                    bounce = soclOuibounce(element, {
                        sensitivity: 20,
                        cookieExpire: cookieExpire,
                        timer: 500,
                        delay: 200,
                        sitewide: true,
                        cookieName: "viewedOuibounceModal_" + storyId,
                        callback: function () {
                            if (!document.getElementById("sm-bounce")) {
                                soclCookie.createCookie("viewedOuibounceModal_" + storyId, null, 0);
                                return;
                            }

                            if (screen.height < 600) {
                                window.scrollTo(0, 0);
                            }


                            if (document.getElementById("sm-onsite-sales") !== null) {
                                document.getElementById("sm-onsite-sales").SoclRemoveTag();
                            }

                            if (document.getElementById("sm-onsite") !== null) {
                                document.getElementById("sm-onsite").SoclRemoveTag();
                            }

                            if (document.getElementById("sm-push") !== null) {
                                document.getElementById("sm-push").SoclRemoveTag();
                            }

                            soclHelper.computePluginHit(soclPerfCounter.type.View, PLUGIN_TYPE);

                            if (!isNaN(bounceView)) {
                                bounceView += 1;
                                soclHelper.setStoreValue("smViewBounce_" + storyId, bounceView);
                            } else {
                                soclHelper.setStoreValue("smViewBounce_" + storyId, 1);
                            }

                            soclCookie.createCookie("smViewBounce", true, cookieExpire);

                            try {
                                var eventObj = {
                                    type: BOUNCE_EVENT.Type.Channel_View,
                                    step: BOUNCE_EVENT.Step.OS_LightBox,
                                    channelId: pluginId
                                };

                                if (eventObj.channelId)
                                    soclHelper.createEvent(eventObj);

                            } catch (e) {
                                console.log(e);
                            }

                            socl.emmit.onView({ "id": pluginId, "type": "bounce" });

                            bounceIsOpened = true;
                        },
                        onBeforeShow: function () {
                            var cancelShow = false;
                            
                            if (soclCookie.getCookie("smViewBounce"))
                                cancelShow = true;
                            else if (soclHelper.isInSuppressionGroup(customerId, pluginId)) {
                                soclCookie.createCookie("smViewBounce", true, cookieExpire);

                                try {
                                    cancelShow = true;
                                    var eventObj = {
                                        type: BOUNCE_EVENT.Type.Channel_Suppression,
                                        step: BOUNCE_EVENT.Step.OS_LightBox,
                                        channelId: pluginId
                                    };

                                    soclHelper.createEvent(eventObj);

                                } catch (e) {
                                    console.log(e);
                                }
                            }

                            return cancelShow;
                        }
                    });
                } else {
                    TIMEOUT_OUIBOUNCE--;
                    if (TIMEOUT_OUIBOUNCE == 0) {
                        window.clearInterval(interval);
                    }
                }
            } catch (e) { }
        }, 1000);

        if (soclHelper.isMobile() &&
            parameters.DeviceType == deviceType.Mobile &&
            soclHelper.getSessionValue("pagesview_" + pluginId) >= parameters.PagesViewBefore) {
            if (parameters.ScrollPercentage > 0) {
                document.addEventListener('scroll', function (event) {
                    if (!soclCookie.getCookie("viewedOuibounceModal_" + storyId) && typeof bounce != 'undefined') {
                        if (parseInt(soclHelper.getPosition()) >= parseInt(parameters.ScrollPercentage)) {
                            bounce.fire();
                        }
                    }
                });
            }

            if (parameters.TimeInSite > 0) {
                window.setTimeout(function () {
                    if (!soclCookie.getCookie("viewedOuibounceModal_" + storyId) && typeof bounce != 'undefined') {
                        bounce.fire();
                    }
                }, parameters.TimeInSite);
            }
        }

    };

    var createBounceHTML = function (customerInfo, element) {
        var baseHTML = "";
        var iframeHTML = '<iframe src="' + BASE_URI + "/index.html?scope=&id=" + customerInfo.id + "&pluginId=" + customerInfo.featureSettings.pluginId + "&gaEnabled=" + customerInfo.gaEnabled + "&version=" + customerInfo.featureSettings.version + '" name="social-lightBox-iframe" scrolling="no" frameborder="0" allowtransparency="true" id="social-lightBox-iframe"></iframe>';

        if (customerInfo.featureSettings.pluginTypeId === bounceType.Default) {
            baseHTML = '<div id="SocialLightbox">' + iframeHTML + '</div><div id="SocialLightboxBlock"></div>';
        }
        else if (customerInfo.featureSettings.pluginTypeId === bounceType.Survey || customerInfo.featureSettings.pluginTypeId === bounceType.Quiz) {
            baseHTML = '<div id="BounceSurveyBox">' + iframeHTML + '</div><div id="BounceSurvey"></div>';
        }
        else if (customerInfo.featureSettings.pluginTypeId === bounceType.LightBoxText) {
            baseHTML = '<div id="LightBoxTextBox">' + iframeHTML + '</div><div id="LightBoxText"></div>';
        }
        else if (customerInfo.featureSettings.pluginTypeId === bounceType.LightBoxImage) {
            baseHTML = '<div id="LightBoxImageBox">' + iframeHTML + '</div><div id="LightBoxImage"></div>';
        }
        else {
            baseHTML = '<div id="BounceImageBox1">' + iframeHTML + '</div><div id="BounceImageBlock1" style="display: block;"></div>';
        }

        return baseHTML;
    };

    var renderPlugin = function (customerInfo) {
        soclHelper.injectDiv("sm-bounce", "none");
        var element = document.getElementById("sm-bounce");

        soclHelper.showPlugin(customerInfo.id, storyId, function (showPlugin) {
            if (showPlugin) {
                soclHelper.userInControlGroup(customerInfo, function (isControlGroup) {
                    if (!isControlGroup) {
                        PLUGIN_TYPE = customerInfo.featureSettings.pluginTypeId;
                        injectDependencies(PLUGIN_TYPE, function (response) {
                            if (response) {
                                pluginId = customerInfo.featureSettings.pluginId;
                                customerId = customerInfo.id;
                                storyId = customerInfo.featureSettings.storyId;
                                forceRedirect = customerInfo.forceRedirect;

                                BASE_URI = soclHelper.replaceAll("{CID}", soclHelper.toGUID(customerInfo.id), BASE_URI);
                                BASE_URI = soclHelper.replaceAll("{PTID}", PLUGIN_TYPE, BASE_URI);
                                BASE_URI = soclHelper.replaceAll("{PID}", customerInfo.featureSettings.pluginId, BASE_URI);

                                element.innerHTML = createBounceHTML(customerInfo, element);

                                parameters = customerInfo.featureSettings.pluginParameters;

                                if (parameters != null) {
                                    parameters = JSON.parse(parameters);

                                    var date = soclHelper.convertMS(parameters.TimeToShowAfterClose);
                                    element.setAttribute("daysToExpire", date.decimalDay);
                                }

                                soclHelper.setStoreValue("smpid_" + PLUGIN_TYPE, customerInfo.featureSettings.pluginId);

                                //Garantir compatibilidade com Bounces Antigos
                                setTimeout(function () { onLoad("on", 1); }, 7000);
                            }
                        });
                    }
                    else {
                        soclConnect.registerAnonymousUser(customerInfo.id, soclConnect.generateRndGuid(), true, function (response) {
                            soclHelper.setStoreValue("smanonymous", JSON.stringify({ "IsControlGroup": true, "Active": response }));
                        });
                    }
                });
            }
            else {
                var anonymous = JSON.parse(soclHelper.getStoreValue("smanonymous"));

                if ((anonymous !== null && anonymous !== "") && !customerInfo.cgActive) {
                    if (!anonymous.Active) {
                        soclHelper.removeStoreValue("smanonymous");
                        soclHelper.removeStoreValue(soclConnect.createSMIdKey(customerInfo.id));
                    }
                    else {
                        anonymous.Active = false;
                        soclHelper.setStoreValue("smanonymous", JSON.stringify(anonymous));
                        soclHelper.removeSessionValue("controlGroupActive");
                    }
                }
            }
        });
    };

    // #[PUBLIC METHODS] -------------------------------------

    context.closeBox = function (nonRejected, step) {
        if (document.getElementById("sm-bounce") !== null) {
            var pluginType = "bounce";

            if (step != "undefined" && step != null && step != "")
                pluginType += "-" + step;

            document.getElementById("sm-bounce").SoclRemoveTag();
            if (!nonRejected) {
                socl.emmit.onClose({ "id": pluginId, "type": pluginType });
                soclCookie.createCookie("smCloseBounce", true, 3);
                soclHelper.setStoreValue("smInteractBounce", true);
            }
        }
    };

    context.addKeydownEvent = function () {
        document.onkeydown = function (evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                context.closeBox(false, "escape");
            };
        };
    };

    context.render = function (customerInfo) {
        if (navigator.cookieEnabled) {
            renderPlugin(customerInfo);
        }
    };

    context.createEventProxy = function (eventObj) {
        windowProxy.post({ 'createEvent': eventObj });
    };

})(soclBounce);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(JL) {﻿window["firebaseMessaging"] = {};

(function (context) {

    var PLUGIN_TYPE = 5; //Push Opt-in

    var PUSH_EVENT = {
        Type: {
            Ping: "Ping.PushProfile",
            Channel_View: "Channel.View",
            Channel_Conclusion: "Channel.Conclusion",
            Channel_Rejection: "Channel.Rejection",
            Channel_Step_View: "Channel.Step.View",
            Channel_Step_Conclusion: "Channel.Step.Conclusion",
            Channel_Step_AlreadyConnected: "Channel.Step.AlreadyConnected",
            Channel_Step_Rejection: "Channel.Step.Rejection",
            Channel_Step_Block: "Channel.Step.Block",
            Channel_ConclusionWithRejection: "Channel.ConclusionWithRejection",
            Channel_Step_Error: "Channel.Step.Error"
        },
        Step: {
            Empty: "",
            OS_Notification: "OS.Notification",
            OS_Notification_Popup: "OS.Notification.Popup",
            OS_Notification_Popup_Policy: "OS.Notification.Popup.Policy",
            OS_Notification_Popup_PoweredBy: "OS.Notification.Popup.PoweredBy",
            OS_Notification_Popup_Dialog: "OS.Notification.Popup.Dialog"
        }
    };

    context.start = function (obj, callback) {
        var config = {
            messagingSenderId: "694635173055"
        };

        firebase.initializeApp(config);

        callback(true);
    };

    context.onMessage = function (messaging) {
        //messaging.onMessage(function (payload) { console.log("onMessage payload", payload); });
    };

    context.onTokenRefresh = function (messaging) {
        messaging.onTokenRefresh(function () {
            messaging.getToken()
            .then(function (refreshedToken) {
                console.log('Token refreshed. New token: ' + refreshedToken);

                soclConnect.getId(metadata.customerId, function (id) {
                    soclConnect.updateConnectedUser(createDataToUpdate(id, metadata.customerId, currentToken, true, true), function (response) {
                        soclHelper.setStoreValue("pushendpoint", currentToken);
                        soclHelper.setStoreValue("smpushoptin_" + metadata.customerId, "true");
                    });
                });

                if (metadata.hasOptIn !== "true")
                    windowProxy.post({ 'hasOptin': 'true', 'customerId': metadata.customerId, 'endpoint': currentToken });
            })
            .catch(function (err) {
                console.log('Unable to retrieve refreshed token ', err);
            });
        });
    };

    context.getToken = function (messaging, metadata, callback) {
        messaging.getToken()
            .then(function (currentToken) {
                console.log("currentToken", currentToken);

                if (currentToken) {
                    // Firebase permission granted
                    // Set SMID by organic push
                    soclHelper.getPushEndpoint(function (endpoint) {
                        if (endpoint !== currentToken) {
                            soclConnect.getId(metadata.customerId, function (id) {
                                soclConnect.updateConnectedUser(createDataToUpdate(id, metadata.customerId, currentToken, true, true), function (response) {
                                    soclHelper.setStoreValue("pushendpoint", currentToken);
                                    soclHelper.setStoreValue("smpushoptin_" + metadata.customerId, "true");
                                });
                            });
                        }

                        if (metadata.hasOptIn !== "true")
                            windowProxy.post({ 'hasOptin': 'true', 'customerId': metadata.customerId, 'endpoint': currentToken });
                    });

                    callback(true);
                } else {
                    // Show Firebase permission request
                    callback(false);
                }
            })
            .catch(function (err) {
                console.log('An error occurred while retrieving token. ', err);
                callback(false);
            });
    };

    var createDataToUpdate = function (userId, customerId, endpoint, allow, deviceType) {
        return {
            "userId": userId,
            "customerId": customerId,
            "endpoint": endpoint,
            "allowPushMessaging": allow,
            "deviceType": deviceType
        };
    };

    context.organicPushPermission = function (callback) {
        if (!soclHelper.getStoreValue('pushendpoint')) {
            if (firebase) {
                var messaging = firebase.messaging();

                soclHelper.getCID(function (cid) {
                    messaging.getToken()
                        .then(function (hasToken) {
                            if (cid !== 0) {
                                var deviceType = getDeviceType();

                                soclConnect.signInWithPush(cid, 11, hasToken, deviceType, function (userId) {
                                    soclHelper.setStoreValue("pushendpoint", hasToken);
                                    callback(true, userId);
                                });
                            }
                        });
                });
            }
        }

        callback(false, 0);
    };

    var getDeviceType = function () {
        var deviceType = 1;

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
            deviceType = 2;

        return deviceType;
    };

    context.requestPermission = function (obj, callback) {

        setTimeout(function() {
            if (document.body.classList.contains("stp1")) {
                window.close();
                window.close();
            }
        }, 50000);

        var deviceType = getDeviceType();
        var messaging = firebase.messaging();

        soclPerfCounter.event(obj.pluginId, soclPerfCounter.type.View, PLUGIN_TYPE, obj.customerId);

        setTimeout(function () {
            try {
                var eventObj = {
                    type: PUSH_EVENT.Type.Channel_Step_View,
                    step: PUSH_EVENT.Step.OS_Notification_Popup_Dialog,
                    channelId: obj.pluginId
                };
    
                if (eventObj.channelId)
                    soclPush.createEventProxy(eventObj);
    
            } catch (e) {
                console.log(e);
            }

            $(".policy a").click(function () {
                try {
                    var eventObj = {
                        type: PUSH_EVENT.Type.Channel_Step_Conclusion,
                        step: PUSH_EVENT.Step.OS_Notification_Popup_Policy,
                        channelId: obj.pluginId
                    };
        
                    if (eventObj.channelId)
                        soclPush.createEventProxy(eventObj);
        
                } catch (e) {
                    console.log(e);
                }
            });
    
            $("#poweredBy").click(function () {
                try {
                    var eventObj = {
                        type: PUSH_EVENT.Type.Channel_Step_Conclusion,
                        step: PUSH_EVENT.Step.OS_Notification_Popup_PoweredBy,
                        channelId: obj.pluginId
                    };
        
                    if (eventObj.channelId)
                        soclPush.createEventProxy(eventObj);
        
                } catch (e) {
                    console.log(e);
                }
            });
        }, 1000);

        if (document.getElementById("sm-bounce") !== null)
            document.getElementById("sm-bounce").SoclRemoveTag();

        soclCookie.createCookie("smViewPushOptin", true, obj.daysToShowAfterView);

        messaging.requestPermission().then(function () {
            var permission = Notification.permission;

            if (permission) {
                messaging.getToken()
                    .then(function (currentToken) {
                        soclHelper.setCookie(soclPush.PUSH_TOKEN_VERIFIED.NAME, soclPush.PUSH_TOKEN_VERIFIED.VALUE, soclPush.PUSH_TOKEN_VERIFIED.DAYS_TO_EXPIRE);
                        soclHelper.getCID(function(cid) {
                            if (cid !== 0) {
                                soclConnect.getId(cid,
                                    function(id) {
                                        if (id === 0) {
                                            soclConnect.signInWithPush(cid, 11, currentToken, deviceType, function(userId) 
                                            {
                                                soclHelper.setStoreValue("pushendpoint", currentToken);
                                            });

                                            try {
                                                var eventObjs = 
                                                [
                                                    {
                                                        type: PUSH_EVENT.Type.Channel_Step_Conclusion,
                                                        step: PUSH_EVENT.Step.OS_Notification_Popup_Dialog,
                                                        channelId: obj.pluginId
                                                    }
                                                ];

                                                for (i = 0; i < eventObjs.length; i++)
                                                    if (eventObjs[i].channelId)
                                                        soclPush.createEventProxy(eventObjs[i]);
                                    
                                            } catch (e) {
                                                console.log(e);
                                            }
                                        } else {
                                            soclConnect.updateConnectedUser(createDataToUpdate(id, cid, currentToken, true, deviceType), function(response) {
                                                soclHelper.setStoreValue("pushendpoint", currentToken);
                                            });

                                            try {
                                                var eventObjs = 
                                                [
                                                    {
                                                        type: PUSH_EVENT.Type.Channel_Step_AlreadyConnected,
                                                        step: PUSH_EVENT.Step.OS_Notification_Popup_Dialog,
                                                        channelId: obj.pluginId
                                                    }
                                                ];

                                                for (i = 0; i < eventObjs.length; i++)
                                                    if (eventObjs[i].channelId)
                                                        soclPush.createEventProxy(eventObjs[i]);
                                                        
                                            } catch (e) {
                                                console.log(e);
                                            }
                                        }

                                        soclPerfCounter.event(obj.pluginId, soclPerfCounter.type.Click, PLUGIN_TYPE, obj.customerId);
                                        callback(true);

                                        $("#btnSave").click(function(event) {
                                            try {
                                                var eventObjs = [];

                                                if($("input[type = 'email']").val()) {
                                                    eventObjs.push(
                                                        {
                                                            type: PUSH_EVENT.Type.Channel_Conclusion,
                                                            step: PUSH_EVENT.Step.OS_Notification,
                                                            channelId: obj.pluginId
                                                        }
                                                    )
                                                }
                                                else {
                                                    eventObjs.push(
                                                        {
                                                            type: PUSH_EVENT.Type.Channel_ConclusionWithRejection,
                                                            step: PUSH_EVENT.Step.OS_Notification,
                                                            channelId: obj.pluginId
                                                        }
                                                    )
                                                }

                                                for (i = 0; i < eventObjs.length; i++)
                                                    if (eventObjs[i].channelId)
                                                        soclPush.createEventProxy(eventObjs[i]);

                                            } catch (e) {
                                                console.log(e);
                                            }
                                        });
                                    });
                            } else {
                                JL("ajaxAppender").fatal({
                                    "msg": "Exception",
                                    "errorMsg":
                                        "Error trying to subscriber user to push notification: 'Missing CID parameter'"
                                });
                                
                                window.close();
                                window.close();
                            }
                        });
                    })
                    .catch(function(err) {
                        console.log('An error occurred while retrieving token. ', err);
                        
                        soclPushEngineAlfajor.setDisplay("stp4", "stp1");

                        try {
                            var eventObj = {
                                type: PUSH_EVENT.Type.Channel_Step_Error,
                                step: PUSH_EVENT.Step.OS_Notification_Popup_Dialog,
                                channelId: obj.pluginId
                            };
                
                            if (eventObj.channelId)
                                soclPush.createEventProxy(eventObj);
                
                        } catch (e) {
                            console.log(e);
                        }

                        window.close();
                        window.close();
                    });
            } else {
                try {
                    var eventObj = {
                        type: PUSH_EVENT.Type.Channel_Step_Error,
                        step: PUSH_EVENT.Step.OS_Notification_Popup_Dialog,
                        channelId: obj.pluginId
                    };
        
                    if (eventObj.channelId)
                        soclPush.createEventProxy(eventObj);
        
                } catch (e) {
                    console.log(e);
                }

                window.close();
                window.close();
            }
        }).catch(function (evt) {
            try {
                var eventObjs = [];

                if (evt.code.includes("block")) {
                    eventObjs.push(
                        {
                            type: PUSH_EVENT.Type.Channel_Step_Block,
                            step: PUSH_EVENT.Step.OS_Notification_Popup_Dialog,
                            channelId: obj.pluginId
                        }
                    );
                }
                else {
                    eventObjs.push(
                        {
                            type: PUSH_EVENT.Type.Channel_Step_Rejection,
                            step: PUSH_EVENT.Step.OS_Notification_Popup_Dialog,
                            channelId: obj.pluginId
                        }
                    );
                }

                eventObjs.push(
                    {
                        type: PUSH_EVENT.Type.Channel_Rejection,
                        step: PUSH_EVENT.Step.OS_Notification,
                        channelId: obj.pluginId
                    }
                );

                for (i = 0; i < eventObjs.length; i++)
                    if (eventObjs[i].channelId)
                        soclPush.createEventProxy(eventObjs[i]);
    
            } catch (e) {
                console.log(e);
            }

            window.close();
            window.close();
        });
    };

})(firebaseMessaging);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)["JL"]))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(JL) {﻿/// <reference path="../common/helper.js" />
/// <reference path="performance-counter.js" />
/// <reference path="../common/cookie.js" />
/// <reference path="../tracking/tracking.js" />
/// <reference path="push-messaging/push-engine-alfajor.js" />
/// <reference path="push-messaging/firebase-init.js" />

window["soclPush"] = {};

(function (context) {
    Element.prototype.SoclRemoveTag = function () {
        this.parentElement.removeChild(this);
    };

    NodeList.prototype.SoclRemoveTag = HTMLCollection.prototype.SoclRemove = function () {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    };

    // #[PRIVATE METHODS] ------------------------------------

    var windowPushProxy = null;
    var windowPushTrackingProxy = null;

    var PLUGIN_TYPE = 5; //Chrome Push Optin
    
    var PUSH_EVENT = {
        Type: {
            Ping_PushProfile: "Ping.PushProfile",
            Channel_View: "Channel.View",
            Channel_Conclusion: "Channel.Conclusion",
            Channel_Rejection: "Channel.Rejection",
            Channel_Suppression: "Channel.Suppression",
            Channel_Step_View: "Channel.Step.View",
            Channel_Step_Conclusion: "Channel.Step.Conclusion",
            Channel_Step_Rejection: "Channel.Step.Rejection",
            Channel_ConclusionWithRejection: "Channel.ConclusionWithRejection"
        },
        Step: {
            Empty: "",
            OS_Notification: "OS.Notification"
        }
    };

    context.PUSH_TOKEN_VERIFIED = {
        NAME: "smPushTokenVerified",
        VALUE: true,
        DAYS_TO_EXPIRE: (1 / 24) // 1 hour
    };

    var GOOGLE_APP = {
        GCM: 1,
        Firebase: 2
    };

    var deviceType = {
        Desktop: 1,
        Mobile: 2
    };

    context.index_db_name = "fcm_token_details_db";

    var messaging = '';
    var firebaseAppScriptUrl = 'https://www.gstatic.com/firebasejs/5.9.1/firebase-app.js';
    var firebaseMessagingScriptUrl = 'https://www.gstatic.com/firebasejs/5.9.1/firebase-messaging.js';

    var BASE_URI = "https://{DNS}.soclminer.com.br/{PID}/";
    var BASE_URI_PUSH_TRACKING = "https://{DNS}.soclminer.com.br/00000000000000000000000000000000/";
    var PIXEL_URI = "https://" + soclHelper.getEnvironment() + "plugins.soclminer.com.br/v3/sdk/";
    var CSS_URI = "https://" + soclHelper.getEnvironment() + "plugins.soclminer.com.br/v3/assets/css/";

    var injectDependencies = function (callback) {
        soclHelper.injectCSS(CSS_URI, "push.min.css");
        try {
            createProxy();
            callback(true);
        } catch (e) {
            console.warn("SM - [Ursa Enterprise]", e);
            callback(false);
        }
    };

    var createGCMServiceWorker = function (customerInfo) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(window.location.origin + '/push-service-worker.js').then(soclPushEngineAlfajor.initialiseState(5));
        }
        else {
            JL("ajaxAppender").fatal({
                "msg": "Exception",
                "errorMsg": "Error trying to initialize serviceWorker to register push: 'Service Workers not supported'"
            });
        }
    };

    var createProxy = function () {
        windowPushProxy = new soclPorthole.WindowProxy(soclHelper.PROXY_URI, "social-push");
        windowPushProxy.addEventListener(onMessage);
    };

    var createPushTrackingProxy = function () {
        windowPushTrackingProxy = new soclPorthole.WindowProxy(soclHelper.PROXY_URI, "social-push-tracking");
        windowPushTrackingProxy.addEventListener(onMessage);
    };

    var onMessage = function (messageEvent) {
        var element = document.getElementById("sm-push") || document.getElementById("sm-push-tracking");
        
        if (element !== null) {
            if (messageEvent.data["hasOptin"] !== undefined) {
                var customerId = messageEvent.data["customerId"];
                var endpoint = messageEvent.data["endpoint"];

                soclConnect.getId(customerId, function (id) {
                    if (id === 0) {
                        soclTracking.setSMIdByPushOrganic(customerId, endpoint, function (id) { });
                    }
                    soclHelper.setStoreValue("smpushoptin_" + customerId, "true");
                });
            }

            if (messageEvent.data["show"] !== undefined) {
                var metadata = messageEvent.data["show"].split('|');

                var daysToShowAfterView = metadata[0];
                var orientation = metadata[1];
                var customerId = metadata[2];
                var pluginId = metadata[3];

                element.setAttribute('class', 'socl-' + orientation);

                var pluginViewed = soclCookie.getCookie("smViewPushOptin");
                var pluginClosed = soclCookie.getCookie("smClosedPushOptin");

                if (!pluginViewed && !pluginClosed) {
                    if (soclHelper.isInSuppressionGroup(customerId, pluginId)) {
                        soclCookie.createCookie("smViewPushOptin", true, daysToShowAfterView);
                        
                        try {
                            var eventObj = {
                                type: PUSH_EVENT.Type.Channel_Suppression,
                                step: PUSH_EVENT.Step.OS_Notification,
                                channelId: pluginId
                            };
    
                            soclHelper.createEvent(eventObj);
    
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        element.style.display = "";
                        soclPerfCounter.event(pluginId, soclPerfCounter.type.Impression, PLUGIN_TYPE, customerId);
                        soclCookie.createCookie("smViewPushOptin", true, daysToShowAfterView);
                        socl.emmit.onView({ "id": pluginId, "type": "push-optin" });
    
                        try {
                            var eventObj = {
                                type: PUSH_EVENT.Type.Channel_View,
                                step: PUSH_EVENT.Step.OS_Notification,
                                channelId: pluginId
                            };
        
                            if (eventObj.channelId)
                                soclHelper.createEvent(eventObj);
            
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            }

            if (messageEvent.data["close"] !== undefined) {
                var daysToShowAfterClose = messageEvent.data["close"];
                var pluginId = messageEvent.data["pluginId"];

                soclCookie.createCookie("smClosePushOptin", true, daysToShowAfterClose);
                socl.emmit.onClose({ "id": pluginId, "type": "push-optin" });

                soclPush.closeMessage();

                try {
                    var eventObj = {
                        type: PUSH_EVENT.Type.Channel_Rejection,
                        step: PUSH_EVENT.Step.OS_Notification,
                        channelId: pluginId
                    };

                    if (eventObj.channelId)
                        soclHelper.createEvent(eventObj);
    
                } catch (e) {
                    console.log(e);
                }
            }

            if (messageEvent.data["click"] !== undefined) {
                var daysToShowAfterClose = messageEvent.data["click"];
                var pluginId = messageEvent.data["pluginId"];

                soclCookie.createCookie("smClosePushOptin", true, daysToShowAfterClose);
                soclCookie.createCookie("smClickPushOptin", true, daysToShowAfterClose);
                socl.emmit.onClick({ "id": pluginId, "type": "push-optin" });

                soclPush.closeMessage();

                try {
                    var eventObj = {
                        type: PUSH_EVENT.Type.Channel_Step_Conclusion,
                        step: PUSH_EVENT.Step.OS_Notification,
                        channelId: pluginId
                    };

                    if (eventObj.channelId)
                        soclHelper.createEvent(eventObj);
    
                } catch (e) {
                    console.log(e);
                }
            }

            if (messageEvent.data["closeBounce"] !== undefined) {
                soclPush.closeBounceMessage();
            }

            if (messageEvent.data["closeOnsite"] !== undefined) {
                soclPush.closeOnSiteMessage();
            }

            if (messageEvent.data["identifier"] !== undefined) {
                var metadata = messageEvent.data["identifier"].split('|');
                var customerId = metadata[0];
                var smid = metadata[1];

                soclConnect.getId(customerId, function (id) {
                    if (id === 0) {
                        soclHelper.setStoreValue(soclConnect.createSMIdKey(customerId), smid);
                    }
                });
            }

            if (messageEvent.data["createEvent"] !== undefined) {
                try {
                    var eventObj = messageEvent.data["createEvent"];
                    
                    if (eventObj.channelId || eventObj.byPassChannel)
                        soclHelper.createEvent(eventObj);
    
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };

    var canShowPush = function (callback, device) {
        var result = (device === "desktop" && !appConfig.IsMobile()) ||
                     (device === "mobile" && appConfig.IsMobile()) ||
                     (device === "all");

        if (result && appConfig.IsChrome()) {
            soclPushEngineAlfajor.supportPush(function (support) {
                callback(true);
            });
        }
        else {
            callback(false);
        }
    };

    var createManifestTag = function () {
        var manifest = document.createElement("link");
        manifest.setAttribute("href", window.location.origin + '/manifest/chrome/manifest.json');
        manifest.setAttribute("rel", "manifest");
        document.head.appendChild(manifest);
    };

    var createDataToUpdate = function (userId, customerId, endpoint, allow, refreshToken) {
        return {
            "userId": userId,
            "customerId": customerId,
            "endpoint": endpoint,
            "allowPushMessaging": allow,
            "isRefreshToken": refreshToken,
            "deviceType": soclHelper.isMobile() ? deviceType.Mobile : deviceType.Desktop
        };
    };

    var createIFrame = function (customerInfo, hasOptIn, element) {
        BASE_URI = soclHelper.replaceAll("{DNS}", customerInfo.dns, BASE_URI);
        BASE_URI = soclHelper.replaceAll("{PID}", customerInfo.featureSettings.pluginId, BASE_URI);

        var iframe = soclHelper.createBaseIframe();

        iframe.setAttribute("src", BASE_URI
            + "index.min.html?appId=" + customerInfo.appId
            + "&id=" + customerInfo.id
            + "&name=" + encodeURIComponent(customerInfo.name)
            + "&pluginId=" + customerInfo.featureSettings.pluginId
            + "&version=" + customerInfo.featureSettings.version
            + "&dns=" + customerInfo.dns
            + "&url=" + encodeURIComponent(document.location.href)
            + "&path=" + encodeURIComponent(BASE_URI)
            + "&hasOptIn=" + hasOptIn
            + "&isMobile=" + soclHelper.isMobile()
            + "&gaEnabled=" + customerInfo.gaEnabled
            + "&googleApp=" + customerInfo.googleApp);

        iframe.setAttribute("id", "social-push");
        iframe.setAttribute("class", "socl-iframe");
        iframe.setAttribute("name", "social-push");

        element.appendChild(iframe);
    }

    context.createPushTrackingIFrame = function (customerInfo, hasOptIn, element) {
        BASE_URI_PUSH_TRACKING = soclHelper.replaceAll("{DNS}", customerInfo.dns, BASE_URI_PUSH_TRACKING);
        createPushTrackingProxy();

        var iframe = soclHelper.createBaseIframe();

        iframe.setAttribute("src", BASE_URI_PUSH_TRACKING
            + "index.min.html?appId=" + customerInfo.appId
            + "&id=" + customerInfo.id
            + "&name=" + encodeURIComponent(customerInfo.name)
            + "&pluginId=00000000000000000000000000000000"
            + "&version=0"
            + "&dns=" + customerInfo.dns
            + "&url=" + encodeURIComponent(document.location.href)
            + "&hasOptIn=" + hasOptIn
            + "&isMobile=" + soclHelper.isMobile()
            + "&gaEnabled=" + customerInfo.gaEnabled
            + "&googleApp=" + customerInfo.googleApp);

        iframe.setAttribute("id", "social-push-tracking");
        iframe.setAttribute("class", "socl-iframe");
        iframe.setAttribute("name", "social-push-tracking");

        element.appendChild(iframe);
    }

    // #[PUBLIC METHODS] -------------------------------------

    context.checkIfUserHaveSubscription = function (metadata, callback) {
        try {

            if (metadata.googleApp && metadata.googleApp === GOOGLE_APP.GCM)
                context.checkIfUserHaveSubscriptionInGCM(metadata, function (response) { callback(false); });
            else
                context.checkIfUserHaveSubscriptionInFirebase(metadata, function (response) { callback(response); });
        }
        catch (e) {
            console.log(e);
        }
    };

    context.checkIfUserHaveSubscriptionInFirebase = function (metadata, callback) {
        try {
            var element = document.getElementById("pushOptIn");

            if (element == null)
                return callback(true);

            callback(false);
        }
        catch (e) {
            console.log(e);
            callback(false);
        }
    };

    context.checkIfUserHaveSubscriptionInGCM = function (metadata, callback) {
        try {
            var element = document.getElementById("pushOptIn");

            if (element != null && window.isSecureContext) {
                if ('permissions' in navigator) {
                    navigator.permissions.query({ name: 'push', userVisibleOnly: true })
                      .then(function (permissionState) {
                          switch (permissionState.state) {
                              case 'granted': // The user blocked the permission
                                  if ('serviceWorker' in navigator) {
                                      createManifestTag();

                                      navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
                                          serviceWorkerRegistration.pushManager.getSubscription().then(function (subscription) {
                                              soclHelper.getPushEndpoint(function (endpoint) {
                                                  if (endpoint !== subscription.endpoint) {
                                                      soclConnect.getId(metadata.customerId, function (id) {
                                                          soclConnect.updateConnectedUser(createDataToUpdate(id, metadata.customerId, subscription.endpoint, true, true), function (response) {
                                                              soclHelper.setStoreValue("pushendpoint", subscription.endpoint);
                                                              soclHelper.setStoreValue("smpushoptin_" + metadata.customerId, "true");
                                                          });
                                                          callback(true);
                                                      });
                                                  }
                                                  else {
                                                      callback(true);
                                                  }

                                                  if (metadata.hasOptIn !== "true") {
                                                      windowProxy.post({ 'hasOptin': 'true', 'customerId': metadata.customerId, 'endpoint': subscription.endpoint });
                                                  }
                                              });
                                          });
                                      });
                                  }
                                  else {
                                      callback(false);
                                  }
                                  break;
                              default:
                                  callback(false);
                                  break;
                          }
                      });
                }
            }
            else {
                callback(false);
            }
        }
        catch (e) {
            console.log(e);
        }
    };

    context.initFirebase = function () {
        var config = {
            messagingSenderId: "694635173055"
        };

        firebase.initializeApp(config);
    };

    context.checkPushToken = function (metadata, callback) {
        if (!window.isSecureContext)
            return callback(false);

        var firebaseApp = document.createElement('script');
        document.head.appendChild(firebaseApp);

        firebaseApp.onload = function () {
            context.initFirebase();

            var firebaseMessaging = document.createElement('script');
            document.head.appendChild(firebaseMessaging);

            firebaseMessaging.onload = function () {

                messaging = firebase.messaging();

                messaging.onTokenRefresh(function () {
                    context.getToken(metadata, function (response) { callback(true); });
                });

                messaging.onMessage(function (payload) { });

                context.verifyToken(function (response) { return callback(response); });
            }

            firebaseMessaging.src = firebaseMessagingScriptUrl;
        };

        firebaseApp.src = firebaseAppScriptUrl;
    };

    context.verifyToken = function (callback) {
        var req = indexedDB.open(context.index_db_name);
        var fcm_db_exists = true;

        var metadata = {
            customerId: soclHelper.getQueryStringParams("id")
        };

        req.onsuccess = function (event) {
            if (!fcm_db_exists) {
                indexedDB.deleteDatabase(context.index_db_name);
            }

            var fcm_db = event.target.result;

            if (fcm_db.objectStoreNames.length > 0) {
                var transaction = fcm_db.transaction("fcm_token_object_Store", "readonly");
                var store = transaction.objectStore("fcm_token_object_Store");

                if (store) {
                    store.openCursor().onsuccess = function (evt) {
                        var cursor = evt.target.result;

                        if (cursor) {
                            store.get(cursor.key).onsuccess = function (evt) {
                                var value = evt.target.result;
                                var currentToken = value.fcmToken;

                                if (currentToken) {
                                    context.getToken(metadata, function (response) {
                                        return callback(response);
                                    });
                                }

                                return callback(false);
                            }
                        } else {
                            context.getToken(metadata, function (response) {
                                return callback(response);
                            });
                        }
                    }
                }
            } else {
                context.getToken(metadata, function (response) {
                    return callback(response);
                });
            }
        };

        req.onupgradeneeded = function () {
            fcm_db_exists = false;
        };
    };

    context.getToken = function (metadata, callback) {
        if (Notification.permission === "granted") {
            messaging = firebase.messaging();

            soclConnect.getId(metadata.customerId, function (smid) {
                windowProxy.post({ 'identifier': metadata.customerId + '|' + smid });

                var iframe = soclHelper.createBaseIframe();

                iframe.setAttribute("src", PIXEL_URI + "pixel.min.html?id=" + metadata.customerId + "&smid=" + smid);
                iframe.setAttribute("id", "social-push-pixel");
                iframe.setAttribute("name", "social-push-pixel");

                document.body.insertBefore(iframe, document.body.childNodes[0]);
            });

            soclHelper.getPushEndpoint(function (endpoint) {
                if (endpoint && endpoint.indexOf("http") > -1) {
                    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
                        serviceWorkerRegistration.pushManager.getSubscription()
                            .then(function (subscription) {
                                if (subscription)
                                    soclPush.compareToken(subscription.endpoint, metadata);
                            })
                            .catch(function (e) {
                                JL("ajaxAppender").fatalException({ "msg": "Exception", "errorMsg": "An error occured while calling getSubscription() to check push opt in" }, e);
                            });
                    });
                }
            });

            messaging.getToken()
                .then(function (currentToken) {
                    if (currentToken) {
                        soclPush.compareToken(currentToken, metadata);
                        callback(true);
                    }
                })
                .catch(function (err) {
                    console.log("Error while trying generate new token. Err:", err);
                    callback(false);
                });
        } else {
            var smUserId = soclHelper.getStoreValue(soclConnect.createSMIdKey(metadata.customerId));

            if (smUserId && !soclCookie.getCookie(context.PUSH_TOKEN_VERIFIED.NAME)) {
                soclHelper.setCookie(context.PUSH_TOKEN_VERIFIED.NAME, context.PUSH_TOKEN_VERIFIED.VALUE, 365);

                soclHelper.getPushEndpoint(function (endpoint) {
                    try {
                        var smObj = soclHelper.getOrCreateSMObj(metadata.customerId);

                        var additionalData = {
                            token: "",
                            oldToken: endpoint || "",
                            pushPermission: Notification.permission
                        };

                        var eventObj = {
                            type: PUSH_EVENT.Type.Ping_PushProfile,
                            step: PUSH_EVENT.Step.Empty,
                            clientId: smObj.clientId,
                            customerId: metadata.customerId,
                            personId: smUserId,
                            channelId: null,
                            additionalData: JSON.stringify(additionalData || {}),
                            byPassChannel: true
                        };

                        if (windowProxy)
                            windowProxy.post({ 'createEvent': eventObj });

                    } catch (e) {
                        console.log(e);
                    }
                });
            }

            callback(false);
        }
    }

    context.compareToken = function (currentToken, metadata) {
        soclHelper.getPushEndpoint(function (endpoint) {

            metadata.isRefreshToken = endpoint.indexOf("http") > -1 && currentToken.indexOf("http") === -1 ? false : true;

            soclConnect.getId(metadata.customerId,
                function (id) {
                    if (!soclCookie.getCookie(context.PUSH_TOKEN_VERIFIED.NAME)) {
                        soclHelper.setCookie(context.PUSH_TOKEN_VERIFIED.NAME, context.PUSH_TOKEN_VERIFIED.VALUE, context.PUSH_TOKEN_VERIFIED.DAYS_TO_EXPIRE);

                        try {
                            var smObj = soclHelper.getOrCreateSMObj(metadata.customerId);

                            var additionalData = {
                                token: currentToken || "",
                                oldToken: endpoint || "",
                                pushPermission: Notification.permission
                            };

                            var eventObj = {
                                type: PUSH_EVENT.Type.Ping_PushProfile,
                                step: PUSH_EVENT.Step.Empty,
                                clientId: smObj.clientId,
                                customerId: metadata.customerId,
                                personId: id,
                                channelId: null,
                                additionalData: JSON.stringify(additionalData || {}),
                                byPassChannel: true
                            }

                            if (windowProxy)
                                windowProxy.post({ 'createEvent': eventObj });

                        } catch (e) {
                            console.log(e);
                        }
                    }

                    if (endpoint !== currentToken) {
                        soclConnect.updateConnectedUser(
                            createDataToUpdate(id, metadata.customerId, currentToken, true, metadata.isRefreshToken),
                            function (response) {
                                soclHelper.setStoreValue("pushendpoint", currentToken);
                                soclHelper.setStoreValue("smpushoptin_" + metadata.customerId, "true");
                            });
                    }
                });
        });
    };

    context.updateUser = function (metadata, token) {
        soclConnect.getId(metadata.customerId, function (id) {
            soclConnect.updateConnectedUser(createDataToUpdate(id, metadata.customerId, token, true, true), function (response) {
                soclHelper.setStoreValue("pushendpoint", token);
                soclHelper.setStoreValue("smpushoptin_" + metadata.customerId, "true");
            });
        });

        if (metadata.hasOptIn !== "true")
            windowProxy.post({ 'hasOptin': 'true', 'customerId': metadata.customerId, 'endpoint': token });
    };

    context.popupInitializer = function (metadata) {
        soclHelper.getPushEndpoint(function (pushEndpoint) {
            if (pushEndpoint === "") {
                canShowPush(function (show) {
                    if (show) {
                        $("#btClose").click(function () {
                            windowProxy.post({ 'close': metadata.daysToShowAfterClose, 'pluginId': metadata.pluginId });
                        });

                        $("#btGo").click(function () {
                            windowProxy.post({ 'closeBounce': true });

                            var left = (screen.width / 2) - (1050 / 2);
                            var top = (screen.height / 2) - (360 / 2);

                            window.open(metadata.path +
                                    "popup.min.html?id=" + metadata.customerId +
                                    "&name=" + encodeURIComponent(metadata.name) +
                                    "&pluginId=" + metadata.pluginId +
                                    "&url=" + metadata.url +
                                    "&isMobile=" + metadata.isMobile +
                                    "&googleApp=" + metadata.googleApp +
                                    "&path=" + encodeURIComponent(metadata.path) +
                                    "&version=" + metadata.version,
                                    "pushPermission", "width=1050,height=440,top=" + top + ",left=" + left + ";");

                            windowProxy.post({ 'click': metadata.daysToShowAfterClose, 'pluginId': metadata.pluginId });
                        });

                        if (windowProxy)
                            windowProxy.post({ 'show': metadata.daysToShowAfterView + '|' + metadata.orientation + "|" + metadata.customerId + "|" + metadata.pluginId });

                    }
                }, metadata.device);
            } else {
                soclConnect.getId(metadata.customerId, function (smid) {
                    windowProxy.post({ 'identifier': metadata.customerId + '|' + smid });

                    var iframe = soclHelper.createBaseIframe();

                    iframe.setAttribute("src", PIXEL_URI + "pixel.min.html?id=" + metadata.customerId + "&smid=" + smid);
                    iframe.setAttribute("id", "social-push-pixel");
                    iframe.setAttribute("name", "social-push-pixel");

                    document.body.insertBefore(iframe, document.body.childNodes[0]);
                });
            }
        });
    };

    context.closeMessage = function () {
        document.getElementById("sm-push").style.display = "none";
    };

    context.closeBounceMessage = function () {
        if (document.getElementById("sm-bounce") !== null) {
            document.getElementById("sm-bounce").SoclRemoveTag();
        }
    };

    context.closeOnSiteMessage = function () {
        if (document.getElementById("sm-onsite-sales") !== null) {
            document.getElementById("sm-onsite-sales").SoclRemoveTag();
        }
    };

    context.render = function (customerInfo) {

        if (!navigator.cookieEnabled)
            return;
        
        soclHelper.injectDiv("sm-push", "none");

        var element = document.getElementById("sm-push");

        soclHelper.hasPushOptInBy(customerInfo.id, function (hasOptIn) {
            if (hasOptIn !== "true") {
                injectDependencies(function (response) {
                    if (response)
                        createIFrame(customerInfo, hasOptIn, element);
                });
            }
            else
                createIFrame(customerInfo, hasOptIn, element);

            soclHelper.setStoreValue("smpid_" + PLUGIN_TYPE, customerInfo.featureSettings.pluginId);
        });
    };

    context.createEventProxy = function(eventObj) {
        window.opener.windowProxy.post({ 'createEvent': eventObj });
    };

})(soclPush);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)["JL"]))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

﻿/// <reference path="signIn.js" />
/// <reference path="../common/cookie.js" />
/// <reference path="../common/helper.js" />
/// <reference path="../plugins/performance-counter.js" />

window["soclOnsiteSales"] = {};

(function (context) {
    Element.prototype.SoclRemoveTag = function () {
        this.parentElement.removeChild(this);
    };

    NodeList.prototype.SoclRemoveTag = HTMLCollection.prototype.SoclRemove = function () {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    };

    // #[PRIVATE METHODS] ------------------------------------

    var windowProxyOnSite;

    var PLUGIN_TYPE = 6; // OnSite Message

    var ONSITE_MESSAGE_EVENT = {
        Type: {
            Channel_View: "Channel.View",
            Channel_Conclusion: "Channel.Conclusion",
            Channel_Rejection: "Channel.Rejection",
            Channel_Suppression: "Channel.Suppression",
            Channel_Step_View: "Channel.Step.View",
            Channel_Step_Conclusion: "Channel.Step.Conclusion",
            Channel_Step_Rejection: "Channel.Step.Rejection",
            Channel_ConclusionWithRejection: "Channel.ConclusionWithRejection"
        },
        Step: {
            Empty: "",
            OS_Message: "OS.Message",
            OS_Message_Fab: "OS.Message.Fab",
            OS_Message_Message: "OS.Message.Message"
        }
    };

    var BASE_URI_PUSH = "https://{DNS}.soclminer.com.br/{PID}";
    var BASE_URI = "https://" + soclHelper.getEnvironment() + "plugins.soclminer.com.br/v3/assets/html/onsite-sales/";
    var CSS_URI = "https://" + soclHelper.getEnvironment() + "plugins.soclminer.com.br/v3/assets/css/";

    var injectDependencies = function (callback) {
        soclHelper.injectCSS(CSS_URI, "onsite.min.css");
        try {
            createProxy();
            callback(true);
        } catch (e) {
            console.warn("SM - [Ursa Enterprise]", e);
            callback(false);
        }
    };

    var createProxy = function () {
        windowProxyOnSite = new soclPorthole.WindowProxy(soclHelper.PROXY_URI, "social-onsite");
        windowProxyOnSite.addEventListener(onMessage);
    };

    var onMessage = function (messageEvent) {
        var element = document.getElementById("sm-onsite-sales");

        if (element !== null) {
            if (messageEvent.data["show"] !== undefined) {
                var metadata = messageEvent.data["show"].split('|');
                var orientation = metadata[0];
                var pluginId = metadata[1];
                var pagesViewBefore = parseInt(metadata[2]);
                var timesToShowAfterView = parseInt(metadata[3]);
                
                element.setAttribute('class', 'socl-' + orientation);

                var customerId = soclHelper.getStoreValue("smcid");
                var pagesView = soclHelper.getSessionValue("pagesview_" + pluginId);
                var minPagesViewed = parseInt(pagesView) > pagesViewBefore;
                var pluginClicked = soclCookie.getCookie("smClickOnSite_" + pluginId);
                var pluginClosed = soclCookie.getCookie("smClosedOnSite_" + pluginId);

                var pluginViewed = parseInt(soclHelper.getStoreValue("onsiteview_" + pluginId));

                if (!pluginClosed && !pluginClicked && minPagesViewed && (!pluginViewed || timesToShowAfterView == 0 || (parseInt(pluginViewed) < timesToShowAfterView))) {

                    var additionalData = { 
                        ImpactTimes: (isNaN(pluginViewed) ? 0: pluginViewed) 
                    };

                    if (soclHelper.isInSuppressionGroup(customerId, pluginId)) {
                        try {
                            var eventObj = {
                                type: ONSITE_MESSAGE_EVENT.Type.Channel_Suppression,
                                step: ONSITE_MESSAGE_EVENT.Step.OS_Message,
                                channelId: pluginId,
                                additionalData: additionalData
                            };
    
                            soclHelper.createEvent(eventObj);

                            if (!isNaN(pluginViewed)) 
                                soclHelper.setStoreValue("onsiteview_" + pluginId, JSON.stringify(pluginViewed += 1));
                            else
                                soclHelper.setStoreValue("onsiteview_" + pluginId, "1");

                            soclOnsiteSales.closeMessage();
    
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        element.style.display = "";

                        try {
                            var eventObj = {
                                type: ONSITE_MESSAGE_EVENT.Type.Channel_View,
                                step: ONSITE_MESSAGE_EVENT.Step.OS_Message,
                                channelId: pluginId,
                                additionalData: additionalData
                            };
    
                            if (eventObj.channelId)
                                soclHelper.createEvent(eventObj);
    
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            }

            if (messageEvent.data["clickToOpen"] !== undefined) {
                try {
                    var eventObj = {
                        type: ONSITE_MESSAGE_EVENT.Type.Channel_Step_Conclusion,
                        step: ONSITE_MESSAGE_EVENT.Step.OS_Message_Fab,
                        channelId: messageEvent.data["clickToOpen"]
                    };

                    if (eventObj.channelId)
                        soclHelper.createEvent(eventObj);
    
                } catch (e) {
                    console.log(e);
                }
            }

            if (messageEvent.data["open"] !== undefined) {
                var metadata = messageEvent.data["open"].split('|');

                var timesToShowAfterView = parseInt(metadata[0]);
                var orientation = metadata[1];
                var customerId = metadata[2];
                var pluginId = metadata[3];
                var pagesViewBefore = parseInt(metadata[4]);

                element.setAttribute('class', 'socl-open ' + 'socl-' + orientation);

                if (!soclCookie.getCookie("smClosedOnSite_" + pluginId) &&
                    !soclCookie.getCookie("smClickOnSite_" + pluginId) &&
                    parseInt(soclHelper.getSessionValue("pagesview_" + pluginId)) > pagesViewBefore &&
                    (!soclHelper.getStoreValue("onsiteview_" + pluginId) || (parseInt(soclHelper.getStoreValue("onsiteview_" + pluginId)) < timesToShowAfterView) || timesToShowAfterView == 0)) {

                    element.style.display = "";

                    soclPerfCounter.event(pluginId, soclPerfCounter.type.View, 6, customerId);

                    var onsiteview = parseInt(soclHelper.getStoreValue("onsiteview_" + pluginId));

                    if (!isNaN(onsiteview)) {
                        onsiteview += 1;
                        soclHelper.setStoreValue("onsiteview_" + pluginId, JSON.stringify(onsiteview));
                    } else {
                        soclHelper.setStoreValue("onsiteview_" + pluginId, "1");
                    }

                    soclCookie.createCookie("smViewOnSite", true, 3);
                    socl.emmit.onView({ "id": pluginId, "type": "onsite" });

                    try {
                        var eventObj = {
                            type: ONSITE_MESSAGE_EVENT.Type.Channel_Step_View,
                            step: ONSITE_MESSAGE_EVENT.Step.OS_Message_Message,
                            channelId: pluginId
                        };

                        if (eventObj.channelId)
                            soclHelper.createEvent(eventObj);

                    } catch (e) {
                        console.log(e);
                    }
                }
            }

            if (messageEvent.data["close"] !== undefined) {
                var metadata = messageEvent.data["close"].split('|');
                var timeToShowAfterClose = parseInt(metadata[0]);
                var pluginId = metadata[1];

                if (timeToShowAfterClose > 0) {
                    soclCookie.createCookieOnSite("smClosedOnSite_" + pluginId, true, timeToShowAfterClose);
                }

                soclHelper.setStoreValue("onsiteview_" + metadata.pluginId, "0");
                soclCookie.createCookie("smCloseOnSite", true, 3);
                socl.emmit.onClose({ "id": metadata.pluginId, "type": "onsite" });

                soclOnsiteSales.closeMessage();

                try {
                    var eventObj = {
                        type: ONSITE_MESSAGE_EVENT.Type.Channel_Rejection,
                        step: ONSITE_MESSAGE_EVENT.Step.OS_Message,
                        channelId: pluginId
                    };

                    if (eventObj.channelId)
                        soclHelper.createEvent(eventObj);
                        
                } catch (e) {
                    console.log(e);
                }
            }

            if (messageEvent.data["click"] !== undefined) {
                var metadata = messageEvent.data["click"].split('|');
                var pluginId = metadata[0];
                var customerId = metadata[1];
                var showAfterClick = parseInt(metadata[2]);
                var link = metadata[3];

                soclPerfCounter.event(pluginId, soclPerfCounter.type.Click, 6, customerId);
                soclHelper.setStoreValue("onsiteview_" + pluginId, "0");
                if (showAfterClick > 0) {
                    soclCookie.createCookieOnSite("smClickOnSite_" + pluginId, true, showAfterClick);
                }

                soclCookie.createCookie("smClickOnSite", true, 3);
                socl.emmit.onClick({ "id": pluginId, "type": "onsite" });

                try {
                    var eventObj = {
                        type: ONSITE_MESSAGE_EVENT.Type.Channel_Conclusion,
                        step: ONSITE_MESSAGE_EVENT.Step.OS_Message,
                        channelId: pluginId
                    };

                    if (eventObj.channelId)
                        soclHelper.createEvent(eventObj);
                        
                } catch (e) {
                    console.log(e);
                }

                window.top.location.href = link;

                setTimeout(function () {
                    soclOnsiteSales.closeMessage();
                }, 1000); 
            }
        }
    };

    var indexHtml = function (customerInfo, element, iframe) {
        if (customerInfo.featureSettings.pluginId) {
            soclHelper.hasPushOptInBy(customerInfo.id, function (hasOptIn) {
                BASE_URI_PUSH = soclHelper.replaceAll("{PID}", customerInfo.featureSettings.pluginId, BASE_URI_PUSH);

                iframe.setAttribute("src", BASE_URI + "index.min.html?appId=" + customerInfo.appId + "&id=" + customerInfo.id + "&name=" + encodeURIComponent(customerInfo.name) + "&pluginId=" + customerInfo.featureSettings.pluginId + "&pluginParameters=" + encodeURIComponent(customerInfo.featureSettings.pluginParameters) + "&version=" + customerInfo.featureSettings.version + "&url=" + encodeURIComponent(document.location.href) + "&path=" + encodeURIComponent(BASE_URI_PUSH) + "&hasOptIn=" + hasOptIn + "&isMobile=" + soclHelper.isMobile() + "&gaEnabled=" + customerInfo.gaEnabled);
            });
        }
        else {
            iframe.setAttribute("src", BASE_URI + "index.min.html?appId=" + customerInfo.appId + "&id=" + customerInfo.id + "&name=" + encodeURIComponent(customerInfo.name) + "&url=" + encodeURIComponent(document.location.href) + "&path=" + encodeURIComponent(BASE_URI_PUSH) + "&gaEnabled=" + customerInfo.gaEnabled);
        }

        iframe.setAttribute("id", "social-onsite");
        iframe.setAttribute("class", "socl-iframe");
        iframe.setAttribute("name", "social-onsite");

        element.appendChild(iframe);
    };

    // #[PUBLIC METHODS] -------------------------------------

    context.closeMessage = function () {
        if (document.getElementById("sm-onsite-sales") !== null) {
            document.getElementById("sm-onsite-sales").SoclRemoveTag();
        }
    };

    context.render = function (customerInfo) {
        if (!navigator.cookieEnabled)
            return;

        soclHelper.injectDiv("sm-onsite-sales", "none");
        var element = document.getElementById("sm-onsite-sales");

        if (element !== null && customerInfo.featureSettings.pluginParameters) {
            injectDependencies(function (response) {
                if (response) {
                    var iframe = soclHelper.createBaseIframe();
                    var pluginParameters = JSON.parse(customerInfo.featureSettings.pluginParameters);

                    BASE_URI_PUSH = soclHelper.replaceAll("{DNS}", customerInfo.dns, BASE_URI_PUSH);

                    if (pluginParameters.scrollPercentage > 0) {
                        document.addEventListener('scroll', function (event) {
                            var viewedInThisPage = element.getAttribute("hasViewedOnSiteInThisPage");

                            if (viewedInThisPage == null) {

                                if (parseInt(soclHelper.getPosition()) >= parseInt(pluginParameters.scrollPercentage)) {

                                    element.setAttribute("hasViewedOnSiteInThisPage", "true");

                                    indexHtml(customerInfo, element, iframe);
                                }
                            }
                        }, false);
                    } else {
                        indexHtml(customerInfo, element, iframe);
                    }
                }
            });
        }
    };
})(soclOnsiteSales);

/***/ }),
/* 17 */
/***/ (function(module, exports) {

﻿/// <reference path="signIn.js" />
/// <reference path="../common/cookie.js" />
/// <reference path="../common/helper.js" />
/// <reference path="../plugins/performance-counter.js" />

window["soclOnSite"] = {};

(function (context) {
    Element.prototype.SoclRemoveTag = function () {
        this.parentElement.removeChild(this);
    };

    NodeList.prototype.SoclRemoveTag = HTMLCollection.prototype.SoclRemove = function () {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        } 
    };

    // #[PRIVATE METHODS] ------------------------------------
    
    var windowProxyOnSite;

    var PLUGIN_TYPE = 4; //On Site

    //var BASE_URI_PUSH = "http://localhost:1660/playground/pushchrome/{DNS}/{PID}";
    //var BASE_URI = "http://localhost:1660/sdk/channels/html/";
    //var CSS_URI = "http://localhost:1660/sdk/channels/assets/css/";

    //var BASE_URI = "https://beta-plugins.soclminer.com.br/v3/sdk/channels/html/";
    //var CSS_URI = "https://beta-plugins.soclminer.com.br/v3/sdk/channels/assets/css/";

    var BASE_URI_PUSH = "https://{DNS}.soclminer.com.br/{PID}";
    var BASE_URI = "https://" + soclHelper.getEnvironment() + "plugins.soclminer.com.br/v3/sdk/channels/html/";
    var CSS_URI = "https://" + soclHelper.getEnvironment() + "plugins.soclminer.com.br/v3/sdk/channels/assets/css/";

    var injectDependencies = function (callback) {
        soclHelper.injectCSS(CSS_URI, "onsite.min.css");
        try {
            createProxy();
            callback(true);
        } catch (e) {
            console.warn("SM - [Ursa Enterprise]", e);
            callback(false);
        }
    };

    var createProxy = function () {
        windowProxyOnSite = new soclPorthole.WindowProxy(soclHelper.PROXY_URI, "social-onsite");
        windowProxyOnSite.addEventListener(onMessage);
    };

    var onMessage = function (messageEvent) {
        var element = document.getElementById("sm-onsite");

        if (element !== null) {
            if (messageEvent.data["show"] !== undefined) {
                var metadata = messageEvent.data["show"].split('|');
                var orientation = metadata[0];
                var isOnSiteLead = metadata[1];

                element.setAttribute('class', 'socl-' + orientation);

                if (isOnSiteLead === "true") {
                    if (!soclCookie.getCookie("smViewedOnSiteLead") && !soclCookie.getCookie("smClosedOnSiteLead")) {
                        element.style.display = "";
                    }
                }
                else {
                    if (!soclCookie.getCookie("smViewedOnSite") && !soclCookie.getCookie("smClosedOnSite")) {
                        element.style.display = "";
                    }
                }
            }

            if (messageEvent.data["open"] !== undefined) {
                var metadata = messageEvent.data["open"].split('|');

                var daysToShowAfterView = metadata[0];
                var orientation = metadata[1];
                var customerId = metadata[2];
                var pluginId = metadata[3];
                var isOnSiteLead = metadata[4];

                element.setAttribute('class', 'socl-open ' + 'socl-' + orientation);

                if (isOnSiteLead === "true") {
                    if (!soclCookie.getCookie("smViewedOnSiteLead") && !soclCookie.getCookie("smClosedOnSiteLead")) {

                        if (pluginId !== null) {
                            soclPerfCounter.event(pluginId, soclPerfCounter.type.Impression, PLUGIN_TYPE, customerId);
                        }
                        
                        soclCookie.createCookie("smViewedOnSiteLead", true, daysToShowAfterView);
                    }
                }
                else {
                    if (!soclCookie.getCookie("smViewedOnSite") && !soclCookie.getCookie("smClosedOnSite")) {
                        soclCookie.createCookie("smViewedOnSite", true, daysToShowAfterView);
                    }
                }
            }

            if (messageEvent.data["close"] !== undefined) {
                var metadata = messageEvent.data["close"].split('|');
                var daysToShowAfterClose = metadata[0];
                var isOnSiteLead = metadata[1];

                if (isOnSiteLead === "true") {
                    soclCookie.createCookie("smClosedOnSiteLead", true, daysToShowAfterClose);
                }
                else {
                    soclCookie.createCookie("smClosedOnSite", true, daysToShowAfterClose);
                }
                
                soclOnSite.closeMessage();
            }
        }
    };

    // #[PUBLIC METHODS] -------------------------------------

    context.closeMessage = function () {
        if (document.getElementById("sm-onsite") !== null) {
            document.getElementById("sm-onsite").SoclRemoveTag();
        }
    };

    context.render = function (customerInfo) {
        if (!navigator.cookieEnabled) return;

        soclHelper.injectDiv("sm-onsite", "none");

        var element = document.getElementById("sm-onsite");

        if (element !== null) {
            injectDependencies(function (response) {
                if (response) {
                    var iframe = soclHelper.createBaseIframe();

                    BASE_URI_PUSH = soclHelper.replaceAll("{DNS}", customerInfo.dns, BASE_URI_PUSH);

                    if (customerInfo.featureSettings.pluginId) {
                        soclHelper.hasPushOptInBy(customerInfo.id, function (hasOptIn) {
                            BASE_URI_PUSH = soclHelper.replaceAll("{PID}", customerInfo.featureSettings.pluginId, BASE_URI_PUSH);

                            iframe.setAttribute("src", BASE_URI + "index-alfajor.min.html?appId=" + customerInfo.appId + "&id=" + customerInfo.id + "&name=" + encodeURIComponent(customerInfo.name) + "&pluginId=" + customerInfo.featureSettings.pluginId + "&version=" + customerInfo.featureSettings.version + "&url=" + encodeURIComponent(document.location.href) + "&path=" + encodeURIComponent(BASE_URI_PUSH) + "&hasOptIn=" + hasOptIn + "&isMobile=" + soclHelper.isMobile() + "&gaEnabled=" + customerInfo.gaEnabled);

                            soclHelper.setStoreValue("smpid_" + PLUGIN_TYPE, customerInfo.featureSettings.pluginId);
                        });
                    }
                    else {
                        iframe.setAttribute("src", BASE_URI + "index-alfajor.min.html?appId=" + customerInfo.appId + "&id=" + customerInfo.id + "&name=" + encodeURIComponent(customerInfo.name) + "&url=" + encodeURIComponent(document.location.href) + "&path=" + encodeURIComponent(BASE_URI_PUSH) + "&gaEnabled=" + customerInfo.gaEnabled);
                    }

                    iframe.setAttribute("id", "social-onsite");
                    iframe.setAttribute("class", "socl-iframe");
                    iframe.setAttribute("name", "social-onsite");

                    element.appendChild(iframe);
                }
            });
        }
    };

})(soclOnSite);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(JL) {﻿/// <reference path="../../common/helper.js" />
/// <reference path="../social-connect.js" />
/// <reference path="../../tracking/tracking.js" />
/// <reference path="../../bower_components/jsnlog/jsnlog.min.js" />

window["soclPushEngineAlfajor"] = {};

(function (context) {

    // #[CONSTANT VARIABLES] ------------------------------------

    var SOURCE_ID_PUSH_MESSAGING = 11;
    var PLUGIN_TYPE = 4; //On Site

    // #[PRIVATE METHODS] ------------------------------------

    var deviceType = {
        Desktop: 1,
        Mobile: 2
    };

    var setDisplay = function (addClass, removeClass) {
        document.body.classList.remove(removeClass);
        document.body.classList.add(addClass);

        window.smStepIntercept && window.smStepIntercept(addClass, removeClass);
    };

    var getDeviceType = function () {
        if (soclHelper.getQueryStringParams("isMobile") && soclHelper.getQueryStringParams("isMobile") === 'true') {
            return deviceType.Mobile;
        }
        return deviceType.Desktop;
    };

    var checkDeviceAndClose = function () {
        if (soclHelper.getQueryStringParams("isMobile") && soclHelper.getQueryStringParams("isMobile") === 'true') {
            window.location.href = decodeURIComponent(soclHelper.getQueryStringParams("url"));
        }
        else {
            window.close();
        }
    };

    var createDataToUpdate = function (userId, customerId, endpoint, allow) {
        return {
            "userId": userId,
            "customerId": customerId,
            "endpoint": endpoint,
            "allowPushMessaging": allow,
            "deviceType": getDeviceType()
        };
    };

    var permissionStateChange = function (permissionState) {
        setDisplay("stp2", "stp1");
        switch (permissionState.state) {
            case 'denied': // The user blocked the permission
                soclHelper.getCID(function (cid) {
                    if (cid !== 0) {
                        soclConnect.getId(cid, function (id) {
                            if (id !== 0) {
                                soclHelper.getPushEndpoint(function (endpoint) {
                                    if (endpoint !== "") {
                                        soclConnect.updateConnectedUser(createDataToUpdate(id, cid, endpoint, false), function (response) {
                                            soclHelper.removeStoreValue("pushendpoint");
                                            checkDeviceAndClose();
                                        });
                                    }
                                    else {
                                        checkDeviceAndClose();
                                    }
                                });
                            }
                            else {
                                checkDeviceAndClose();
                            }
                        });
                    } else {
                        checkDeviceAndClose();
                    };
                });
                break;
            case 'granted':
                setDisplay("stp4", "stp2");
                break;
            case 'prompt': // The user didn't accept the permission prompt
                checkDeviceAndClose();
                break;
        }
    }

    var onPushSubscription = function (pushSubscription) {
        setDisplay("stp2", "stp1");
        soclHelper.getCID(function (cid) {
            if (cid !== 0) {
                soclConnect.getId(cid, function (id) {
                    if (id === 0) {
                        soclConnect.signInWithPush(cid, SOURCE_ID_PUSH_MESSAGING, pushSubscription.endpoint, getDeviceType(), function (userId) {
                            soclHelper.setStoreValue("pushendpoint", pushSubscription.endpoint);
                            setDisplay("stp3", "stp2");
                        });
                    }
                    else {
                        soclConnect.updateConnectedUser(createDataToUpdate(id, cid, pushSubscription.endpoint, true), function (response) {
                            soclHelper.setStoreValue("pushendpoint", pushSubscription.endpoint);
                            setDisplay("stp4", "stp2");
                        });
                    }

                    if (!soclHelper.getStoreValue('sm_native')) {
                        soclPerfCounter.event(soclHelper.getQueryStringParams("pluginId"), soclPerfCounter.type.Click, PLUGIN_TYPE, soclHelper.getQueryStringParams("id"));
                    }
                });
            }
            else {
                setDisplay("stp4", "stp2");
                JL("ajaxAppender").fatal({
                    "msg": "Exception",
                    "errorMsg": "Error trying to subscriber user to push notification: 'Missing CID parameter'"
                });
            }
        });
    }

    var subscribeDevice = function () {
        navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
              .then(onPushSubscription)
              .catch(function (e) {
                  if ('permissions' in navigator) {
                      navigator.permissions.query({ name: 'push', userVisibleOnly: true })
                        .then(function (permissionState) {
                            JL("ajaxAppender").fatal({ "msg": "Exception", "errorMsg": "subscribeDevice() Error: Push permission state = " + permissionState });
                            permissionStateChange(permissionState);
                        }).catch(function (err) {
                            JL("ajaxAppender").fatalException({ "msg": "Exception", "errorMsg": "Push Error to register" }, err);
                        });
                  } else {
                      if (Notification.permission === 'denied') {
                          JL("ajaxAppender").fatal({ "msg": "Exception", "errorMsg": "subscribeDevice() Denied Error: " + e.message });
                      } else {
                          JL("ajaxAppender").fatal({ "msg": "Exception", "errorMsg": "Push Error to register = " + e.message });
                      }
                  }
              });
        });
    }

    var unsubscribeDevice = function () {
        navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.getSubscription().then(function (pushSubscription) {
                // Check we have everything we need to unsubscribe
                if (!pushSubscription) {
                    return;
                }

                // TODO: Remove the device details from the server
                // i.e. the pushSubscription.subscriptionId and
                // pushSubscription.endpoint
                //console.log('Unsubscribe from push');
                pushSubscription.unsubscribe().then(function (successful) {
                    console.log('Unsubscribed from push: ', successful);
                    if (!successful) {
                        // The unsubscribe was unsuccessful, but we can
                        // remove the subscriptionId from our server
                        // and notifications will stop
                        // This just may be in a bad state when the user returns
                        console.error('We were unable to unregister from push');
                    }
                }).catch(function (e) {
                    console.log('Unsubscribtion error: ', e);
                });
            }.bind(this)).catch(function (e) {
                console.error('Error thrown while revoking push notifications. Most likely because push was never registered', e);
            });
        });
    }

    var setUpPushPermission = function () {
        navigator.permissions.query({ name: 'push', userVisibleOnly: true })
          .then(function (permissionState) {
              if (permissionState.state === "denied") {
                  permissionStateChange(permissionState);
              } else {
                  subscribeDevice();
              }
          }).catch(function (err) {
              JL("ajaxAppender").fatalException({ "msg": "Exception", "errorMsg": "An error occured while get push permission" }, err);
          });
    };

    var setUpNotificationPermission = function () {
        if (Notification.permission === 'denied') {
            setDisplay("stp4", "stp1");
            JL("ajaxAppender").fatal({
                "msg": "Exception",
                "errorMsg": "Error trying to subscriber user to push notification: 'Permission Denied'"
            });
            return;
        } else if (Notification.permission === 'default') {
            setDisplay("stp4", "stp1");
            JL("ajaxAppender").fatal({
                "msg": "Exception",
                "errorMsg": "Error trying to subscriber user to push notification: 'Permission Default'"
            });
            return;
        }

        subscribeDevice();
    }

    var hasPermission = function (callback) {
        navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.getSubscription()
                .then(function (subscription) {
                    if (subscription) {
                        soclHelper.setStoreValue("pushendpoint", subscription.endpoint);
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                })
              .catch(function (e) {
                  JL("ajaxAppender").fatalException({ "msg": "Exception", "errorMsg": "An error occured while calling getSubscription() to check push opt in" }, e);
              });
        });
    };

    // #[PUBLIC METHODS] -------------------------------------

    context.hasPermission = function (callback) {
        hasPermission(function (permission) {
            callback(permission);
        });
    }

    context.setDisplay = function () {
        soclConnect.getFbId(function (id) {
            if (id === 0)
                setDisplay("stp3", "stp1");
            else
                setDisplay("stp4", "stp1");
        });
    };

    context.initialiseState = function (pluginType) {

        PLUGIN_TYPE = pluginType === undefined ? 4 : pluginType;

        hasPermission(function (permission) {
            if (!permission) {
                if ('permissions' in navigator) { // Is the Permissions API supported
                    setUpPushPermission();
                } else {
                    setUpNotificationPermission();
                }
            }
            else {
                soclConnect.getFbId(function (id) {
                    if (id === 0) {
                        setDisplay("stp3", "stp1");
                    }
                    else {
                        setDisplay("stp4", "stp1");
                    }
                });
            }
        });
    }

    context.supportPush = function (callback) {
        if (!('PushManager' in window)) { // Check if push messaging is supported
            //console.log('Service Workers not supported');
            callback(false);
        }
        else {
            callback(true);
        }
    }

})(soclPushEngineAlfajor);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)["JL"]))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

﻿/// <reference path="plugins/social-connect.js" />
/// <reference path="plugins/social-bounce.js" />
/// <reference path="plugins/onsite-sales/onsite-message-sales.js" />
/// <reference path="tracking/tracking.js" />
/// <reference path="common/helper.js" />
/// <reference path="channels/onsite-message-alfajor.js" />
/// <reference path="bower_components/localStorageDB/localstoragedb.js" />

var apiUrl = '';
window["socl"] = {};
var firebase;

(function (context) {

    // #[PRIVATE METHODS] ------------------------------------

    var TIMEOUT_EXECUTE = 20;

    var setParamOnSession = function (data) {
        if (data.paramOnSession !== undefined && data.paramOnSession !== "") {

            var param = soclHelper.getSessionValue("paramOnSession");

            if (param !== null && param !== '') {
                param += "|" + data.paramOnSession;
            }
            else {
                param = data.paramOnSession;
            }

            soclHelper.setSessionValue("paramOnSession", param);
        }
    };

    var PRESALES_EVENT = {
        Type: {
            Presales_Impact: "Presales.Impact"
        }
    };

    // #[PUBLIC METHODS] -------------------------------------

    context.inject = function (url) {
        var js, ref = document.getElementsByTagName('script')[0];
        js = document.createElement('script');
        js.src = url;
        ref.parentNode.insertBefore(js, ref);
    };

    context.execute = function () {
        this.apiUrl = "https://" + soclHelper.getEnvironment() + "api.soclminer.com.br/v2.1";
        setTimeout(function () {
            TIMEOUT_EXECUTE--;
            if (typeof soclTracking !== 'undefined') {
                window.soclInit();
            } else if (TIMEOUT_EXECUTE > 0) {
                context.execute();
            } else {
                return;
            }
        }, 2000);
    };

    context.emmit = {
        onView: function (e) {
            e.event = "view";
            context.onView && context.onView(e);
        },
        onClick: function (e) {
            e.event = "click";
            context.onClick && context.onClick(e);
        },
        onClose: function (e) {
            e.event = "close";
            context.onClose && context.onClose(e);
        },
        onEvent: function(e) {
            context.onEvent && context.onEvent(e);
        }
    };

    context.start = function (cid) {
        if (!cid) return;

        this.apiUrl = "https://" + soclHelper.getEnvironment() + "api.soclminer.com.br/v2.1";

        var smid = soclHelper.getStoreValue(soclConnect.createSMIdKey(cid));

        if (smid && !soclHelper.guidValidation(smid)) {
            var cidFormatted = soclHelper.replaceAll("-", "", cid);
            soclHelper.removeStoreValue(soclConnect.createSMIdKey(cid));
            soclHelper.removeStoreValue("smpushoptin_" + cidFormatted);
            soclHelper.removeStoreValue(cidFormatted);
        }

        var smObj = soclHelper.getOrCreateSMObj(cid);
        soclHelper.getOrCreateSessionHash(cid);

        var encodedCurrentURL = encodeURIComponent(document.location.href);
        soclHelper.getCustomerInfo(cid, encodedCurrentURL, function (data) {
            if (data.response !== undefined) {
                var customerInfo = {
                    "id": data.response.id,
                    "appId": data.response.appId,
                    "name": data.response.name,
                    "dns": data.response.customDNS,
                    "forceRedirect": data.response.forceRedirect,
                    "gaEnabled": data.response.gaEnabled,
                    "cgActive": data.response.cgActive,
                    "purchaseUrl": data.response.purchaseUrl,
                    "pageId": data.response.facebookPageId,
                    "featureSettings": { folderName: "", pluginParameters: "", pluginTypeId: "", pluginId: "", version: "", startDate: "", endDate: "" },
                    "isPushNativeEnabled": false,
                    "timeInSite": 0,
                    "googleApp": 2,
                    "sendAnonymousData": data.response.sendAnonymousData,
                    "baseSizePercent": data.response.baseSizePercent,
                    "features": data.response.features
                };

                soclHelper.setCustomerInfoToLocalStorage(customerInfo);

                var chromeOptinFeature = data.response.features.find(function (item) {
                    return item.feature.id == 'f4456763b8cb412a9e5cf2a11f2b6222';
                });

                if (chromeOptinFeature && chromeOptinFeature.pluginTypeId === 5) {
                    var pluginParameters = JSON.parse(chromeOptinFeature.pluginParameters)
                    customerInfo.isPushNativeEnabled = pluginParameters.native;
                    customerInfo.googleApplicationId = pluginParameters.GoogleAppTypeId;
                    customerInfo.daysToShowAfterView = pluginParameters.daysToShowAfterView;
                    customerInfo.timeInSite = pluginParameters.TimeInSite;


                    if (customerInfo.googleApplicationId)
                        customerInfo.googleApp = customerInfo.googleApplicationId;
                }

                soclHelper.removeSessionValue("paramOnSession");

                for (var i = 0; i < data.response.features.length; i++) {
                    customerInfo.featureSettings = { folderName: data.response.features[i].folderName, pluginTypeId: "", pluginId: "", version: "", startDate: "", endDate: "" }

                    switch (data.response.features[i].feature.id) {
                        case "ce48903b935c436f8c696585e8df1f36": // Tracking
                            var formattedCID = soclHelper.replaceAll("-", "", cid);
                            var database = soclHelper.replaceAll("{0}", formattedCID, "logs_{0}");

                            soclTracking.createLogDB(database);
                            soclTracking.createEventDB("events_" + formattedCID);
                            soclHelper.sendEvents(formattedCID);

                            try {

                                var url = document.location.href;

                                if (url.includes("smid")) {
                                    var url_smid = soclHelper.getQueryStringParams("smid")
                                    soclCookie.createCookie("sm_event_impact", "smid=" + url_smid, 60);

                                    try {
                                        var additionalData = {
                                            ImpactType: "smid=" + url_smid
                                        };

                                        var eventObj = {
                                            type: PRESALES_EVENT.Type.Presales_Impact,
                                            additionalData: additionalData
                                        };

                                        soclHelper.createEvent(eventObj);

                                    } catch (e) {
                                        console.log(e);
                                    }
                                }

                                var smImpactCookie = soclCookie.getCookie("sm_event_impact");

                                if (smImpactCookie && !url.includes("smid")) {
                                    var paramsConcurrentImpact = soclHelper.getParamsConcurrentImpact();

                                    for (var j = 0; j < paramsConcurrentImpact.length; j++)
                                        if (url.includes(paramsConcurrentImpact[j]))
                                            soclCookie.removeCookie("sm_event_impact");
                                }

                            } catch (e) {
                                console.log(e)
                            }

                            soclHelper.injectCrawler(cid, function () {
                                var logItem = {
                                    url: document.location.href,
                                    referrer: document.referrer,
                                    date: soclHelper.getNow(),
                                    metadata: soclHelper.getMetadata(),
                                    sessionHash: soclHelper.getSessionHash(),
                                    clientId: smObj.clientId
                                };

                                soclTracking.insertLogItem(database, logItem);

                                // Handle only anonymous data
                                if (!smid && customerInfo.sendAnonymousData && soclHelper.isInControlGroup(smObj.randomNumber, customerInfo.baseSizePercent)) {
                                    try {
                                        soclHelper.postBehaviors(cid, smObj.clientId);
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                }
                            });

                            customerInfo.tagsParameter = data.response.tagsParameter;

                            soclTracking.init(customerInfo);

                            break;
                        case "f4456763b8cb412a9e5cf2a11f2b6222": // Push Opt-in
                        case "6fb5edd41bda496593802a9d0acf8595":
                            var plugin = data.response.features[i];

                            setParamOnSession(plugin);

                            var customerInfoCopy = JSON.parse(JSON.stringify(customerInfo));

                            if (plugin.pluginId) {
                                customerInfoCopy.featureSettings.pluginTypeId = plugin.pluginTypeId;
                                customerInfoCopy.featureSettings.pluginId = plugin.pluginId;
                                customerInfoCopy.featureSettings.version = plugin.version;


                                if (customerInfoCopy.timeInSite > 0)
                                    setTimeout(function () { soclPush.render(customerInfoCopy); }, customerInfoCopy.timeInSite * 1000);
                                else
                                    soclPush.render(customerInfoCopy);
                            }

                            soclHelper.injectDiv("sm-push-tracking", "none");
                            var element = document.getElementById("sm-push-tracking");

                            soclHelper.hasPushOptInBy(customerInfoCopy.id, function (hasOptIn) {
                                soclPush.createPushTrackingIFrame(customerInfoCopy, hasOptIn, element);
                            });

                            break;
                        case "89981d318e7f4fa9bf267e5498ac6688": // Lightbox (Social Bounce)
                            setParamOnSession(data.response.features[i]);

                            if (data.response.features[i].pluginId && customerInfo.appId) {
                                customerInfo.featureSettings.pluginTypeId = data.response.features[i].pluginTypeId;
                                customerInfo.featureSettings.pluginId = data.response.features[i].pluginId;
                                customerInfo.featureSettings.version = data.response.features[i].version;
                                customerInfo.featureSettings.pluginParameters = data.response.features[i].pluginParameters;
                                customerInfo.featureSettings.storyId = data.response.features[i].storyId;


                                var pagesview = parseInt(soclHelper.getSessionValue("pagesview_" + customerInfo.featureSettings.pluginId));

                                if (!isNaN(pagesview)) {
                                    pagesview += 1;
                                    soclHelper.setSessionValue("pagesview_" + customerInfo.featureSettings.pluginId, pagesview);
                                } else {
                                    soclHelper.setSessionValue("pagesview_" + customerInfo.featureSettings.pluginId, 1);
                                }

                                soclBounce.render(JSON.parse(JSON.stringify(customerInfo)));
                            }

                            break;
                        case "3f1df6d723414bb9bc2e23ccb33e8d8b": // Old onsite
                            setParamOnSession(data.response.features[i]);

                            if (data.response.features[i].pluginId) {
                                customerInfo.featureSettings.pluginTypeId = data.response.features[i].pluginTypeId;
                                customerInfo.featureSettings.pluginId = data.response.features[i].pluginId;
                                customerInfo.featureSettings.version = data.response.features[i].version;
                            }

                            soclOnSite.render(JSON.parse(JSON.stringify(customerInfo)));

                            break;
                        case "5491c86eda73474a907c6e4adb18ee99": // Onsite Message
                            setParamOnSession(data.response.features[i]);

                            if (data.response.features[i].pluginId) {
                                var onsitePlugin = data.response.features[i];
                                customerInfo.featureSettings.pluginTypeId = onsitePlugin.pluginTypeId;
                                customerInfo.featureSettings.pluginId = onsitePlugin.pluginId;
                                customerInfo.featureSettings.version = onsitePlugin.version;
                                customerInfo.featureSettings.pluginParameters = onsitePlugin.pluginParameters;
                                customerInfo.featureSettings.startDate = onsitePlugin.startDate;
                                customerInfo.featureSettings.endDate = onsitePlugin.endDate;

                                var pagesview = parseInt(soclHelper.getSessionValue("pagesview_" + customerInfo.featureSettings.pluginId));

                                if (!isNaN(pagesview)) {
                                    pagesview += 1;
                                    soclHelper.setSessionValue("pagesview_" + customerInfo.featureSettings.pluginId, pagesview);
                                } else {
                                    soclHelper.setSessionValue("pagesview_" + customerInfo.featureSettings.pluginId, 1);
                                }
                            }

                            soclOnsiteSales.render(JSON.parse(JSON.stringify(customerInfo)));

                            break;
                    }
                }
            }
        });
    };
})(socl);

(function (d) {
    //this.apiUrl = "http://localhost:2834";
    //this.apiUrl = "https://beta-api.soclminer.com.br/v2.1";

    // Get environment variable from helper.js
    this.apiUrl = "https://" + soclHelper.getEnvironment() + "api.soclminer.com.br/v2.1";

    socl.execute();
})(document);

/***/ }),
/* 20 */
/***/ (function(module, exports) {

﻿///#source 1 1 /sdk/plugins/assets/js/porthole.js
/*
    Copyright (c) 2011-2012 Ternary Labs. All Rights Reserved.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

/*
# Websequencediagrams.com
participant abc.com
participant "iFrame proxy xyz.com"
participant "iFrame proxy abc.com"
participant "iFrame xyz.com"
abc.com->iFrame proxy xyz.com: postMessage(data, targetOrigin)
note left of "iFrame proxy xyz.com": Set url fragment and change size
iFrame proxy xyz.com->iFrame proxy xyz.com: onResize Event
note right of "iFrame proxy xyz.com": read url fragment
iFrame proxy xyz.com->iFrame xyz.com: forwardMessageEvent(event)
iFrame xyz.com->iFrame proxy abc.com: postMessage(data, targetOrigin)
note right of "iFrame proxy abc.com": Set url fragment and change size
iFrame proxy abc.com->iFrame proxy abc.com: onResize Event
note right of "iFrame proxy abc.com": read url fragment
iFrame proxy abc.com->abc.com: forwardMessageEvent(event)
*/

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype

(function(window, soclPorthole){
    'use strict';
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    var PortholeClass = function(){};

    // Create a new Class that inherits from this class
    PortholeClass.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = PortholeClass.extend;

        return Class;
    };

    /**
     * @overview Porthole, JavaScript Library for Secure Cross Domain iFrame Communication.
     * @author <a href="mailto:georges@ternarylabs.com">Georges Auberger</a>
     * @copyright 2011-2012 Ternary Labs, All Rights Reserved.
     *
     * Namespace for Porthole
     * @module Porthole
     */
    var Porthole = {
        debug: false,

        /**
         * Utility function to trace to console
         * @private
         */
        trace: function(s) {
            if (this.debug && window.console !== undefined) {
                window.console.log('Porthole: ' + s);
            }
        },

        /**
         * Utility function to send errors to console
         * @private
         */
        error: function(s) {
            if (typeof window.console !== undefined && typeof window.console.error === 'function') {
                window.console.error('Porthole: ' + s);
            }
        }
    };

    /**
     * @class
     * @classdesc Proxy window object to post message to target window
     * @param {string} proxyIFrameUrl - Fully qualified url to proxy iframe, or null to create a receiver only window
     * @param {string} targetWindowName - Name of the proxy iframe window
     */
    Porthole.WindowProxy = function(){};

    Porthole.WindowProxy.prototype = {
        /**
         * Post a message to the target window only if the content comes from the target origin.
         * <code>targetOrigin</code> can be a url or *
         * @public
         * @param {Object} data - Payload
         * @param {String} targetOrigin
         */
        post: function(data, targetOrigin) {},
        /**
         * Add an event listener to receive messages.
         * @public
         * @param {Function} eventListenerCallback
         * @returns {Function} eventListenerCallback
         */
        addEventListener: function(f) {},
        /**
         * Remove an event listener.
         * @public
         * @param {Function} eventListenerCallback
         */
        removeEventListener: function(f) {}
    };

    Porthole.WindowProxyBase = PortholeClass.extend({
        init: function(targetWindowName) {
            if (targetWindowName === undefined) {
                targetWindowName = '';
            }
            this.targetWindowName = targetWindowName;
            this.origin = window.location.protocol + '//' + window.location.host;
            this.eventListeners = [];
        },

        getTargetWindowName: function() {
            return this.targetWindowName;
        },

        getOrigin: function() {
            return this.origin;
        },

        /**
         * Lookup window object based on target window name
         * @private
         * @return {string} targetWindow
         */
        getTargetWindow: function() {
            return Porthole.WindowProxy.getTargetWindow(this.targetWindowName);
        },

        post: function(data, targetOrigin) {
            if (targetOrigin === undefined) {
                targetOrigin = '*';
            }
            this.dispatchMessage({
                'data' : data,
                'sourceOrigin' : this.getOrigin(),
                'targetOrigin' : targetOrigin,
                'sourceWindowName' : window.name,
                'targetWindowName' : this.getTargetWindowName()
            });
        },

        addEventListener: function(f) {
            this.eventListeners.push(f);
            return f;
        },

        removeEventListener: function(f) {
            var index;
            try {
                index = this.eventListeners.indexOf(f);
                this.eventListeners.splice(index, 1);
            } catch(e) {
                this.eventListeners = [];
            }
        },

        dispatchEvent: function(event) {
            var i;
            for (i = 0; i < this.eventListeners.length; i++) {
                try {
                    this.eventListeners[i](event);
                } catch(e) {
                    Porthole.error(e);
                }
            }
        }
    });

    /**
     * Legacy browser implementation of proxy window object to post message to target window
     *
     * @private
     * @constructor
     * @param {string} proxyIFrameUrl - Fully qualified url to proxy iframe
     * @param {string} targetWindowName - Name of the proxy iframe window
     */
    Porthole.WindowProxyLegacy = Porthole.WindowProxyBase.extend({
        init: function(proxyIFrameUrl, targetWindowName) {
            this._super(targetWindowName);

            if (proxyIFrameUrl !== null) {
                this.proxyIFrameName = this.targetWindowName + 'ProxyIFrame';
                this.proxyIFrameLocation = proxyIFrameUrl;

                // Create the proxy iFrame and add to dom
                this.proxyIFrameElement = this.createIFrameProxy();
            } else {
                // Won't be able to send messages
                this.proxyIFrameElement = null;
                Porthole.trace("proxyIFrameUrl is null, window will be a receiver only");
                this.post = function(){ throw new Error("Receiver only window");};
            }
        },

        /**
         * Create an iframe and load the proxy
         *
         * @private
         * @returns iframe
         */
        createIFrameProxy: function() {
            var iframe = document.createElement('iframe');

            iframe.setAttribute('id', this.proxyIFrameName);
            iframe.setAttribute('name', this.proxyIFrameName);
            iframe.setAttribute('src', this.proxyIFrameLocation);
            // IE needs this otherwise resize event is not fired
            iframe.setAttribute('frameBorder', '1');
            iframe.setAttribute('scrolling', 'auto');
            // Need a certain size otherwise IE7 does not fire resize event
            iframe.setAttribute('width', 30);
            iframe.setAttribute('height', 30);
            iframe.setAttribute('style', 'position: absolute; left: -100px; top:0px;');
            // IE needs this because setting style attribute is broken. No really.
            if (iframe.style.setAttribute) {
                iframe.style.setAttribute('cssText', 'position: absolute; left: -100px; top:0px;');
            }
            document.body.appendChild(iframe);
            return iframe;
        },

        dispatchMessage: function(message) {
            var encode = window.encodeURIComponent;

            if (this.proxyIFrameElement) {
                var src = this.proxyIFrameLocation + '#' + encode(Porthole.WindowProxy.serialize(message));
                this.proxyIFrameElement.setAttribute('src', src);
                this.proxyIFrameElement.height = this.proxyIFrameElement.height > 50 ? 50 : 100;
            }
        }
    });

    /**
     * Implementation for modern browsers that supports it
     */
    Porthole.WindowProxyHTML5 = Porthole.WindowProxyBase.extend({
        init: function(proxyIFrameUrl, targetWindowName) {
            this._super(targetWindowName);
            this.eventListenerCallback = null;
        },

        dispatchMessage: function(message) {
            this.getTargetWindow().postMessage(Porthole.WindowProxy.serialize(message), message.targetOrigin);
        },

        addEventListener: function(f) {
            if (this.eventListeners.length === 0) {
                var self = this;
                if (window.addEventListener) {
                    this.eventListenerCallback = function(event) { self.eventListener(self, event); };
                    window.addEventListener('message', this.eventListenerCallback, false);
                } else if (window.attachEvent) {
                    // Make IE8 happy, just not that 1. postMessage only works for IFRAMES/FRAMES http://blogs.msdn.com/b/ieinternals/archive/2009/09/16/bugs-in-ie8-support-for-html5-postmessage-sessionstorage-and-localstorage.aspx
                    this.eventListenerCallback = function(event) { self.eventListener(self, window.event); };
                    window.attachEvent("onmessage", this.eventListenerCallback);
                }
            }
            return this._super(f);
        },

        removeEventListener: function(f) {
            this._super(f);

            if (this.eventListeners.length === 0) {
                if (window.removeEventListener) {
                    window.removeEventListener('message', this.eventListenerCallback);
                } else if (window.detachEvent) { // Make IE8, happy, see above
                    // see jquery, detachEvent needed property on element, by name of that event, to properly expose it to GC
                    if (typeof window.onmessage === 'undefined') window.onmessage = null;
                    window.detachEvent('onmessage', this.eventListenerCallback);
                }
                this.eventListenerCallback = null;
            }
        },

        eventListener: function(self, nativeEvent) {
            var data = Porthole.WindowProxy.unserialize(nativeEvent.data);
            if (data && (self.targetWindowName === '' || data.sourceWindowName == self.targetWindowName)) {
                self.dispatchEvent(new Porthole.MessageEvent(data.data, nativeEvent.origin, self));
            }
        }
    });

    if (!window.postMessage) {
        Porthole.trace('Using legacy browser support');
        Porthole.WindowProxy = Porthole.WindowProxyLegacy.extend({});
    } else {
        Porthole.trace('Using built-in browser support');
        Porthole.WindowProxy = Porthole.WindowProxyHTML5.extend({});
    }

    /**
     * Serialize an object using JSON.stringify
     *
     * @param {Object} obj The object to be serialized
     * @return {String}
     */
    Porthole.WindowProxy.serialize = function(obj) {
        if (typeof JSON === 'undefined') {
            throw new Error('Porthole serialization depends on JSON!');
        }

        return JSON.stringify(obj);
    };

    /**
     * Unserialize using JSON.parse
     *
     * @param {String} text Serialization
     * @return {Object}
     */
    Porthole.WindowProxy.unserialize =  function(text) {
        if (typeof JSON === 'undefined') {
            throw new Error('Porthole unserialization dependens on JSON!');
        }
        try {
            var json = JSON.parse(text);
        } catch (e) {
            return false;
        }
        return json;
    };

    Porthole.WindowProxy.getTargetWindow = function(targetWindowName) {
        if (targetWindowName === '') {
            return parent;
        } else if (targetWindowName === 'top' || targetWindowName === 'parent') {
            return window[targetWindowName];
        }
        return window.frames[targetWindowName];
    };

    /**
     * @classdesc Event object to be passed to registered event handlers
     * @class
     * @param {String} data
     * @param {String} origin - url of window sending the message
     * @param {Object} source - window object sending the message
     */
    Porthole.MessageEvent = function MessageEvent(data, origin, source) {
        this.data = data;
        this.origin = origin;
        this.source = source;
    };

    /**
     * @classdesc Dispatcher object to relay messages.
     * @public
     * @constructor
     */
    Porthole.WindowProxyDispatcher = {
        /**
         * Forward a message event to the target window
         * @private
         */
        forwardMessageEvent: function(e) {
            var message,
                decode = window.decodeURIComponent,
                targetWindow,
                windowProxy;

            if (document.location.hash.length > 0) {
                // Eat the hash character
                message = Porthole.WindowProxy.unserialize(decode(document.location.hash.substr(1)));

                targetWindow = Porthole.WindowProxy.getTargetWindow(message.targetWindowName);

                windowProxy =
                    Porthole.WindowProxyDispatcher.findWindowProxyObjectInWindow(
                        targetWindow,
                        message.sourceWindowName
                    );

                if (windowProxy) {
                    if (windowProxy.origin === message.targetOrigin || message.targetOrigin === '*') {
                        windowProxy.dispatchEvent(
                            new Porthole.MessageEvent(message.data, message.sourceOrigin, windowProxy));
                    } else {
                        Porthole.error('Target origin ' +
                            windowProxy.origin +
                            ' does not match desired target of ' +
                            message.targetOrigin);
                    }
                } else {
                    Porthole.error('Could not find window proxy object on the target window');
                }
            }
        },

        /**
         * Look for a window proxy object in the target window
         * @private
         */
        findWindowProxyObjectInWindow: function(w, sourceWindowName) {
            var i;

            if (w) {
                for (i in w) {
                    if (Object.prototype.hasOwnProperty.call(w, i)) {
                        try {
                            // Ensure that we're finding the proxy object
                            // that is declared to be targetting the window that is calling us
                            if (w[i] !== null &&
                                typeof w[i] === 'object' &&
                                w[i] instanceof w.Porthole.WindowProxy &&
                                w[i].getTargetWindowName() === sourceWindowName) {
                                return w[i];
                            }
                        } catch(e) {
                            // Swallow exception in case we access an object we shouldn't
                        }
                    }
                }
            }
            return null;
        },

        /**
         * Start a proxy to relay messages.
         * @public
         */
        start: function() {
            if (window.addEventListener) {
                window.addEventListener('resize',
                    Porthole.WindowProxyDispatcher.forwardMessageEvent,
                    false);
            } else if (window.attachEvent && window.postMessage !== 'undefined') {
                window.attachEvent('onresize',
                    Porthole.WindowProxyDispatcher.forwardMessageEvent);
            } else if (document.body.attachEvent) {
                window.attachEvent('onresize',
                    Porthole.WindowProxyDispatcher.forwardMessageEvent);
            } else {
                // Should never happen
                Porthole.error('Cannot attach resize event');
            }
        }
    };

    window[soclPorthole] = Porthole;

})(typeof window !== "undefined" ? window : this, "soclPorthole");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

(function (root, factory) {
    //if (typeof define === 'function' && define.amd) {
    //    define(factory);
    //} else if (typeof exports === 'object') {
    //    module.exports = factory(require, exports, module);
    //} else {
    //    root.ouibounce = factory();
    //}
    soclOuibounce = factory();
}(this, function () {

    return function ouibounce(el, config) {
        var config = config || {},
            aggressive = config.aggressive || false,
            sensitivity = setDefault(config.sensitivity, 20),
            timer = setDefault(config.timer, 1000),
            delay = setDefault(config.delay, 0),
            callback = config.callback || function () { },
            beforeShow = config.onBeforeShow || function () { },
            cookieExpire = setDefaultCookieExpire(config.cookieExpire) || '',
            cookieDomain = config.cookieDomain ? ';domain=' + config.cookieDomain : '',
            cookieName = config.cookieName ? config.cookieName : 'viewedOuibounceModal',
            sitewide = config.sitewide === true ? ';path=/' : '',
            _delayTimer = null,
            _html = document.documentElement;

        function setDefault(_property, _default) {
            return typeof _property === 'undefined' ? _default : _property;
        }

        function setDefaultCookieExpire(days) {
            // transform days to milliseconds
            var ms = days * 24 * 60 * 60 * 1000;

            var date = new Date();
            date.setTime(date.getTime() + ms);

            return "; expires=" + date.toUTCString();
        }

        setTimeout(attachOuiBounce, timer);
        function attachOuiBounce() {
            _html.addEventListener('mouseleave', handleMouseleave);
            _html.addEventListener('mouseenter', handleMouseenter);
            _html.addEventListener('keydown', handleKeydown);
        }

        function handleMouseleave(e) {
            if (e.clientY > sensitivity || (checkCookieValue(cookieName, 'true') && !aggressive)) return;

            _delayTimer = setTimeout(fire, delay);
        }

        function handleMouseenter(e) {
            if (_delayTimer) {
                clearTimeout(_delayTimer);
                _delayTimer = null;
            }
        }

        var disableKeydown = false;
        function handleKeydown(e) {
            if (disableKeydown || checkCookieValue(cookieName, 'true') && !aggressive) return;
            else if (!e.metaKey || e.keyCode !== 76) return;

            disableKeydown = true;
            _delayTimer = setTimeout(fire, delay);
        }

        function checkCookieValue(cookieName, value) {
            return parseCookies()[cookieName] === value;
        }

        function parseCookies() {
            // cookies are separated by '; '
            var cookies = document.cookie.split('; ');

            var ret = {};
            for (var i = cookies.length - 1; i >= 0; i--) {
                var el = cookies[i].split('=');
                ret[el[0]] = el[1];
            }
            return ret;
        }

        function fire() {
            var cancelShow = beforeShow() || false;
            // You can use ouibounce without passing an element
            // https://github.com/carlsednaoui/ouibounce/issues/30
            if (cancelShow) return;
            if (el) el.style.display = 'block';
            disable();
            callback();
        }

        function disable(options) {
            var options = options || {};

            // you can pass a specific cookie expiration when using the OuiBounce API
            // ex: _ouiBounce.disable({ cookieExpire: 5 });
            if (typeof options.cookieExpire !== 'undefined') {
                cookieExpire = setDefaultCookieExpire(options.cookieExpire);
            }

            // you can pass use sitewide cookies too
            // ex: _ouiBounce.disable({ cookieExpire: 5, sitewide: true });
            if (options.sitewide === true) {
                sitewide = ';path=/';
            }

            // you can pass a domain string when the cookie should be read subdomain-wise
            // ex: _ouiBounce.disable({ cookieDomain: '.example.com' });
            if (typeof options.cookieDomain !== 'undefined') {
                cookieDomain = ';domain=' + options.cookieDomain;
            }

            if (typeof options.cookieName !== 'undefined') {
                cookieName = options.cookieName;
            }

            document.cookie = cookieName + '=true' + cookieExpire + cookieDomain + sitewide;

            // remove listeners
            _html.removeEventListener('mouseleave', handleMouseleave);
            _html.removeEventListener('mouseenter', handleMouseenter);
            _html.removeEventListener('keydown', handleKeydown);
        }

        return {
            fire: fire,
            disable: disable
        };
    };
}));

/***/ })
/******/ ]);
//# sourceMappingURL=all.js.map