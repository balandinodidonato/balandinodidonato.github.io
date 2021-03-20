function drawHeatmap() {
    keyPntHeatBuffer.background(0); // motion
    keyPntMovHeatBuffer.background(0); // motion

    for (let index = 0; index < keypointsToDraw.length; index++) {
        if (keypointsToDraw[index]) { // shows only existing keypoints
            keypointsToDraw[index].show(); // show keypoint
        }
    }
    keyPntMovHeatBuffer.stroke(0);
}


function showHeatmaps(){
    keyPntHeatBuffer.fill(0);
    keyPntHeatBuffer.rect(tMargin, tMargin, 200, tSize)
    keyPntHeatBuffer.fill(255);
    keyPntHeatBuffer.textSize(tSize);
    keyPntHeatBuffer.stroke(0);
    keyPntHeatBuffer.text('Skeleton Keypoint Heatmap', tMargin, tMargin, 200, tSize);
    image(keyPntHeatBuffer, 0, 0);

    keyPntMovHeatBuffer.fill(0);
    keyPntMovHeatBuffer.rect(tMargin, tMargin, 200, tSize)
    keyPntMovHeatBuffer.fill(255);
    keyPntMovHeatBuffer.textSize(tSize);
    keyPntMovHeatBuffer.stroke(0);
    keyPntMovHeatBuffer.text('Skeleton Movemet Heatmap', tMargin, tMargin, 200, tSize);
    image(keyPntMovHeatBuffer, 0, height / 2);
}



class drawk {
    constructor(motionData, k, keypointFlag, movementFlag) {
        this.k = k;
        this.motionData = motionData;
        this.keypointFlag = keypointFlag;
        this.movementFlag = movementFlag;
    }
    show() {

        for (let f = 0; f < motionData[this.k].frames.length; f++) {
            this.confidence = motionData[this.k].frames[f].keypoint.confidence;
            if (this.keypointFlag && this.confidence > c_threshold.value()) {

                this.alpha = motionData[this.k].frames[f].keypoint.confidence * 255;
                this.color = color(colors[this.k][0], colors[this.k][1], colors[this.k][2], this.alpha);

                this.x = motionData[this.k].frames[f].keypoint.normalised.x * keyPntHeatBuffer.width;
                this.y = motionData[this.k].frames[f].keypoint.normalised.y * keyPntHeatBuffer.height;
                this.x0 = motionData[this.k].frames[f].keypoint.normalised.x0 * keyPntHeatBuffer.width;
                this.y0 = motionData[this.k].frames[f].keypoint.normalised.y0 * keyPntHeatBuffer.height;

                this.size = motionData[this.k].frames[f].keypoint.normalised.qom * keyPntHeatBuffer.height * .05;

                keyPntHeatBuffer.noStroke();
                keyPntHeatBuffer.fill(this.color);
                keyPntHeatBuffer.circle(this.x, this.y, this.size);

                keyPntMovHeatBuffer.strokeWeight(this.size);
                keyPntMovHeatBuffer.stroke(this.color);
                keyPntMovHeatBuffer.fill(this.color);
                keyPntMovHeatBuffer.line(this.x0, this.y0, this.x, this.y);
            }
        }
    }
}