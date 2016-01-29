function Unit(game, x, y, hp, ap) {
    this.hp = hp; // health points
    this.ap = ap; // attack points
    Entity.call(this, game, x, y);
}

Unit.prototype = new Entity();
Unit.prototype.constructor = Unit;

// Other is another unit
Unit.prototype.attack = function(other) {
    other.hp -= this.ap;
    if (other.hp <= 0) {
        other.removeFromWorld = true;
    }
}

// SUN (may not need this class, just use unit class)

function Sun(game, x, y) {
    Unit.call(game, x, y, 0, 0);
}

Sun.prototype = new Unit();
Sun.prototype.constructor = Sun;

// ALLIES

function Ally(game, idleAnim, attackAnim, x, y, projectile, hp) {
    this.attacking = false;
    this.idleAnimation = idleAnim;
    this.attackAnimation = attackAnim;
    this.projectile = projectile; // is the constructor for a new projectile of the right type
    Unit.call(game, x, y, hp, 0);
}

Ally.prototype = new Unit();
Ally.prototype.constructor = Ally;

Ally.prototype.draw = function (ctx) {
    // draw a frame of something
    Entity.prototype.draw.call(this);
}

// ENEMIES

function Enemy(game, approachAnim, waitAnim, attackAnim, x, y, hp, ap) {
    this.waiting = false;
    this.attacking = false;
    this.approachAnim = approachAnim;
    this.waitAnim = waitAnim;
    this.attackAnim = attackAnim;
    Unit.call(game, x, y, hp, ap);
}

Enemy.prototype = new Unit();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    // something happens here
    Entity.prototype.update.call(this);
}

Enemy.prototype.draw = function (ctx) {
    // draw a frame of something
    Entity.prototype.draw.call(this);
}

// PROJECTILES

function Projectile(game, animation, x, y, ap) {
    Unit.call(game, x, y, 0, ap);
}

Projectile.prototype = new Unit();
Projectile.prototype.constructor = Projectile;

Projectile.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

Projectile.prototype.attack = function (other) {
    super.attack(other);
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }
}