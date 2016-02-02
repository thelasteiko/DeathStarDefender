function Unit(game, x, y, hp, ap) {
    Entity.call(this, game, x, y);
    this.hp = hp; // health points
    this.ap = ap; // attack points
}

Unit.prototype = new Entity();
Unit.prototype.constructor = Unit;

// Other is another unit
Unit.prototype.attack = function (other) {
    other.hp -= this.ap;
    if (other.hp <= 0) {
        other.removeFromWorld = true;
    }
};

Unit.prototype.update = function () {
    Entity.prototype.update.call(this);
};

// SUN (may not need this class, just use unit class)

function Sun(game, x, y) {
    Unit.call(this, game, x, y, 0, 0);
}

Sun.prototype = new Unit();
Sun.prototype.constructor = Sun;

// ALLIES

function Ally(game, x, y, hp, idleAnim, attackAnim, attackCallback, projectile) {
    Unit.call(this, game, x, y, hp, 0);
    this.attacking = false;
    this.idleAnim = idleAnim; // ally being idle between attacks
    this.attackAnim = attackAnim; // ally attacking 
    this.attackCallback = attackCallback; // callback function that allows the calling scene to fire the projectile correctly
    this.projectile = projectile; // projectile object of the right type
    this.projectileTime = 5;
}

Ally.prototype = new Unit();
Ally.prototype.constructor = Ally;

Ally.prototype.update = function () {
    if (this.attacking) {
        this.projectileTime += this.game.game.clockTick;
        if (this.projectileTime >= 5) {
            this.projectileTime = 0;
            this.fireProjectile();
        }
    }
    //Unit.prototype.update.call(this);
    var row = this.game.getRowAndCol(this.x, this.y).row;
    if(this.game.enemies[row].length > 0) {
        this.attacking = true;
    } else {
        this.attacking = false;
    }
}

Ally.prototype.draw = function (ctx) {
    //var clock = this.game.game.clockTick;
    if (this.attacking) { // attacking
        this.attackAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    } else { // approaching from the right
        this.idleAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
};

Ally.prototype.fireProjectile = function () {
    var projectile = new this.projectile(this.game, this.x, this.y);
    this.hasProjectile = projectile;
    this.attackCallback(projectile);
};

// Luke Ally
// TODO: figure out why this (and LukeEnemy, which are the only two I've tested) have prototypes that point to themselves.
function TieFighter(game, x, y, attackCallback) {
    var idleAnim = new Animation(ASSET_MANAGER.getAsset("./main/img/ally/tiefighter.png"), 0, 0, 64, 64, 0.2, 4, true, true, false);
    var attackAnim = new Animation(ASSET_MANAGER.getAsset("./main/img/ally/tiefighter.png"), 0, 64, 64, 64, 0.2, 4, true, true, false);
    Ally.call(this, game, x, y, 10, idleAnim, attackAnim, attackCallback, LukeProjectile);
}

TieFighter.prototype = new Ally();
TieFighter.prototype.constructor = TieFighter;

// ENEMIES

function Enemy(game, x, y, hp, ap, speed, approachAnim, waitAnim, attackAnim) {
    Unit.call(this, game, x, y, hp, ap);
    this.speed = speed;
    this.waiting = false;
    this.attacking = false;
    this.approachAnim = approachAnim; // enemy moving from right to left
    this.waitAnim = waitAnim; // enemy waiting between attacks
    this.attackAnim = attackAnim; // enemy attacking
    this.isEnemy = true;
}

Enemy.prototype = new Unit();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    if(this.x <= 0) {
        this.removeFromWorld = true;
        return;
    }
    if (this.waiting) { // waiting between attacks

    } else if (this.attacking) { // attacking

    } else { // approaching from the right
        this.x += this.speed * this.game.game.clockTick;
    }
    //console.log("[" + this.x + ", " + this.y + "]");
    // something happens here
    Entity.prototype.update.call(this);
};

Enemy.prototype.draw = function (ctx) {
    if (this.waiting) { // waiting between attacks
        this.waitAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    } else if (this.attacking) { // attacking
        this.attackAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    } else { // approaching from the right
        this.approachAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
};

// Luke Enemy
function LukeEnemy(game, x, y) {
    var approachAnim = new Animation(ASSET_MANAGER.getAsset("./main/img/enemy/luke/LukeRun.png"), 0, 0, 64, 96, 0.1, 7, true, true, true);
    Enemy.call(this, game, x, y-32, 10, 10, -50, approachAnim, approachAnim, approachAnim);
    console.log("[" + this.x + ", " + this.y + "]");
}

LukeEnemy.prototype = new Enemy();
LukeEnemy.prototype.constructor = LukeEnemy;

// PROJECTILES

function Projectile(game, x, y, ap, speed, animation) {
    Unit.call(this, game, x, y, 0, ap);
    this.speed = speed;
    this.animation = animation;
}

Projectile.prototype = new Unit();
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function () {
    this.x += this.speed * this.game.game.clockTick;
    if (this.x > this.game.surfaceWidth)
        this.removeFromWorld = true;
    Entity.prototype.update.call(this);
};

Projectile.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

// This function currently breaks EVERYTHING, probably because "super" is meaningless. Oh well.
// I think this works - Grant
//why does a projectile have hp?
Projectile.prototype.attack = function (other) {
    Unit.prototype.attack.call(other);
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }
};

// Luke Projectile
function LukeProjectile(game, x, y) {
    var bulletAnim = new Animation(ASSET_MANAGER.getAsset("./main/img/enemy/luke/LukeRun.png"), 0, 20, 64, 76, 0.05, 8, true, true, false);
    Projectile.call(this, game, x, y, 5, 50, bulletAnim);
}

LukeProjectile.prototype = new Projectile();
LukeProjectile.prototype.constructor = LukeProjectile;
