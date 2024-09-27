/*globals BasePlugin */
var CompressorPlugin = function (factory, owner) {
    BasePlugin.call(this, factory, owner);// This attaches the base plugin items to the Object
    var plugin = this;
    var bypass = false;
    // Create Nodes
    var input = this.context.createGain(),output = this.context.createGain();
		var Compressor = new DynamicsCompressorNode(this.context,{threshold:-20});
    input.channelCountMode = 'explicit'; //The number of channels is defined by the value of channelCount.
    // Connect Nodes
		input.connect(Compressor);
		Compressor.connect(output);
    // Initialise bypass
    disconnectNode(input, false, Compressor);
    disconnectNode(output, Compressor, false);
    input.connect(output);

		var thres_parameter = this.parameters.createNumberParameter("thres",-20,-100,0);
		var knee_parameter = this.parameters.createNumberParameter("knee",20,0,40);
		var ratio_parameter = this.parameters.createNumberParameter("ratio",12,1,20);
		var reduction_parameter = this.parameters.createNumberParameter("reduction",0,-20,0);
		var attack_parameter = this.parameters.createNumberParameter("attack",0.003,0,1);
		var release_parameter = this.parameters.createNumberParameter("release",0.5,0,1);
    var bypass_parameter = this.parameters.createNumberParameter("bypass", 0, 0, 1);
    bypass_parameter.trigger = function() {
      if(bypass_parameter.value==0 && bypass == true) {
        output.gain.linearRampToValueAtTime(0,plugin.context.currentTime+0.02);
        setTimeout(function(){
          disconnectNode(input, false, Compressor);
          disconnectNode(output, Compressor, false);
          input.connect(output);
        }, 21);
        output.gain.linearRampToValueAtTime(1,plugin.context.currentTime+0.3);
        bypass = false;
      } else if(bypass_parameter.value==1 && bypass == false) {
        output.gain.linearRampToValueAtTime(0,plugin.context.currentTime+0.02);
        setTimeout(function(){
          input.disconnect(output);
          connectNode(input, false, Compressor);
          connectNode(output, Compressor, false);
        }, 21);
        output.gain.linearRampToValueAtTime(1,plugin.context.currentTime+0.3);
        bypass = true;
      };
    };

		thres_parameter.trigger = function() {
			Compressor.threshold.value=thres_parameter.value;
		};
		knee_parameter.trigger = function() {
			Compressor.knee.value=knee_parameter.value;
		};
		ratio_parameter.trigger = function() {
			Compressor.ratio.value=ratio_parameter.value;
		};
		reduction_parameter.trigger = function() {
			Compressor.reduction.value=reduction_parameter.value;
		};
		attack_parameter.trigger = function() {
			Compressor.attack.value=attack_parameter.value;
		};
		release_parameter.trigger = function() {
			Compressor.release.value=release_parameter.value;
		};

    // Connecting the I/O of the chain
    this.addInput(input);
    this.addOutput(output);
    /* USER MODIFIABLE END */
    (function () {
      for (var i = 0; i < this.numOutputs; i++) {
          var node = this.context.createAnalyser();
          this.features.push(node);
          this.outputs[i].connect(node);
      }
  })();
};
CompressorPlugin.prototype = Object.create(BasePlugin.prototype);
CompressorPlugin.prototype.name = "Compressor Plugin";
CompressorPlugin.prototype.version = "1.0.0";
CompressorPlugin.prototype.uniqueID = "RTSFXcompressor";
