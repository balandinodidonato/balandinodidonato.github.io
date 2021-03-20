let barkMax;

function drawBark(){
  barkBuffer.background(0);
  let values = [];
  
  for (let c = 1; c < barkData.getColumnCount(); c++) {
    for (let r = 1; r < barkData.getRowCount(); r++) {
      let value = barkData.getNum(r, c);
      if (value>0) {
        values.push(value);
      } else {
        values.push(0);
      }
    }
  }
  barkMax = max(values);

  let lineHeight = barkBuffer.height/(barkData.getColumnCount()-1);
  let factor_x = barkBuffer.width/(barkData.getRowCount()-1);
  
  let x_pre = 0;
  if (factor_x<0.5) {
    barkBuffer.strokeWeight(0.5);
  }

  for (let r = 1; r < barkData.getRowCount(); r++) {
    let x = r * factor_x;
    let y0_post = 0;
    
    for (let c = 1; c < barkData.getColumnCount(); c++) {
      
      let y0 = c*lineHeight;

      if (int(y0) != int(y0_post)) {

        let value = barkData.getNum(r, c);

        let br = map(value, 0, barkMax, 0, 100);
        let col = map(value, 0, barkMax, 75, 0);

        barkBuffer.colorMode(HSB, 100);
        barkBuffer.stroke(col, 100, br*4);

        let y1 = y0+lineHeight;

        barkBuffer.line(x, barkBuffer.height-y0 , x, barkBuffer.height-y1);
        y0_post = y0;
      }
    }
    x_pre = x;
  }
}

function showBark(){
  barkBuffer.fill(0);
  barkBuffer.rect(tMargin, tMargin, 200, tSize)
  barkBuffer.fill(255);
  barkBuffer.textSize(tSize);
  qomBuffer.stroke(0);
  barkBuffer.text('Bark coefficents (0 , '+barkMax+') / Time', tMargin, tMargin, 300, tSize);
  image(barkBuffer, width/2, (height/noDisplays)*2);
}
  