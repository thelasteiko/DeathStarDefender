function Animation(spriteSheet, startX, startY, frameWidth, frameHeight,
                   frameDuration, frames, drawOutlines, loop, reverse, audio, loopReverse) {
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
    this.drawOutlines = drawOutlines;
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

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
        index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
        this.frameWidth, this.frameHeight,
        locX, locY,
        this.frameWidth * scaleBy,
        this.frameHeight * scaleBy);

    if (this.drawOutlines) {
        ctx.strokeStyle = "Red"
        ctx.strokeRect(locX, locY, this.frameWidth * scaleBy, this.frameHeight * scaleBy);
    }
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
    for (var i = 0; i < rows; i++) {
        rf = Math.ceil(framesleft / (i + 1));
        framesleft = framesleft - rf;
        var animation = new Animation(spriteSheet, startX, startY + (frameHeight * i),
            frameWidth, frameHeight, frameDuration, rf, false, false, reverse, audio);
        this.anims.push(animation);
    }
}

LayeredAnim.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    if (this.loop && this.isDone()) this.rl = 0;
    else if (this.isDone()) return;

    this.anims[this.rl].drawFrame(tick, ctx, x, y, scaleBy);
    if (this.anims[this.rl].isDone()) {
        this.anims[this.rl].elapsedTime = 0;
        this.rl += 1;
    }
}

LayeredAnim.prototype.isDone = function () {
    return this.rl === this.rows - 1;
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./main/img/background.png");
ASSET_MANAGER.queueDownload("./main/img/title2.png");

// Go specific; delete later
ASSET_MANAGER.queueDownload("./main/img/gameboard.png");

// ENEMIES
// Luke
ASSET_MANAGER.queueDownload("./main/img/enemy/luke/LukeImg.png");
ASSET_MANAGER.queueDownload("./main/img/enemy/luke/LukeRun.png");
ASSET_MANAGER.queueDownload("./main/img/enemy/luke/LukeJumpAttack.png");
ASSET_MANAGER.queueDownload("./main/img/enemy/luke/LukeIdle.png");
ASSET_MANAGER.queueDownload("./main/img/ally/tiefighter.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("Downloading...");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start(new LevelScene(gameEngine));
});
