/* User Interface Loading Functions*/
function popup() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function videoPopup() {
    var popup = document.getElementById("videoPopup");
    popup.classList.toggle("show");
}

function loadWireFrame() {
    return new Promise((resolve) => {
        $("header").load("../app/grid-panels/header.html", () => {
            console.log("%c header.html loaded successfully", "color:DarkTurquoise; font-weight:bold");
            $("sb-left").load("../app/grid-panels/sidebar-left.html", () => {
                console.log("%c sidebar-left.html loaded successfully", "color:DarkTurquoise; font-weight:bold");
                $("sb-right").load("../app/grid-panels/sidebar-right.html", () => {
                    console.log("%c sidebar-right.html loaded successfully", "color:DarkTurquoise; font-weight:bold");
                    resolve();
                });
            });
        });
    });
}

function loadAudioFxInterface() {
    return new Promise((resolve) => {
        $("#distortion-control").load('../app/grid-panels/effects/distortion.html', () => {
            console.log("%c distortion.html loaded successfully", "color:DarkTurquoise; font-weight:bold");
            $("#delay-control").load('../app/grid-panels/effects/delay.html', () => {
                console.log("%c delay.html loaded successfully", "color:DarkTurquoise; font-weight:bold");
                $("#reverb-control").load('../app/grid-panels/effects/reverb.html', () => {
                    console.log("%c reverb.html loaded successfully", "color:DarkTurquoise; font-weight:bold");
                    $("#equaliser-control").load('../app/grid-panels/effects/equalizer.html', () => {
                        console.log("%c equalizer.html loaded successfully", "color:DarkTurquoise; font-weight:bold");
                        $("#compressor-control").load('../app/grid-panels/effects/compressor.html', () => {
                            console.log("%c compressor.html loaded successfully", "color:DarkTurquoise; font-weight:bold");
                            $("#spatialisation").load('../app/opt-panel/spatialisation.html', () => {
                                console.log("%c spatialiation.html loaded successfully", "color:DarkTurquoise; font-weight:bold");
                                resolve();
                            });
                        });
                    });
                });
            });
        });
    });
}

function loadRandomisationSectionInterface() {
    return new Promise((resolve) => {
        $("#randomisation").load("../app/opt-panel/randomisation.html", function () {
            console.log("%c randomisation.html loaded successfully", "color:DarkTurquoise; font-weight:bold");
            resolve();
        });
    });
}

function loadTriggerSectionInterface() {
    return new Promise((resolve) => {
        $("#trigger").load("../app/opt-panel/trigger.html", function () {
            console.log("%c trigger.html loaded successfully", "color:DarkTurquoise; font-weight:bold");
            resolve();
        });
    });
}

function loadPresetInterface() {
    return new Promise((resolve) => {
        $.getScript("../app/presets/" + getPatchName() + "-presets.js", () => {
            console.log("%c loadPresetInterface complete", "color:orange; font-weight: bold");
            resolve();
        });
    });
}

