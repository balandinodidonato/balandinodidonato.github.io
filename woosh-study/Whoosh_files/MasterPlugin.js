var MasterPlugin = function (factory, owner) {//globals BasePlugin
    BasePlugin.call(this, factory, owner);// This attaches the base plugin items to the Object
    var mute = false,lastGain;
    // Create Nodes
    var input = this.context.createGain();
    var output = this.context.createGain();
    var splitter = this.context.createChannelSplitter(2);
    var merger = this.context.createChannelMerger(2);
    var panLeft = this.context.createGain();
    var panRight = this.context.createGain();
    var makeupGain = new GainNode(this.context,{gain:2});
    input.channelCountMode = 'explicit'; // Configure channels, # channels is defined by the value of channelCount.
    // input.channelInterpretation = 'explicit';
    // Connect Nodes
    input.connect(splitter);
    splitter.connect(panRight, 0);
    splitter.connect(panLeft, 1);
    panRight.connect(merger, 0, 0);
    panLeft.connect(merger, 0, 1);
    merger.connect(makeupGain);
    makeupGain.connect(output);
    // Create parameters
    var gain_parameter = this.parameters.createNumberParameter("gain", 1, 0, 1);
    gain_parameter.bindToAudioParam(input.gain);
    var panning_parameter = this.parameters.createNumberParameter("panning", 0, -1, 1);
    panning_parameter.trigger = function() {
      var val = panning_parameter.value;
      panRight.gain.value = (val * -0.5) + 0.5;
      panLeft.gain.value = (val * 0.5) + 0.5;
    }
    // Connecting the I/O of the chain
    this.addInput(input),this.addOutput(output);
    (function () {
      for (var i = 0; i < this.numOutputs; i++) {
          var node = this.context.createAnalyser();
          this.features.push(node);
          this.outputs[i].connect(node);
      }
  })();
};
MasterPlugin.prototype = Object.create(BasePlugin.prototype);
MasterPlugin.prototype.name = "Master Section Plugin";
MasterPlugin.prototype.version = "1.0.0";
MasterPlugin.prototype.uniqueID = "RTSFXmaster";
