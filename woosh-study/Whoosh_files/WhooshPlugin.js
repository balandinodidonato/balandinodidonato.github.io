var WhooshPlugin = function (factory, owner) { /*globals BasePlugin */
    BasePlugin.call(this, factory, owner);// This attaches the base plugin items to the Object
    var plugin = this,maxGain = 0.5,startFreq = 300,endFreq = 700,peakFreq = 1000,
        envAttackType= "linear",envReleaseType = "linear",envAttackTime= 0.15,envReleaseTime = 0.3,
        filtAttackTime= 0.15,filtReleaseTime= 0.3,filtAttackType= "linear",filtReleaseType= "linear";
    // Create Nodes
    var input = this.context.createGain(),output = this.context.createGain();
    // Connect Nodes
    // Create parameters
    var envAttackParameter = this.parameters.createNumberParameter("env_attack", 0.15, 0, 1);
    var envAttackTypeParameter = this.parameters.createNumberParameter("env_attack_type",0, 0, 1);
    var envReleaseParameter = this.parameters.createNumberParameter("env_release", 0.3, 0, 2);
    var envReleaseTypeParameter = this.parameters.createNumberParameter("env_release_type",0, 0, 1);
    var maxGainParameter = this.parameters.createNumberParameter("max_gain",0.5,0,0.5);
    var startFreqParameter = this.parameters.createNumberParameter("start_f", 200, 300, 20000);
    var endFreqParameter = this.parameters.createNumberParameter("end_f", 700, 300, 20000);
    var peakFreqParameter = this.parameters.createNumberParameter("peak_f", 1000, 300, 20000);
    var QParameter = this.parameters.createNumberParameter("Q", 2, 0, 20);
    var filtTypeParameter = this.parameters.createNumberParameter("filt_type", 0, 0, 1);
    var filtAttackParameter = this.parameters.createNumberParameter("filt_attack", 0.15, 0, 1);
    var filtAttackTypeParameter = this.parameters.createNumberParameter("filt_attack_type",0, 0, 1);
    var filtReleaseParameter = this.parameters.createNumberParameter("filt_release", 0.3, 0, 2);
    var filtReleaseTypeParameter = this.parameters.createNumberParameter("filt_release_type",0, 0, 1);
    var gateOnParameter = this.parameters.createButtonParameter("gate_on");
    Promise.all([this.context.audioWorklet.addModule('/audio-js/generatorWorklets.js')]).then(() => {
    var envelope= new GainNode(this.context,{gain:0}),
    filter= new BiquadFilterNode(this.context,{type:'lowpass'});
    input.channelCountMode = 'explicit';// Configure channels, # channels defined by the value of channelCount.
    this.whiteNoise = new AudioWorkletNode(this.context, 'white-noise-generator');
    input.connect(this.whiteNoise);
    this.whiteNoise.connect(envelope);
    envelope.connect(filter);
    filter.connect(output);

    // Callback functions for the different parameters
    envAttackParameter.trigger = function () { envAttackTime = envAttackParameter.value; }.bind(envAttackParameter);
    envAttackTypeParameter.stepSize = 1;
    envAttackTypeParameter.trigger = function () {
      switch (envAttackTypeParameter.value) {
        case 0:envAttackType = "linear";break;
        case 1:envAttackType = "exponential";break;
        default:envAttackType = "linear";break;
      }
    }.bind(envAttackTypeParameter);
    envReleaseParameter.trigger = function () { envReleaseTime = envReleaseParameter.value; }.bind(envReleaseParameter);
    envReleaseTypeParameter.stepSize = 1;
    envReleaseTypeParameter.trigger = function () {
      switch (envReleaseTypeParameter.value) {
        case 0:envReleaseType = "linear";break;
        case 1:envReleaseType = "exponential";break;
        default:envReleaseType = "linear";break;
      }
    }.bind(envReleaseTypeParameter);
    maxGainParameter.trigger = function () { maxGain = maxGainParameter.value; }.bind(maxGainParameter);
    startFreqParameter.trigger = function () { startFreq = startFreqParameter.value; }.bind(startFreqParameter);
    endFreqParameter.trigger = function () { endFreq = endFreqParameter.value; }.bind(endFreqParameter);
    peakFreqParameter.trigger = function () { peakFreq = peakFreqParameter.value;}.bind(peakFreqParameter);
    QParameter.bindToAudioParam(filter.Q);
    filtTypeParameter.stepSize = 1;
    filtTypeParameter.trigger = function () { changeFilterType(this.value); }.bind(filtTypeParameter);
    filtAttackParameter.trigger = function () { filtAttackTime = filtAttackParameter.value; }.bind(filtAttackParameter);
    filtAttackTypeParameter.stepSize = 1;
    filtAttackTypeParameter.trigger = function () {
      switch (filtAttackTypeParameter.value) {
        case 0: filtAttackType = "linear";break;
        case 1: filtAttackType = "exponential";break;
        default: filtAttackType = "linear";break;
      }
    }.bind(filtAttackTypeParameter);
    filtReleaseParameter.trigger = function () { filtReleaseTime = filtReleaseParameter.value; }.bind(filtReleaseParameter);
    filtReleaseTypeParameter.stepSize = 1;
    filtReleaseTypeParameter.trigger = function () {
      switch (filtReleaseTypeParameter.value) {
        case 0: filtReleaseType = "linear";break;
        case 1: filtReleaseType = "exponential";break;
        default: filtReleaseType = "linear";break;
      }
    }.bind(filtReleaseTypeParameter);
    gateOnParameter.onclick = function () {
      var now = plugin.context.currentTime;
      envelope.gain.cancelScheduledValues(now);
      envelope.gain.setValueAtTime(0, now);
      if (envAttackType == "exponential") envelope.gain.exponentialRampToValueAtTime(maxGain, now + envAttackTime);
      else envelope.gain.linearRampToValueAtTime(maxGain, now + envAttackTime);
      if (envReleaseType == "exponential") envelope.gain.exponentialRampToValueAtTime(0.000000001, now + envAttackTime + envReleaseTime);
      else envelope.gain.linearRampToValueAtTime(0, now + envAttackTime + envReleaseTime);
      filter.frequency.cancelScheduledValues(now);
      filter.frequency.setValueAtTime(startFreq, now);
      if (filtAttackType == "exponential") filter.frequency.exponentialRampToValueAtTime(peakFreq, now + filtAttackTime);
      else filter.frequency.linearRampToValueAtTime(peakFreq, now + filtAttackTime);
      if (filtReleaseType=="exponential") filter.frequency.exponentialRampToValueAtTime(endFreq, now + filtAttackTime + filtReleaseTime);
      else filter.frequency.linearRampToValueAtTime(endFreq, now + filtAttackTime + filtReleaseTime);
    };
    function changeFilterType(filtType) {
      switch(filtType) {
        case 0: filter.type = "lowpass";break;
        case 1: filter.type = "bandpass";break;
        default: filter.type = "bandpass";break;
      }
    };
  }); //End audio worklet
  this.addInput(input),this.addOutput(output);// Connecting the I/O of the chain
};
WhooshPlugin.prototype = Object.create(BasePlugin.prototype);
WhooshPlugin.prototype.name = "Whoosh Effect";
WhooshPlugin.prototype.version = "1.0.0";
WhooshPlugin.prototype.uniqueID = "RTSFXwhoosh";
