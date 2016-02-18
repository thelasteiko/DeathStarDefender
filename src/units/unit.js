function Unit(game, x, y, hp, ap) {
    Entity.call(this, game, x, y);
    this.hp = hp; // health points
    this.ap = ap; // attack points
}

Unit.prototype = new Entity();
Unit.prototype.constructor = Unit;

Unit.prototype.takeDamage = function (damage) {
    if (this.dying) return;
    this.hp -= damage;
    console.log(this.constructor.name, "HP now", this.hp);
    var dead = this.hp <= 0;
    if (dead) {
        console.log(this.constructor.name, "is dead.");
        this.triggerDeath();
    }
    return dead;
};

Unit.prototype.update = function () {
    Entity.prototype.update.call(this);
};

Unit.prototype.triggerDeath = function () {
    var spritesheet = ASSET_MANAGER.getAsset("./assets/img/expl.png");
    var audio = ASSET_MANAGER.getAsset("./assets/audio/bomb.mp3");
    this.animation = new Animation(spritesheet, 0, 0, 96, 96, .1, 15, false, false, false, audio);
    this.draw = function (ctx) {
        this.animation.drawFrame(this.game.game.clockTick, ctx, this.x - 16, this.y - 32);
    };
    this.update = function () {
        if (this.animation.isDone())
            this.removeFromWorld = true;
    };
    this.dying = true;
};

// Needs to be overridden to work properly. Think of it as an abstract overloaded method.
Unit.prototype.setBoundaries = function (left, right) {
    if (left && right) {
        this.left = left;
        this.right = right;
    }
};

Unit.prototype.collide = function (other) {
    if (this.dying || other.dying) return false;
    this.setBoundaries();
    other.setBoundaries();
    var collide = ((this.left < other.right && this.right > other.left)
    || (this.right < other.left && this.left > other.right));
    //if (collide) {
    //    console.log("Colliding", this.constructor.name, "with", other.constructor.name);
    //}
    return collide;
};