function Explosion(game, x, y) {
    Entity.call(this, game, x, y);
    this.animation = new Animation(ASSET_MANAGER.getAsset("./main/img/expl.png"),
        0, 0, 96, 96, 0.1, 15, false, true, false);
}

Explosion.prototype = new Entity();
Explosion.prototype.constructor = Explosion;

Explosion.prototype.draw = function(ctx) {
    Entity.prototype.draw.call(this, ctx);
    this.animation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
}

Explosion.prototype.update = function() {
    Entity.prototype.update.call(this);
}

function TestScene(gameEngine) {
    Scene.call(this,gameEngine);
}

TestScene.prototype = new Scene();
TestScene.prototype.constructor = TestScene;

TestScene.prototype.init = function(ctx) {
    Scene.prototype.init.call(this, ctx);
    this.addEntity(new Explosion(this, 20, 20));
}