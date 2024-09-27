let stars = [];
let x, y, starW, starH;
let border = 100;

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
  let noStars = 100;
  let speed = 10;
  stars = [];

  for (var i = 0; i < noStars; i++) {

    x = width/2;
    y = height/2;
    starW = random(width*.2);
    starH = random(height*.2);

    let c = color(random(0), random(145), random(145), random(145));
    let star = new Star(x, y, starW, starH, speed, c);
    stars.push(star);
  }
}

function draw(){
  for (let i = 0; i<stars.length; i++) {
    stars[i].update()
    stars[i].show();
  }
}

class Star {
  constructor(starX, starY, starWidth, starHeight, speed, color) {
      this.starX = starX;
      this.starY = starY;
      this.starWidth = starWidth;
      this.starHeight = starHeight;
      this.speed = speed;
      this.color = color;
  }

  update(){
    this.starX += (random(-this.speed, this.speed));
    this.starY += (random(-this.speed, this.speed));

    if (this.starX>width) {
      this.starX -= this.speed;
    }
    if (this.starY>height) {
      this.starY -= this.speed;
    }

    this.starX = abs(this.starX);
    this.starY = abs(this.starY);
    this.starX %= width;
    this.starY %= height;


    this.starWidth += random(-this.speed, this.speed);
    this.starWidth = abs(this.starWidth);
    if (this.starWidth>starW) {
      this.starWidth -= this.speed;
    }

    this.starHeight += random(-this.speed, this.speed);
    this.starHeight = abs(this.starHeight);
    if (this.starHeight>starH) {
      this.starHeight -= this.speed;
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
    line(this.starX-(this.starWidth/2),this.starY,this.starX+(this.starWidth/2),this.starY); // horizontal line
    line(this.starX,this.starY-(this.starHeight/2),this.starX,this.starY+(this.starHeight/2)); // vertical line
    line(this.starX-(this.starWidth/2),this.starY-(this.starHeight/2),this.starX+(this.starWidth/2),this.starY+(this.starHeight/2)); // topleft - bottom right
    line(this.starX+(this.starWidth/2),this.starY-(this.starHeight/2),this.starX-(this.starWidth/2),this.starY+(this.starHeight/2)); // topr ight - bottom left
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
