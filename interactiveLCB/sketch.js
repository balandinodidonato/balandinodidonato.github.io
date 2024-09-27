var consumerKey = 'fDbqHOgK7YSCv1jBn1xo56gxV';
var consumerSecret = 'JgyjFjfReAQ1moZQrpSbzl03W3TQ4lsWDpGzImJp8GLfyD4YPu';

var token = '77984972-VMhm6Cz1GJiedFzcicTmrtsN8atzEyGgXCquT7u8O';
var tokenSecret = 'VTLaIHtMpSLksIMcInz5mkVqba4Ar4ks6akrLPHlTCYHf';

var cb = new Codebird();
var imagesURL = [];
var images = [];
var indexImage = 0;
var factor = 1  ;
var colors = [];

function setup() {
  createCanvas(600, 600);
  setInterval(callTweet, 1000);
  frameRate(10);
}

function callTweet(query){
  imagesURL = [];
  images = [];

  cb.setConsumerKey(consumerKey, consumerSecret);
  cb.setToken(token, tokenSecret);

  var params = {
    q: "#interactiveLCB",
    result_type: 'all'
  };

  cb.__call(
    "search_tweets",
    params,
    function(reply) {
      var statuses = reply.statuses;
      for (var i = 0; i < statuses.length; i++) {
        var tweet = statuses[i];

      //  if (!tweet.retweeted_status) {
          print("- USER NAME: " + tweet.user.name +  " - TEXT: " + tweet.text + " - user bg color: " + tweet.user.profile_background_color);
          colors.push(tweet.user.profile_background_color);
          imagesURL.push(tweet.user.profile_image_url);
      //  }
      }



      for (var i = 0; i < imagesURL.length; i++) {
        loadImage(imagesURL[i], drawImage);
      }
    }
  );
}

function drawImage(imagesss){


  image(imagesss, random(width-imagesss.width*factor), random(height-imagesss.height*factor), imagesss.width*factor, imagesss.height*factor);
}

function draw() {
  /*
  for (var i = 0; i < colors.length; i++) {
    noStroke();
    fill("#"+colors[i]);
    ellipse(random(width), random(height), 2, 2);
  }
  */
}
