/* Audio Framework Handling Functions*/

/** PLUGINS **/
// Add a new plugin to a chosen chain
function addPlugin (pluginPrototype, fxChain, how) {
  if (how === 'parallel'){
    var newChain = fxChain.getFactory().createSubFactory(fxChain.chainStart, fxChain.chainStop, true);
    return newChain.createPlugin(pluginPrototype);
  } else {
    return fxChain.createPlugin(pluginPrototype);
  }
}

// Get plugin(s) from chain
function getPlugin (pluginId, chain) {
  if (chain.constructor.name === "PluginSubFactory") var plugins = chain.getPlugins();
  else if (chain.constructor.name === "PluginFactory") var plugins = chain.getAllPlugins();
  if (Array.isArray(pluginId)) return plugins.filter(function(value) { return (value.node.uniqueID == pluginId[0] && value.id == pluginId[1]); });// [uniqueID, id]
  else if (typeof pluginId == "string") return plugins.filter(function(value) { return value.node.uniqueID == pluginId; });// uniqueID
  else if (Number.isInteger(pluginId)) return plugins.filter(function(value) { return value.id == pluginId; });// id
  else return [];
};

// Get plugin's parameters
function getPluginParameterValues (plugin, type) {
    var paramObj = plugin.node.getParameterObject();
    for (var param in paramObj) {
      switch(type) {
        default:
        case 'value':
          paramObj[param] = paramObj[param].value;
          break;
        case 'max':
          if(paramObj[param].constructor.name == "NumberParameter") paramObj[param] = paramObj[param].maximum;
          else delete paramObj[param];
          break;
        case 'min':
          if(paramObj[param].constructor.name == "NumberParameter") paramObj[param] = paramObj[param].minimum;
          else delete paramObj[param];
          break;
        case 'default': paramObj[param] = paramObj[param].defaultValue;
          break;
      };
    };
    return paramObj;
};

/** PARAMETERS OBJECT **/
// Update parameters object with the current state of the different plugins
function updateParametersObjectState (pObj, Factory, format) {
  for (var pluginObj in pObj) {
    for (var pluginId in pObj[pluginObj]) {
      var plugin = getPlugin(parseInt(pluginId), Factory)[0];
      if(plugin != undefined && plugin.constructor.name == "PluginInstance") Object.assign(pObj[pluginObj][pluginId],getPluginParameterValues(plugin));
    };
  };
  if (format == "string") return JSON.stringify(pObj);
  else  return pObj;
};

function getParametersObjectInfo (pObj, Factory, format) {
  var infoObj = {};
  for (var pluginObj in pObj) {
    for (var pluginId in pObj[pluginObj]) {
      var plugin = getPlugin(parseInt(pluginId), Factory)[0];
      if(plugin != undefined && plugin.constructor.name == "PluginInstance") {
        var parameters = plugin.node.getParameterObject();
        for (var p in parameters) {
          switch(parameters[p].constructor.name) {
            default:
            case 'NumberParameter':
              parameters[p] = {
                type: parameters[p].constructor.name,
                max: parameters[p].maximum,
                min: parameters[p].minimum,
                default: parameters[p].defaultValue,
                stepSize: parameters[p].stepSize
              };
              break;
            case 'ButtonParameter':
              parameters[p] = {type: parameters[p].constructor.name };
              break;
          }
        };
        if(infoObj[pluginObj] == undefined) infoObj[pluginObj] = {};
        infoObj[pluginObj][pluginId] = parameters;
        // Object.assign(infoObj[pluginObj][pluginId], parameters);
      };
    };
  };
  if (format == "string") return JSON.stringify(infoObj);
  else return infoObj;
};

