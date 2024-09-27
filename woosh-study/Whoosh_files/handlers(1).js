/* User Interface Handling Functions*/
/** SLIDERS **/
function setSliderNexus (slider, parameterName, parameterObject, step) {
    var stepSize = parameterObject[parameterName].stepSize || 0.001;
    slider.step = stepSize;
    slider.min = parameterObject[parameterName].minimum;// NexusUI: min , JSAP: minimum
    slider.max = parameterObject[parameterName].maximum;
    updateSliderValueNexus(slider, parameterObject[parameterName].value);
};

function updateSliderValueNexus (slider, value) {
  slider.value = value;
  slider.lastinput= slider.value;
  return slider.value;
};

/** PARAMETER BINDING **/
function bindElementToAudioParamNexus(element, parameterName, pluginObject, numBox, option) {
  var pId = pluginObject.pluginInstance.id;
  var pUniqueID = pluginObject.uniqueID;
  var pluginParameterObject = pluginObject.getParameterObject();

  try {
    var parameterType = pluginParameterObject[parameterName].constructor.name;
  }
  catch(err) {
    throw "UI/handlers/bindElementToAudioParamNexus - \nThe plugin's Parameter Object is empty. Make sure no plugin parameters are being created inside of a promise.";
  }

  var step = 0.001;
  switch(element.type) {
    case "Dial":
    case "Slider":
      element.parameter = {name:parameterName,type:parameterType,plugin:{id:pId,uniqueID:pUniqueID}}
      if(parameterType == "NumberParameter") {
        setSliderNexus(element, parameterName, pluginParameterObject, step);
        element.on('change',function binder(){
          element.lastinput = element.value;
          pluginObject.setParameterByName(parameterName, element.value);
        });
      }
      if(typeof numBox !== 'undefined' &&  numBox.constructor.name == 'Number') numBox.link(element);
      break;
    case "Position":
      if(parameterType == "NumberParameter") {
        if(option) {
          switch(option) {
            case 'x':
              element.minX = pluginParameterObject[parameterName].minimum;// NexusUI: minX, JSAP: minimum
              element.maxX = pluginParameterObject[parameterName].maximum;
              element.on('change',function binder(){
                pluginObject.setParameterByName(parameterName, element.x);
                if(numBox) numBox.value = element.x;
              });
              break;
            case 'y':
              element.minY = pluginParameterObject[parameterName].minimum;// NexusUI: minX, JSAP: minimum
              element.maxY = pluginParameterObject[parameterName].maximum;
              element.on('change',function binder(){
                pluginObject.setParameterByName(parameterName, element.y);
                if(numBox) numBox.value = element.y;
              });
              break;
          }
        }
      }
      break;
    case "Select":
      element.parameter = {name:parameterName,type:parameterType,plugin:{id:pId,uniqueID:pUniqueID}}
      element.on('change',function binder() { pluginObject.setParameterByName(parameterName,element.selectedIndex); });
      break;
    case "Button":
    case "TextButton":
      element.parameter = {name:parameterName,type:parameterType,plugin:{id:pId,uniqueID:pUniqueID}}
      element.on('change',function binder(data){ if(data) pluginObject.getParameterByName(parameterName).onclick(); });
      break;
    case "Toggle":
      element.parameter = {name:parameterName,type:parameterType,plugin:{id:pId,uniqueID:pUniqueID}}
      element.on('change',function binder(data){
        var value = element.state ? 1 : 0;
        pluginObject.setParameterByName(parameterName, value);
      });
      break;
    case "Pan":
      element.parameter = {name:parameterName,type:parameterType,plugin:{id:pId,uniqueID:pUniqueID}}
      if(parameterType == "NumberParameter") {
        setSliderNexus(element, parameterName, pluginParameterObject);
        element.on('change',function binder(){
          element.lastinput = element.value;
          pluginObject.setParameterByName(parameterName, element.value);
        });
      }
      break;
  }
  return element;
}

