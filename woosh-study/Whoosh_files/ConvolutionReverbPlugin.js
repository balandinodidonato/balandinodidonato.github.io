/*globals BasePlugin */
var ConvolutionReverbPlugin = function (factory, owner) {
    BasePlugin.call(this, factory, owner);// This attaches the base plugin items to the Object
    var plugin = this;
    var bypass = false;
    var impulses = new Object();
    // Create Nodes
    var input = this.context.createGain(),
        output = this.context.createGain(),
        volume = this.context.createGain(),
        convolver = this.context.createConvolver(),
        dry = this.context.createGain(),
        wet = this.context.createGain(),
        highFilter= new BiquadFilterNode(this.context,{type:'highpass',frequency:20}),
        lowFilter= new BiquadFilterNode(this.context,{frequency:20000});
    getImpulses(impulses);
    loadImpulse(impulses.smallImpulseURL);
    // input.connect(convolver);
    input.connect(dry);
    input.connect(lowFilter);
    lowFilter.connect(highFilter);
    highFilter.connect(convolver);
    convolver.connect(wet);
    wet.connect(volume);
    dry.connect(volume);
    volume.connect(output);
    // Initialise bypass
    disconnectNode(input, false, [dry, lowFilter]);
    disconnectNode(output, volume, false);
    input.connect(output);
    var dry_parameter = this.parameters.createNumberParameter("dry", 0, 0, 1);
    dry_parameter.bindToAudioParam(dry.gain);
    var wet_parameter = this.parameters.createNumberParameter("wet", 1, 0, 1);
    wet_parameter.bindToAudioParam(wet.gain);
    var level_parameter = this.parameters.createNumberParameter("level", 1, 0, 1);
    level_parameter.bindToAudioParam(volume.gain);
    var lowCut_parameter = this.parameters.createNumberParameter("lowCut", 20, 20, 20000);
    lowCut_parameter.bindToAudioParam(highFilter.frequency);
    var highCut_parameter = this.parameters.createNumberParameter("highCut", 20000, 20, 20000);
    highCut_parameter.bindToAudioParam(lowFilter.frequency);
    var type_parameter = this.parameters.createNumberParameter("type", 0, 0, 10);
    type_parameter.trigger = function () {
      switch (type_parameter.value) {
        case 0: loadImpulse(impulses.smallImpulseURL);
          break;
        case 1: loadImpulse(impulses.largeImpulseURL);
          break;
        case 2: loadImpulse(impulses.chateauDeLogneURL);
          break;
        case 3: loadImpulse(impulses.deepSpaceURL);
          break;
        case 4: loadImpulse(impulses.largeWideHallURL);
          break;
        case 5: loadImpulse(impulses.narrowSpaceURL);
          break;
        case 6: loadImpulse(impulses.parkingGarageURL);
          break;
        case 7: loadImpulse(impulses.scalaOperaHallURL);
          break;
        case 8: loadImpulse(impulses.stNicolaesChurchURL);
          break;
        case 9: loadImpulse(impulses.digitalRevURL);
          break;
        case 10: loadImpulse(impulses.divorceBeach);
          break;
        default: loadImpulse(impulses.smallImpulseURL);
          break;
      }
    };
    var bypass_parameter = this.parameters.createNumberParameter("bypass", 0, 0, 1);
    bypass_parameter.trigger = function() {
      if(bypass_parameter.value==0 && bypass == true) {
        output.gain.linearRampToValueAtTime(0,plugin.context.currentTime+0.02);
        setTimeout(function(){
          disconnectNode(input, false, [dry, lowFilter]);
          disconnectNode(output, volume, false);
          input.connect(output);
        }, 21);
        output.gain.linearRampToValueAtTime(1,plugin.context.currentTime+0.3);
        bypass = false;
      } else if(bypass_parameter.value==1 && bypass == false) {
        output.gain.linearRampToValueAtTime(0,plugin.context.currentTime+0.02);
        setTimeout(function(){
          input.disconnect(output);
          connectNode(input, false, [dry, lowFilter]);
          connectNode(output, volume, false);
        }, 21);
        output.gain.linearRampToValueAtTime(1,plugin.context.currentTime+0.3);
        bypass = true;
      };
    }
    function getImpulses(impulses) {
        impulses.smallImpulseURL = '../../jsap-plugins/audio-effects/IR/smallIR.wav';
        impulses.largeImpulseURL = '../../jsap-plugins/audio-effects/IR/largeIR.wav';
        impulses.chateauDeLogneURL = '../../jsap-plugins/audio-effects/IR/Chateau_de_Logne.wav';
        impulses.deepSpaceURL = '../../jsap-plugins/audio-effects/IR/Deep_Space.wav';
        impulses.largeWideHallURL = '../../jsap-plugins/audio-effects/IR/Large_Wide_Hall.wav';
        impulses.narrowSpaceURL = '../../jsap-plugins/audio-effects/IR/Narrow_Space.wav';
        impulses.parkingGarageURL = '../../jsap-plugins/audio-effects/IR/Parking_Garage.wav';
        impulses.scalaOperaHallURL = '../../jsap-plugins/audio-effects/IR/Scala_Milan_Opera_Hall.wav';
        impulses.stNicolaesChurchURL = '../../jsap-plugins/audio-effects/IR/St_Nicolaes_Church.wav';
        impulses.digitalRevURL = '../../jsap-plugins/audio-effects/IR/Digital.wav';
        impulses.divorceBeach = '../../jsap-plugins/audio-effects/IR/DivorceBeach.wav';
    };
    function loadImpulse(impulseURL) {
      oldWetGain = wet.gain.value;
      wet.gain.cancelScheduledValues(plugin.context.currentTime)
      wet.gain.linearRampToValueAtTime(0,plugin.context.currentTime+0.005);
      var xhr = new XMLHttpRequest();
      xhr.open("GET", impulseURL, true);
      xhr.responseType = "arraybuffer";
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status < 300 && xhr.status > 199 || xhr.status === 302) {
            plugin.context.decodeAudioData(xhr.response, function(buffer) {
              convolver.disconnect();//NEW
              convolver = plugin.context.createConvolver();//NEW
              convolver.buffer = buffer;
              highFilter.connect(convolver);
              convolver.connect(wet);
              wet.connect(volume);
              wet.gain.cancelScheduledValues(plugin.context.currentTime)
              wet.gain.linearRampToValueAtTime(oldWetGain, plugin.context.currentTime+0.4);
            }, function(e) { if (e) console.log("Error decoding data" + e); });
          }
        }
      };
      xhr.send(null);
    };
    // Connecting the I/O of the chain
    this.addInput(input);
    this.addOutput(output);
    /* USER MODIFIABLE END */
    (function () {
      var i;
      for (i = 0; i < this.numOutputs; i++) {
        var node = this.context.createAnalyser();
        this.features.push(node);
        this.outputs[i].connect(node);
      }
  })();
};
ConvolutionReverbPlugin.prototype = Object.create(BasePlugin.prototype);
ConvolutionReverbPlugin.prototype.name = "Convolution Reverb Plugin";
ConvolutionReverbPlugin.prototype.version = "1.0.0";
ConvolutionReverbPlugin.prototype.uniqueID = "RTSFXconvReverb";
