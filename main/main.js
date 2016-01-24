function Animation(spriteSheet, startX, startY, frameWidth, frameHeight,
    frameDuration, frames, loop, reverse, audio) {
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
    this.audio = audio;
}
//x and y are the location in the canvas
Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1; //used to scale image
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
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function LayeredAnim(spriteSheet, startX, startY, frameWidth, frameHeight,
 frameDuration, frames, loop, reverse, rows, audio) {
    this.anims = [];
    this.loop = loop;
    this.rows = rows;
    this.rl = 0;
    var framesleft = frames;
    var rf = 0;
  for(var i = 0; i < rows; i++) {
      rf = Math.ceil(framesleft/(i+1));
      framesleft = framesleft - rf;
      var animation = new Animation(spriteSheet, startX, startY+(frameHeight*i),
        frameWidth, frameHeight, frameDuration, rf, false, reverse, audio);
      this.anims.push(animation);
  }
}

LayeredAnim.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    if(this.loop) {
        if(this.isDone())
            this.rl = 0;
    } else if(this.isDone()) {
        return;
    }
    this.anims[this.rl].drawFrame(tick, ctx, x, y, scaleBy);
    if(this.anims[this.rl].isDone()) {
        this.anims[this.rl].elapsedTime = 0;
        this.rl += 1;
    }
}

LayeredAnim.prototype.isDone = function() {
    return this.rl === this.rows-1;
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./main/img/expl.png");
ASSET_MANAGER.queueDownload("./main/audio/bomb.mp3");

ASSET_MANAGER.downloadAll(function () {
    console.log("Downloading...");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start(new ExplosionScene(gameEngine));
});
