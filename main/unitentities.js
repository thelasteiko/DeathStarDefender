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

Unit.prototype.triggerDeath = function() {
    var spritesheet = ASSET_MANAGER.getAsset("./main/img/expl.png");
    this.animation = new Animation(spritesheet, 0, 0, 96, 96, .1, 15, false, false, false);
    var that = this;
    this.draw = function (ctx) {
        this.animation.drawFrame(that.game.game.clockTick, ctx, that.x-16, that.y-8);
    };
    this.update = function () {
        if (this.animation.isDone())
            this.removeFromWorld = true;
    };
}

function Vader (scene, x, y, row) {
    var spritesheet = ASSET_MANAGER.getAsset("./main/img/ally/vader.png");
    var lightning = ASSET_MANAGER.getAsset("./main/img/ally/lightning.png");
    this.readypic = new SpriteImage(spritesheet, 0, 0, 64, 64);
    this.firepic = new SpriteImage(spritesheet, 0, 64, 64, 64);
    this.popup = new Animation(spritesheet, 0, 0, 64, 64, .1, 9, false, false, false);
    this.popdown = new Animation(spritesheet, 0, 128, 64, 64, .1, 9, false, false, false);
    this.donepic = new SpriteImage(spritesheet, 576, 128, 64, 64);
    this.projectile = new Animation(lightning, 0, 0, 576, 64, .08, 12, false, false, false);
    this.row = row;
    this.state = "ready";
    Unit.call(this, scene, x, y, 1000, 1000);
}

Vader.prototype = new Unit();
Vader.prototype.constructor = Vader;

Vader.prototype.update = function () {
    switch(this.state) {
        case "ready":
        //check row for enemies x <= 64
        var list = this.game.enemies[this.row];
        for (var i = 0; i < list.length; i++) {
            if (list[i].x <= 64) {
                this.state = "popup";
                break;
            }
        }
        break;
        
        case "popup":
        if (this.popup.isDone())
            this.state = "fire";
        break;
        
        case "fire":
        var list = this.game.enemies[this.row];
        for (var i = 0; i < list.length; i++) {
            list[i].triggerDeath();
        }
        this.state = "firing";
        break;
        case "firing":
        if (this.projectile.isDone())
            this.state = "popdown";
        break;
        case "popdown":
        if (this.popdown.isDone())
            this.state = "done";
        break;
    }
}

Vader.prototype.draw = function (ctx) {
    switch(this.state) {
        case "ready":
        this.readypic.drawImage(ctx, this.x , this.y);
        break;
        case "popup":
        this.popup.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
        break;
        case "firing":
        this.firepic.drawImage(ctx, this.x, this.y);
        this.projectile.drawFrame(this.game.game.clockTick, ctx, this.x + 64, this.y);
        break;
        case "popdown":
        this.popdown.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
        break;
        case "done":
        this.donepic.drawImage(ctx, this.x, this.y);
        break;
    }
}

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
    var isDrawn = false;
    if (this.attacking && this.attackAnim) {
        isDrawn = this.attackAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    }

    // draw if the above did not draw
    if(!isDrawn) this.idleAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

Ally.prototype.fireProjectile = function () {
    if (!this.projectile) return;
    var projectile = new this.projectile(this.game, this.x, this.y);
    this.attackCallback(projectile, this.col, this.row);
};

// Battery
function Battery(game, x, y, col, row, attackCallback) {
    var pic = ASSET_MANAGER.getAsset("./main/img/ally/battery.png");
    var idleAnim = new Animation(pic, 0, 0, 64, 64, 1, 8, true, true, false);
    Ally.call(this, game, x, y, col, row, 10, idleAnim, null, attackCallback, Sun, 8, false, false);
}

Battery.prototype = new Ally();
Battery.prototype.constructor = Battery;

// Stormtrooper
function Stormtrooper(game, x, y, col, row) {
    var pic = ASSET_MANAGER.getAsset("./main/img/ally/stormt.png");
    var idleAnim = new Animation(pic, 0, 0, 64, 64, 1, 1, true, true, false);
    var attackAnim = new Animation(pic, 0, 0, 64, 64, .07, 7, true, false, false);
    Ally.call(this, game, x, y, col, row, 100, idleAnim, attackAnim, null, null, 1, true, true);
}

Stormtrooper.prototype = new Ally();
Stormtrooper.prototype.constructor = Stormtrooper;

// Tie Fighter
function TieFighter(game, x, y, col, row, attackCallback) {
    var pic = ASSET_MANAGER.getAsset("./main/img/ally/tiefighter.png");
    var idleAnim = new Animation(pic, 0, 0, 64, 64, 0.2, 4, true, true, false);
    var attackAnim = new Animation(pic, 0, 64, 64, 64, 0.1, 4, true, false, false);
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
    var anim = new Animation(ASSET_MANAGER.getAsset("./main/img/ally/sun.png"), 0, 0, 64, 64, 0.2, 14, false, true, false, false, false);
    Projectile.call(this, game, x, y, 0, 0, anim);
}

Sun.prototype = new Projectile();
Sun.prototype.constructor = Sun;

Sun.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};