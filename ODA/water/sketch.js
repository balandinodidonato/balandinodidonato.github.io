let img;
var R = 120;
var G = 50;
var B = 200;
var A = 9;
var size = 300;

function preload(){
  img = [loadImage('assets/0.jpg'),
         loadImage('assets/1.jpg'),
         loadImage('assets/2.jpg'),
         loadImage('assets/3.jpg'),
         loadImage('assets/4.jpg'),
         loadImage('assets/5.jpg'),
         loadImage('assets/6.jpg'),
         loadImage('assets/7.jpg'),
         loadImage('assets/8.jpg'),
         loadImage('assets/9.jpg'),
         loadImage('assets/10.jpg'),
         loadImage('assets/11.jpg'),
         loadImage('assets/12.jpg'),
         loadImage('assets/13.jpg'),
         loadImage('assets/14.jpg'),
         loadImage('assets/15.jpg'),
         loadImage('assets/16.jpeg'),
         loadImage('assets/17.jpg')];
}

function setup() {
  createCanvas(600, 600);
  background(255);
  frameRate(32);
  
}

function draw() { 
  for(var x=0; x<width-1; x=x+size){
    for(var y=0; y<height-1; y=y+size){
      var index = int(random(16));
      tint(random(255), random(255), random(255), A);
      image(img[index], x, y, size, size);
    }
  }
}

function mousePressed(){
  A = random(8)+1;
}