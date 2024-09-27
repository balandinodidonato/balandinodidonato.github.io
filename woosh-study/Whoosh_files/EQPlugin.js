/*globals BasePlugin */
var EQPlugin = function(factory, owner) {
  // This attaches the base plugin items to the Object
  BasePlugin.call(this, factory, owner);
  var plugin=this;
  // Create Nodes
  var input = this.context.createGain(),output = this.context.createGain();
  var gainNode = this.context.createGain();
  var bypass = false;
  this.terms = [];
  var parametricEQ = [];
  parametricEQ.push(this.context.createBiquadFilter());
  parametricEQ.push(this.context.createBiquadFilter());
  parametricEQ.push(this.context.createBiquadFilter());
  parametricEQ.push(this.context.createBiquadFilter());
  parametricEQ.push(this.context.createBiquadFilter());
  // Connect Nodes
  parametricEQ[0].type = "lowshelf";
  parametricEQ[1].type = "peaking";
  parametricEQ[2].type = "peaking";
  parametricEQ[3].type = "peaking";
  parametricEQ[4].type = "highshelf";
  input.connect(parametricEQ[0]);
  parametricEQ[0].connect(parametricEQ[1]);
  parametricEQ[1].connect(parametricEQ[2]);
  parametricEQ[2].connect(parametricEQ[3]);
  parametricEQ[3].connect(parametricEQ[4]);
  parametricEQ[4].connect(gainNode);
  gainNode.connect(output);
  // Initialise bypass_parameter
  disconnectNode(input, false, parametricEQ[0]);
  disconnectNode(output, gainNode, false);
  input.connect(output);
  var frequenciesTest = [150, 560, 1000, 3300, 8200];
  for (var i = 0; i < parametricEQ.length; i++) {
    parametricEQ[i].gain.value = 0
    parametricEQ[i].frequency.value = frequenciesTest[i];
  }
  // Create parameters
  var lGain_parameter = this.parameters.createNumberParameter("Band1Gain", 0, -12, 12);
  var lFreq_parameter = this.parameters.createNumberParameter("Band1Frequency", 150, 22, 1000);
  var lQ_parameter = this.parameters.createNumberParameter("Band1Q", 0.7, 0.1, 10);
  var lmGain_parameter = this.parameters.createNumberParameter("Band2Gain", 0, -12, 12);
  var lmFreq_parameter = this.parameters.createNumberParameter("Band2Frequency", 560, 82, 3900);
  var lmQ_parameter = this.parameters.createNumberParameter("Band2Q", 0.7, 0.1, 10);
  var mGain_parameter = this.parameters.createNumberParameter("Band3Gain", 0, -12, 12);
  var mFreq_parameter = this.parameters.createNumberParameter("Band3Frequency", 1000, 180, 4700);
  var mQ_parameter = this.parameters.createNumberParameter("Band3Q", 0.7, 0.1, 10);
  var hmGain_parameter = this.parameters.createNumberParameter("Band4Gain", 0, -12, 12);
  var hmFreq_parameter = this.parameters.createNumberParameter("Band4Frequency", 3300, 220, 10000);
  var hmQ_parameter = this.parameters.createNumberParameter("Band4Q", 0.7, 0.1, 10);
  var hGain_parameter = this.parameters.createNumberParameter("Band5Gain", -12, -12, 12);
  var hFreq_parameter = this.parameters.createNumberParameter("Band5Frequency", 8200, 580, 20000);
  var hQ_parameter = this.parameters.createNumberParameter("Band5Q", 0.7, 0.1, 10);


  var bypass_parameter = this.parameters.createNumberParameter("bypass", 0, 0, 1);

  bypass_parameter.trigger = function() {
    if(bypass_parameter.value==0 && bypass == true) {
      output.gain.linearRampToValueAtTime(0,plugin.context.currentTime+0.02);
      setTimeout(function(){
        disconnectNode(input, false, parametricEQ[0]);
        disconnectNode(output, gainNode, false);
        input.connect(output);
      }, 21);
      output.gain.linearRampToValueAtTime(1,plugin.context.currentTime+0.3);
      bypass = false;
    } else if(bypass_parameter.value==1 && bypass == false) {
      output.gain.linearRampToValueAtTime(0,plugin.context.currentTime+0.02);
      setTimeout(function(){
        input.disconnect(output);
        connectNode(input, false, parametricEQ[0]);
        connectNode(output, gainNode, false);
      }, 21);
      output.gain.linearRampToValueAtTime(1,plugin.context.currentTime+0.3);
      bypass = true;
    };
  };

  lGain_parameter.bindToAudioParam(parametricEQ[0].gain);
  lFreq_parameter.bindToAudioParam(parametricEQ[0].frequency);
  lQ_parameter.bindToAudioParam(parametricEQ[0].Q);
  lmGain_parameter.bindToAudioParam(parametricEQ[1].gain);
  lmFreq_parameter.bindToAudioParam(parametricEQ[1].frequency);
  lmQ_parameter.bindToAudioParam(parametricEQ[1].Q);``
  mGain_parameter.bindToAudioParam(parametricEQ[2].gain);
  mFreq_parameter.bindToAudioParam(parametricEQ[2].frequency);
  mQ_parameter.bindToAudioParam(parametricEQ[2].Q);
  hmGain_parameter.bindToAudioParam(parametricEQ[3].gain);
  hmFreq_parameter.bindToAudioParam(parametricEQ[3].frequency);
  hmQ_parameter.bindToAudioParam(parametricEQ[3].Q);
  hGain_parameter.bindToAudioParam(parametricEQ[4].gain);
  hFreq_parameter.bindToAudioParam(parametricEQ[4].frequency);
  hQ_parameter.bindToAudioParam(parametricEQ[4].Q);

  var band1FrequencyType_parameter = this.parameters.createNumberParameter("Band1FilterType",0, 0, 1);
  band1FrequencyType_parameter.trigger = function () {
    switch (band1FrequencyType_parameter.value) {
      case 0: parametricEQ[0].type = "lowshelf";
        break;
      case 1: parametricEQ[0].type = "highpass";
        break;
      default: parametricEQ[0].type = "lowshelf";
        break;
    }
    updateGui()
  };
  var band5FrequencyType_parameter = this.parameters.createNumberParameter("Band5FilterType",0, 0, 1);
  band5FrequencyType_parameter.trigger = function () {
    switch (band5FrequencyType_parameter.value) {
      case 0:parametricEQ[4].type = "highshelf";
        break;
      case 1: parametricEQ[4].type = "lowpass";
        break;
      default: parametricEQ[4].type = "highshelf";
        break;
    }
    updateGui()
  };
  lQ_parameter.trigger = function() { updateGui()  }
  lGain_parameter.trigger = function() { updateGui() }
  lFreq_parameter.trigger = function() { updateGui() }
  lmGain_parameter.trigger = function() { updateGui() }
  lmFreq_parameter.trigger = function() { updateGui() }
  lmQ_parameter.trigger = function() { updateGui() }
  mGain_parameter.trigger = function() { updateGui() }
  mFreq_parameter.trigger = function() { updateGui() }
  mQ_parameter.trigger = function() { updateGui() }
  hmGain_parameter.trigger = function() { updateGui() }
  hmFreq_parameter.trigger = function() { updateGui() }
  hmQ_parameter.trigger = function() { updateGui() }
  hGain_parameter.trigger = function() { updateGui() }
  hFreq_parameter.trigger = function() { updateGui() }
  hQ_parameter.trigger = function() { updateGui() }
  input.channelCountMode = 'explicit'; //The number of channels is defined by the value of channelCount.
  var canvas = EqualiserResponseCanvas;
  var canvContext = canvas.getContext("2d");
  canvContext.clearRect(0, 0, canvas.width, canvas.height);
  canvContext.strokeStyle = "rgb(129, 129, 129)";
  canvContext.lineWidth = 2;
  // Draw the log scale: log(20) == 1.3010299956639813 log(20k) == 4.301029995663981
  var decades = [10, 100, 1000, 10000];
  var bases = [ 2,3,4,5,6,7,8,9 ];
  var f_bounds = [20, 20000];
  var fl_bounds = [1.3010299956639813, 4.301029995663981];
  // for (var decade of decades) {
  //   for (var base of bases) {
  //     var f = decade * base;
  //     if (f > f_bounds[0] && f < f_bounds[1]) {
  //       var pos = (Math.log10(f) - fl_bounds[0]) / (fl_bounds[1] - fl_bounds[0]);
  //       var pixel = Math.floor(canvas.width * pos) + 0.5;
  //       canvContext.beginPath();
  //       canvContext.moveTo(pixel, 0);
  //       canvContext.lineTo(pixel, canvas.height);
  //       canvContext.stroke();
  //     }
  //   }
  // }
  var gains = [-20, -15, -10, -5,
    0,
    5,
    10,
    15,
    20
  ];
  var g_bounds = [-20, 20];
  // for (var g of gains) {
  //   if (g > g_bounds[0] && g < g_bounds[1]) {
  //     var pos = (g - g_bounds[0]) / (g_bounds[1] - g_bounds[0]);
  //     var pixel = Math.floor(canvas.height * pos) + 0.5;
  //     canvContext.beginPath();
  //     canvContext.moveTo(0, pixel);
  //     canvContext.lineTo(canvas.width, pixel);
  //     canvContext.stroke();
  //   }
  // }
  // Draw the text
  // canvContext.font = "10px 'Work Sans' sans-serif";
  // canvContext.fillStyle = "#E9B000";
  // canvContext.fillText("20dB", 8, 13);
  // canvContext.fillText("-20dB", 8, canvas.height - 8);
  //
  // canvContext.fillStyle = "rgb(129, 129, 129)";
  // canvContext.fillText("100Hz", 155, canvas.height - 8);
 	// canvContext.fillText("1000Hz", 387, canvas.height - 8);
  // canvContext.fillText("10000Hz", 616, canvas.height - 8);

  // Prepare to get the frequency responses
  var freqs = new Float32Array(1024);
  var linear_freqs = new Float32Array(1024);
  var fl_range = fl_bounds[1] - fl_bounds[0];
  var fl_start = fl_bounds[0];
  var fl_step = fl_range / freqs.length;
  for (var i = 0; i < freqs.length; i++) {
    linear_freqs[i] = fl_start + (i * fl_step);
    freqs[i] = Math.pow(10, linear_freqs[i]);
  }

  var FR_Sum = getDecibelFrequencyResponse(freqs);
  // Draw the frequencies on:
  //20*Math.log10(FR_Sum[i]);
  canvContext.strokeStyle = "#E9B000";
  canvContext.beginPath();
  for (var i = 0; i < freqs.length; i++) {
    var x_pos = (linear_freqs[i] - fl_bounds[0]) / (fl_bounds[1] - fl_bounds[0]);
    var y_pos = 1 - (FR_Sum[i] - g_bounds[0]) / (g_bounds[1] - g_bounds[0]);
    var x_pixel = canvas.width * x_pos;
    var y_pixel = canvas.height * y_pos;
    if (i == 0) {
      canvContext.moveTo(x_pixel, y_pixel);
    } else {
      canvContext.lineTo(x_pixel, y_pixel);
    }
  }
  canvContext.stroke();

  // Draw the filter dots
  var dot_colours = ["white", "rgb(236, 220, 172)", "#dd9b95", "#38A53B", "#66B9BF"];
  for (var i = 0; i < 5; i++) {
    var G = parametricEQ[i].gain.value;
    var F = parametricEQ[i].frequency.value;
    var x_pos = (Math.log10(F) - fl_bounds[0]) / (fl_bounds[1] - fl_bounds[0]);
    var y_pos = 1 - (G - g_bounds[0]) / (g_bounds[1] - g_bounds[0]);
    canvContext.fillStyle = dot_colours[i];
    canvContext.beginPath();
    canvContext.arc(canvas.width * x_pos, canvas.height * y_pos, 5, 0, Math.PI * 2);
    canvContext.closePath();
    canvContext.fill();
  }

  function getFrequencyResponse(frequencies) {
    var N = frequencies.length;
    var FR_Sum = new Float32Array(N);
    var MR = new Float32Array(N);
    var PR = new Float32Array(N);
    for (var filter of parametricEQ) {
      filter.getFrequencyResponse(frequencies, MR, PR);
      for (var n = 0; n < N; n++) {
        FR_Sum[n] += MR[n];
      }
    }
    for (var n = 0; n < N; n++) {
      FR_Sum[n] /= parametricEQ.length;
    }
    return FR_Sum;
  }

  function getDecibelFrequencyResponse(frequencies) {
    var N = frequencies.length;
    var FR_Sum = new Float32Array(N);
    var MR = new Float32Array(N);
    var PR = new Float32Array(N);
    for (var filter of parametricEQ) {
      filter.getFrequencyResponse(frequencies, MR, PR);
      for (var n = 0; n < N; n++) FR_Sum[n] += 20 * Math.log10(MR[n]);
    }
    return FR_Sum;
  }
  function updateGui (){
    canvContext.clearRect(0, 0, canvas.width, canvas.height);
    canvContext.strokeStyle = "rgb(129, 129, 129)";
    // Draw the log scale: log(20) == 1.3010299956639813 log(20k) == 4.301029995663981
    var decades = [10, 100, 1000, 10000];
    var bases = [2,3,4,5,6,7,8,9];
    var f_bounds = [20, 20000];
    var fl_bounds = [1.3010299956639813, 4.301029995663981];
    // for (var decade of decades) {
    //   for (var base of bases) {
    //     var f = decade * base;
    //     if (f > f_bounds[0] && f < f_bounds[1]) {
    //       var pos = (Math.log10(f) - fl_bounds[0]) / (fl_bounds[1] - fl_bounds[0]);
    //       var pixel = Math.floor(canvas.width * pos) + 0.5;
    //       canvContext.beginPath();
    //       canvContext.moveTo(pixel, 0);
    //       canvContext.lineTo(pixel, canvas.height);
    //       canvContext.stroke();
    //     }
    //   }
    // }
    var gains = [-20, -15, -10, -5,0,5,10,15,20];
    var g_bounds = [-20, 20];
    // for (var g of gains) {
    //   if (g > g_bounds[0] && g < g_bounds[1]) {
    //     var pos = (g - g_bounds[0]) / (g_bounds[1] - g_bounds[0]);
    //     var pixel = Math.floor(canvas.height * pos) + 0.5;
    //     canvContext.beginPath();
    //     canvContext.moveTo(0, pixel);
    //     canvContext.lineTo(canvas.width, pixel);
    //     canvContext.stroke();
    //   }
    // }
    // Draw the text
    // canvContext.font = "10px 'Work Sans' sans-serif";
    // canvContext.fillStyle = "#E9B000";
  	// canvContext.fillText("20dB", 8, 13);
  	// canvContext.fillText("-20dB", 8, canvas.height - 8);
    //
  	// canvContext.fillStyle = "rgb(129, 129, 129)";
  	// canvContext.fillText("100Hz", 155, canvas.height - 8);
  	// canvContext.fillText("1000Hz", 387, canvas.height - 8);
  	// canvContext.fillText("10000Hz", 616, canvas.height - 8);

    // Prepare to get the frequency responses
    var freqs = new Float32Array(1024);
    var linear_freqs = new Float32Array(1024);
    var fl_range = fl_bounds[1] - fl_bounds[0];
    var fl_start = fl_bounds[0];
    var fl_step = fl_range / freqs.length;
    for (var i = 0; i < freqs.length; i++) {
      linear_freqs[i] = fl_start + (i * fl_step);
      freqs[i] = Math.pow(10, linear_freqs[i]);
    }



    var FR_Sum = getDecibelFrequencyResponse(freqs);
    // Draw the frequencies on:
    //20*Math.log10(FR_Sum[i]);
    canvContext.strokeStyle = "#E9B000";
    canvContext.beginPath();
    for (var i = 0; i < freqs.length; i++) {
      var x_pos = (linear_freqs[i] - fl_bounds[0]) / (fl_bounds[1] - fl_bounds[0]);
      var y_pos = 1 - (FR_Sum[i] - g_bounds[0]) / (g_bounds[1] - g_bounds[0]);
      var x_pixel = canvas.width * x_pos;
      var y_pixel = canvas.height * y_pos;
      if (i == 0) canvContext.moveTo(x_pixel, y_pixel);
      else canvContext.lineTo(x_pixel, y_pixel);
    }
    canvContext.stroke();

    // Draw the filter dots
    var dot_colours = ["white", "orange", "#C03C3C", "#38A53B", "#3FB7C0"];
    for (var i = 0; i < 5; i++) {
      var G = parametricEQ[i].gain.value;
      var F = parametricEQ[i].frequency.value;
      var x_pos = (Math.log10(F) - fl_bounds[0]) / (fl_bounds[1] - fl_bounds[0]);
      var y_pos = 1 - (G - g_bounds[0]) / (g_bounds[1] - g_bounds[0]);
      canvContext.fillStyle = dot_colours[i];
      canvContext.beginPath();
      canvContext.arc(canvas.width * x_pos, canvas.height * y_pos, 5, 0, Math.PI * 2);
      canvContext.closePath();
      canvContext.fill();
    }
  }
  // Connecting the I/O of the chain
  this.addInput(input);
  this.addOutput(output);
  (function() {
    var i;
    for (i = 0; i < this.numOutputs; i++) {
      var node = this.context.createAnalyser();
      this.features.push(node);
      this.outputs[i].connect(node);
    }
  })();
};
EQPlugin.prototype = Object.create(BasePlugin.prototype);
EQPlugin.prototype.name = "EQ Plugin";
EQPlugin.prototype.version = "1.0.0";
EQPlugin.prototype.uniqueID = "RTSFXeq";