/** BIND AUDIO FX INTERFACES **/
var bindAudioPluginsToInterface = function (afxPlugins) {
  bindOverdriveEffectToInterface(afxPlugins);
  console.log('binded OverdriveEffectToInterface')
  bindDelayEffectToInterface(afxPlugins);
  console.log('binded DelayEffectToInterface')
  bindReverbEffectToInterface(afxPlugins);
  console.log('binded ReverbEffectToInterface')
  bindCompressorEffectToInterface(afxPlugins);
  console.log('binded CompressorEffectToInterface')
  // Find eq plugin
  eq = afxPlugins.find(function (plugin) { return plugin.node.uniqueID == "RTSFXeq" }).node;
  bindElementToAudioParamNexus(eqBypass, "bypass", eq);
  bindSpatialisationEffectToInterface(afxPlugins);
  spatial = afxPlugins.find(function (plugin) { return plugin.node.uniqueID == "RTSFXspatialisation" }).node;
  bindElementToAudioParamNexus(spatBypass, "bypass", spatial);
  // Find master plugin
  master = afxPlugins.find(function (plugin) { return plugin.node.uniqueID == "RTSFXmaster" }).node;
  master.setParameterByName("gain", 1);
  master.setParameterByName("panning", 0);
  // Initialise master controls.
  bindElementToAudioParamNexus(masterGainInput, "gain", master);
  bindElementToAudioParamNexus(masterPanInput, "panning", master);
  console.log("%c bindAudioPluginsToInterface complete", "color:orange; font-weight: bold");
};

/** PRESETS **/
function addPresetOption(selectObj, preset, button, customFunction) {
  let selector = isNexus(selectObj) ? selectObj : window.presetSelect;
  if(selector != null) { }
  else {
    if(window.presetSelect_ghost == undefined) {
      var selectElement = document.createElement("div");
      selectElement.setAttribute("id","presetSelect_ghost");
      window.presetSelect_ghost = new Nexus.Select(selectElement, {
        'size': [130, 30],
        'options':['--']
      });
      selectElement.style.display = "none"
      selector = window.presetSelect_ghost;
    }
    selector = window.presetSelect_ghost
  }
  let newOptions = Object.values(selector._options);
  if(!newOptions.includes(preset.name)) {
    newOptions.push(preset.name);
    selector.defineOptions(newOptions);
    selector.element.options = selector._options;
    selector.on('change',function(data) {
      if(data && data.value == preset.name){
        var that = this;
        if(customFunction && typeof customFunction == 'function') customFunction.call(this, preset, button);
        else {
          setPreset(preset, Factory);
          var _button = (typeof button === 'string' ? window[button] : button);
          if(_button) _button.click();
          updateInterface();
        }
      }
    });
  }
}

function updatePresetSelect(selectObj, presets, button, customFunction) {
        var queryString = window.location.search;
        var msg = queryString.replace(/\?preset=/g, "");
        msg = msg.replace(/%20/g, " ")
        if(msg === "")
        {
          msg = "--"
        }
  let selector = isNexus(selectObj) ? selectObj : window.presetSelect;
  if(selector != null) {
    if(window.presetSelect_ghost == undefined) {
      var selectElement = document.createElement("div");
      selectElement.setAttribute("id","presetSelect_ghost");
      window.presetSelect_ghost = new Nexus.Select(selectElement, {
        'size': [130, 30],
        'options':['--']
      });
      selectElement.style.display = "none"
      selector = window.presetSelect_ghost;
    }
    selector.defineOptions(presetSelect_ghost._options);
    selector.element.options = selector._options;
    const index = (element) => element == msg;
    const selectedpreset = selector._options.findIndex(index);
    selector.element.selectedIndex = selectedpreset;
    selector.on('change',function(data) {
      for(p in presets) {
        if(data && data.value == presets[p].name){
          var that = this;
          if(customFunction && typeof customFunction == 'function')
            customFunction.call(this, presets[p], button);
          else {
            setPreset(presets[p], Factory);
            var _button = (typeof button === 'string' ? window[button] : button);
            if(_button) _button.click();
            updateInterface();
          }
        }
      }
    });
    presetSelect_ghost.destroy();
  }
  updateInterface();
  console.log("%c updatePresetSelect complete", "color:orange; font-weight: bold");
}

