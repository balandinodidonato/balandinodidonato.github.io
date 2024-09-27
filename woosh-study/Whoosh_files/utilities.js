// Get URL parameters using jQuery
// usage: var param = GetURLParameter('param_name');
function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) return sParameterName[1];
    }
}
// Get URL parameters using js
// usage: var param = $_GET('param_name')
// usage: var all_param = $_GET(),
//    param1 = $_GET['param1_name'],
//    param2 = $_GET['param2_name'];
function GetURLParamJS(param) {
    var vars = {};
    window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function(m, key, value) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );
    if (param) return vars[param] ? vars[param] : null;
    return vars;
}
// Parse JavaScript parameters out in an array
// usage:
//  parameters = parseQuery( yourQuery);
//  param1 = parameters['param1']
function parseQuery(query) {
    var Params = new Object();
    if (!query) return Params; // return empty object
    var Pairs = query.split(/[;&]/);
    for (var i = 0; i < Pairs.length; i++) {
        var KeyVal = Pairs[i].split('=');
        if (!KeyVal || KeyVal.length != 2) continue;
        var key = unescape(KeyVal[0]);
        var val = unescape(KeyVal[1]);
        val = val.replace(/\+/g, ' ');
        if (key in Params) {
            if (!Array.isArray(Params[key])) {
                Params[key] = Array.of(Params[key]);
            }
            Params[key].push(val);
        } else Params[key] = val;
    }
    return Params;
}

function EncodeQueryData(data) {
    var ret = [];
    for (var d in data) ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
    return ret.join("&");
}
var QueryString = function() {
    // This function is anonymous, is executed immediately and the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") query_string[pair[0]] = decodeURIComponent(pair[1]); // If second entry with this name
        else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
    return query_string;
}();

function downloadObjectAsJson(exportObj, exportName, space, format) {
    var format = format || ".json";
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, space || null));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + format);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function disconnectNode(node, nodeInputs, nodeOutputs) {
    if (typeof nodeInputs !== 'undefined' && nodeInputs !== false) {
        if (!Array.isArray(nodeInputs)) nodeInputs = [nodeInputs];
        for (var i = 0; i < nodeInputs.length; i++) nodeInputs[i].disconnect(node);
    }
    if (typeof nodeOutputs !== 'undefined' && nodeOutputs !== false) {
        if (!Array.isArray(nodeOutputs)) nodeOutputs = [nodeOutputs];
        for (var i = 0; i < nodeOutputs.length; i++) node.disconnect(nodeOutputs[i]);
    }
};

function connectNode(node, nodeInputs, nodeOutputs) {
    if (typeof nodeInputs !== 'undefined' && nodeInputs !== false) {
        if (!Array.isArray(nodeInputs)) nodeInputs = [nodeInputs];
        for (var i = 0; i < nodeInputs.length; i++) nodeInputs[i].connect(node);
    }
    if (typeof nodeOutputs !== 'undefined' && nodeOutputs !== false) {
        if (!Array.isArray(nodeOutputs)) nodeOutputs = [nodeOutputs];
        for (var i = 0; i < nodeOutputs.length; i++) node.connect(nodeOutputs[i]);
    }
};

function bindInputs(input1, input2, event1, event2) {
    event1 = event1 || "input";
    event2 = event2 || "change";
    window.addEventListener('load', function() {
        equalValues(input1, input2);
    }, false);
    document.getElementById(input1).addEventListener(event1, function() {
        equalValues(input1, input2);
    }, false);
    document.getElementById(input2).addEventListener(event2, function() {
        equalValues(input2, input1);
    }, false);

    function equalValues(inputA, inputB) {
        document.getElementById(inputB).value = document.getElementById(inputA).value;
    };
};
// DEPRECATED
// generate the random number within the calculated range
function generateRandomValue(minVal, maxVal) {
    return Math.random() * (maxVal - minVal) + minVal;
};
// get selected slider (see selector) and put them into an array
function selectedValuesMultiple() {
    var multipleValues = $("#selectParameterToRandomise").val() || [];
    return multipleValues;
};
// DEPRECATED
function bindElementToAudioParam(elementName, parameterName, elementType, pluginObject) {
    var element = document.getElementById(elementName);
    var pluginParameterObject = pluginObject.getParameterObject();
    var parameterType = pluginParameterObject[parameterName].constructor.name;
    var event = "change";
    switch (elementType) {
        case "slider":
            event = "input";
            break;
        case "switch":
            event = "change";
            break;
        case "button":
            event = "click";
            break;
    }
    if (elementType == "slider" && parameterType == "NumberParameter") setSlider(elementName, parameterName, pluginParameterObject);
    return new bindToEvent(elementName, pluginObject, parameterName, element.value, event);
};
// DEPRECATED
function bindToEvent(element, plugin, parameter, value, events) {
    this.plugin = plugin;
    this.parameter = parameter;
    this.value = value;
    this.element = document.getElementById(element);
    element.value = value;
    if (!Array.isArray(events)) events = [events];
    for (var i = 0; i < events.length; i++) this.element.addEventListener(events[i], this, false);
};
bindToEvent.prototype.handleEvent = function(event) {
    switch (event.type) {
        case "change":
            this.change(this.element.value);
            break;
        case "input":
            this.change(this.element.value);
            break;
        case "click":
            this.plugin.getParameterByName(this.parameter).onclick();
            break;
    }
};
bindToEvent.prototype.change = function(value) {
    this.data = value;
    this.element.value = value;
    this.element.setAttribute("lastinput", value);
    this.plugin.setParameterByName(this.parameter, value);
};
// access to slider attribute 'lastinput' as reference for the random range (mid point)
function getlastinput(element) {
    return element.getAttribute('lastinput');
};

