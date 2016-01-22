function Explosion(game) {
    //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, rows
    this.explanim = new LayeredAnim(ASSET_MANAGER.getAsset("./main/img/expl.png"), 0, 0, 96, 96, 0.07, 15, true, false, 3);
    this.radius = 100;
    Entity.call(this, game, 80, 100);
}

Explosion.prototype = new Entity();
Explosion.prototype.constructor = Explosion;

//this is where I would move the x and y if there is anything to move
Explosion.prototype.update = function () {
    
    //calls the entity's update function which is not doing anything right now...
    Entity.prototype.update.call(this);
}
//This is where I would change the animation
Explosion.prototype.draw = function (ctx) {
    this.explanim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function ExplosionScene(gameEngine) {
    Scene.call(this,gameEngine);
}

ExplosionScene.prototype = new Scene();
ExplosionScene.prototype.constructor = ExplosionScene;

ExplosionScene.prototype.init = function() {
    this.addEntity(new Explosion(this));
}