function createNexusPosition(divId,xParameterName,yParameterName,pluginObject,xNumBoxId,yNumBoxId,size,boxSize) {
  //HAS ERROR. CHANGING MIN OR MAX IN EACH AUDIO PARAM DOES NOT CHANGE RANGES ON NEXUS
  cleanDivId = divId.replace("#","");
  if (xNumBoxId != null) xCleanNumBoxId = xNumBoxId.replace("#","");
  if (yNumBoxId != null) yCleanNumBoxId = yNumBoxId.replace("#","");
  this.size = [200,200],this.boxSize = [40,22];
  if(typeof size != undefined && Array.isArray(size) && size.length == 2) this.size = size;
  if(typeof boxSize != undefined && Array.isArray(boxSize) && boxSize.length == 2) this.boxSize = boxSize;
  this.position = new Nexus.Position(divId,{'size':this.size,'mode':'absolute'});
  if($(xNumBoxId).length != 0) this.xNumBox = new Nexus.Number(xNumBoxId, {'size': this.boxSize});
  if($(yNumBoxId).length != 0) this.yNumBox = new Nexus.Number(yNumBoxId, {'size': this.boxSize});
  bindElementToAudioParamNexus(this.position,xParameterName, pluginObject, this.xNumBox, 'x');
  bindElementToAudioParamNexus(this.position,yParameterName, pluginObject, this.yNumBox, 'y');
  window[cleanDivId]=this.position;
  if(this.numBox) window[cleanNumBoxId]=this.numBox;
  if(this.numBox) return [this.position, this.xNumBox,this.yNumBox];
  else return this.position;
};

function createNexusSlider(divId, parameterName, pluginObject, numBoxId, size, boxSize, option) {
  cleanDivId = divId.replace("#","");
  if (numBoxId != null) cleanNumBoxId = numBoxId.replace("#","");
  this.size = [280, 20],this.boxSize = [60, 30];
  if(typeof size != undefined && Array.isArray(size) && size.length == 2) this.size = size;
  if(typeof boxSize != undefined && Array.isArray(boxSize) && boxSize.length == 2) this.boxSize = boxSize;
  this.slider = new Nexus.Slider(divId,{'size':this.size,'mode': 'relative','min': 0,'max': 1,'step': 0.001,'value': 0.5});
  if($(numBoxId).length != 0) this.numBox = new Nexus.Number(numBoxId, {'size': this.boxSize});
  bindElementToAudioParamNexus(this.slider, parameterName, pluginObject, this.numBox, option);
  window[cleanDivId]=this.slider;
  if(this.numBox) window[cleanNumBoxId]=this.numBox;
  if(this.numBox) return [this.slider, this.numBox];
  else return this.slider;
};

function createNexusDial(divId, parameterName, pluginObject, numBoxId, size, boxSize, option) {
  cleanDivId = divId.replace("#","");
  if (numBoxId != null) cleanNumBoxId = numBoxId.replace("#","");
  this.size = [30,30],this.boxSize = [40,22];
  if(typeof size != undefined && Array.isArray(size) && size.length == 2) this.size = size;
  if(typeof boxSize != undefined && Array.isArray(boxSize) && boxSize.length == 2) this.boxSize = boxSize;
  this.dial = new Nexus.Dial(divId,{'size':this.size,'mode': 'relative','min': 0,'max': 1,'step': 0.001,'value': 0.5});
  if($(numBoxId).length != 0) this.numBox = new Nexus.Number(numBoxId, {'size': this.boxSize});
  bindElementToAudioParamNexus(this.dial, parameterName, pluginObject, this.numBox, option);
  window[cleanDivId]=this.dial;
  if(this.numBox) window[cleanNumBoxId]=this.numBox;
  if(this.numBox) return [this.dial, this.numBox];
  else return this.dial;
};

function createNexusButton(divId, parameterName, pluginObject,size) {
  cleanDivId = divId.replace("#","");
  this.size = [60,60];
  if(typeof size != undefined && Array.isArray(size) && size.length == 2) this.size = size;
  this.button = new Nexus.Button(divId, {'size':size,'mode': 'impulse','state': false});
  bindElementToAudioParamNexus(this.button, parameterName, pluginObject);
  window[cleanDivId]=this.button;
  return this.button;
};

function createNexusTextButton(divId, parameterName, pluginObject,text,size) {
  cleanDivId = divId.replace("#","");
  this.size = [150, 55];
  if(typeof size != undefined && Array.isArray(size) && size.length == 2) this.size = size;
  this.button = new Nexus.TextButton(divId, {'size': size,'state': false,'text': text || 'Button','alternate': false,'mode': 'impulse'});
  bindElementToAudioParamNexus(this.button, parameterName, pluginObject);
  window[cleanDivId]=this.button;
  return this.button;
};

function createNexusSelect(divId, parameterName, pluginObject, options, size) {
  cleanDivId = divId.replace("#", "");
  this.size = [125, 30];
  if(typeof size != undefined && Array.isArray(size) && size.length == 2) this.size = size;
  this.select = new Nexus.Select(divId, {'size': size,'options': options});
  bindElementToAudioParamNexus(this.select, parameterName, pluginObject);
  window[cleanDivId]=this.select;
  return this.select;
};