// Update plugin parameters based on a parameter object
function updatePluginParameters (parametersObject, Factory, pluginId) {
  var pObj = {};
  Object.assign(pObj, parametersObject)
  if(pluginId != undefined) {
    var plugin = getPlugin(pluginId, Factory);
    for( var i=0;i<plugin.length;i++) plugin[i].node.setParametersByObject(pObj[plugin[i].node.uniqueID][plugin[i].id]);
  } else {
    for (var pluginObj in pObj) {
      if(typeof pObj[pluginObj][Object.keys(pObj[pluginObj])[0]] == 'object') {
        for (var pluginID in pObj[pluginObj]) {
          var plugin = getPlugin(parseInt(pluginID), Factory)[0];
          if(plugin != undefined && plugin.constructor.name == "PluginInstance") {
            if(JSON.stringify(getPluginParameterValues(plugin)) != JSON.stringify(pObj[pluginObj][pluginID])) plugin.node.setParametersByObject(pObj[pluginObj][pluginID]);
          };
        };
      } else {
        var plugin = getPlugin(pluginObj, Factory)[0];
        if(plugin != undefined && plugin.constructor.name == "PluginInstance") {
          if(JSON.stringify(getPluginParameterValues(plugin)) != JSON.stringify(pObj[pluginObj])) plugin.node.setParametersByObject(pObj[pluginObj]);
        };
      };
    };
  };
  return pObj;
};

// Add plugin's parameters to parameters object
function addToParametersObject (plugin, parametersObject) {
    var parametersObject = parametersObject || window.parametersObject;
    if(typeof parametersObject === 'undefined') parametersObject = {};
    window.parametersObject = parametersObject;
    var pId = plugin.node.uniqueID
    if(!(pId in parametersObject)) parametersObject[pId] = {};
    parametersObject[pId][plugin.id] = {};
    Object.assign(parametersObject[pId][plugin.id], getPluginParameterValues(plugin));
    return parametersObject;
};

/** CHAINS **/
// This function returns an array of plugins belonging to the subFactory "sfxChain".
// if the subFactory "sfxChain" is not defined, it will create it with chainStart and chainStop as the start and stop nodes
async function createSoundFxChain (soundFx, chainStart, chainStop, Factory) {
  const prototypes = await Promise.all(loadSoundFxPlugins(Factory));
  var sfxChain;
  var plugins = [];
  // Going through the array soundFx, which contains the IDs of the plugins used in the model as specified in model.html
  for (i = 0; i < soundFx.length; i++) {
    let soundFxSeries = [];
    if (soundFx[i].constructor == Array) soundFxSeries = soundFx[i];
    else soundFxSeries = [soundFx[i]];
    for (j = 0; j < soundFxSeries.length; j++) {
      var sfxProto = prototypes.filter((value) => { return value.uniqueID == soundFxSeries[j]; });
      if (sfxProto.length == 1) {
        sfxProto = sfxProto[0];
        if (j == 0) {
          if (sfxChain == undefined) {
            sfxChain = Factory.createSubFactory(chainStart, chainStop);
            sfxChain.name = 'SFXChain';
            var plugin_3 = addPlugin(sfxProto, sfxChain);
            plugins.push(plugin_3);
            addToParametersObject(plugin_3);
          } else {
            if (sfxChain.constructor != Array) sfxChain = [sfxChain];
            var plugin_3 = addPlugin(sfxProto, sfxChain[i - 1], 'parallel');
            sfxChain.push(plugin_3.node.owner);
            plugins.push(plugin_3);
            addToParametersObject(plugin_3);
          }
        } else {
          if (sfxChain.constructor != Array) sfxChain = [sfxChain];
          var plugin_3 = addPlugin(sfxProto, sfxChain[i], 'series');
          plugins.push(plugin_3);
          addToParametersObject(plugin_3);
        }
      }
    }
  };
  console.log("%c createSoundFxChain complete", "color:orange; font-weight: bold");
  return plugins;
};

// Loads the audio fx plugins from the Factory and adds them to the new sub Factory 'afxChain'
// Returns the plugins
var createAudioFxChain  = async function (Factory, chainStart, chainStop) {
  const prototypes = await Promise.all(loadAudioFxPlugins(Factory));
  var afxChain = Factory.createSubFactory(chainStart, chainStop);
  afxChain.name = 'AFXChain';
  for (i = 0; i < prototypes.length; i++) {
    var plugin = addPlugin(prototypes[i], afxChain);
    addToParametersObject(plugin);
    // addPluginToChain(prototypes[i], afxChain);
  };
  console.log("%c createAudioFxChain complete", "color:orange; font-weight: bold");
  return afxChain.getPlugins();
};

