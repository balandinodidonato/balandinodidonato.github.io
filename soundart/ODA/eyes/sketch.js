// to use mouse: state, position, velocity distance, speed, orientation
// 4 drawing functions: line(), ellipse(), rect(), arc(), vertex(), etc.
// 2 conditionals
// Extreme change with mouse movement

var eyeLx = 0;
var eyeLy = 0;
var eyeLsize = 0;

var eyeRx = 0;
var eyeRy = 0;
var eyeRsize = 0;

var distL = 0;
var distR = 0;
var vel = 0;
var mouseXpressed = [0, 0];
var mouseYpressed = [0, 0];

var orientationX = "-";
var orientationY = "-";

var Lpoint0 = [307, 384];
var Lpoint1 = [307, 384];

var Lpoint0 = [307, 384];
var Lpoint1 = [307, 384];

var Rpoint0 = [717, 384];
var Rpoint1 = [717, 384];
var pressedColor = 0;

var rotX = 0;
var rotY = 0;

var index = 0;

function setup() {
  createCanvas(1024, 768);
  background(255);
  frameRate(2);
}

function draw() {
  
}


function mousePressed() {
/*
  mouseXpressed[1] = mouseX;
  mouseYpressed[1] = mouseY;
  line(mouseXpressed[0], mouseYpressed[0], mouseXpressed[1] , mouseYpressed[1]);
  mouseXpressed[0] = mouseXpressed[1];
  mouseYpressed[0] = mouseYpressed[1];
*/
  pressedColor = random(255);
  index = (index+1)%3;
}


function mouseMoved() {
  // Distance eye-mouse
  distL = dist(eyeLx, eyeLy, mouseX, mouseY);
  distR = dist(eyeRx, eyeRy, mouseX, mouseY);

  // Velocity
  vel = abs(movedX) + abs(movedY);

  // Orientation
  if (movedX>0){
    orienationX = "R";
  }
  else if (movedX<0){
    orienationX = "L";
  }
  else{
    orienationX = "-";
  }

  if (movedY>0){
    orienationY = "U";
  }
  else if (movedY>0){
    orienationY = "D";
  }
  else{
    orienationY = "-";
  }

  if(mouseX < width/2){
    stroke(255-vel);
    Lpoint1 = [((width/10)*3)+random(movedX), (height/2)+random(movedY)];
    if(index == 0){
      line(Lpoint0[0], Lpoint0[1], Lpoint1[0] , Lpoint1[1]);
    }
    if(index == 1){
      rect(Lpoint0[0]-(vel/2), Lpoint0[1]-(vel/2), vel , vel);
    }
    if(index == 2){
      ellipse(Lpoint0[0]-(vel/2), Lpoint0[1]-(vel/2), vel , vel);
    }
    Lpoint0[0] = Lpoint1[0];
    Lpoint0[1] = Lpoint1[1];
  }
  else{
    stroke(255-vel);
    Rpoint1 = [((width/10)*7)+random(movedX), (height/2)+random(movedY)];
    if(index == 0){
      line(Rpoint0[0], Rpoint0[1], Rpoint1[0] , Rpoint1[1]);
    }
    if(index == 1){
      rect(Rpoint0[0]-(vel/2), Rpoint0[1]-(vel/2), vel , vel);
    }
    if(index == 2){
      ellipse(Rpoint0[0]-(vel/2), Rpoint0[1]-(vel/2), vel , vel);
    }
    Rpoint0[0] = Rpoint1[0];
    Rpoint0[1] = Rpoint1[1];
  }

  // redraw eyes with triangles
  noFill();
  stroke(0, random(20));
  beginShape();
  vertex(random(width), random(height));
  vertex(random(width), random(height));
  vertex(random(width), random(height));
  endShape(CLOSE);
}