function createNexusToggle(divId, parameterName, pluginObject, state, size) {
  cleanDivId = divId.replace("#", "");
  this.size = [40, 20];
  if(typeof size != undefined && Array.isArray(size) && size.length == 2) this.size = size;
  this.toggle = new Nexus.Toggle(divId, {'size': size,'state': state || false });
  bindElementToAudioParamNexus(this.toggle, parameterName, pluginObject);
  window[cleanDivId]=this.toggle;
  return this.toggle;
};

function createAudioContextToggle(divId, text, size) {
  this.size = [100, 20];
  this.text = text || 'Start Audio';
  if(typeof size != undefined && Array.isArray(size) && size.length == 2) this.size = size;
  this.audioContextButton = new Nexus.Toggle(divId,{'size': this.size,'state': false})
  this.audioContextButton.colorize("fill","#367C66");
  this.audioContextButton.colorize("accent","#59C9A5");
  this.audioContextButton.on('change', function(data) {
    if(data) {
      window.audio_context.resume();
      chainStop.gain.setValueAtTime(0, window.audio_context.currentTime);
      chainStop.gain.setTargetAtTime(1, window.audio_context.currentTime+0.1, 0.5);
      this.colorize("accent","#59C9A5");
      AudioCtxOn = true;
    }
    else{
      this.colorize("accent","#59C9A5");
      chainStop.gain.linearRampToValueAtTime(0, window.audio_context.currentTime+0.2);
      SetTimeout(()=>{window.audio_context.suspend();}, 200);
      AudioCtxOn = false;
    }
  });
  return this.audioContextButton;
};

function createAudioContextButton(divId){
    this.start = false;
    var CtxButton = new Nexus.TextButton(divId, {
        'size': [50, 35],
        'state': false,
        'text': '&#9654',
        'alternate': false,
    })
    CtxButton.textElement.style.fontSize = "16px";
    CtxButton.textElement.style.fontFamily = "'Work Sans', sans-serif";
    CtxButton.textElement.style.color = "white";
    CtxButton.colorize('fill', "#FF5733");
    CtxButton.on('change', function(data) {
        if (data) {
            CtxButton.element.style.pointerEvents = 'none';
            if(!this.start){
                CtxButton.colorize('fill', '#C63010');
                CtxButton.text = "||";
                window.audio_context.resume();
                AudioCtxOn = true;
                chainStop.gain.setValueAtTime(0, window.audio_context.currentTime);
                chainStop.gain.setTargetAtTime(1, window.audio_context.currentTime+0.1, 0.5);
                setTimeout(function() {
                    CtxButton.element.style.pointerEvents = 'auto';
                }, 500);
            }
            else {
                CtxButton.colorize('fill', "#FF5733");
                CtxButton.text = "&#9654";
                chainStop.gain.linearRampToValueAtTime(0, window.audio_context.currentTime+0.2);
                setTimeout(()=>{
                    window.audio_context.suspend();
                    AudioCtxOn = false;
                    CtxButton.element.style.pointerEvents = 'auto';
                }, 200);
            }
            CtxButton.textElement.style.fontSize = "16px";
            this.start = !this.start;
        }
    });
    return CtxButton;
}
// Turn an already existing nexus text button into an audio context button
function makeIntoAudioContextButton(nexusButton){
    nexusButton.on('change', function(data) {
        if (data && !AudioCtxOn) {
            forceResumeCtx();
        }
    });
    nexusButton.text = "&#9654";
    nexusButton.size = [50, 35];
    nexusButton.textElement.style.fontSize = "16px";
    nexusButton.colorize('fill', "#FF5733");
}

// Give any nexus element the ability to turn on the audio context
function linkToAudioContext(nexusElement){
    nexusElement.on('change', function(data) {
        if (data && !AudioCtxOn) {
            forceResumeCtx();
        }
    });
}

function forceResumeCtx(){
    window.audio_context.resume();
    chainStop.gain.setValueAtTime(0, window.audio_context.currentTime);
    chainStop.gain.setTargetAtTime(1, window.audio_context.currentTime+0.1, 0.5);
    AudioCtxOn = true;
}

function forcePauseCtx(){
    chainStop.gain.linearRampToValueAtTime(0, window.audio_context.currentTime+0.2);
    SetTimeout(()=>{window.audio_context.suspend();}, 200);
    AudioCtxOn = false;
}