function displayInfo(obj) {
    var content = {

        "Alert": {
            "pitchSlider": "Controls the Pitch of the Alert Siren",
            "durationSlider": "Controls the Time Duration of the Alert Siren",
            "explodeButton": "Click to ring the Alert Siren",
        },
        "Alarm": {
            "srcSelect": "Select the source waveform for the Alarm",
            "CarrierSlider": "Controls the Pitch of the source waveform",
            "DepthSlider": "Controls the intensity of the variations in the source waveform pitch",
            "RateSlider": "Controls the Speed of the pitch variations",
            "PulseSwitch": "turn on/off noise pulse that occurs at regular intervals"
        },
        "Aeolian Tones": {
            "airSpeedInputNexus": "Controls the speed at which air keeps moving past the cylinder",
            "diameterInputNexus": "Controls the diameter of the cylinder",
            "lengthInputNexus": "Controls the length of the cylinder",
            "obsElevInputNexus": "Vertical angle between the audiosource and the observer",
            "obsAzimInputNexus": "Horizontal distance between the audio source and the observer",
            "obsDistInputNexus": "Controls the distance between the observer and the audio source",
            "outGainInputNexus": "overall gain of the audio source",
        },
        "Aeolian Tones": {
            "airSpeedInputNexus": "Controls the speed at which air keeps moving past the cylinder",
            "diameterInputNexus": "Controls the diameter of the cylinder",
            "lengthInputNexus": "Controls the length of the cylinder",
            "obsElevInputNexus": "Vertical angle between the audiosource and the observer",
            "obsAzimInputNexus": "Horizontal distance between the audio source and the observer",
            "obsDistInputNexus": "Controls the distance between the observer and the audio source",
            "outGainInputNexus": "overall gain of the audio source",
        },
        "Bouncing": {
            "oneBounceButton": "Click to hear a single bounce",
            "sequenceBounceButton": "Click to Multiple bounces",
            "coefficientSlider": "Controls the number of bounces by defining how bouncy the object is",
            "wobbleSlider": "Controls the shape of the bouncing object",
            "heightSlider": "Controls the height from which the object is dropped",
            "sequenceTimes": "Time Interval controls the time interval between two consecutive bounces",
            "sequenceMags": "Amplitude controls the loudness of each bounce",
        },
        "Applause": {
            "startStop": "Click to start/stop the applause",
            "startTimeSlider": "Controls the time duration taken for all the clappers to start clapping",
            "stopTimeSlider": "Controls the time duration taken for all the clappers to stop clapping",
            "masterClapRateSlider": "Controls the speed of the applause",
            "applause_depthSlider": "Controls the total number of clappers",
            "enthusiasmSlider": "Controls the enthusiasm of the clappers",
            "widthSlider": "Positions the observer within the crowd or infront of the crowd",
        },
        "Bells": {
            "sourceSelect": "click and select the type of bell",
            "strikeButton": "click to strike the bell",
            "pitch": "Controls the pitch of the bell",
            "BellDuration": "Controls the total time duration for which the bell rings"
        },
        "Bird Call": {
            "tweetButtonNexus": "Click to hear a bird call",
            "freqInputNexus": "Carrier frequency controls the pitch of the the audible carrier signal",
            "fmFreqInputNexus": "Controls the pitch modulation of the bird tweet",
            "amFreqInputNexus": "Controls the pitch of the loudness modulation signal",
            "fmAmpInputNexus": "Controls the loudness of the pitch modulation signal",
            "amAmpInputNexus": "Controls the loudness of the loudness modulation signal",
            "amAmpAttackInputNexus": "Controls the fade in time of the loudness modulation signal",
            "fmAmpAttackInputNexus": "Controls the fade in time of the pitch modulation signal",
            "amFreqAttackInputNexus": "Controls the fade in time of the pitch modulation caused by the loudness modulation signal",
            "fmFreqAttackInputNexus": "Controls the fade in time of the pitch modulation caused by the pitch modulation signal",
            "attackInputNexus": "Controls the fade in time of the audible carrier signal",
            "decayInputNexus": "Controls the fade out time of the audible carrier signal",
            "fmFreqDecayInputNexus": "Controls the fade out time of the pitch modulation caused by the pitch modulation signal",
            "amFreqDecayInputNexus": "Controls the fade out time of the pitch modulation caused by the loudness modulation signal",
            "fmAmpDecayInputNexus": "Controls the fade out time of the pitch modulation signal",
            "amAmpDecayInputNexus": "Controls the fade out time of the loudness modulation signal"
        },

        "Bird Call": {
            "tweetButtonNexus": "Click to hear a bird call",
            "freqInputNexus": "Carrier frequency controls the pitch of the the audible carrier signal",
            "fmFreqInputNexus": "Controls the pitch modulation of the bird tweet",
            "amFreqInputNexus": "Controls the pitch of the loudness modulation signal",
            "fmAmpInputNexus": "Controls the loudness of the pitch modulation signal",
            "amAmpInputNexus": "Controls the loudness of the loudness modulation signal",
            "amAmpAttackInputNexus": "Controls the fade in time of the loudness modulation signal",
            "fmAmpAttackInputNexus": "Controls the fade in time of the pitch modulation signal",
            "amFreqAttackInputNexus": "Controls the fade in time of the pitch modulation caused by the loudness modulation signal",
            "fmFreqAttackInputNexus": "Controls the fade in time of the pitch modulation caused by the pitch modulation signal",
            "attackInputNexus": "Controls the fade in time of the audible carrier signal",
            "decayInputNexus": "Controls the fade out time of the audible carrier signal",
            "fmFreqDecayInputNexus": "Controls the fade out time of the pitch modulation caused by the pitch modulation signal",
            "amFreqDecayInputNexus": "Controls the fade out time of the pitch modulation caused by the loudness modulation signal",
            "fmAmpDecayInputNexus": "Controls the fade out time of the pitch modulation signal",
            "amAmpDecayInputNexus": "Controls the fade out time of the loudness modulation signal"
        },

        "Footsteps": {
            "listenerPerspective": "this switch toggles the footsteps from a third person perspective to a first person perspective",
            "pace": "Pace controls the speed of the footsteps",
            "softnessHardnessRatio": "This slider makes the footsteps harder or softer",
            "startStop": "click this button to hear a footstep",
            "shoeType": "choos the type of shoe from this drop down menu",
            "movementType": "Choose the type of movement from this drop down menu",
            "surfaceType": "Choose the surface on which the footsteps happen from this drop down menu",
            "terrainType": "Surface type is used to control if the footsteps happen on a flat surface or if it happens in a staircase",
            "HeelGain": "this slider controls the loudness of the sound that happens when the heel of the shoe hits the surface",
            "HeelAttack": "this slider controls the fade in time of the sound caused by heel of the shoe",
            "HeelDecay": "This slider controls the time taken for the heel sound to decay",
            "RollLength": "This slider controls the time duration of the sound caused by shoe when it rolls on the surface",
            "RollGain": "Roll gain controls the loudness of the roll sound that is caused when the shoe rubs against the surface",
            "BallAttack": "This slider controls the fade in time of the sound caused by the ball of the shoe",
            "BallGain": "This slider controls the loudness of the sound caused by the ball of the shoe",
            "BallDecay": "This slider controls the fade out time of the sound caused by the ball of the shoe"
        },

        "Guitar": {
            "PickPositionSlider": "This slider controls the position where the guitar strings are picked between the bridge to the neck",
            "PickDirectionSlider": "This slider changes the guitar sound between a muted sound and a open sound by altering the picking style between a up stroke or a downstroke",
            "DecaySlider": "Decay slider controls the fade out time for each note",
            "BrightnessSlider": "This slider adds a brigth edge to the sound, lower values result in a duller sound and higher value result in a bright sound",
            "DynamicLevelSlider": "Dynamic level controls the velocity with which the guitar strings are struck",
            "feedBackSlider": "The feedback slider creates a feedback howl, similar to what happens in a guitar amp"
        },

        "Beep": {
            "oscSelect": "Choose a timbre for the beeps",
            "oscFreq": "controls the pitch of the beeps",
            "interval": "controls the speed of the beeps",
            "soundRatio": "Time ratio between the silence and the beeps"
        },

        "Jet": {
            "turbineGain": "Turbine gain controls the loudness of the jet turbine",
            "burnGain": "Burn gain controls the loudness of the sound caused by fuel combustion",
            "manSpeed": "This slider can be used to controls the speed of the jet manually when the switch is in the manual mode",
            "onSwitch": "use this switch toggle between automatically starting the jet or controlling it manually using the manual speed slider",
            "maxThrust": "This slider is active only when automatic mode is selected, It controls the maximum speed that can be attained by the jet",
            "accTime": "THis slider is active only when audtomatic mode is selected, It controls the time taken by the jet to reach maximum thrust"
        },

        "Propeller": {
            "horse_powerSlider": "loudness of the propeller engine",
            "blade_lengthSlider": "length of the propeller blade, it affects the timbre of the propeller",
            "azimuthSlider": "angle between the source and the observer",
            "obs_distanceSlider": "distance between the observer and the propeller",
            "rpmSlider": "rotations per minute controls the pitch of the propeller. blade length decreases with higher rpm",
            "numberBladesTypeNexus": "the amount of blades in the propeller which affects the pitch of the propeller",
            "speedTypeNexus": "the speed at which the aircraft passes by the observer",
            "directionTypeNexus": "the direction in which the aircraft passes by the observer",
            "gateButtonNexus": "Click to fly the aircraft by the observer"
        },

        "Helicopter": {
            "rotorPeriodNexus": "This slider controls the speed of rotation of the helicopter blades",
            "baseFreqNexus": "the base frequency slider changes the pitch of the main rotor",
            "resonanceInputNexus": "this slider muffles the helicopter blade noise",
            "shiftInputNexus": "shift is used to select which pitch is muffled by the resonance parameter",
            "symmetryInputNexus": "this slider changes the rotor sound between a woosh and a slap",
            "gearMixInputNexus": "This slider controls the loudness gear sound in the mix",
            "tailMixInputNexus": "this slider controls the loudness of the helicopter tail in the helicopter sound",
            "engineMixInputNexus": "this slider controls the loudness of the engine sound",
            "engineSpeedInputNexus": "this slider increases the speed of the helicopter motor. It affects the pitch of the engine sound",
            "distanceInputNexus": "Distance controls the distance between the observer and the helicopter",
            "rotorMixInputNexus": "The rotor mix slider controls the loudness of the sound caused by the main rotor blade",
            "bladeNoiseInputNexus": "This slider controls the time duration of each blade sound",
        },

        "Rocket": {
            "durationSlider": "force controls the back pressure applied by the rocket launcher",
            "forceSlider": "force controls the back pressure applied by the rocket launcher",
            "azimuthSlider": "angle between the source and the observer",
            "exitNoiseSlider": "exit noise controls the initial noise impulse that occurs as the rocket exits the launcher",
            "chamberResSlider": "chamber resonance controls the resonant pitch of the lauch tube that modifies the timbre of the launch",
            "launchButton": "Click to lauch the rocket"
        },

        "Gun": {
            "fireButton": "click this button to fire the gun",
            "shellDecaySlider": "this slider controls the time length of the gun fire sound",
            "shellGainSlider": "this slider controls the loundess of the shell sound caused during the bullet detonation",
            "shellNoiseFreq": "Shell noise frequency controls the level of the high pitched sounds caused during the shell detonation",
            "timeSeparationSlider": "The shell seperation slider controls the total time taken by the bullet to travel down the gun barrell",
            "gassingGainSlider": "Gassing controls the loudness of the gas released as the round exits the barrel",
            "gassingNoiseFreqSlider": "Gassing noise frequency controls the pitch of the gassing sound"
        },

        "Light Saber": {
            "swingDecaySlider": "this slider controls how slowly the light saber swing stops",
            "swingAttackSlider": "this slider controls how slowly the light saber swing starts",
            "sheathTimeSlider": "this slider controls the time taken by the light saber to draw from its sheath or to retract it",
            "swingGainSlider": "This slider controls the loudness of the light saber when it is swung",
            "idleGainSlider": "Idle gain controls the loudness of the light saber buzz when it isn't moving ",
            "sheathGainSlider": "his slider controls the loudness of the sound caused when the lightsaber is drawn from its sheath",
            "sheathSwitch": "Toggle this switch to draw the light saber from its sheath or to retract it",
            "explodeButton": "Click this button to swing the  light saber",
            "src1Select": "Select a soundsource for the first light saber, this changes the timbre of the light saber sound",
            "src2Select": "Select a soundsource for the first second saber, this changes the timbre of the light saber sound",
        },

        "Gunshot": {
            "explodeButton": "click this button to fire the gun",
            "sourceSelect": "use this drop down menu to select between three different guns",
            "highSlider": "this slider controls the loundess of the high pitch content in the gun sound",
            "midSlider": "this slider controls the loundess of the mid pitch content in the gun sound",
            "lowSlider": "this slider controls the loundess of the low pitch content in the gun sound",
            "decaySlider": "this slider controls the fade out time of the gunshot sound",
        },

        "Creaking Door": {
            "upLengthSlider": "force controls the back pressure applied by the rocket launcher",
            "downLengthSlider": "force controls the back pressure applied by the rocket launcher",
            "rustSlider": "angle between the source and the observer",
            "triggerDoor": "click these buttons to open and close the creaking door",
            "triggerUp": "click these buttons to open the creaking door",
            "triggerDown": "click these buttons to close the creaking door",
            "doorParam": "chamber resonance controls the resonant pitch of the lauch tube that modifies the timbre of the launch",
        },

        "Fan": {
            "speedSlider": "this slider controls the speed of the fan rotation",
            "motorRatioSlider": "this slider controls the timbre of the fan motor",
            "motorLevelSlider": "motor level controls the overall loudness of the stator, rotor and the brush",
            "fanLevelSlider": "this slider controls the loudness of the fan hum",
            "fanNoiseSlider": "fan noise controls the loudness of the noise caused by the fan",
            "fanPulsewidthSlider": "this slider controls the choppiness of the fan sound",
            "fanButton": "Toggle this switch to turn the fan on or off",
            "brushLevelSlider": "Brush level controls the loudness of the motor brush",
            "rotorLevelSlider": "this slider controls the loudness of the sounds caused by the fans rotor",
            "statorLevelSlider": "The stator level slider controls the loudness of sound caused by the the fan's stator",
        },

        "Night Scene": {
            "firePan": "This slider pans the fire sounds between the left and rigth audio output channels",
            "fireGain": "this slider controls the loudness of the fire",
            "windPan": "This slider pans the wind sounds between the left and rigth audio output channels",
            "windGain": "this slider controls the loudness of the fire",
            "crittersGain": "this slider controls the loudness of the critter insects",
            "crittersPan": "This slider pans the critter sounds between the left and rigth audio output channels",
            "lapping": "lapping controls the loudness of the lapping sound caused by the combustion of the fuel",
            "hissing": "hissing controls the loudness of the regular outgassing and release of trapped vapour",
            "crackling": "this slider controls the loudness of the small scale explosions caused by stresses in the fuel",
            "windSpeed": "Controls the speedof the wind by changing its pitch",
            "gustiness": "Gusts occur at moderate wind speeds and gustiness controls the intensity of the gusts",
            "squall": "Squall occur at higher wind speeds and squall controls the intensity of the squalls",
            "leaves": "Leaves controls the amount of wind that blows past leaves",
            "branches": "Branches controls the amount of wind that blows past branches",
            "doorways": "Doorways controls the amount of wind that passes through open doorways",
            "buildings": "Buildings controls the amount of wind that blows past concrete structures",
            "cricketButton": "Toggle this switch to turn the cricket sounds on",
            "cricketSpeedSlider": "this slider controls the rate of the cricket chirps",
            "cricketFrequencySlider": "Cricket frequency slider controls the pitch of the cricket insect sounds",
            "cricketsGain": "this slider controls the volume level of the cricket sounds",
            "cricketsPan": "This slider pans the cricket sounds between the left and rigth audio output channels",
            "critterButton": "Toggle this switch to turn the critter sounds on",
            "critterSpeedSlider": "this slider controls the rate of the critter chirps",
            "critterFrequencySlider": "Critter frequency slider controls the pitch of the critter insect sounds",
            "windSettings": "click this to open additional settings for wind",
            "crittersSettings": "click this to oepn additional settings for critters",
            "cricketsSettings": "click this to open additional settings for crickets",
            "fireSettings": "click this to open additional settings for fire"
        },

        "Metal Impact": {
            "explodeButton": "click this button to hear the metal impact",
            "sourceSelect": "from this drop down menu choose from three different type of metal tools",
            "sourcePitchSlider": "This slider controls the pitch of the metal impact sound",
            "filterPitchSlider": "this slider removes the high pitch content in the metal impact sound",
            "decaySlider": "This slider controls the total time duration of the metal impact sound",
            "lowSlider": "Low slider adds an additional boost to the low pitch content in the metal impact sound",
            "midSlider": "this slider adds an additional boost to the mid pitch content in the metal impact sound",
            "highSlider": "this slider adds an additional boost to the high pitch content in the metal impact sound"
        },


        "Snap Crackle Pop": {
            "snapSwitch": "this switch turns random snaps on",
            "snapButton": "this button triggers one snap ",
            "snapBurst": "this button triggers a burst of snaps",
            "snapDensity": "This slider controls the total number of snaps that occur randomly when the snap switch is on",
            "Frequency": "This slider controls how frequenty the snaps occur",
            "qSlider": "this slider controls the loudness of the snaps",
            "crackleDensity": "crackle density controls the number of crackles that occur when the crackle switch is on",
            "crackleBurst": "click this button to hear a burst of crackles",
            "crackleButton": "this button triggers one crackle ",
            "crackleSwitch": "turn this switch on to hear random crackles ",
            "popSwitch": "turn on this switch to hear random pops",
            "popButton": "this slider adds an additional boost to the high pitch content in the metal impact sound",
            "popBurst": "click this button to hear a burst of pops",
            "popDensity": "pop density controls the number of crackles that occur when the pop switch is turned on",
            "vinylIntensity": "this slider controls the loudness of the background noise ",
            "qualitySlider": "this slider controlsthe intensity of the background hiss noise and the pops",
        },

        "Pouring": {
            "viscositySlider": "viscosity controls the thickness of the liquid that is being poured",
            "resonanceSlider": "this slider controls the effect of the pipe on the pitch of the pouring sound",
            "pourSpeedSlider": "This slider controls the time taken to pour the liquid from the slider into the container",
            "cavitySlider": "this slider controls the height of the container cavity into which the liquid is poured into",
            "triggerButton": "click hear to start pouring"
        },

        "Swinging Objects": {
            "tipSpeedInputNexus": "this slider controls the force with which the object is swung",
            "diameterInputNexus": "this slider controls the diameter of the tip of the swingin object, the tip cuts through the air which causes the sound ",
            "hiltDiameterInputNexus": "this slider controls the diameter of the handle of the swinging object",
            "lengthInputNexus": "this slider controls the time duration for which the object is swung",
            "rampButtonNexus": "click this button to swing the selected object",
            "swingObjectSelectNexus": "use this drop down menu to choose what object to swing",
            "swingLengthSelectNexus": "use this drop down menu to control the degree to which the object is swung",
            "obsDistInputNexus": "This slider controls the distance from which the swinging object is observer from",
            "obsAzimInputNexus": "This slider positions the observer around the swinging object in a the specified angle ",
            "obsElevInputNexus": "this slider controls the height from which the object is observed",
            "outGainInputNexus": "this slider controls the overall volume of the swinging object"
        },

        "Spray": {
            "durationSlider": "this slider controls how long the spray sound lasts",
            "pressureSlider": "this slider controls the fade in fade out time of the spray cannister, higher pressure yields faster fade in and slower fade out time",
            "strengthSlider": "this slider controls the bass in the spray sounds, a high intensity value will produce more rumble",
            "speedSlider": "this slider controls the size of the spray nozzle, a smaller nozzle translates to a boost in high-frequency range",
            "sizeSlider": "This slider affects the size affects the salient pitch of the sound, it relates to the size of the cannister containing the pressurised liquid/gas",
            "SprayButton": "Click this button to hear the spray",
            "flucDepthSlider": "this slider controls how much the volume varies",
            "flucTimeSlider": "This slider controls how frequently the volume variations occur"
        },

        "Ricochet": {
            "explodeButton": "click this button to hear the bullets",
            "hitSwitch": "toggle this switch to turn the sound of the bullets hitting a surface on or off",
            "hitGain": "this slider controls the loudness of the sound caused by bullets hitting a surface",
            "hitDecay": "this slider controls the fade out time duration of the ricochet hit sound",
            "ricochetDecay": "ricochet decay slider controls the fade off time of the ricochet sound",
            "ricochetGain": "ricochet gain slider controls the loudness of the ricochet sound",
            "ricochetSwitch": "toggle this switch to turn the sound of the ricochet",
            "dopplerRandom": "this slider controls the randomness of the pitch sweeps",
            "dopplerSweep": "this slider controls the depth of the doppler pitch sweeps",
            "dopplerSwitch": "this slider controls if the pitch changes during the ricochet sound, a doppler effect occurs on the pitch of the sound when an object passes by the observer",
        },

        "Rain": {
            "dropletSlider": "this slider controls the total number of droples occuring at once during the rain",
            "rumbleSlider": "this slider controls the loudness of the rumbling sound caused by the rain",
            "ambienceSlider": "this slider controls the loudness of the ambient hiss that happens during the rain"
        },

        "Stream": {
            "bubblesSlider": "this slider controls the number of bubbles formed in the stream",
            "frequencySlider": "the frequency slider controls the overall pitch of the stream",
            "qSlider": "filter Q controls the loudness of the central pitch of the stream sound",
            "sinkSlider": "this slider morphs the stream to sound like it is flowing into a sink"
        },

        "Droid": {
            "speedSlider": "speed controls the rate of the droid sounds",
            "r2Slider": "this slider controls amount of high pitch sounds in the droid speech",
            "r8Slider": "this slider controls the randomness of the droid sounds",
            "r14Slider": "gossipy adds more complexity to the sound"
        },

        "Fire": {
            "lapping": "lapping controls the loudness of the lapping sound caused by the combustion of the fuel",
            "hissing": "hissing controls the loudness of the regular outgassing and release of trapped vapour",
            "crackling": "this slider controls the loudness of the small scale explosions caused by stresses in the fuel",
            "intensity": "this slider adds more intensity to the burning flame by changing the low pitch content in the sound"
        },

        "Explosion": {
            "explodeButton": "click this to hear the explosion sound",
            "lowGain": "this slider controls the bass in the explosion sound",
            "lowDecay": "this slider controls the duration of the bass sound",
            "grit": "grit enables distortion in the explosion sound",
            "highDelay": "this slider adds a time delay to the hight frequency sounds",
            "whiteDecay": "this slider controls the time duration of the white noise",
            "whiteGain": "white gain controls the loudness of the white noise in the explosion sound",
            "pinkGain": "this slider controls the loudness of the pink noise",
            "pinkDecay": "pink decay controls the time duration of the pink noise",
        },

        "Electricity": {
            "humFrequency": "this slider controls the pitch of the electric hum",
            "frequencyBeating": "this slider changes the timbre of the electricity hum",
            "lowFrequency": "this slider controls the volume of the bass content in the electricity hum",
            "noiseModulation": "this slider controls the speed of the fluctuations in the loudness of the electricity hum",
            "humGain": "this slider controls the loudness of the electricity hum",
            "sparkIntensity": "this slider controls the loudness of the electric sparks",
            "sparkAmount": "This slider controls the amount of sparks triggered automatically ",
            "autoTrigger": "turn on this switch to ocassionally trigger electric sparks",
            "sparkTrigger": "click this button to trigger an electric spark",
            "sparkFrequency": "spark frequency controls the pitch of the sparks",
        },

        "Electric Motor": {
            "runButton": "click this button to hear the electric motor",
            "runtimeSlider": "this slider controls the total time duration for which the motor runs",
            "maxSpeedSlider": "this slider controls the maximum speed of the motor, this alters the pitch of the motor sound",
            "statorLevelSlider": "this slider controls the loudness of the stator sound",
            "brushLevelSlider": "this slider controls the loudness of the motor brush",
            "rotorLevelSlider": "this slider controls the loudness of the motor's rotor sound",
            "tubeResonanceSlider": "This slider controls the loudness of the motor tube that resonates with the motor sound",
            "gritSlider": "this slider distorts the sound caused by the resonating motor tube",
        },

        "Droplets": {
            "freqSlider": "this slider controls the softness of the droplet sounds",
            "roughnessSlider": "this slider  changes the timbre of the droplets",
            "surfaceAngleSlider": "this slider controls angle of the surface on which the droplets fall on, this affects the pitch of the individual droplets",
            "distSlider": "this slider moves the droplets closer or far away from the listener"
        },

        "Real Birds": {
            "freqStartNexus": "this slider controls the starting pitch of the bird syllable",
            "freqEndNexus": "this slider controls the ending pitch of the bird syllable",
            "rateInputNexus": "rate is in hertz describes how fast the bird syllable repeats",
            "lengthInputNexus": "thisslider controls the duration of each syllable in seconds",
            "numberInputNexus": "number controls the the number of times the bird syllable is repeated",
            "freq1XInputNexus": "shapes the x axis of the bezier curve that determines the pitch sweep of the bird syllable",
            "freq2XInputNexus": "shapes the x axis of the bezier curve that determines the pitch sweep of the bird syllable",
            "amp1XInputNexus": "shapes the x axis of the bezier curve that determines the volume of the bird syllable",
            "amp2XInputNexus": "shapes the x axis of the bezier curve that determines the volume of the bird syllable",
            "ovAttInputNexus": "This slider is used to add or attenuate high frequency content in the bird syllable",
            "freq1YInputNexus": "this slider shapes the Y axis of the bezier curve that determines the pitch sweep of the bird syllable",
            "freq2YInputNexus": "this slider shapes the Y axis of the bezier curve that determines the pitch sweep of the bird syllable",
            "amp1YInputNexus": "shapes the Y axis of the bezier curve that determines the volume of the bird syllable",
            "amp2YInputNexus": "shapes the Y axis of the bezier curve that determines the volume of the bird syllable",
            "isOddInputNexus": "this switch can be used to further alter the timbre of the bird syllable",
            "tweetButtonNexus": "click this button to hear the tweet"
        },

        "Bubbles": {
            "sources": "this slider controls the number of bubbles",
            "decay": "this slider controls the total time taken for the all the bubbles to pop",
            "energy": "this slider controls the loudness and intensity of the bubbles",
            "centerFreq": "this slider controls the average pitch of the bubbles",
            "freq_sweep": "this slider defines thedifference between the starting pitch and the ending pitch of the bubbles",
            "dropletsButton": "Click drop to hear bubbles"
        },

        "Computery": {
            "intensitySlider": "this slider controls the speed of the beeps",
            "rangeSlider": "this slider adds more variety to the beep sounds",
            "baseSlider": "this slider controls the lowest frequency of the beeps",
            "mixSlider": "this slider changes the timbre of the beeps between a smooth sound and a rough sound",
            "gritSlider": "this slider distorts the beep sounds",
        },

        "Clock": {
            "onOffSwitch": "this switch turns the clock on and off",
            "tempo": "tempo controls the speed of the clock",
            "hand": "this slider controls the loudness athe clocks moving hand",
            "tick": "tick occurs on every first and third beat",
            "tock": "tock occurs on every second and fourth beat",
            "escapement": "this slider controls the loudness of the escapement mechanism in clocks"
        },

        "Shaker": {
            "shakeButton": "Click to hear the Shaker",
            "beans": "beans control the number of particles in the shaker",
            "decay": "decay controls the time duration of the shake",
            "energy": "energy controls the loudness of the shake",
            "centerFreq": "center frequency controls the pitch of the shaker",
        },
        "Teleport": {
            "explodeButton": "Click here to hear the teleportation sound",
            "beamGain": "This slider controls the loudness of the teleportation beam",
            "activationWobble": "This slider controls the pitch variations in the activation sounds",
            "activationGain": "This slider controls the loudness of the activation sounds",
            "duration": "This slider controls the total length of the teleport sound"
        },
        "Thunder": {
            "strikeButton": "Click here to make the lightning strike",
            "isReverbOnNexus": "Toggle whether the individual lightning is dry or wet with reverb",
            "distanceSlider": "Adjust the perceived distance the listener is from the lightning strike",
            "initialStrikeSlider": "Influences the intensity and loudness of the initial strike",
            "rumbleSlider": "Change the depth of the roll of the thunder",
            "growlSlider": "Change the depth of the growl of background noise"
        },
        "Wind": {
            "windSpeed": "Controls the speedof the wind by changing its pitch",
            "gustiness": "Gusts occur at moderate wind speeds and gustiness controls the intensity of the gusts",
            "squall": "Squall occur at higher wind speeds and squall controls the intensity of the squalls",
            "leaves": "Leaves controls the amount of wind that blows past leaves",
            "branches": "Branches controls the amount of wind that blows past branches",
            "doorways": "Doorways controls the amount of wind that passes through open doorways",
            "buildings": "Buildings controls the amount of wind that blows past concrete structures",
            "pan": "Pan moves the wind between the left and right audio channels",
            "directionality": "Directionality makes the wind unidirectional or omnidirectional",
            "gain": "Gain controls the loudness of the wind"
        },

        "Marimba": {
            "pianoroll": "Press 'a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';' for each piano key Press ',' and '.' to change the octave"
        },

        "piano": {
            "pianoroll": "Press 'a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';' for each piano key Press ',' and '.' to change the octave"
        }
    };
    var pluginId = document.getElementById("titleHeader");
    var pluginName = pluginId.textContent;
    var controlId = obj.id;
    var info = document.getElementById("info-text");
    if (info !== null) {
        var result = pluginName in content;
        if (result) {
            info.textContent = content[pluginName][controlId];
        }
    }
}