function browserDetection() {
    var browser = {
        name: navigator.appName,
        version: parseInt(navigator.appVersion, 10),
        fullVersion: '' + parseFloat(navigator.appVersion)
    }
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var nameOffset, verOffset, ix;
    // In Opera 15+, the true version is after "OPR/"
    if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
        browser.name = "Opera";
        browser.fullVersion = nAgt.substring(verOffset + 4);
    }
    // In older Opera, the true version is after "Opera" or after "Version"
    else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browser.name = "Opera";
        browser.fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1) browser.fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browser.name = "Microsoft Internet Explorer";
        browser.fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browser.name = "Chrome";
        browser.fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browser.name = "Safari";
        browser.fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1) browser.fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browser.name = "Firefox";
        browser.fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browser.name = nAgt.substring(nameOffset, verOffset);
        browser.fullVersion = nAgt.substring(verOffset + 1);
        if (browser.name.toLowerCase() == browser.name.toUpperCase()) browser.name = navigator.appName;
    }
    // trim the browser.fullVersion string at semicolon/space if present
    if ((ix = browser.fullVersion.indexOf(";")) != -1) browser.fullVersion = browser.fullVersion.substring(0, ix);
    if ((ix = browser.fullVersion.indexOf(" ")) != -1) browser.fullVersion = browser.fullVersion.substring(0, ix);
    browser.version = parseInt('' + browser.fullVersion, 10);
    if (isNaN(browser.version)) {
        browser.fullVersion = '' + parseFloat(navigator.appVersion);
        browser.version = parseInt(navigator.appVersion, 10);
    }
    return browser;
};
var getURLQuery = function() {
    var queryString = window.location.search.substring(1);
    return queryResults = parseQuery(queryString);
};
window.parseBoolean = function(string) {
    var bool;
    bool = (function() {
        switch (false) {
            case string.toLowerCase() !== 'true':
                return true;
            case string.toLowerCase() !== 'false':
                return false;
        }
    })();
    if (typeof bool === "boolean") return bool;
    return void 0;
};
var filterObject = function(object, index) {
    var obj = {};
    for (let o in object) obj[o] = object[o][index];
    return obj;
}
// UNFINISHED
function sortObjArray(oArray, key) {
    return oArray.sort(function(a, b) {
        if (a.key > b.key) return 1;
        if (a.key < b.key) return -1;
        return 0; // a must be equal to b
    });
};

function getPatchName() {
    var hash = location.hash;
    var path = location.pathname;
    if (hash.indexOf('#') > -1) {
        hash = hash.substr(1);
        return hash.toLowerCase();
    } else {
        path = path.substr(path.lastIndexOf('/') + 1);
        path = path.replace(/\.[^/.]+$/, "");
        return path.toLowerCase();
    }
}

function Rescale(value, newMin, newMax, oldMin, oldMax) {
    let _min = oldMin || 0,
        _max = oldMax || 1;
    if (value < _min) value = _min;
    else if (value > _max) value = _max;
    return (value - _min) * (newMax - newMin) / (_max - _min) + newMin;
}

function arraySum(array) {
    const add = (a, b) => a + b;
    if (Array.isArray(array)) return array.reduce(add);
    return false;
};

function rangeZones(value, zones, range, weights) {
    let rng = (Array.isArray(range) && range.length == 2) ? range : [0, 1];
    if (Array.isArray(zones) && zones.length >= 2) {
        let nZ = zones.length - 1;
        if (arraySum(weights) === 1 && weights.length === nZ) {
            let rngSpan = rng[1] - rng[0];
            let incrWeights = [0];
            for (let i = 0; i < weights.length; i++) incrWeights.push(incrWeights[i] + weights[i]);
            for (let i = 1; i < zones.length; i++) {
                let rngLimits = [rng[0] + rngSpan * incrWeights[i - 1], rng[0] + rngSpan * incrWeights[i]];
                if (value >= rngLimits[0] && value <= rngLimits[1]) {
                    let newVal = Rescale(value, zones[i - 1], zones[i], rngLimits[0], rngLimits[1]);
                    return newVal;
                }
            }
            return value;
        } else {
            let incr = (rng[1] - rng[0]) / nZ;
            for (let i = 1; i < zones.length; i++) {
                let rngLimits = [rng[0] + (i - 1) * incr, rng[0] + i * incr];
                if (value >= rngLimits[0] && value <= rngLimits[1]) {
                    let newVal = Rescale(value, zones[i - 1], zones[i], rngLimits[0], rngLimits[1]);
                    return newVal;
                }
            }
            return value;
        }
    } else return value;
}
