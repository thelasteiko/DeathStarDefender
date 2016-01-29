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

function Ally(game, idleAnim, attackAnim, attackCallback, x, y, hp, projectile, projectileAp) {
    this.attacking = false;
    this.idleAnim = idleAnim;
    this.attackAnim = attackAnim;
    this.attackCallback = attackCallback;
    this.projectile = projectile; // projectile object of the right type
    Unit.call(game, x, y, hp, 0);
}

Ally.prototype = new Unit();
Ally.prototype.constructor = Ally;

Ally.prototype.update = function () {
    if (this.attacking) { // attacking
        if (this.attackAnim.isDone()) { // currently launching projectile at end of attack animation
            this.attackAnim.elapsedTime = 0;
            this.attacking = false;
            this.fireProjectile();
        }
    } else { // approaching from the right

    }

    // Inhertiting classes must call this on their own
    // Entity.prototype.update.call(this);
}

Ally.prototype.draw = function (ctx) {
    if (this.attacking) { // attacking
        this.attackAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else { // approaching from the right
        this.approachAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

Ally.prototype.fireProjectile = function () {
    var projectile = this.projectile.clone(this.x, this.y); // launches a new projectile from current ally location
    this.attackCallback(projectile);
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
    if (this.waiting) { // waiting between attacks

    } else if (this.attacking) { // attacking

    } else { // approaching from the right

    }
    // something happens here
    Entity.prototype.update.call(this);
}

Enemy.prototype.draw = function (ctx) {
    if (this.waiting) { // waiting between attacks
        this.waitAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.attacking) { // attacking
        this.attackAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else { // approaching from the right
        this.approachAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

// PROJECTILES

function Projectile(game, animation, x, y, ap) {
    this.animation = animation;
    Unit.call(game, x, y, 0, ap);
}

Projectile.prototype = new Unit();
Projectile.prototype.constructor = Projectile;

// Clones, with the option to set a new location
Projectile.prototype.clone = function(optX, optY) {
    var newProjectile = new Projectile(this.game, this.animation, this.x, this.y, this.ap);
    if (optX && optY) {
        this.x = optX;
        this.y = optY;
    }
    newProjectile.removeFromWorld = this.removeFromWorld;
    return newProjectile;
}

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