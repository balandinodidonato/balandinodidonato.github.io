let loudMax;
let loudMin;

function drawLoudness(){
    loudnessBuffer.background(0);
  
    const factor_x = loudnessBuffer.width/audioLoudnesData.getRowCount();
    const movAvgWin = 128;
  
    let values = [];
    let movAvgValues = [];
    let indexValues = 0;
  
    for (let c = 1; c < audioLoudnesData.getColumnCount(); c++) {
      for (let r = 1; r < audioLoudnesData.getRowCount(); r++) {
        
        let value = audioLoudnesData.getNum(r, c);
        if (value>0) {
          values.push(value);
        } else {
          values.push(0);
        }
        if (indexValues>=movAvgWin) {
          let sum = 0;
          for (let index = 0; index < movAvgWin; index++) {
            sum += values[indexValues-index];
          }
          let movAvgValue = sum/movAvgWin;
          movAvgValues.push(movAvgValue);
        } else {
          movAvgValues.push(0);
        }
        indexValues++;
      }
    }
    
    loudMax = max(values);
    loudMin = min(values);
  
    if (factor_x<=0) {
      factor_x = 5e-324;
    }
  
    let x_pre = 0;
    let y_pre = 0;
    let y_movAvgPre = 0;
  
    for (let index = 0; index < values.length; index++) {
      let x = index * factor_x;
      let y = 0;
      let y_movAvg = 0;
  
      y = map(values[index], loudMin, loudMax, loudnessBuffer.height, 0);
  
      y_movAvg = map(movAvgValues[index], loudMin, loudMax, loudnessBuffer.height, 0);
  
      if (index==0) {
        y_pre = y;
        y_movAvgPre = y_movAvg;
      }
  
      if (factor_x<0.4) {
        loudnessBuffer.strokeWeight(0.4);
      } else {
        loudnessBuffer.strokeWeight(factor_x);
      }
      loudnessBuffer.stroke(0, 0, 255);
      loudnessBuffer.line(x_pre,  y_pre, x, y);
      
      if (factor_x<0.4) {
        loudnessBuffer.strokeWeight(2);
      } else {
        loudnessBuffer.strokeWeight(factor_x+2);
      }
  
      loudnessBuffer.stroke(255);
      loudnessBuffer.line(x_pre,  y_movAvgPre, x, y_movAvg);
      
      x_pre = x;
      y_pre = y;
      y_movAvgPre = y_movAvg;
    }
    
    loudnessBuffer.noStroke();
  }

function showLoudness(){
    loudnessBuffer.fill(0);
    loudnessBuffer.rect(0, 0, 200, tSize)
    loudnessBuffer.fill(255);
    loudnessBuffer.textSize(tSize);
    qomBuffer.stroke(0);
    loudnessBuffer.text('Loudness ('+loudMin+'-'+loudMax+' dB) / Time', 0, 0, 200, tSize);
    image(loudnessBuffer, width/2, (height/noDisplays)*1);
}