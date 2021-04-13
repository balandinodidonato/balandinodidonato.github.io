let img;
const colors = [[245, 66, 132], [255, 0, 0], [247, 95, 0], [247, 193, 0], [247, 247, 0], [181, 247, 0], [103, 247, 0], [0, 255, 0], [247, 45, 0], [178, 102, 255], [51, 255, 51], [255, 255, 255], [102, 178, 255], [51, 153, 255], [51, 51, 255], [255, 0, 127], [178, 102, 255], [255, 0, 255], [102, 0, 204], [0, 0, 255], [0, 0, 255], [51, 51, 255], [0, 255, 255], [0, 255, 255], [0, 255, 255]];
const keypointsName = ["Nose", "Neck", "R Shoulder", "R Elbow", "R Wrist", "L shoulder", "L Elbow", "L Wrist", "Mid hip", "R Hip", "R Knee", "R Ankle", "L Hip", "L Knee", "L Ankle", "R Eye", "L Eye", "L Ear", "R Ear", "R Big toe", "R small_toe", "R Heel", "L Big toe", "R small_toe", "R Heel"];
let imgBuffer, legendBuffer;

function preload() {
  img = loadImage('dataViz-sample.png');
}


function setup() {
  const ratio = img.width/img.height;
  const widthCanvas = windowWidth;
  const heightCanvas = widthCanvas / ratio;
  let cnv = createCanvas(widthCanvas, heightCanvas);
  
  
  imgBuffer = createGraphics(width*0.76, height*0.76);
  legendBuffer = createGraphics(width*0.14, height);

  cnv.position((width-(legendBuffer.width+imgBuffer.width))/2, 0);

  imgBuffer.image(img, 0, 0, imgBuffer.width, imgBuffer.height);
  
}

function draw(){
  background(30, 39, 49);
  
  image(imgBuffer, legendBuffer.width, 0, imgBuffer.width, imgBuffer.height);
  image(legendBuffer, 0, 0, legendBuffer.width, legendBuffer.height);
  drawLegend();
  showPointer();
}

function showPointer(){
  colorMode(RGB);
  stroke(255, 0, 0);
  strokeWeight(3);
  
  let imgBuffer05 = legendBuffer.width + (imgBuffer.width/2);
  
  if (mouseX>legendBuffer.width && mouseX<imgBuffer05 && mouseY<imgBuffer.height) {  
    line(mouseX, 0, mouseX, imgBuffer.height);
    let y = mouseY%(imgBuffer.height/2);

    line(legendBuffer.width, y, imgBuffer05, y);
    line(legendBuffer.width, y+(imgBuffer.height/2), imgBuffer05, y+(imgBuffer.height/2));
  }

  if(mouseX>imgBuffer05 && mouseX < legendBuffer.width+imgBuffer.width && mouseY<imgBuffer.height){
    line(mouseX, 0, mouseX, imgBuffer.height);
    line(imgBuffer05, mouseY, legendBuffer.width+imgBuffer.width, mouseY);
  }
}

function drawLegend(){
  const tSize = width*0.013;
  const tWidth = width*0.1;
  const boxX = 5+tWidth;
  const tBoxWidth = tSize*0.8;
  const tHeightMargin = legendBuffer.height * 0.027;

  for (let index = 0; index < keypointsName.length; index++) {
    // lables
    legendBuffer.fill(255);
    legendBuffer.noStroke();
    legendBuffer.textSize(tSize);
    legendBuffer.text(keypointsName[index], 5, (index*tHeightMargin)+tSize, tWidth, tSize);
    //boxes
    legendBuffer.fill(colors[index][0], colors[index][1], colors[index][2]);
    legendBuffer.stroke(0);
    legendBuffer.strokeWeight(0.5);
    legendBuffer.rect(boxX, (index*tHeightMargin)+tSize, tBoxWidth, tBoxWidth);
  }
}