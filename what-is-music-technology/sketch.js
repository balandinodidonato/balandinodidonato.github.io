var wave; // is our oscilator
var playing = false;
var index0 = 0;
var index1 = 0;
var arrayLength = 0;
var counter = 1;
var dailyCasesArray = []; // array that will contain daily cases figures, per each day
var maxCases;
let buttonSonification;
let country;
let audioONOFF;
let audioBtn;
let submitBtn;
let allData;
let visualisation;

function preload(){
  loadJSON("https://pomber.github.io/covid19/timeseries.json", gotData); // loads official covid data of england
}

function gotData(data){
  allData = data;// this is how you access data which objects id contain spaces
}

function setup() {
  const widthCanvas = windowWidth-10;
  const heightCanvas = widthCanvas;

  audioBtn = document.getElementById("audio").addEventListener("click", audioTgl); 
  submitBtn = document.getElementById("submit").addEventListener("click", getherData); 
  cvnSonification = createCanvas(widthCanvas, heightCanvas);

  oscSetUp();
  getherData();
}

function audioTgl(){
    if (!audioONOFF) {
      audioONOFF=true;
      document.getElementById("audio").value="ON";
    } else {
      audioONOFF=false;
      document.getElementById("audio").value="OFF"
    }
}

function getherData(){
  clearInterval(visualisation);
  dailyCasesArray = [];

  country = document.getElementById("country").value.toString();

  // from line 20 till 24 is the code to extract the maximum number of cdaily covid cases
  for (var day=1; day<allData[country].length; day++){ // for loop to iterate across the whole data set
    dailyCasesArray.push(dailyCases(day)); // add number each daily cases into array
  }
  maxCases = max(dailyCasesArray); // calculates the maximum of number of daily cases

  resetVisualisation();
  
  visualisation = setInterval(drawData, 20);
}

function drawData() {
  if(allData[country]){ // Cheks that the allData[country] is filled.

    increment = deltaTime / 50; // delataTime is time difference between the beginning of the previous frame and the beginning of the current frame in milliseconds.
    // this allows to to set out the increment of our counter in function of time (faster or slower). The higher is the divided the slower will be the increment and so the progression from one data to the other one.
    counter = (counter+increment)%arrayLength; // update the counter; module array lenght so it will restart from 0 every time
    index0 = int(counter); // current index
    var currentDailyCases = dailyCasesArray[index0]; // extracts the current daily cases

    if(index0 != index1){ // makes sure that the same sound is not repeated twice. If the current index is different thant he previous one than carry on. this can happen because the counter increment might be less than 1. Thus, the counter can result of the same integer value for more than one iteration of the draw function.

      
     if(audioONOFF){
      var midiNote = int(map(currentDailyCases, 0, maxCases, 40, 100)); // generates a MIDI note according to the number of cases low pitch=lowcases, high pitch=high number of cases
      var f = midiToFreq(midiNote); // Transforms the note in frequency

      wave.freq(f);
      wave.amp(0.8, 0.3);
     }  else {
      wave.amp(0, 0.3);
     }
    
      var x = map(counter, 0, arrayLength, 0, width); // advance the x of the line according to the counter value
      var y = map(currentDailyCases, 0, maxCases, height-30, 30); // sents the y of the line according to number of cases
      stroke(255);
      line(x, height-30, x, y);

      index1 = index0;

      if(index0>=arrayLength-1){ // this redraws the background so data the data visualisation can restart
        resetVisualisation();
      }
    }
  }
}


function dailyCases(index){
  return allData[country][index].confirmed - allData[country][index-1].confirmed; // extracts the number of daily cases. We calculated this in
}

function resetVisualisation(){
  background(240);
  arrayLength = allData[country].length-1; // calcultes the lenght of the array
  text(allData[country][0].date, 2, height-10); // draw the date of the first day in the array
  text(allData[country][int(arrayLength/2)].date, (width/2)-30, height-10); // draw the date of the day of half of the perdiod of data
  text(allData[country][arrayLength].date, width-60, height-10); // draw the date of the last day the data were pulled
  text("Country: "+country+"     Range: 0-"+maxCases+" cases", 5, 15); // draws the text about the
  fill(50);
  noStroke();
  rect(0, 20, width, height-48);
  counter = 0;
}

function oscSetUp(){
  wave = new p5.Oscillator(); // creates an oscilator named wave
  wave.setType('sine'); // sents the oscilator of type sine
  wave.amp(0);
  wave.start();
}