/** PRESETS **/
// Add new preset
function addPreset (pObj, name) {
  if(typeof scene !== 'undefined') addScenePresets(pObj,name);
  else{
    if(typeof presets === 'undefined')
      presets = {};
    window.presets = presets;
    presets[Object.keys(presets).length] = { name: name,state: pObj }
    return presets;
  }
};

// This function takes pObj, an object containing all the different presets and their parameters,
// and a string "name" which is the name of the preset to get.
// It returns the first element of pObj whose name matches the specified "name" parameter
function getPreset (pObj, name) {
  return Object.values(pObj).find(item => item.name == name);
};

// Set preset as URL
function setPresetAsURL (preset) {
  var encodedObj = encodeURIComponent(JSON.stringify(preset.state));
  var url = window.location.href.split('?')[0];
  url = url+'?'+'state='+encodedObj;
  window.location = url;
};

function setPreset (preset, Factory) {
  Object.assign(parametersObject,updatePluginParameters(preset.state,Factory));
}

// Update Presets Object with IDs
function updatePresetsObject (pObj, Factory) {
  var plugins = Factory.getAllPlugins();
  var idPairs = {};
  plugins.forEach(function(plugin) {
    idPairs[plugin.id] = plugin.node.uniqueID;
  });
  idEntries = Object.entries(idPairs);
  idEntries.map(x => { x.reverse() });
  idPairs = {};
  idEntries.forEach(function(e) {
    if(e[0] in idPairs) {
      if(!Array.isArray(idPairs[e[0]])) idPairs[e[0]] = [idPairs[e[0]]];
      idPairs[e[0]].push(e[1]);
    } else idPairs[e[0]] = e[1];
  });
  Object.keys(pObj).map(function(objectKey, index) {
    var state = pObj[objectKey].state;
    for(let p in state) {
      if(Array.isArray(state[p])) {
        var oldState = state[p];
        state[p] = {};
        oldState.forEach((x, i) => { state[p][idPairs[p][i]] = x });
      } else {
        var oldState = state[p];
        state[p] = {};
        state[p][idPairs[p]] = oldState;
      };
    };
  });
  console.log("%c updatePresetsObject complete", "color:orange; font-weight: bold");
  return pObj;
}

/** TRIGGERS **/
function sortTriggers(triggers) {
  var pluginParameters = {};
  for(let t in triggers) {
    var ownerId = triggers[t].parameter.ownerId;
    var pName = triggers[t].parameter.name;
    if(!(ownerId in pluginParameters)) pluginParameters[ownerId] = getPlugin(ownerId,Factory)[0].node.getParameterObject();;
    if(pName in pluginParameters[ownerId]) triggers[t].parameter = pluginParameters[ownerId][pName];
  }
  return sortObjArray(triggers, 'time');
};

function launchTriggers() {
  if(typeof triggers !== 'undefined') {
    for(let t in triggers) {
      var trigger = triggers[t];
      setTimeout(function(){ trigger.parameter.onclick(); }, 1000*parseFloat(trigger.time));
    };
  };
};

