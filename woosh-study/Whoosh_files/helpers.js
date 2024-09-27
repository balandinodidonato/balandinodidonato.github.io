/* Audio Framework Helping Functions*/
/** RECORDER **/
function startRecording(input) {
    window.recorder = new Recorder(input);
    recorder && recorder.record();
}

function stopRecording(name) {
    recorder && recorder.stop();
    createDownloadLink(name)
    recorder.clear();
}

function deleteRec(event) {
    let delBtn = event.srcElement.id
    let rowNum = delBtn.slice(-1);
    let recName = "recbtn" + rowNum;
    let recList = document.getElementById(recName);
    recList.src = '';
    recList.parentNode.removeChild(recList);
    let delList = document.getElementById(delBtn);
    delParent = delList.parentNode;
    delParent.removeChild(delList);
    delParent.firstChild.setAttribute("class", 'li_1');
}

var executed = false;
var counter = 0;
function createDownloadLink(name) {
    recorder && recorder.exportWAV(function(blob) {
        var url = URL.createObjectURL(blob);
        var li = document.createElement('li');
        var au = document.createElement('audio');
        var hf = document.createElement('a');
        counter += 1;
        li.setAttribute("id", 'recbtn' + counter);
        au.controlsList = "nodownload";
        au.controls = true;
        au.src = url;

        var del1 = document.createElement('li');
        del1.setAttribute("class", 'li_1');
        del1.setAttribute("id", 'delbtn1');
        del1.addEventListener("click", deleteRec)
        var deln = document.createElement('li');
        deln.setAttribute("class", 'li_n');
        deln.setAttribute("id", 'delbtn' + counter);
        deln.addEventListener("click", deleteRec);
        if (name && typeof name == 'string') {
            hf.download = name + '.wav';
        } else {
            hf.download = createAutoFileName();
        };
        li.appendChild(au);
        li.appendChild(hf);
        let rList = document.getElementById("recList");
        let dList = document.getElementById("delList")

        if (rList != null) {
            rList.appendChild(li);
            if (!executed) {
                dList.appendChild(del1);
                executed = true;
            } else if (executed) {
                dList.appendChild(deln);
            }
        }
    });
}
// Load plugin corresponding to the sound effect
function loadSoundFxPlugins(Factory) {
    return [
        Factory.loadPluginScript({
            'url': pluginDetails.path,
            test: function() {
                return typeof window[pluginDetails.objName] === "function"
            },
            returnObject: pluginDetails.objName
        })
    ];
}
var loadAudioFxPlugins = function(Factory) {
    return pAudioFx = [
        // Load Overdrive Section
        Factory.loadPluginScript({
            'url': "../../jsap-plugins/audio-effects/OverdrivePlugin.js",
            test: function() {
                return typeof OverdrivePlugin === "function"
            },
            'returnObject': "OverdrivePlugin"
        }),
        // Load Delay Section
        Factory.loadPluginScript({
            'url': "../../jsap-plugins/audio-effects/DelayPlugin.js",
            test: function() {
                return typeof DelayPlugin === "function"
            },
            'returnObject': "DelayPlugin"
        }),
        // Load Convolution Reverb Section
        Factory.loadPluginScript({
            'url': "../../jsap-plugins/audio-effects/ConvolutionReverbPlugin.js",
            test: function() {
                return typeof ConvolutionReverbPlugin === "function"
            },
            'returnObject': "ConvolutionReverbPlugin"
        }),
        // Load Compressor Plugin
        Factory.loadPluginScript({
            'url': "../../jsap-plugins/audio-effects/CompressorPlugin.js",
            test: function() {
                return typeof CompressorPlugin === "function"
            },
            'returnObject': "CompressorPlugin"
        }),
        // Load EQ Plugin
        Factory.loadPluginScript({
            'url': "../../jsap-plugins/audio-effects/EQPlugin.js",
            test: function() {
                return typeof EQPlugin === "function"
            },
            'returnObject': "EQPlugin"
        }),
        // Load Spatialisation Section
        Factory.loadPluginScript({
            'url': "../../jsap-plugins/audio-effects/SpatialisationPlugin.js",
            test: function() {
                return typeof SpatialisationPlugin === "function"
            },
            'returnObject': "SpatialisationPlugin"
        }),
        // Load Master Section
        Factory.loadPluginScript({
            'url': "../../jsap-plugins/audio-effects/MasterPlugin.js",
            test: function() {
                return typeof MasterPlugin === "function"
            },
            'returnObject': "MasterPlugin"
        })
    ]
}
/** OTHER **/
function fadeAudioOut(audioOut) {
    audioOut.gain.setTargetAtTime(0, audio_context.currentTime, 0.01);
}

function createAutoFileName() {
    var now = new Date();
    var patchName = location.pathname.split("/");
    patchName = patchName[patchName.length - 1];
    patchName = patchName.replace(/\.[^/.]+$/, "");
    return patchName + '_' + now.toISOString().split('.')[0] + '.wav';
}

