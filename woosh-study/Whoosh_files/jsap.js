var LinkedStore = function (storeName) {
  // Store for semantic terms, each store holds its own data tree, Terms added as key/value paris to a root node
    var root = {};
    function objectToXML(obj, root, doc) {
      // Used if an object was passed as a term value
      var term;
      for (term in obj) {
        if (obj.hasOwnProperty(term)) {
          if (typeof obj[term] === "object") {
            var docNode;
            if (obj[term].toXML) docNode = obj[term].toXML(doc);
            else {
              docNode = doc.createElement(term);
              root.appendChild(docNode);
              if (obj[term].length) arrayToXML(obj[term], docNode, doc);
              else objectToXML(obj[term], docNode, doc);
            }
            root.appendChild(docNode);
          } else root.setAttribute(term, obj[term]);
        }
      }
    }
    function arrayToXML(arr, root, doc) {
        // Used to convert an array to a list of XML entries
        var all_numbers = true,all_strings = true,i, l = arr.length;
        for (i = 0; i < l; i++) {
          switch (typeof arr[i]) {
            case "string": all_numbers = false;
              break;
            case "number": all_strings = false;
              break;
            case "object": all_numbers = all_strings = false;
              break;
          }
        }
        if (all_numbers || all_strings) {
          for (i = 0; i < l; i++) root.setAttribute("index-" + i, arr[i]);// An array of numbers or strings
        } else {
          // An array of objects
        for (i = 0; i < l; i++) {
          var node = document.createElement("value");
          node.setAttribute("index", i);
          objectToXML(arr[i], node, doc);
          root.appendChild(node);
        }
      }
    }
    Object.defineProperties(this, {
      'name': {
        'get': function () { return storeName; },
        'set': function (name) {
            if (storeName === undefined) name = storeName;
            else throw ("Name is already set");
        }
      },
      'addTerm': {
          'value': function (term, value) {
              if (typeof term !== "string" && term.length === 0) throw ("term must be a string");
              root[term] = value;
          }
      },
      'addTerms': {
          'value': function (termsObject) {
              if (typeof termsObject !== "object") throw ("addTerms takes an object of term/value pairs");
              var term;
              for (term in termsObject) {
                  if (termsObject.hasOwnProperty(term)) this.addTerm(term, termsObject[term]);
              }
          }
      },
      'deleteTerm': {
          'value': function (term) {
              if (typeof term !== "string" && term.length === 0) throw ("term must be a string");
              root[term] = undefined;
          }
      },
      'getTerm': {
          'value': function (term) {
              if (typeof term !== "string" && term.length === 0) throw ("term must be a string");
              return root[term];
          }
      },
      'hasTerm': {
          'value': function (term) {
              if (typeof term !== "string" && term.length === 0) throw ("term must be a string");
              return root.hasOwnProperty(term);
          }
      },
      'toJSON': {
          'value': function () { return JSON.parse(JSON.stringify(root)); }
      },
      'toXML': {
        'value': function (doc) {
            var node;
            if (!doc) {
                doc = document.implementation.createDocument(null, storeName, null);
                node = doc.firstElementChild;
            } else node = doc.createElement(storeName);
            objectToXML(root, node, doc);
            return node;
        }
      }
    });
};
// Add getInputs to all AudioNodes to ease deployment
/*globals AudioNode, Worker, console, window, document, Promise, XMLHttpRequest */
/*eslint-env browser */
AudioNode.prototype.getInputs = function () { return [this];};
// This should simply define the BasePlugin from which custom plugins can be built from
var BasePlugin = function (factory, owner) {
  var inputList = [],outputList = [],pOwner = owner;
  this.context = factory.context;
  this.factory = factory;
  this.featureMap = new PluginFeatureInterface(this);
  this.parameters = new ParameterManager(this);
  this.addInput = function (node) {
    inputList.push(node);
    return inputList;
  };
  this.deleteInput = function (node) {
    var i = inputList.findIndex(function (e) { return e === this; }, node);
    if (i === -1) return false;
    inputList.splice(i, 1);
    return true;
  };
  this.addOutput = function (node) {
    outputList.push(node);
    return this.outputs;
  };
  this.deleteOutput = function (node) {
    var i = outputList.findIndex(function (e) { return e === this; }, node);
    if (i === -1) return false;
    outputList.splice(i, 1);
    return true;
  };
  Object.defineProperties(this, {
    "numInputs": {
      get: function () { return inputList.length; },
      set: function () { throw ("Cannot set the number of inputs of BasePlugin"); }
    },
    "numOutputs": {
      get: function () { return outputList.length; },
      set: function () { throw ("Cannot set the number of outputs of BasePlugin"); }
    },
    "numParameters": {
      get: function () { return this.parameters.parameters.length; },
      set: function () { throw ("Cannot set the number of parameters of BasePlugin"); }
    },
    "owner": {
      get: function () { return pOwner; },
      set: function (owner) {
        if (typeof owner === "object") pOwner = owner;
        return pOwner;
      }
    },
    "inputs": {
      get: function (index) { return inputList; },
      set: function () { throw ("Illegal attempt to modify BasePlugin"); }
    },
    "outputs": {
      get: function (index) { return outputList; },
      set: function () { throw ("Illegal attempt to modify BasePlugin"); }
    }
  });
};
BasePlugin.prototype.connect = function (dest) { this.outputs[0].connect(dest.inpt ? dest.input : dest);};
BasePlugin.prototype.disconnect = function (dest) {
  if (dest === undefined) this.outputs[0].disconnect();
  else this.outputs[0].disconnect(dest.input ? dest.input : dest);
};
BasePlugin.prototype.getInputs = function () { return this.inputs;};
BasePlugin.prototype.getOutputs = function () { return this.outputs;};
BasePlugin.prototype.start = function () {};
BasePlugin.prototype.stop = function () {};
BasePlugin.prototype.onloaded = function () {};
BasePlugin.prototype.onunloaded = function () {};
BasePlugin.prototype.deconstruct = function () {};
BasePlugin.prototype.getParameterNames = function () { return this.parameters.getParameterNames();};
BasePlugin.prototype.getParameterByName = function (name) { return this.parameters.getParameterByName(name);};
BasePlugin.prototype.getParameterObject = function () { return this.parameters.getParameterObject();};
BasePlugin.prototype.setParameterByName = function (name, value) { return this.parameters.setParameterByName(name, value);};
BasePlugin.prototype.setParametersByObject = function (object) {
  // Set a parameter by passing a paired tuple object of the parameter name with the value
  // For instance, the Volume Control could use object = {volume: 0.5}
  // The LowPass could use object = {gain: 0.5, frequency: 1000, Q: 1.3}
  return this.parameters.setParametersByObject(object);
};
var ParameterManager = function (owner) {
    var parameterList = [];
    function findParameter(name) { return parameterList.find(function (e) { return e.name === name; }); }
    function findParameterIndex(name) { return parameterList.findIndex(function (e) { return e.name === name; }); }
    function buildParameterObject() {
        var obj = {};
        parameterList.forEach(function (e) { obj[e.name] = e; });
        return obj;
    }
    function addParameter(param) {
        var exists = parameterList.findIndex(function (e) {
            return e === param;
        }, param);
        if (exists === -1) parameterList.push(param);
        return param;
    }
    function PluginParameter(owner, name, dataType) {
        var update, translate, trigger, audioParam, _ActionList = [];
        update = translate = function (v) { return v; };
        trigger = function () {};
        Object.defineProperties(this, {
          "name": { "value": name },
          "dataType": { "value": dataType }, //added this line - JR
          "owner": { "value": owner },
          "update": {
            "get": function () { return update; },
            "set": function (f) {
              if (typeof f !== "function") throw ("Must be a callback function");
              if (f(0) === undefined) throw ("Function must return a value");
              update = f;
            }
          },
          "translate": {
            "get": function () {  return translate; },
            "set": function (f) {
              if (typeof f !== "function") throw ("Must be a callback function");
              if (f(0) === undefined) throw ("Function must return a value");
              translate = f;
            }
          },
          "trigger": {
            "get": function () { return trigger; },
            "set": function (f) {
              if (typeof f !== "function") throw ("Must be a callback function");
              trigger = f;
            }
          },
          "bindToAudioParam": {
            "value": function (ap) {
              if (typeof ap !== "object" || ap.value === undefined) throw ("Must be an AudioParam object from an AudioNode");
              audioParam = ap;
            }
          },
          "boundAudioParam": { "get": function () { return audioParam; } },
          "actionList": { "value": _ActionList }
        });
    }
    function NumberParameter(owner, name, defaultValue, minimum, maximum) {
        PluginParameter.call(this, owner, name, "Number");
        var _value = defaultValue,  _stepSize;
        function addAction(v) {
            var entry = { 'time': new Date(),'value': v };
            this.actionList.push(entry);
        }
        Object.defineProperties(this, {
          "destroy": { "value": function () { owner = name = defaultValue = minimum = maximum = _value = _stepSize = undefined; }},
          "minimum": { "value": minimum },
          "maximum": { "value": maximum },
          "defaultValue": { "value": defaultValue },
          "value": {
              "get": function () {
                if (this.boundAudioParam) return this.translate(this.boundAudioParam.value);
                return _value;
              },
              "set": function (v) {
                  if (this.minimum) v = Math.max(v, this.minimum);
                  if (this.maximum) v = Math.min(v, this.maximum);
                  if (_stepSize) {
                      v = Math.round(v / _stepSize);
                      v = v * _stepSize;
                  }
                  if (this.boundAudioParam) this.boundAudioParam.value = this.update(v);
                  _value = v;
                  this.trigger();
              }
          },
          "stepSize": {
            "get": function () { return _stepSize; },
            "set": function (n) {
              if (!isFinite(n) || n < 0) throw ("Invalid step size");
              _stepSize = n;
            }
          }
        });
    }
    NumberParameter.prototype = Object.create(PluginParameter.prototype);
    NumberParameter.prototype.constructor = NumberParameter;
    function StringParameter(owner, name, defaultValue, maxLength) {
        PluginParameter.call(this, owner, name, "String");
        var _value = defaultValue;
        function addAction(v) {
          var entry = { 'time': new Date(),'value': v };
          this.actionList.push(entry);
        }
        Object.defineProperties(this, {
          "destroy": { "value": function () { owner = name = defaultValue = maxLength = _value = undefined; } },
          "maxLength": { "value": maxLength },
          "defaultValue": { "value": defaultValue },
          "value": {
              "get": function () {
                  if (this.boundAudioParam) return this.translate(this.boundAudioParam.value);
                  return _value;
              },
              "set": function (v) {
                if (maxLength) {
                  if (v.length > maxLength) throw ("String longer than " + maxLength + " characters");
                }
                if (this.boundAudioParam) this.boundAudioParam.value = this.update(v);
                _value = v;
                this.trigger();
              }
          }
        });
    }
    StringParameter.prototype = Object.create(PluginParameter.prototype);
    StringParameter.prototype.constructor = StringParameter;
    function ButtonParameter(owner, name) {
        PluginParameter.call(this, owner, name, "Button");
        var onclick = function () {};
        function addAction(v) {
            var entry = { 'time': new Date(),'value': "clicked" };
            this.actionList.push(entry);
        }
        Object.defineProperties(this, {
            "destroy": { "value": function () { owner = name = undefined; } },
            "onclick": {
                "get": function () { return onclick; },
                "set": function (f) {
                    if (typeof f !== "function") throw ("onclick must be a function");
                    onclick = f;
                }
            }
        });
    }
    ButtonParameter.prototype = Object.create(PluginParameter.prototype);
    ButtonParameter.prototype.constructor = ButtonParameter;
    function SwitchParameter(owner, name, defaultValue, minState, maxState) {
        PluginParameter.call(this, owner, name, "Switch"); //JR - Fixed
        var onclick = function () {};
        var _value = defaultValue;
        function addAction(v) {
            var entry = { 'time': new Date(),'value': v };
            this.actionList.push(entry);
        }
        function setV(v) {
            if (this.boundAudioParam) this.boundAudioParam.value = this.update(v);
            addAction(v);
            this.trigger();
            _value = v;
            return v;
        }
        Object.defineProperties(this, {
            "destroy": { "value": function () { owner = name = undefined; } },
            "defaultValue": { "value": defaultValue },
            "minState": { "value": minState },
            "maxState": { "value": maxState },
            "value": {
                "get": function () {
                    if (this.boundAudioParam) return this.translate(this.boundAudioParam.value);
                    return _value;
                },
                "set": function (v) {
                    if (v < minState) throw ("Set value is less than " + minState);
                    if (v > maxState) throw ("Set value is greater than " + maxState);
                    return setV(v);
                }
            },
            "increment": {
                "value": function () {
                    var v = _value++;
                    if (v > maxState) v = minState;
                    return setV(v);
                }
            },
            "deccrement": {
                "value": function () {
                    var v = _value--;
                    if (v < minState) v = maxState;
                    return setV(v);
                }
            }
        });
    }
    SwitchParameter.prototype = Object.create(PluginParameter.prototype);
    SwitchParameter.prototype.constructor = SwitchParameter;
    Object.defineProperties(this, {
      'createNumberParameter': {
        "value": function (name, defaultValue, minimum, maximum) {
          if (typeof name !== "string" || typeof defaultValue !== "number" || (minimum !== undefined && typeof minimum !== "number") || (maximum !== undefined && typeof maximum !== "number")) {
            throw ("Invlid constructor");
          }
          if (findParameterIndex(name) !== -1) throw ("Parameter with name '" + name + "' already exists");
          var param = new NumberParameter(owner, name, defaultValue, minimum, maximum);
          addParameter(param);
          return param;
        }
      },
      'createStringParameter': {
        "value": function (name, defaultValue, maxLength) {
          if (typeof name !== "string" || typeof defaultValue !== "number" || (maxLength !== undefined && typeof maxLength !== "number")) throw ("Invlid constructor");
          if (findParameterIndex(name) !== -1) throw ("Parameter with name '" + name + "' already exists");
          var param = new StringParameter(owner, name, defaultValue, maxLength);
          addParameter(param);
          return param;
        }
      },
      'createButtonParameter': {
        "value": function (name) {
          if (typeof name !== "string") throw ("Invalid constructor");
          if (findParameterIndex(name) !== -1) throw ("Parameter with name '" + name + "' already exists");
          var param = new ButtonParameter(owner, name);
          addParameter(param);
          return param;
        }
      },
      'createSwitchParameter': {
        "value": function (name, defaultValue, minState, maxState) {
          if (typeof name !== "string" || typeof defaultValue !== "number" || typeof minState !== "number" || typeof maxState !== "number") throw ("Invlid constructor");
          if (findParameterIndex(name) !== -1) { throw ("Parameter with name '" + name + "' already exists"); }
          var param = new SwitchParameter(owner, name, defaultValue, minState, maxState);
          addParameter(param);
          return param;
        }
      },
      'getParameterName': {
        'value': function () {
          var names = [], i;
          for (i = 0; i < parameterList.length; i++) names.push(parameterList[i].name);
          return names;
        }
      },
      'getParameterByName': { 'value': function (name) { return findParameter(name); } },
      'getParameterObject': { 'value': function () { return buildParameterObject(); } },
      'setParameterByName': {
        'value': function (n, v) {
          var parameter = findParameter(n);
          if (!parameter) return;
          parameter.value = v;
        }
      },
      'deleteParameter': {
        'value': function (o) {
          var index = parameterList.findIndex(function (e) { return e === o; }, o);
          if (index >= 0) {
            // Does exist
            parameterList.splice(index, 1);
            o.destroy();
            return true;
          }
          return false;
        }
      },
      'deleteAllParameters': {
        'value': function (o) {
          parameterList.forEach(function (e) { e.destroy(); });
          parameterList = [];
          return true;
        }
      },
      'setParametersByObject': {
        'value': function (object) {
          var key;
          for (key in object) {
            if (object.hasOwnProperty(key)) this.setParameterByName(key, object[key]);
          }
        }
      },
      'parameters': {
          'get': function () { return parameterList; },
          'set': function () { throw ("Cannot set read only array"); }
      }
    });
};
var PluginFeatureInterface = function (BasePluginInstance) {
    this.plugin = BasePluginInstance;
    this.Receiver = new PluginFeatureInterfaceReceiver(this, BasePluginInstance.factory.FeatureMap);
    this.Sender = new PluginFeatureInterfaceSender(this, BasePluginInstance.factory.FeatureMap);
    Object.defineProperty(this, "onfeatures", {
        'get': function () { return this.Receiver.onfeatures; },
        'set': function (func) {
            this.Receiver.onfeatures = func;
            return func;
        }
    });
};
var PluginFeatureInterfaceReceiver = function (FeatureInterfaceInstance, FactoryFeatureMap) {
  var c_features = function () {};
  this.requestFeatures = function (featureList) {
    var i;
    for (i = 0; i < featureList.length; i++) {
      this.requestFeaturesFromPlugin(featureList[i].plugin, {
        'outputIndex': featureList[i].outputIndex,'frameSize': featureList[i].frameSize,'features': featureList[i].features
      });
    }
  };
  this.requestFeaturesFromPlugin = function (source, featureObject) {
      if (source === undefined) throw ("Source plugin must be defined");
      if (featureObject === undefined) throw ("FeatureObject must be defined");
      if (typeof featureObject.outputIndex !== "number" || typeof featureObject.frameSize !== "number" || typeof featureObject.features !== "object") {
          throw ("Malformed featureObject");
      }
      FactoryFeatureMap.requestFeatures(FeatureInterfaceInstance.plugin, source, featureObject);
  };
  this.cancelFeaturesFromPlugin = function (source, featureObject) {
      if (source === undefined) throw ("Source plugin must be defined");
      if (featureObject === undefined) throw ("FeatureObject must be defined");
      if (typeof featureObject.outputIndex !== "number" || typeof featureObject.frameSize !== "number" || typeof featureObject.features !== "object") {
          throw ("Malformed featureObject");
      }
      FactoryFeatureMap.deleteFeatures(FeatureInterfaceInstance.plugin, source, featureObject);
  };
  this.cancelAllFeaturesFromPlugin = function (source) {
      if (source === undefined) throw ("Source plugin must be defined");
      FactoryFeatureMap.deleteFeatures(FeatureInterfaceInstance.plugin, source);
  };
  this.cancelAllFeatures = function () { FactoryFeatureMap.deleteFeatures(FeatureInterfaceInstance.plugin); };
  this.postFeatures = function (Message) {
    /* Called by the Plugin Factory with the feature message
      message = {'plugin': sourcePluginInstance,'outputIndex': outputIndex,'frameSize': frameSize,'features': {} JS-Xtract feature results object}  */
    if (typeof c_features === "function") c_features(Message);
  };
  Object.defineProperty(this, "onfeatures", {
    'get': function () { return c_features; },
    'set': function (func) {
      if (typeof func === "function") {
          c_features = func;
          return true;
      }
      return false;
    }
  });
};
var PluginFeatureInterfaceSender = function (FeatureInterfaceInstance, FactoryFeatureMap) {
    var OutputNode = function (parent, output, index) {
        var extractors = [];
        var Extractor = function (output, frameSize) {
          this.extractor = FeatureInterfaceInstance.plugin.factory.context.createAnalyser();
          this.extractor.fftSize = frameSize;
          output.connect(this.extractor);
          this.features = [];
          Object.defineProperty(this, "frameSize", { 'value': frameSize });
          function recursiveProcessing(base, list) {
            var l = list.length, i, entry;
            for (i = 0; i < l; i++) {
              entry = list[i];
              base[entry.name].apply(base, entry.parameters);
              if (entry.features && entry.features.length > 0) recursiveProcessing(base.result[entry.name], entry.features);
            }
          }
          function onaudiocallback(data) {
              //this === Extractor
              var message = {'numberOfChannels': 1,'results': []};
              recursiveProcessing(data, this.features);
              message.results[0] = { 'channel': 0,'results': JSON.parse(data.toJSON()) };
              this.postFeatures(data.length, message);
          }
          this.setFeatures = function (featureList) {
              this.features = featureList;
              if (this.features.length === 0) this.extractor.clearCallback();
              else this.extractor.frameCallback(onaudiocallback, this);
          };
      };
      var WorkerExtractor = function (output, frameSize) {
          function onaudiocallback(e) {
              var c, frames = [];
              for (c=0;c< e.inputBuffer.numberOfChannels; c++) frames[c] = e.inputBuffer.getChannelData(c);
              worker.postMessage({'state': 2,'frames': frames });
          }
          function response(msg) { this.postFeatures(frameSize, msg.data.response); }
          var worker = new Worker("jsap/feature-worker.js");
          worker.onerror = function (e) { console.error(e); };
          this.setFeatures = function (featureList) {
            var self = this;
            var configMessage = {
                'state': 1,
                'sampleRate': FeatureInterfaceInstance.plugin.factory.context.sampleRate,
                'featureList': featureList,'numChannels': output.numberOfOutputs,'frameSize': this.frameSize
            };
            this.features = featureList;
            if (featureList && featureList.length > 0) {
                worker.onmessage = function (e) {
                    if (e.data.state === 1) {
                        worker.onmessage = response.bind(self);
                        self.extractor.onaudioprocess = onaudiocallback.bind(self);
                    } else worker.postMessage(configMessage);
                };
                worker.postMessage({ 'state': 0 });
            } else this.extractor.onaudioprocess = undefined;
          };
          this.extractor = FeatureInterfaceInstance.plugin.factory.context.createScriptProcessor(frameSize, output.numberOfOutputs, 1);
          output.connect(this.extractor);
          this.extractor.connect(FeatureInterfaceInstance.plugin.factory.context.destination);
          Object.defineProperty(this, "frameSize", { 'value': frameSize });
        };
        this.addExtractor = function (frameSize) {
            var obj;
            if (window.Worker) obj = new WorkerExtractor(output, frameSize);
            else obj = new Extractor(output, frameSize);
            extractors.push(obj);
            Object.defineProperty(obj, "postFeatures", {
              'value': function (frameSize, resultsJSON) {
                var obj = { 'outputIndex': index,'frameSize': frameSize,'results': resultsJSON };
                this.postFeatures(obj);
              }.bind(this)
            });
            return obj;
        };
        this.findExtractor = function (frameSize) {
            var check = frameSize;
            return extractors.find(function (e) { return e.frameSize === check; });// This MUST be === NOT ===
        };
        this.deleteExtractor = function (frameSize) {};
    };
    var outputNodes = [];
    this.updateFeatures = function (featureObject) {
      // [] Output -> {} 'framesize' -> {} 'features'
      var o;
      for (o = 0; o < featureObject.length; o++) {
        if (outputNodes[o] === undefined) {
          if (o > FeatureInterfaceInstance.plugin.numOutputs) throw ("Requested an output that does not exist");
          outputNodes[o] = new OutputNode(FeatureInterfaceInstance.plugin, FeatureInterfaceInstance.plugin.outputs[o], o);
          Object.defineProperty(outputNodes[o], "postFeatures", {
            'value': function (resultObject) { this.postFeatures(resultObject); }.bind(this)
          });
        }
        var si;
        for (si = 0; si < featureObject[o].length; si++) {
          var extractor = outputNodes[o].findExtractor(featureObject[o][si].frameSize);
          if (!extractor) extractor = outputNodes[o].addExtractor(featureObject[o][si].frameSize);
          extractor.setFeatures(featureObject[o][si].featureList);
        }
      }
    };
    this.postFeatures = function (featureObject) {
      /* Called by the individual extractor instances:
          featureObject = {'frameSize': frameSize,'outputIndex': outputIndex,'results':[]} */
      FeatureInterfaceInstance.plugin.factory.FeatureMap.postFeatures({
        'plugin': FeatureInterfaceInstance.plugin.pluginInstance,
        'outputIndex': featureObject.outputIndex,'frameSize': featureObject.frameSize,'results': featureObject.results
      });
    };
    // Send to Factory
    FactoryFeatureMap.createSourceMap(this, FeatureInterfaceInstance.plugin.pluginInstance);
};
/* Attempts to create a graphical implementation. GUI is optional & can be accepted or ignored by the host */
var PluginUserInterface = function (BasePluginInstance, width, height) {
    this.processor = BasePluginInstance;
    this.root = document.createElement("div");
    if (width > 0) this.root.style.width = width + "px";
    if (height > 0) this.root.style.height = height + "px";
    this.dim = { width: width, height: height };
    this.intervalFunction = null;
    this.updateInterval = null;
    this.PluginParameterInterfaces = [];
    var PluginParameterInterfaceNode = function (DOM, PluginParameterInstance, processor, gui) {
      this.input = DOM;
      this.processor = processor;
      this.GUI = gui;
      this.AudioParam = PluginParameterInstance;
      this.handleEvent = function (event) { this.AudioParam.value = this.input.value; };
      this.input.addEventListener("change", this);
      this.input.addEventListener("mousemove", this);
      this.input.addEventListener("click", this);
    };
    this.createPluginParameterInterfaceNode = function (DOM, PluginParameterInstance) {
      var node = new PluginParameterInterfaceNode(DOM, PluginParameterInstance, this.processor, this);
      this.PluginParameterInterfaces.push(node);
      return node;
    };
    this.update = function () {};
};
PluginUserInterface.prototype.getRoot = function () { return this.root;};
PluginUserInterface.prototype.getDimensions = function () { return this.dim;};
PluginUserInterface.prototype.getWidth = function () { return this.dim.width;};
PluginUserInterface.prototype.getHeight = function () { return this.dim.height;};
PluginUserInterface.prototype.beginCallbacks = function (ms) {
    // Any registered callbacks are started by the host
    if (ms === undefined) ms = 250; //Default of 250ms update period
    if (this.intervalFunction === null) {
        this.updateInterval = ms;
        this.intervalFunction = window.setInterval(function () { this.update(); }.bind(this), 250);
    }
};
PluginUserInterface.prototype.stopCallbacks = function () {
    // Any registered callbacks are stopped by the host
    if (this.intervalFunction !== null) {
        window.clearInterval(this.intervalFunction);
        this.updateInterval = null;
        this.intervalFunction = null;
    }
};
PluginUserInterface.prototype.loadResource = function (url) {
    var p = new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function () {
            if (req.status === 200) resolve(req.response);
            else reject(Error(req.statusText));
        };
        req.onerror = function () { reject(Error("Network Error")); };
        req.send();
    });
    return p;
};
PluginUserInterface.prototype.clearGUI = function () {
  this.stopCallbacks();
  this.root.innerHTML = "";
};
// Defines master object for holding all plugins and communicating. Also handles creation and destruction of plugins
/*globals Promise, document, console, LinkedStore, Worker, window */
/*eslint-env browser */
var PluginFactory = function (context, dir) {
  var audio_context = context,subFactories = [],plugin_prototypes = [],pluginsList = [],
      currentPluginId = 0,audioStarted = false,script,self = this;
    /*  this.loadResource. Load a resource into the global namespace
        @param resourceObject: a JS object holding the following parameters:
            .url: URL of the resource
            .test: function to call, returns true if resource already loaded, false if not  */
    this.loadResource = function (resourceObject) {
      if (resourceObject) {
        if (typeof resourceObject.url !== "string") throw ("resourceObject.url must be a string");
        if (typeof resourceObject.test !== "function") throw ("resourceObject.test must be a function");
        var response = resourceObject.test();
        if (response !== false && response !== true) throw ("resourceObject.test must return true or false");
        switch (resourceObject.type) {
          case "CSS":
          case "css":
            return new Promise(function (resolve, reject) {
              var css = document.createElement("link");
              css.setAttribute("rel", "stylesheet");
              css.setAttribute("type", "text/css");
              css.setAttribute("href", resourceObject.url);
              document.getElementsByTagName("head")[0].appendChild(css);
              resolve(resourceObject);
            });
          case "javascript":
          case "JavaScript":
          case "Javascript":
          case undefined:
            if (!response) {
              return loadResource(resourceObject).then(function (resourceObject) {
                if (typeof resourceObject.returnObject === "string") {
                  var returnObject;
                  if (window.hasOwnProperty(resourceObject.returnObject)) return window[resourceObject.returnObject];
                  return false;
                } else return true;
              });
            } else {
              return new Promise(function (resolve, reject) {
                if (typeof resourceObject.returnObject === "string") {
                  if (window.hasOwnProperty(resourceObject.returnObject)) resolve(window[resourceObject.returnObject]);
                  else reject(false);
                } else resolve(true);
              });
            }
            break;
          default:
            console.error(resourceObject.type);
            break;
        }
      }
    };
    this.loadPluginScript = function (resourceObject) {
      if (resourceObject) {
        if (typeof resourceObject.returnObject !== "string") throw ("resourceObject.returnObject must be the name of the prototype function");
        return this.loadResource(resourceObject).then(function (plugin) { return self.addPrototype(plugin); });
      }
    };
    function loadResource(resourceObject) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement("script");
            script.src = resourceObject.url;
            document.getElementsByTagName("head")[0].appendChild(script);
            script.onload = function () { resolve(resourceObject); };
        });
    }
    if (dir === undefined) { dir = "jsap/"; }
    var PluginInstance = function (id, plugin_node) {
      this.next_node = undefined;
      this.reconnect = function (new_next) {
        if (new_next !== this.next_node) {
          if (this.next_node !== undefined && typeof this.next_node.getInputs === "function") plugin_node.disconnect(this.next_node.getInputs()[0]);
          this.next_node = new_next;
          if (this.next_node !== undefined && typeof this.next_node.getInputs === "function") plugin_node.connect(this.next_node.getInputs()[0]);
          return true;
        }
        return false;
      };
      this.disconnect = function () {  this.reconnect(undefined); };
      this.destory = function () { plugin_node.destroy(); };
      Object.defineProperties(this,{
        'id':{ 'value': id },'node':{'value':plugin_node },
        'getInputs':{ 'value': function () { return plugin_node.getInputs(); } },
        'getOutputs':{ 'value': function () { return plugin_node.getOutputs(); } }
      });
    };
    var PluginPrototype = function (proto) {
      Object.defineProperties(this,{'name':{value:proto.prototype.name},'proto':{value:proto},'version':{value:proto.prototype.version},'uniqueID':{value:proto.prototype.uniqueID}});
      this.createPluginInstance = function (owner) {
        if (!this.ready) throw ("Plugin Not Read");
        var plugin = new proto(this.factory, owner);
        var node = new PluginInstance(currentPluginId++, plugin);
        var basePluginInstance = plugin;
        Object.defineProperties(plugin, {
          'pluginInstance': {'value': node},
          'prototypeObject': {'value': this},
          'name': {value: proto.prototype.name},
          'version': {value: proto.prototype.version},
          'uniqueID': {value: proto.prototype.uniqueID},
          'SesionData': {value: this.factory.SessionData},
          'UserData': {value: this.factory.UserData}
        });
        Object.defineProperty(node, "prototypeObject", {'value': this});
        this.factory.registerPluginInstance(node);
        return node;
      };
      function loadResourceChain(resourceObject, p) {
        if (!p) {
          var k = loadResource(resourceObject);
          k.then(function (resourceObject) {
            if (resourceObject.resources !== undefined && resourceObject.resources.length > 0) {
              for (var i = 0; i < resourceObject.resources.length; i++) k = loadResourceChain(resourceObject.resources[i], k);
            }
          });
          return k;
        } else return p.then(loadResource(resourceObject));
      }
      function loadStylesheet(url) {
        var css = document.createElement("link");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("type", "text/css");
        css.setAttribute("href", url);
        document.getElementsByTagName("head")[0].appendChild(css);
      }
      function recursiveGetTest(resourceObject) {
        if (resourceObject.hasOwnProperty("length") && resourceObject.length > 0) {
          return recursiveGetTest(resourceObject[resourceObject.length - 1]);
        } else if (resourceObject.hasOwnProperty("resources")) return recursiveGetTest(resourceObject.resources);
        else return resourceObject.test;
      }
      var resourcePromises = [];
      if (proto.prototype.resources) {
        for (var i = 0; i < proto.prototype.resources.length; i++) {
          var resource = proto.prototype.resources[i];
          switch (resource.type) {
            case "css":
            case "CSS":
            loadStylesheet(resource.url);
              break;
            case "javascript":
            case "Javascript":
            case "JavaScript":
            case "JS":
              var object = {
                'promise': loadResourceChain(resource),
                'state': 0,
                'complete': function () { this.state = 1; },
                'test': recursiveGetTest(resource)
              };
              object.promise.then(object.complete.bind(object));
              resourcePromises.push(object);
              break;
            default:
              console.error(resource.type);
              break;
          }
        }
      }
      this.getResourcePromises = function () { return resourcePromises; };
      this.ready = function () {
        var state = true;
        for (var i = 0; i < resourcePromises.length; i++) {
          if (resourcePromises[i].state !== 1 || !resourcePromises[i].test()) {
            state = false;
            break;
          }
        }
        return state;
      };
    };
    this.addPrototype = function (plugin_proto) {
      var testObj = {'proto':plugin_proto,'name':plugin_proto.prototype.name,'version':plugin_proto.prototype.version,'uniqueID':plugin_proto.prototype.uniqueID};
      if (typeof plugin_proto !== "function") {throw ("The Prototype must be a function!");}
      if (typeof testObj.name !== "string" || testObj.name.length === 0) {throw ("Malformed plugin. Name not defined");}
      if (typeof testObj.version !== "string" || testObj.version.length === 0) {throw ("Malformed plugin. Version not defined");}
      if (typeof testObj.uniqueID !== "string" || testObj.uniqueID.length === 0) {throw ("Malformed plugin. uniqueID not defined");}
      var obj = plugin_prototypes.find(function (e) {
        var param,match = 0;
        for (param in this) {
          if (e[param] === this[param]) match++;
        }
        return match === 4;
      }, testObj);
      if (!obj) { //plugin must be unique
        obj = new PluginPrototype(plugin_proto);
        plugin_prototypes.push(obj);
        Object.defineProperties(obj, { 'factory': { 'value': this } });
      }
      return obj;
    };
    this.getPrototypes = function () { return plugin_prototypes; };
    this.getAllPlugins = function () { return pluginsList; };
    this.getAllPluginsObject = function () {
      var i,obj = {'factory':this,'subFactories':[]};
      for (i=0;i<subFactories.length;i++) obj.subFactories.push({'subFactory':subFactories[i],'plugins':subFactories[i].getPlugins() });
      return obj;
    };
    this.createSubFactory = function (chainStart, chainStop, parallel) {
      var node = new PluginSubFactory(this, chainStart, chainStop, parallel);
      Object.defineProperties(node,{ 'SessionData':{ value:this.SessionData},'UserData':{ value:this.UserData} });
      subFactories.push(node);
      return node;
    };
    this.registerPluginInstance = function (instance) {
      if (pluginsList.find(function (p) { return p === this;}, instance)) {throw ("Plugin Instance not unique"); }
      pluginsList.push(instance);
      if (audioStarted) instance.node.start.call(instance.node);
      return true;
    };
    this.deletePlugin = function (id) { if (id >= 0 && id < pluginsList.length) pluginsList.splice(id, 1); };
    this.audioStart = function () {
      if (!audioStarted) {
        pluginsList.forEach(function (n) { n.node.start.call(n.node); });
        audioStarted = true;
      }
    };
    this.audioStop = function () {
      if (audioStarted) {
        pluginsList.forEach(function (n) { n.node.stop.call(n.node); });
        audioStarted = false;
      }
    };
    Object.defineProperty(this, "context", {
      'get': function () { return audio_context; },
      'set': function () {}
    });
    this.FeatureMap = function () {
      var Mappings = [];
      var SourceMap = function (Sender, pluginInstace) {
        var Mappings = [];
        this.getSourceInstance = function () { return pluginInstace; };
        this.getSender = function () { return Sender; };
        function updateSender() {
          function recursiveFind(featureList) {
            var f, list = [];
            for (f = 0; f < featureList.length; f++) {
              var featureNode = list.find(function (e) { return e.name === this.name; }, featureList[f]);
              if (!featureNode || (featureList[f].parameters && featureList[f].parameters.length !== 0)) {
                featureNode = { 'name': featureList[f].name,'parameters': featureList[f].parameters,'features': [] };
                list.push(featureNode);
              }
              if (featureList[f].features && featureList[f].features.length > 0) featureNode.features = recursiveFind(featureList[f].features);
            }
            return list;
          }
          var i, outputList = [];
          for (i = 0; i < Mappings.length; i++) {
            if (outputList[Mappings[i].outputIndex] === undefined) outputList[Mappings[i].outputIndex] = [];
              var frameList = outputList[Mappings[i].outputIndex].find(function (e) {
                return e.frameSize === this.frameSize;
              }, Mappings[i]);
              if (!frameList) {
                frameList = { 'frameSize': Mappings[i].frameSize,'featureList': undefined };
                outputList[Mappings[i].outputIndex].push(frameList);
              }
              frameList.featureList = recursiveFind(Mappings[i].getFeatureList());
            }
            Sender.updateFeatures(outputList);
          }
          this.requestFeatures = function (requestorInstance, featureObject) {
            var map = Mappings.find(function (e) {
              return (e.outputIndex === this.outputIndex && e.frameSize === this.frameSize);
            }, featureObject);
            if (!map) {
              map = {
                'outputIndex': featureObject.outputIndex,'frameSize': featureObject.frameSize,'requestors': [],
                'getFeatureList': function () {
                  var F = [],i;
                  for (i = 0; i < this.requestors.length; i++) F = F.concat(this.requestors[i].getFeatureList());
                  return F;
                }
              };
              Mappings.push(map);
            }
            var requestor = map.requestors.find(function (e) { return e.getRequestorInstance() === this; }, requestorInstance);
            if (!requestor) {
              requestor = new RequestorMap(requestorInstance);
              map.requestors.push(requestor);
            }
            requestor.addFeatures(featureObject);
            updateSender();
          };
          this.findFrameMap = function (outputIndex, frameSize) {
            return Mappings.find(function (e) {
              return (e.outputIndex === outputIndex && e.frameSize === frameSize);
            });
          };
          this.cancelFeatures = function (requestorInstance, featureObject) {
            if (featureObject === undefined) {
              Mappings.forEach(function (map) {
                var requestorIndex = map.requestors.findIndex(function (e) {
                  return e.getRequestorInstance() === requestorInstance;
                });
                if (requestorIndex >= 0) map.requestors.splice(requestorIndex, 1);
              });
            } else {
              var map = Mappings.find(function (e) {
                return (e.outputIndex === this.outputIndex && e.frameSize === this.frameSize);
              }, featureObject);
              if (!map) return;
              var requestor = map.requestors.find(function (e) {
                return e.getRequestorInstance() === this;
              }, requestorInstance);
              if (!requestor) return;
              requestor.deleteFeatures(featureObject);
            }
            updateSender();
          };
        };
        var RequestorMap = function (pluginInstance) {
            var Features = [];
            var Receiver = pluginInstance.node.featureMap.Receiver;
            this.getRequestorInstance = function () { return pluginInstance; };
            function recursivelyAddFeatures(rootArray, featureObject) {
              var i;
              for (i = 0; i < featureObject.length; i++) {
                // Check we have not already listed the feature
                var featureNode = rootArray.find(function (e) { return e.name === this.name; }, featureObject[i]);
                if (!featureNode) {
                  featureNode = { 'name':featureObject[i].name,'parameters':featureObject[i].parameters,'features':[] };
                  rootArray.push(featureNode);
                }
                if (featureObject[i].features !== undefined && featureObject[i].features.length > 0) {
                  recursivelyAddFeatures(featureNode.features, featureObject[i].features);
                }
              }
            }
            function recursivelyDeleteFeatures(rootArray, featureObject) {
              var l = featureObject.length,i;
              for (i = 0; i < l; i++) {
                // Find the feature
                var index = rootArray.find(function (e) { return e.name === this.name; }, featureObject[i]);
                if (index >= 0) {
                  if (featureObject[index].features && featureObject[index].features.length > 0) recursivelyDeleteFeatures(rootArray[index].features,featureObject[index].features);
                  else Features.splice(index, 0);
                }
              }
            }
            this.addFeatures = function (featureObject) { recursivelyAddFeatures(Features, featureObject.features); };
            this.deleteFeatures = function (featureObject) { recursivelyDeleteFeatures(Features, featureObject.features); };
            this.getFeatureList = function () { return Features; };
            this.postFeatures = function (featureObject) {
              var message = {'plugin':featureObject.plugin,'outputIndex':featureObject.outputIndex,'frameSize':featureObject.frameSize,
                'features':{'numberOfChannels':featureObject.results.numberOfChannels,'results':[]}
              },
              i;
              function recursivePostFeatures(rootNode, resultsList, FeatureList) {
                // Add the results tree where necessary
                var i, param;
                function ao(e) { return e.name === param; }
                for (param in resultsList) {
                  if (resultsList.hasOwnProperty(param)) {
                    var node = FeatureList.find(ao);
                    if (node) {
                      if (resultsList[param].constructor === Object && node.results) {
                        rootNode[param] = {};
                        recursivePostFeatures(rootNode[param], resultsList[param], node.results);
                      } else rootNode[param] = resultsList[param];
                    }
                  }
                }
              }
              // Perform recursive map for each channel
              for (i = 0; i < featureObject.results.numberOfChannels; i++) {
                message.features.results[i] = {};
                recursivePostFeatures(message.features.results[i], featureObject.results.results[i].results, Features);
              }
              pluginInstance.node.featureMap.Receiver.postFeatures(message);
            };
        };
        function findSourceIndex(Sender) {
          return Mappings.findIndex(function (e) { return e.getSender() === this; }, Sender);
        }
        // GENERAL INTERFACE
        this.createSourceMap = function (Sender, pluginInstance) {
          var node = new SourceMap(Sender, pluginInstance);
          Mappings.push(node);
          return node;
        };
        this.deleteSourceMap = function (Sender) {
          var index = findSourceIndex(Sender);
          if (index === -1) throw ("Could not find the source map for the plugin");
          Mappings.splice(index, 1);
        };
        this.getPluginSender = function (plugin) {
          if (plugin.constructor === PluginInstance) plugin = plugin.node;
          return plugin.featureMap.Sender;
        };
        this.requestFeatures = function (requestor, source, featureObject) {
            if (requestor.constructor !== PluginInstance) requestor = requestor.pluginInstance;
            // Get the source map
            var sourceMap = Mappings[findSourceIndex(source)];
            if (!sourceMap) {
              sourceMap = Mappings[findSourceIndex(this.getPluginSender(source))];
              if (!sourceMap) throw ("Could not locate source map");
            }
            sourceMap.requestFeatures(requestor, featureObject);
        };
      this.deleteFeatures = function (requestor, source, featureObject) {
        if (requestor.constructor !== PluginInstance) requestor = requestor.pluginInstance;
        if (source === undefined) Mappings.forEach(function (sourceMap) { sourceMap.cancelFeatures(requestor); });
        else {
          // Get the source map
          var sourceMap = Mappings[findSourceIndex(source)];
          if (!sourceMap) {
            sourceMap = Mappings[findSourceIndex(this.getPluginSender(source))];
            if (!sourceMap) throw ("Could not locate source map");
          }
          sourceMap.cancelFeatures(requestor, featureObject);
        }
      };
      this.getFeatureList = function (requestor, source) {};
      this.postFeatures = function (featureObject) {
        // Receive from the Sender objects
        // Trigger distributed search for results transmission
        // First get the instance mapping for output/frame
        var source = Mappings[findSourceIndex(featureObject.plugin)];
        if (!source) {
          source = Mappings[findSourceIndex(this.getPluginSender(featureObject.plugin))];
          if (!source) { throw ("Plugin Instance not loaded!"); }
        }
        var frameMap = source.findFrameMap(featureObject.outputIndex, featureObject.frameSize);
        // Send the feature object to the RequestorMap object to handle comms
        frameMap.requestors.forEach(function (e) { e.postFeatures(this); }, featureObject);
      };
    };
    this.FeatureMap = new this.FeatureMap();
    Object.defineProperty(this.FeatureMap, "factory",{'value':this });
    var stores = [];
    this.createStore = function (storeName) {
      var node = new LinkedStore(storeName);
      stores.push(node);
      return node;
    };
    this.getStores = function () { return stores; };
    this.findStore = function (storeName) { return stores.find(function (a) { return a.name === storeName; }); };
    // Build the default Stores
    this.SessionData = new LinkedStore("Session");
    this.UserData = new LinkedStore("User");
    // Created for the input of each SubFactory plugin chain
    var SubFactoryFeatureSender = function (owner, FactoryFeatureMap) {
      var OutputNode = function (parent, output) {
        var extractors = [];
        var Extractor = function (output, frameSize) {
            this.extractor = output.context.createAnalyser();
            this.extractor.fftSize = frameSize;
            output.connect(this.extractor);
            this.features = [];
            Object.defineProperty(this, "frameSize", {'value':frameSize});
            function recursiveProcessing(base, list) {
              var l = list.length, i, entry;
              for (i = 0; i < l; i++) {
                entry = list[i];
                base[entry.name].apply(base, entry.parameters);
                if (entry.features && entry.features.length > 0) recursiveProcessing(base.result[entry.name], entry.features);
              }
            }
            function onaudiocallback(data) {
              //this === Extractor
              var message = {'numberOfChannels':1,'results':[]};
              recursiveProcessing(data, this.features);
              message.results[0] = { 'channel':0,'results':JSON.parse(data.toJSON()) };
              this.postFeatures(data.length, message);
            }
            this.setFeatures = function (featureList) {
              this.features = featureList;
              if (this.features.length === 0) this.extractor.clearCallback();
              else this.extractor.frameCallback(onaudiocallback, this);
            };
            this.rejoinExtractor = function () { output.connect(this.extractor); };
        };
        var WorkerExtractor = function (output, frameSize) {
            function onaudiocallback(e) {
              var c, frames = [];
              for (c = 0; c < e.inputBuffer.numberOfChannels; c++) frames[c] = e.inputBuffer.getChannelData(c);
              worker.postMessage({'state':2,'frames':frames });
            }
            function response(msg) {this.postFeatures(frameSize, msg.data.response); }
            var worker = new Worker("jsap/feature-worker.js");
            worker.onerror = function (e) { console.error(e); };
            this.setFeatures = function (featureList) {
              var self = this;
              var configMessage = {
                'state':1,'sampleRate':output.context.sampleRate,'featureList':featureList,
                'numChannels':output.numberOfOutputs,'frameSize':this.frameSize
              };
              this.features = featureList;
              if (featureList && featureList.length > 0) {
                  worker.onmessage = function (e) {
                      if (e.data.state === 1) {
                          worker.onmessage = response.bind(self);
                          self.extractor.onaudioprocess = onaudiocallback.bind(self);
                      } else worker.postMessage(configMessage);
                  };
                  worker.postMessage({'state':0 });
              } else this.extractor.onaudioprocess = undefined;
            };
            this.rejoinExtractor = function () { output.connect(this.extractor); };
            this.extractor = output.context.createScriptProcessor(frameSize, output.numberOfOutputs, 1);
            output.connect(this.extractor);
            this.extractor.connect(output.context.destination);
            Object.defineProperty(this, "frameSize", {  'value':frameSize });
        };
        this.addExtractor = function (frameSize) {
          var obj;
          if (window.Worker)  obj = new WorkerExtractor(output, frameSize);
          else obj = new Extractor(output, frameSize);
          extractors.push(obj);
          Object.defineProperty(obj, "postFeatures", {
            'value':function (frameSize, resultsJSON) {
              var obj = { 'outputIndex':0,'frameSize':frameSize,'results':resultsJSON };
              this.postFeatures(obj);
            }.bind(this)
          });
          return obj;
        };
        this.findExtractor = function (frameSize) {
          var check = frameSize;
          return extractors.find(function (e) {
            return Number(e.frameSize) === Number(check);// This MUST be == NOT ===
          });
        };
        this.rejoinExtractors = function () { extractors.forEach(function (e) { e.rejoinExtractor(); }); };
        this.deleteExtractor = function (frameSize) {};
      };
      var outputNodes;
      this.updateFeatures = function (featureObject) {
        var o;
        for (o = 0; o < featureObject.length; o++) {
          if (outputNodes === undefined) {
            if (o > 1) throw ("Requested an output that does not exist");
            outputNodes = new OutputNode(owner, owner.chainStart);
            Object.defineProperty(outputNodes, "postFeatures", {
              'value':function (resultObject) { this.postFeatures(resultObject); }.bind(this)
            });
          }
          var si;
          for (si = 0; si < featureObject[o].length; si++) {
            var extractor = outputNodes.findExtractor(featureObject[o][si].frameSize);
            if (!extractor) extractor = outputNodes.addExtractor(featureObject[o][si].frameSize);
            extractor.setFeatures(featureObject[o][si].featureList);
          }
        }
      };
      this.rejoinExtractors = function () { if (outputNodes) outputNodes.rejoinExtractors(); };
      this.postFeatures = function (featureObject) {
        /*  Called by individual extractor instances:
            featureObject = {'frameSize':frameSize,'outputIndex':outputIndex,'results':[]} */
        FactoryFeatureMap.postFeatures({'plugin':this,'outputIndex':featureObject.outputIndex,'frameSize':featureObject.frameSize,'results':featureObject.results});
      };
      FactoryFeatureMap.createSourceMap(this, undefined);// Send to Factory
    };
    var PluginSubFactory = function (PluginFactory, chainStart, chainStop, parallel) {
        var plugin_list = [],pluginChainStart = chainStart,
            pluginChainStop = chainStop,factoryName = "",state = 1,
            chainStartFeature = new SubFactoryFeatureSender(this, PluginFactory.FeatureMap),
            semanticStores = [],
            parallel = parallel || false;
        this.parent = PluginFactory;
        if(!parallel)
          pluginChainStart.disconnect();
        pluginChainStart.connect(chainStop);
        this.PluginData = new LinkedStore("Plugin");
        this.featureSender = chainStartFeature;
        this.getFeatureChain = function () { };
        function rebuild() {
          var i = 0,l = plugin_list.length - 1;
          while (i < l) {
            var currentNode = plugin_list[i++];
            var nextNode = plugin_list[i];
            currentNode.reconnect(nextNode);
          }
        }
        function isolate() { plugin_list.forEach(function (e) { e.disconnect(); }); }
        function cutChain() {
          if (plugin_list.length > 0) {
              pluginChainStart.disconnect(plugin_list[0].node.getInputs()[0]);
              plugin_list[plugin_list.length - 1].node.getOutputs()[0].disconnect(pluginChainStop);
          } else pluginChainStart.disconnect(pluginChainStop);
        }
        function joinChain() {
          if (plugin_list.length > 0) {
              pluginChainStart.connect(plugin_list[0].node.getInputs()[0]);
              plugin_list[plugin_list.length - 1].node.getOutputs()[0].connect(pluginChainStop);
          } else pluginChainStart.connect(pluginChainStop);
          chainStartFeature.rejoinExtractors();
        }
        this.getPrototypes = function () { return this.parent.getPrototypes(); };
        this.getFactory = function () { return this.parent; };
        this.destroy = function () {
          var i;
          for (i = 0; i < plugin_list.length; i++) this.destroyPlugin(plugin_list[i]);
          pluginChainStart.disconnect();
          pluginChainStart.connect(pluginChainStop);
        };
        // Plugin creation / destruction
        this.createPlugin = function (prototypeObject) {
            var node, last_node;
            if (state === 0) throw ("SubFactory has been destroyed! Cannot add new plugins");
            cutChain();
            node = prototypeObject.createPluginInstance(this);
            plugin_list.push(node);
            isolate();
            rebuild();
            joinChain();
            node.node.onloaded.call(node.node);
            return node;
        };
        this.destroyPlugin = function (plugin_object) {
            if (state === 0) return;
            var index = this.getPluginIndex(plugin_object);
            if (index >= 0) {
              cutChain();
              plugin_object.node.stop.call(plugin_object.node);
              plugin_object.node.onloaded.call(plugin_object.node);
              plugin_object.node.deconstruct.call(plugin_object.node);
              plugin_list.splice(index, 1);
              this.parent.deletePlugin(plugin_object.id);
              isolate();
              rebuild();
              joinChain();
            }
        };
        this.getPlugins = function () { return plugin_list; };
        this.getAllPlugins = function () { return this.parent.getAllPluginsObject(); };
        this.getPluginIndex = function (plugin_object) {
          if (state === 0) return;
          var index = plugin_list.findIndex(function (element, index, array) {
            if (element === this) return true;
            return false;
          }, plugin_object);
          return index;
        };
        this.movePlugin = function (plugin_object, new_index) {
          if (state === 0) return;
          var obj, index = this.getPluginIndex(plugin_object),holdLow, holdHigh, i;
          if (index >= 0) {
            cutChain();
            isolate();
            obj = plugin_list.splice(index, 1);
            plugin_object.node.onunloaded.call(plugin_object.node);
            if (new_index === 0) plugin_list = obj.concat(plugin_list);
            else if (new_index >= plugin_list.length) plugin_list = plugin_list.concat(obj);
            else {
              holdLow = plugin_list.slice(0, new_index);
              holdHigh = plugin_list.slice(new_index);
              plugin_list = holdLow.concat(obj.concat(holdHigh));
            }
            rebuild();
            joinChain();
            plugin_object.node.onloaded.call(plugin_object.node);
          }
        };
        Object.defineProperty(this, "name", {
          get: function () { return factoryName; },
          set: function (name) {
            if (typeof name === "string") factoryName = name;
            return factoryName;
          }
        });
        Object.defineProperties(this, {'chainStart': {'value': chainStart},'chainStop': {'value': chainStop} });
    };
};