function toolsdisplayInfo(obj) {
    var content = {
        "audioContextButton": "Click to start audio",
        "videopop": "Click to open a instruction video on how to use this model",
        "infopopup": "Click to view tips for using this model",
        "randButton": "Click to open the Randomiser, used to randomise selected plugin parameters",
        "randButton-sc": "Click to instantly Randomise the sliders selected inside the randomise tool",
        "trigButton": "Click to open the Trigger sequencer used to trigger buttons at regular intervals",
        "trigButton-sc": "Click and hold to start the trigger sequencer and release mouse to stop it",
        "spatButton": "Click to open spatialiser, used to modify the space in which the sounds occur and the listener's position",
        "spatBypass": "Toggle to bypass 3D spatialization. Use spatialization with headphones for best results",
        "presetSelect": "Click to list all the available presets",
        "presetButton": "Click to save the current settings as a preset",
        "recordOn": "Click and hold to record currently playing sounds",
        "eqButton": "Click to open Equaliser. Equaliser is used to control the loudness of selective frequencies in the input signal",
        "eqBypass": "Toggle to bypass Equaliser",
        "revButton": "Click to open Reverb. Reverb is used to add reflections to the input signal",
        "revBypass": "Toggle to bypass Reverb ",
        "delButton": "Click to open Delay. Delay is used to delay the input signal",
        "delBypass": "Toggle to bypass Delay",
        "distButton": "Click to open Distortion. Distortion is used to deform the input signal",
        "distBypass": "Toggle to bypass Distortion",
        "compButton": "Click to open Compressor. Compressor is used for reducing the loudness of the input signal if it is above a defined threshold.",
        "compBypass": "Toggle to bypass Compressor",
        "masterGainInput": "Controls the overall loudness of the audio output",
        "masterPanInput": "Control the position of the audio output between the left and the right channels",
        "masterMute": "Mute the audio output",
        "masterVisRadio": "Toggle between an Oscillogram and a Spectrogram",
        "addSeq": "Add a new sequencer",
        "deleteSeq": "Delete a sequencer",
        "dtime": "the total number of units in each trigger sequencer",
        "dunit": "speed of the sequencer",
        "dtrigger": "click to start/stop the sequencer",
        "Seqs": "fill the sequencer by clicking on the blocks",
        "mySelect": "Select a parameter from the dropdown list to trigger",
        "selectParameterToRandomise": "Choose all the parameters that need to be randomized, use ctrl/cmd + click to select multiple parameters",
        "buttonRandomise": "Click to Randomise the selected parameters",
        "sliderRandomPercentInput": "controls the amount of randomisation applied to the selected parameters",
        "xSlider": "Controls the width of the room",
        "ySlider": "Controls the height of the room",
        "xyPosition": "Click and drag the circle to move the sound source across the room",
        "resetPosition": "Reset the position of the sound source back to the center of the room",
        "zSlider": "Move the sound source to the back or to the front of the room",
        "compReleaseInput": " Time taken for the loudness reduction to stop after the input signal loudness falls below the threshold ",
        "compAttackInput": " Time taken for the loudness reduction to start after the input signal loudness rises above the threshold ",
        "compReductionInput": "Reduction sets the amount of loudness reduction ",
        "compRatioInput": "Controls the strength of compression by defining how much loudness reduction to apply when the signal goes above the threshold",
        "compKneeInput": "Knee Contols how fast the compressor transitions between the attack and release states",
        "compThresInput": "Loudness Threshold above which the loudness reduction should start",
        "delayLevelInput": "Loudness of the overall audio signal",
        "delayCutoffInput": "Low pass filter cut-off frequency for the delayed audio signal",
        "delayDryInput": "Loudness of the input audio signal",
        "delayWetInput": "Loudness of the delayed audio signal",
        "delayTimeInput": "Time interval between the original signal and the delayed signal",
        "delayFeedbackInput": "Number of time the delayed signal is repeated",
        "odDriveInput": "Drive controls the intensity of the distortion effect",
        "odToneInput": "Tone controls the brightness of the distorted signal",
        "odKneeInput": "Knee controls how gradually or abruptly distortion occurs",
        "odBiasInput": "Bias controls the texture of the distortion",
        "odLevelInput": "Loudness of the overall audio signal",
        "revHCInput": "Controls the brightness of the audio signal ",
        "revLCInput": "Controls the bass of the audio signal",
        "revWetInput": "Loudness of the reverb signal",
        "revDryInput": "Loudness of the input signal",
        "revLevelInput": "Loudness of the overall audio signal",
        "reverbType": "Select the type of reverb",
        "bandFilterTypeInput": "Select the type of filter",
        "lfEQFreqInput": "Filter cutoff frequency",
        "lfEQGainInput": "Loudness of the filter",
        "lfEQQInput": "Quality factor of the filter",
        "lmfEQFreqInput": "Filter cutoff frequency",
        "lmfEQGainInput": "Loudness of the filter",
        "lmfEQQInput": "Quality factor of the filter",
        "mEQFreqInput": "Filter cutoff frequency",
        "mEQGainInput": "Loudness of the filter",
        "mEQQInput": "Quality factor of the filter",
        "hmfEQFreqInput": "Filter cutoff frequency",
        "hmfEQGainInput": "Loudness of the filter",
        "hmfEQQInput": "Quality factor of the filter",
        "hfEQFreqInput": "Filter cutoff frequency",
        "hfEQGainInput": "Loudness of the filter",
        "hfEQQInput": "Quality factor of the filter"
    };
    const regex = /\d/;
    var controlId = obj.id;
    if (regex.test(controlId)) {
        controlId = controlId.replace(/[0-9]/g, '')
    }
    var info = document.getElementById("info-text");
    if (info !== null) {
        info.textContent = content[controlId];
    }

}

function hideInfo() {
    var info = document.getElementById("info-text");
    if (info !== null) {
        info.textContent = "";
    }
}