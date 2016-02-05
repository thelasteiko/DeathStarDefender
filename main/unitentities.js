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

// ALLIES

function Ally(game, x, y, col, row, hp, idleAnim, attackAnim, attackCallback, projectile, projectileInterval, isOffensive, fireImmediately) {
    Unit.call(this, game, x, y, hp, 0);
    this.col = col;
    this.row = row;
    this.idleAnim = idleAnim; // ally being idle between attacks
    this.attackAnim = attackAnim; // ally attacking 
    this.attackCallback = attackCallback; // callback function that allows the calling scene to fire the projectile correctly
    this.projectile = projectile; // projectile-creation function of the right type
    this.projectileTime = fireImmediately ? projectileInterval : 0;
    this.projectileInterval = projectileInterval;
    this.isOffensive = isOffensive;
}

Ally.prototype = new Unit();
Ally.prototype.constructor = Ally;

Ally.prototype.update = function () {
    if (this.attackAnim && this.attacking) {
        if (this.attackAnim.isDone()) {
            this.attackAnim.elapsedTime = 0;
            this.attacking = false;
            this.projectileTime = 0;
        }
    } else {
        this.projectileTime += this.game.game.clockTick;
        var row = this.game.getRowAndCol(this.x, this.y).row;
        if (this.projectileTime >= this.projectileInterval && !(this.game.enemies[row].length === 0 && this.isOffensive)) {
            this.projectileTime = 0;
            this.attacking = true;
            this.fireProjectile();
        }
    }
    //Unit.prototype.update.call(this);
};

Ally.prototype.draw = function (ctx) {
    //var clock = this.game.game.clockTick;
    if (this.attackAnim && this.attacking) { // attacking
        console.log(this)
        this.attackAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    } else { // approaching from the right
        this.idleAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
};

Ally.prototype.fireProjectile = function () {
    var projectile = new this.projectile(this.game, this.x, this.y);
    this.hasProjectile = projectile;
    this.attackCallback(projectile, this.col, this.row);
};

// Battery
function Battery(game, x, y, col, row, attackCallback) {
    var pic = ASSET_MANAGER.getAsset("./main/img/battery.png");
    var idleAnim = new Animation(pic, 0, 0, 64, 64, 1, 8, true, true, false);
    Ally.call(this, game, x, y, col, row, 10, idleAnim, null, attackCallback, Sun, 8, false, false);
}

Battery.prototype = new Ally();
Battery.prototype.constructor = Battery;

function TieFighter(game, x, y, col, row, attackCallback) {
    var pic = ASSET_MANAGER.getAsset("./main/img/ally/tiefighter.png");
    var idleAnim = new Animation(pic, 0, 0, 64, 64, 0.2, 4, true, true, false);
    var attackAnim = new Animation(pic, 0, 64, 64, 64, 0.2, 4, true, false, false);
    Ally.call(this, game, x, y, col, row, 10, idleAnim, attackAnim, attackCallback, LukeProjectile, 5, true, true);
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
    if (this.x <= 0) {
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
    Enemy.call(this, game, x, y - 32, 10, 10, -50, approachAnim, approachAnim, approachAnim);
    // console.log("[" + this.x + ", " + this.y + "]");
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
    if (this.x > this.game.surfaceWidth) {
        this.removeFromWorld = true;
    }
    Entity.prototype.update.call(this);
};

Projectile.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

Projectile.prototype.attack = function (other) {
    Unit.prototype.attack.call(other);
    this.removeFromWorld = true;
};

// Luke Projectile
function LukeProjectile(game, x, y) {
    var bulletAnim = new Animation(ASSET_MANAGER.getAsset("./main/img/enemy/luke/LukeRun.png"), 0, 20, 64, 76, 0.05, 8, true, true, false);
    Projectile.call(this, game, x, y - 12, 5, 50, bulletAnim);
}

LukeProjectile.prototype = new Projectile();
LukeProjectile.prototype.constructor = LukeProjectile;

// SUN (techinically a projectile, but not normally used as such)

function Sun(game, x, y) {
    var anim = new Animation(ASSET_MANAGER.getAsset("./main/img/enemy/luke/LukeIdle.png"), 0, -10, 64, 76, 0.2, 10, true, true, false, false, true);
    Projectile.call(this, game, x, y - 12, 0, 0, anim);
}

Sun.prototype = new Projectile();
Sun.prototype.constructor = Sun;

Sun.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};