/** URL QUERY **/
async function processURLQuery(query, task, Factory) {
    if(!Array.isArray(task)) task = [task];
    var results = {},fileName;
    if('fileName' in query && typeof query['fileName'] == 'string') fileName = query['fileName'];
    else fileName = createAutoFileName();
    if('trigger' in query) {
        triggers = window.triggers =  JSON.parse(decodeURIComponent(query['trigger']));
        sortTriggers(triggers);
    }
    if('getParameters' in query) {
      if(parseBoolean(query['getParameters'])) downloadObjectAsJson(sfxP_flyObjectState(parametersObject, Factory), fileName, 4, '.txt');
      else if(query['getParameters']=='info') downloadObjectAsJson(getParametersObjectInfo(parametersObject, Factory), fileName, 4, '.txt');
    };
    for (let t in task) {
        Object.assign(results, results, await new Promise ((resolve)  => {
            switch(task[t]) {
                default: break;
                case 'record':
                    if('rTime' in query) {
                        startRecording(chainStop);
                        document.body.innerHTML += '<div class="loading-screen">Please wait. Generating audio...</div>';
                        launchTriggers();
                        setTimeout(function(){
                          // Stop recording & download file
                            stopRecording(true, fileName);
                            $('.loading-screen').remove();
                            resolve({'record': query['rTime']});
                        }, 1000 * parseFloat(query['rTime']));
                    } else resolve({'record': null});
                    break;
                case 'preset':
                    if('preset' in query) {
                        var preset = getPreset(presets, query['preset']);
                        if(preset != undefined) setPreset(preset, Factory);
                    }
                    resolve({'preset': preset});
                    break;
                case 'update':
                    var pObj = {};
                    if('state' in query) {
                        var newState = JSON.parse(decodeURIComponent(query['state']));
                        if(Factory != undefined && Factory.constructor.name == 'PluginFactory') {
                            Object.assign(pObj, updatePluginParameters(newState, Factory));
                            Object.assign(parametersObject, pObj);
                        };
                    };
                    resolve({'update': pObj});
                    break;
                case 'gui':
                    var gui = true;
                    if('gui' in query) gui = (parseBoolean(query['gui']) != undefined ? parseBoolean(query['gui']) : gui);
                    resolve({'gui': gui});
                    break;
            };
      }));
  };
  console.log("%c processURLQuery complete", "color:orange; font-weight: bold");
  return results;
};

// [>* AUDIO SEQUENCE *<]
//Latest restructured version of LAS
function loadAudioSequence() {
    console.log("%c Starting loadAudioSequence", "color:orange; font-weight: bold");
    window.audio_context = new window.AudioContext();// Audio Context

    Nexus.context = window.audio_context; // Passing the audio context to specific audio visualizers in Nexus UI
    window.Factory = new PluginFactory(audio_context);// Create new Factory
    window.addEventListener("beforeunload", () => {fadeAudioOut(chainStop);}); // Fade out audio if window unload
    // Build our global chain start and stop points
    var afxChainStart = audio_context.createGain(); // Audio Effects
    var sfxChainStart = audio_context.createGain(); // Post-processing Effects
    chainStop = audio_context.createGain(); // Final node of the plugin chain (declared in modelending.js)
    var values = [];
    // createSoundFxChain returns a promise that resolves in an array of sfx Plugins
    createSoundFxChain(soundFx, sfxChainStart, afxChainStart, Factory).then((v)=>{
        values.push(v); // Adding these plugins to our global chain
        //createAudioFxChain returns a promise that resolves in an array of afx Plugins
        createAudioFxChain(Factory, afxChainStart, chainStop).then((v)=>{
            values.push(v); // Adding these plugins to our global chain
            // loading preset file for the model
            loadPresetInterface().then(()=>{
                updatePresetsObject(presets, Factory);
                processURLQuery(getURLQuery(), ['update','preset','record','gui'], Factory).then(()=>{
                    bindSoundPluginsToInterface(values[0]);
                    console.log("%c bindSoundPluginsToInterface complete", "color:orange; font-weight: bold");
                    // Avoids harsh clipping when the audio is switched on for the first time
                    setTimeout(async ()=>{
                        await audio_context.suspend();
                        chainStop.connect(audio_context.destination);
                    }, 150);
                    Promise.all([loadWireFrame(),loadAudioFxInterface(),
                    loadTriggerSectionInterface(), loadRandomisationSectionInterface()]).then(()=>{
                        console.log("%c html loading complete", "color:orange; font-weight: bold");
                        bindAudioPluginsToInterface(values[1]);
                        setupRandomiser("selectParameterToRandomise", "buttonRandomise");
                        updatePresetSelect(presetSelect, presets);
                    });
                });
            });
        });
    });
}
