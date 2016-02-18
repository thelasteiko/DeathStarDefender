function Projectile(game, x, y, ap, speed, animation) {
    Unit.call(this, game, x, y, 0, ap);
    this.speed = speed;
    this.animation = animation;
}

Projectile.prototype = new Unit();
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function () {
    this.x += this.speed * this.game.game.clockTick;
    if (this.x > this.game.surfaceWidth) {
        this.removeFromWorld = true;
    }
    Entity.prototype.update.call(this);
};

Projectile.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

Projectile.prototype.attemptAttack = function (other) {
    var collision = this.collide(other);
    if (collision) {
        other.takeDamage(this.ap);
        this.removeFromWorld = true;
    }
    return collision;
};

Projectile.prototype.setBoundaries = function (left, right) {
    Unit.prototype.setBoundaries.call(this, left, right);
};

// Luke Projectile
function LukeProjectile(game, x, y) {
    var bulletAnim = new Animation(ASSET_MANAGER.getAsset("./assets/img/enemy/luke/LukeRun.png"), 0, 20, 64, 76, 0.05, 8, true, true, false);
    Projectile.call(this, game, x, y - 12, 5, 50, bulletAnim);
}

LukeProjectile.prototype = new Projectile();
LukeProjectile.prototype.constructor = LukeProjectile;

LukeProjectile.prototype.setBoundaries = function () {
    Projectile.prototype.setBoundaries.call(this, this.x, this.x + 64);
};

// SUN (techinically a projectile, but not normally used as such)

function Sun(game, x, y) {
    var anim = new Animation(ASSET_MANAGER.getAsset("./assets/img/ally/sun.png"), 0, 0, 64, 64, 0.2, 14, false, true, false, false, false);
    Projectile.call(this, game, x, y, 0, 0, anim);
}

Sun.prototype = new Projectile();
Sun.prototype.constructor = Sun;

Sun.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};