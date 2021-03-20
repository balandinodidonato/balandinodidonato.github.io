let motionData;
let checkbox_k = [];
let keypointsToDraw;
let barkData;
let audioLoudnesData;
let c_threshold;
let cnv;
const marginLeft = 10;
const noDisplays = 3;
let tSize;
const tMargin = 5;

const colors = [[245, 66, 132], [255, 0, 0], [247, 95, 0], [247, 193, 0], [247, 247, 0], [181, 247, 0], [103, 247, 0], [0, 255, 0], [247, 45, 0], [178, 102, 255], [51, 255, 51], [255, 255, 255], [102, 178, 255], [51, 153, 255], [51, 51, 255], [255, 0, 127], [178, 102, 255], [255, 0, 255], [102, 0, 204], [0, 0, 255], [0, 0, 255], [51, 51, 255], [0, 255, 255], [0, 255, 255], [0, 255, 255]];

function preload() {
  loadJSON('../data_test/body_raw_keypoints_0_360.json', gotData);
  barkData = loadTable('../data_test/0_360_bark.csv', 'csv');
  audioLoudnesData = loadTable('../data_test/0_360_loudness.csv', 'csv');
}

function gotData(data) {
  motionData = data.keypoints;
}

function setup() {
  const widthCanvas = windowWidth - 250;
  const heightCanvas = widthCanvas / 1.7777777777777777777777777778;
  cnv = createCanvas(widthCanvas, heightCanvas);
  cnv.position(240, 10);
  tSize = width*0.019;

  background(255);

  keyPntHeatBuffer = createGraphics(width / 2, height / 2);
  keyPntMovHeatBuffer = createGraphics(width / 2, height / 2);

  qomBuffer = createGraphics(width / 2, height / noDisplays);
  loudnessBuffer = createGraphics(width / 2, height / noDisplays);
  barkBuffer = createGraphics(width / 2, height / noDisplays);
  
  const dropdownText = createP('Confidence threshold').position(marginLeft, 0).size(150, 10);
  
  c_threshold = createSelect().value(0).position(marginLeft + 150, 15);

  for (let index = 0; index < 10; index++) {
    c_threshold.option(index / 10);
  }

  c_threshold.changed(() => {
    drawHeatmap();
    drawQOM();
  });

  if (motionData) {

    keypointsToDraw = new Array(motionData.length);

    let keypointSelectionText = createP('Keypoints to display').position(marginLeft, 25).size(150, 20);

    let positionInit = 45;
    let positionIncrement = 0;
    let checkBoxSize = 20;

    for (let i = 0; i < motionData.length; i++) { // creates checkbox_kes
      if (motionData[i].no_frames) { // creates a checkboxes only if there are frames for a certain keypoint
        positionIncrement++;
        checkbox_k[i] = createCheckbox(i + ", " + motionData[i].k_name, true).position(10, (positionIncrement * checkBoxSize) + positionInit); // creates checkbox

        if (checkbox_k[i].checked()) { // if active ...
          keypointsToDraw[i] = new drawk(motionData, i, true, true); // creates a new keypoint
        } else {
          keypointsToDraw[i] = null; // deletes keypoint
        }

        checkbox_k[i].changed(() => { // if a checkbox status changes ...
          if (checkbox_k[i].checked()) { // if active ...
            keypointsToDraw[i] = new drawk(motionData, i, true, true); // creates a new keypoint
          } else {
            keypointsToDraw[i] = null; // deletes keypoint
          }
          drawHeatmap();
          drawQOM();
        });
      }
    }

    drawHeatmap();
    drawQOM();
    drawBark();
    drawLoudness();
  }
  loop();
  frameRate(24);
}

function draw(){
  background(0);

  showQuom();
  showLoudness();
  showBark();
  showHeatmaps();
  showPointer();
}

function showPointer(){
  colorMode(RGB);
  stroke(255, 0, 0);
  strokeWeight(3);
  line(mouseX, 0, mouseX, height);

  if (mouseX<width/2) {  
    let y = mouseY%keyPntHeatBuffer.height;
    line(0, y, width/2, y);
    line(0, y+keyPntHeatBuffer.height, width/2, y+keyPntHeatBuffer.height);
  }

  if(mouseX>width/2){
    line(width/2, mouseY, width, mouseY);
  }
}