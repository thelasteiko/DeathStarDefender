function Animation(spriteSheet, startX, startY, frameWidth, frameHeight,
                   frameDuration, frames, drawOutlines, loop, reverse, audio,
                   loopReverse, offsetX, offsetY) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
    this.loopReverse = loopReverse; // whether the animation should run forwards then backwards
    this.audio = audio;
    this.drawOutlines = drawOutlines && DEBUG;
    this.offsetX = offsetX || 0;
    this.offsetY = offsetY || 0;
}

//x and y are the location in the canvas
// returns whether or not a frame was drawn
Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    scaleBy = scaleBy || 1; //used to scale image
    if (this.audio && this.elapsedTime === 0) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.play();
    }
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return false;
    }

    var index = this.currentFrame();

    if (this.loopReverse) { // unclear if this is compatible with multiple rows of sprites or reversing the sprites
        if (index >= this.frames / 2) {
            index = this.frames - index; // animation goes forwards, then backwards
        }
    }

    index = this.reverse ? this.frames - index : index;
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    //the y needs to change if there are multiple rows

    var locX = x + this.offsetX;
    var locY = y + this.offsetY;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
        index * this.frameWidth + offset,
        vindex * this.frameHeight + this.startY,  // source from sheet
        this.frameWidth, this.frameHeight,
        locX, locY,
        this.frameWidth * scaleBy,
        this.frameHeight * scaleBy);

    if (this.drawOutlines) {
        ctx.strokeStyle = "Red";
        ctx.strokeRect(locX, locY, this.frameWidth * scaleBy, this.frameHeight * scaleBy);
    }

    return true;
};

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
};

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
};

Animation.prototype.reset = function () {
    this.elapsedTime = 0;
};
