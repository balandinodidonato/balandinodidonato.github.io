var DelayPlugin = function (factory, owner) { /*globals BasePlugin */
    BasePlugin.call(this, factory, owner);// This attaches the base plugin items to the Object
    var plugin = this;
    var bypass = false;
    // Create Nodes
    var input= this.context.createGain(),output = this.context.createGain(),
      volume= this.context.createGain(), delay = this.context.createDelay(),
      dry= this.context.createGain(),wet= this.context.createGain(),tone= this.context.createBiquadFilter(),
      feedback= new GainNode(this.context,{gain:Math.pow(10,-12 / 20.0)});
    input.connect(dry);
    input.connect(delay);
    dry.connect(volume);
    delay.connect(tone);
    tone.connect(wet);
    // delay.connect(feedback);
    tone.connect(feedback);
    feedback.connect(delay);
    wet.connect(volume);
    volume.connect(output);
    // Initialise bypass
    disconnectNode(input, false, [dry, delay]);
    disconnectNode(output, volume, false);
    input.connect(output);
    var delay_parameter = this.parameters.createNumberParameter("delay", 100, 20, 1000);
    delay_parameter.update = function (e) { return e / 1000.0; };
    delay_parameter.translate = function (e) { return e * 1000.0; };
    delay_parameter.bindToAudioParam(delay.delayTime);
    var dry_parameter = this.parameters.createNumberParameter("dry", 0.5, 0, 1);
    dry_parameter.bindToAudioParam(dry.gain);
    var wet_parameter = this.parameters.createNumberParameter("wet", 0.5, 0, 1);
    wet_parameter.bindToAudioParam(wet.gain);
    var level_parameter = this.parameters.createNumberParameter("level", 1, 0, 1);
    level_parameter.bindToAudioParam(volume.gain);
    var feedback_parameter = this.parameters.createNumberParameter("feedback", -12, -40, -3);
    feedback_parameter.translate = function (e) { return 20.0 * Math.log10(e); };
    feedback_parameter.update = function (e) { return Math.pow(10, e / 20.0); };
    feedback_parameter.bindToAudioParam(feedback.gain);
    var cutoff_parameter = this.parameters.createNumberParameter("cutOff", 20000, 20, 20000);
    cutoff_parameter.bindToAudioParam(tone.frequency);
    var bypass_parameter = this.parameters.createNumberParameter("bypass", 0, 0, 1);
    bypass_parameter.trigger = function() {
      if(bypass_parameter.value==0 && bypass == true) {
        output.gain.linearRampToValueAtTime(0,plugin.context.currentTime+0.02);
        setTimeout(function(){
          disconnectNode(input, false, [dry, delay]);
          disconnectNode(output, volume, false);
          input.connect(output);
        }, 21);
        output.gain.linearRampToValueAtTime(1,plugin.context.currentTime+0.3);
        bypass = false;
      } else if(bypass_parameter.value==1 && bypass == false) {
        output.gain.linearRampToValueAtTime(0,plugin.context.currentTime+0.02);
        setTimeout(function(){
          input.disconnect(output);
          connectNode(input, false, [dry, delay]);
          connectNode(output, volume, false);
        }, 21);
        output.gain.linearRampToValueAtTime(1,plugin.context.currentTime+0.3);
        bypass = true;
      };
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
DelayPlugin.prototype = Object.create(BasePlugin.prototype);
DelayPlugin.prototype.name = "Delay Plugin";
DelayPlugin.prototype.version = "1.0.0";
DelayPlugin.prototype.uniqueID = "RTSFXdelay";
