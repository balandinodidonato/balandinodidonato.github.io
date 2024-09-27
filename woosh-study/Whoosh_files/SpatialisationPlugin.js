/*globals BasePlugin */
var SpatialisationPlugin = function (factory, owner) {
    BasePlugin.call(this, factory, owner);// This attaches the base plugin items to the Object
    var distanceX=100,distanceY=100;
    // Create Nodes
    var input = this.context.createGain(),output = this.context.createGain();
        listener = this.context.listener,panNode= this.context.createPanner();
    var bypass = false
    input.channelCountMode = 'explicit'; //Configure channels, # channels defined by value of channelCount.
    // Connect Nodes
    input.connect(output);

    if(listener.forwardX) {
       listener.forwardX.value = 0;
       listener.forwardY.value = 0;
       listener.forwardZ.value = -1;
       listener.upX.value = 0;
       listener.upY.value = 1;
       listener.upZ.value = 1;
     } else listener.setOrientation(0,0,-1,0,1,1);
 function setListenerPosition(){
   if(listener.positionX) {
     listener.positionX.value = 0.5*distanceX;
     listener.positionY.value = 0.5*distanceY;
     listener.positionZ.value = 0;
   } else listener.setPosition(0.5,0.5,0);
 }
   setListenerPosition();
   function setPannerPosition(){
     if(panNode.positionX) {
       panNode.positionX.value=0.5*distanceX;
       panNode.positionY.value=0.5*distanceY;
       panNode.positionZ.value = 0;
     } else panNode.setPosition(0.5*distance,0.5*distance,51);
   }
   setPannerPosition();
   panNode.panningModel = 'equalpower';
   panNode.distanceModel = 'inverse';
   panNode.refDistance = 1;
   panNode.maxDistance = 500;
   panNode.rolloffFactor = 0.05;
   panNode.coneInnerAngle = 360;
   panNode.coneOuterAngle = 0;
   panNode.coneOuterGain = 0;
   if(panNode.orientationX) {
     panNode.orientationX.value = 1;
     panNode.orientationY.value = 0;
     panNode.orientationZ.value = 0;
   } else panNode.setOrientation(1,0,0);
    // Create parameters
    var bypass_parameter = this.parameters.createNumberParameter("bypass", 0, 0, 1);
    var panPositionX_parameter = this.parameters.createNumberParameter("positionX",0.5,0,1);
    panPositionX_parameter.trigger=function(){ panNode.positionX.value=(panPositionX_parameter.value)*distanceX; }
    var panPositionY_parameter = this.parameters.createNumberParameter("positionY",0.5,0,1);
    panPositionY_parameter.trigger=function(){ panNode.positionY.value=(panPositionY_parameter.value)*distanceY; }
    var panPositionZ_parameter = this.parameters.createNumberParameter("positionZ",0,-1,1);
    panPositionZ_parameter.trigger=function(){
      if(!isNaN(panPositionZ_parameter.value)) panNode.positionZ.value=-100*panPositionZ_parameter.value;
    }
    var distanceX_parameter = this.parameters.createNumberParameter("distanceX",100,50,300);
    distanceX_parameter.trigger=function(){
      distanceX=distanceX_parameter.value;
      setListenerPosition();
      setPannerPosition();
    }
    var distanceY_parameter = this.parameters.createNumberParameter("distanceY",100,50,300);
    distanceY_parameter.trigger=function(){
      distanceY=distanceY_parameter.value;
      setListenerPosition();
      setPannerPosition();
    }
    bypass_parameter.trigger = function(){
      if(bypass_parameter.value == 0)
      {
        panNode.panningModel = 'equalpower'
        input.disconnect(panNode);
        input.connect(output);
      }
      if(bypass_parameter.value == 1)
      {
        panNode.panningModel = 'HRTF'
        input.disconnect(output);
        input.connect(panNode);
        panNode.connect(output);
      }
    }
    // Connecting the I/O of the chain
    this.addInput(input);
    this.addOutput(output);
    (function () {
      var i;
      for (i = 0; i < this.numOutputs; i++) {
          var node = this.context.createAnalyser();
          this.features.push(node);
          this.outputs[i].connect(node);
      }
  })();
};
SpatialisationPlugin.prototype = Object.create(BasePlugin.prototype);
SpatialisationPlugin.prototype.name = "Spatialisation Section Plugin";
SpatialisationPlugin.prototype.version = "1.0.0";
SpatialisationPlugin.prototype.uniqueID = "RTSFXspatialisation";
