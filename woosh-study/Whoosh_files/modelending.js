
////////////////////////////////////////////////////////////
//THIS SCRIPT RUNS AT THE END OF EVERY MODEL UI HTML PAGE.//
////////////////////////////////////////////////////////////

Nexus.colors.accent = "#4A8DAC",Nexus.colors.fill = "#99CED4",Nexus.colors.dark = "#FFFFFF";
//var audioCtxButton = new createAudioContextToggle('#audioContextButton');
var parametersObject = {};// Object holding parameters of the plugins
var presets = {};// Object holding all the different presets
var chainStop;// Final node of the plugin chain
var master;// Master Section object
var eq;// EQ Section Object
var AudioCtxOn = false;

// soundFx is an array of strings in the form "RTSFX.....", declared in the model.html file.
// It contains the IDs of all the sound effects plugins required for the model.
// If not declared it will default to the ID specified for the variable pluginDetails
if (soundFx === undefined) var soundFx = [pluginDetails.id];
loadAudioSequence();
document.title = titleHeader.innerText = pluginDetails.name;
var masterPanVal = 0,masterGainVal = 1;
window.onresize =  resizeSliders();
resizeSliders();

// window.onload = ()=>{
//     document.body.addEventListener('click', frc);       // browser
//     document.body.addEventListener('touchstart', frc);  // mobile
// }
//
// function frc(e){
//     e.preventDefault();
//     forceResumeCtx(audioCtxButton);
//     document.body.removeEventListener("click", frc);
//     document.body.removeEventListener("touchstart", frc);
// }
