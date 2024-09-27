let lines = [];

function setup(){
  if (windowWidth<windowHeight) {
    createCanvas((windowWidth/3)-border, (windowWidth/3)-border);
  } else {
    createCanvas((windowHeight/3)-border, (windowHeight/3)-border);
  }

  start();
}

function start(){
  background("black");
  let noLines = 100;
  let speed = 10;
  lines = [];

  for (var i = 0; i < noLines; i++) {
    let starX0 = width/2;
    let starY0 = height/2;
    let starX1 = starX0+random(-speed, speed);
    let starY1 = starY0+random(-speed, speed);

    let c = color(random(0), random(145), random(145), random(145));
    let star = new Line(starX0, starY0, starX1, starY1, speed, c);
    lines.push(star);
  }
}

function draw(){
  for (let i = 0; i<lines.length; i++) {
    lines[i].update()
    lines[i].show();
  }
}

class Line {
  constructor(starX0, starY0, starX1, starY1, speed, color) {
      this.starX0 = starX0;
      this.starY0 = starY0;
      this.starX1 = starX1;
      this.starY1 = starY1;
      this.speed = speed;
      this.color = color;
  }

  update(){
    this.starX0 += (random(-this.speed, this.speed));
    this.starY0 += (random(-this.speed, this.speed));
    this.starX0 = abs(this.starX0);
    this.starY0 = abs(this.starY0);
    if (this.starX0>width) {
      this.starX0 -= this.speed;
    }
    if (this.starY0>height) {
      this.starY0 -= this.speed;
    }


    this.starX1 += (random(-this.speed, this.speed));
    this.starY1 += (random(-this.speed, this.speed));
    this.starX1 = abs(this.starX1);
    this.starY1 = abs(this.starY1);
    if (this.starX1>width) {
      this.starX1 -= this.speed;
    }
    if (this.starY1>height) {
      this.starY1 -= this.speed;
    }

    this.blue = blue(this.color)+random(-this.speed*2, this.speed*2);
    this.blue = abs(this.blue);
    this.blue %= 255;
    this.color.setBlue(this.blue);

    this.green = green(this.color)+random(-this.speed*2, this.speed*2);
    this.green = abs(this.green);
    this.green %= 255;
    this.color.setGreen(this.green);

    this.alpha = alpha(this.color)+random(-this.speed*2, this.speed*2);
    this.alpha = abs(this.alpha);
    this.alpha %= 255;
    this.color.setAlpha(this.alpha);
  }

  show(){
    stroke(this.color);
    strokeWeight(random(0.1));
    line(this.starX0,this.starY0,this.starX1, this.starY1); // horizontal line

  }
}

function windowResized() {
  if (windowWidth<windowHeight) {
    createCanvas((windowWidth/3)-border, (windowWidth/3)-border);
  } else {
    createCanvas((windowHeight/3)-border, (windowHeight/3)-border);
  }
  start();
}
