
function drawQOM() {
    qomBuffer.background(0);
    let x_draw_mtion = 0;
    let framesQom = [];
    
    const maxLenght = qomBuffer.height / motionData.length;
    const xIncrement = qomBuffer.width / motionData[0].no_frames;

    for (let frame = 0; frame < motionData[0].no_frames; frame++) {

        let y0 = qomBuffer.height;
        
        if (x_draw_mtion >= qomBuffer.width) {
            x_draw_mtion = 0;
        } else {
            x_draw_mtion += xIncrement;
        }

        for (let index = 0; index < motionData.length; index++) {

            if (motionData[index].frames[frame] && keypointsToDraw[index]) {

                let confidence = motionData[index].frames[frame].keypoint.confidence;

                if (confidence > c_threshold.value()) {
                    let qom = motionData[index].frames[frame].keypoint.normalised.qom;
                    let lineLength = qom * maxLenght * 10;
                    let y1 = y0 - lineLength;

                    let c = color(colors[index][0], colors[index][1], colors[index][2]);
                    qomBuffer.stroke(c);
                    qomBuffer.line(x_draw_mtion, y0, x_draw_mtion, y1);
                    y0 -= lineLength;  
                }
            }
        }
        framesQom.push(y0);
    }


    //// end quantity of motion drawing ///

    const movAvgWin = 120;
    let movAvgValues = [];
    
    for (let frame = 1; frame < framesQom.length; frame++) {
        if (frame>=movAvgWin) {
            let sum = 0;
            for (let index = 0; index < movAvgWin; index++) {
                sum += framesQom[frame-index];
            }
            let movAvgValue = sum/movAvgWin;
            movAvgValues.push(movAvgValue);
        } else {
            movAvgValues.push(0);
        }
    }

    qomBuffer.stroke(255);
    qomBuffer.strokeWeight(2);
    let x_movAvg = 0;
    let y0_movAvg = 0;

    for (let index = 0; index < movAvgValues.length; index++) {
        x_movAvg += xIncrement;
        let y_movAvg = movAvgValues[index];

        if (y_movAvg<=0) {
            y_movAvg = qomBuffer.height
        }
        
        qomBuffer.line(x_movAvg, y0_movAvg, x_movAvg, y_movAvg);
        y0_movAvg = y_movAvg;
    }
    
    //// end quantity of motion drawing ///
    qomBuffer.noStroke();
}


function showQuom(){
    qomBuffer.fill(0);
    qomBuffer.rect(tMargin, tMargin, 200, tSize)
    qomBuffer.fill(255);
    qomBuffer.textSize(tSize);
    qomBuffer.stroke(0);
    qomBuffer.text('Quantity of Motion / Time', tMargin, tMargin, 200, tSize);
    image(qomBuffer, width / 2, (height / noDisplays) * 0);
}