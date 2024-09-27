var OverdrivePlugin = function (factory, owner) {/*globals BasePlugin */
    BasePlugin.call(this, factory, owner);// This attaches the base plugin items to the Object
    var plugin = this;
    var bypass = false,oldOutput = 0;
    // Create Nodes
    var input = this.context.createGain(),output = this.context.createGain();
    // Create parameters
    var knee_parameter = this.parameters.createNumberParameter("knee", 0, 0, 1);
    var bias_parameter = this.parameters.createNumberParameter("bias", 0, 0, 1);
    var tone_parameter = this.parameters.createNumberParameter("tone", 1, 0, 1);
    var drive_parameter = this.parameters.createNumberParameter("drive", 0, -50, 50);
    var volume_parameter = this.parameters.createNumberParameter("level", 6, -60, 6);
    var bypass_parameter = this.parameters.createNumberParameter("bypass", 0, 0, 1);
    Promise.all([this.context.audioWorklet.addModule('/audio-js/otherWorklets.js')]).then(() => {
    var wave = new AudioWorkletNode(this.context, 'overdrive-processor');// new overdrive(0, 10, 0, 0);
    dcBlocking= new BiquadFilterNode(this.context,{type:'highpass',frequency:20}),
    tone= new BiquadFilterNode(this.context,{frequency:20000});
    input.channelCountMode = 'explicit'; // Configure channels, # channels is defined by the value of channelCount.
    // Connect Nodes
    input.connect(tone);
    tone.connect(wave);
    wave.connect(dcBlocking);
    dcBlocking.connect(output);
    // Initialise bypass
    disconnectNode(input, false, tone);
    disconnectNode(output, dcBlocking, false);
    input.connect(output);

    knee_parameter.trigger = function() { wave.parameters.get('knee').value= knee_parameter.value }.bind(knee_parameter);

    bias_parameter.trigger = function() { wave.parameters.get('bias').value= bias_parameter.value }.bind(bias_parameter);

    tone_parameter.trigger = function() {tone.frequency.value= 200.0 + (Math.pow(10, tone_parameter.value) - 1.0) * 2200 }.bind(tone_parameter);

    drive_parameter.trigger = function() { wave.parameters.get('drive').value= drive_parameter.value }.bind(drive_parameter);

    volume_parameter.trigger = function() { wave.parameters.get('volume').value= volume_parameter.value }.bind(volume_parameter);

    bypass_parameter.trigger = function() {
      if(bypass_parameter.value==0 && bypass == true) {
        output.gain.linearRampToValueAtTime(0,plugin.context.currentTime+0.02);
        setTimeout(function(){
          disconnectNode(input, false, tone);
          disconnectNode(output, dcBlocking, false);
          input.connect(output);
        }, 21);
        output.gain.linearRampToValueAtTime(1,plugin.context.currentTime+0.3);
        bypass = false;
      } else if(bypass_parameter.value==1 && bypass == false) {
        output.gain.linearRampToValueAtTime(0,plugin.context.currentTime+0.02);
        setTimeout(function(){
          input.disconnect(output);
          connectNode(input, false, tone);
          connectNode(output, dcBlocking, false);
        }, 21);
        output.gain.linearRampToValueAtTime(1,plugin.context.currentTime+0.3);
        bypass = true;
      };
    };
  }); //End audio worklet
    this.addInput(input),this.addOutput(output);// Connecting the I/O of the chain
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
OverdrivePlugin.prototype = Object.create(BasePlugin.prototype);
OverdrivePlugin.prototype.name = "Overdrive Plugin";
OverdrivePlugin.prototype.version = "1.0.0";
OverdrivePlugin.prototype.uniqueID = "RTSFXoverdrive";
