function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
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
}

function LayeredAnim(spriteSheet, startX, startY, frameWidth, frameHeight,
 frameDuration, frames, loop, reverse, rows, cols) {
    this.anims = [];
    this.loop = loop;
    this.rows = rows;
    this.rl = 0;
    var framesleft = frames;
    var rf = 0;
  for(var i = rows; i > 0; i--) {
      rf = Math.ceil(framesleft/i);
      framesleft = framesleft - rf;
      this.anims.push(new Animation(spriteSheet, startX, startY,
        frameWidth, frameHeight, frameDuration, rf, true, reverse));
  }
}

LayeredAnim.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    if(this.loop) {
        if(this.rl === rows-1)
            this.rl = 0;
    } else if(this.rl === rows-1) {
        return;
    }
    
    this.anims[rl].drawFrame(tick, ctx, x, y, scaleBy);
    if(this.anims[rl].isDone())
        this.rl -= 1;
}