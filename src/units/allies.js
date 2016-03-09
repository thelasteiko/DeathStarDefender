function Ally(game, x, y, col, row, hp, idleAnim, attackAnim, attackCallback, projectile, projectileInterval, isOffensive,
              fireImmediately) {
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
    if (this.row != null) { // Allows allies to be drawn in non-game conditions (about screen)
        if (this.attackAnim && this.attacking) {
            if (this.attackAnim.isDone()) {
                this.attackAnim.elapsedTime = 0;
                this.attacking = false;
                this.projectileTime = 0;
            }
        } else {
            this.projectileTime += this.game.game.clockTick;
            var row = this.game.getRowAndCol(this.x, this.y).row;
            if (this.projectileTime >= this.projectileInterval) {
                if (this.isOffensive && this.game.enemies[row].length > 0) {
                    this.projectileTime = 0;
                    this.attacking = true;
                    this.fireProjectile();
                } else if (this.constructor.name === "Battery") {
                    this.projectileTime = 0;
                    this.fireProjectile();
                }
            }
        }
    }
    //Unit.prototype.update.call(this);
};

Ally.prototype.draw = function (ctx) {
    var isDrawn = false;
    //why?...
    if (this.attacking && this.attackAnim) {
        isDrawn = this.attackAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    }

    // draw if the above did not draw
    if (!isDrawn) this.idleAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

Ally.prototype.fireProjectile = function () {
    if (!this.projectile) return;
    var projectile = new this.projectile(this.game, this.x, this.y);
    this.attackCallback(projectile, this.col, this.row);
};

Ally.prototype.setBoundaries = function (idleLeft, idleRight, attackLeft, attackRight) {
    if (this.attacking) {
        Unit.prototype.setBoundaries.call(this, attackLeft, attackRight);
    } else {
        Unit.prototype.setBoundaries.call(this, idleLeft, idleRight);
    }
};

// Battery
function Battery(game, x, y, col, row, attackCallback) {
    var pic = ASSET_MANAGER.getAsset("./assets/img/ally/battery.png");
    var idleAnim = new Animation(pic, 0, 0, 64, 64, 1, 8, true, true, false);
    Ally.call(this, game, x, y, col, row, 15, idleAnim, null, attackCallback, Sun, 8, false, false);
}

Battery.prototype = new Ally();
Battery.prototype.constructor = Battery;

Battery.prototype.setBoundaries = function () {
    Ally.prototype.setBoundaries.call(this, this.x + 32, this.x + 64, this.x + 32, this.x + 64);
};

// Stormtrooper
function Stormtrooper(game, x, y, col, row) {
    var pic = ASSET_MANAGER.getAsset("./assets/img/ally/stormt.png");
    var idleAnim = new Animation(pic, 0, 0, 64, 64, 1, 1, true, true, false);
    var attackAnim = new Animation(pic, 0, 0, 64, 64, .07, 7, true, false, false);
    Ally.call(this, game, x, y, col, row, 100, idleAnim, attackAnim, null, null, 1, true, true);
}

Stormtrooper.prototype = new Ally();
Stormtrooper.prototype.constructor = Stormtrooper;

Stormtrooper.prototype.setBoundaries = function () {
    Ally.prototype.setBoundaries.call(this, this.x + 32, this.x + 64, this.x + 32, this.x + 64);
};

// Tie Fighter
function TieFighter(game, x, y, col, row, attackCallback) {
    var pic = ASSET_MANAGER.getAsset("./assets/img/ally/tiefighter.png");
    var idleAnim = new Animation(pic, 0, 0, 64, 64, 0.2, 4, true, true, false);
    var attackAnim = new Animation(pic, 0, 64, 64, 64, 0.1, 4, true, false, false);
    Ally.call(this, game, x, y, col, row, 20, idleAnim, attackAnim, attackCallback, FlashProjectile, 5, true, true);
}

TieFighter.prototype = new Ally();
TieFighter.prototype.constructor = TieFighter;

TieFighter.prototype.setBoundaries = function () {
    Ally.prototype.setBoundaries.call(this, this.x + 32, this.x + 64, this.x + 32, this.x + 64);
};

function ATST(game, x, y, col, row, attackCallback) {
  var pic = ASSET_MANAGER.getAsset("./assets/img/ally/atst.png");
  var idleAnim = new Animation(pic, 0, 0, 64, 96, .5, 6, true, true, false, null, false, 0, -32);
  //needs to fire projectile at frame 8 of attack
  //when attackAnim.elapsedTime = attackAnim.frameDuration * 8
  var attackAnim = new Animation(pic, 0, 96, 64, 96, .2, 12, true, false, false, null, false, 0, -32);
  this.hasFired = false;
  Ally.call(this, game, x, y, col, row, 50, idleAnim, attackAnim, attackCallback, ATSTProjectile, 6, true, true);
}

ATST.prototype = new Ally();
ATST.prototype.constructor = ATST;

ATST.prototype.setBoundaries = function() {
  Ally.prototype.setBoundaries.call(this, this.x+32, this.x + 64, this.x + 32, this.x + 64);
}

ATST.prototype.update = function () {
    if (this.row != null) { // Allows allies to be drawn in non-game conditions (about screen)
        if (this.attackAnim && this.attacking) {
            if (this.attackAnim.isDone()) {
              this.attackAnim.elapsedTime = 0;
              this.attacking = false;
              this.projectileTime = 0;
              return;
            } else if (this.attackAnim.elapsedTime >= this.attackAnim.frameDuration * 8 && !this.hasFired) {
                this.fireProjectile();
                this.hasFired = true;
            }
            
        } else {
            this.projectileTime += this.game.game.clockTick;
            var row = this.game.getRowAndCol(this.x, this.y).row;
            if (this.projectileTime >= this.projectileInterval) {
                if (this.game.enemies[row].length > 0) {
                    this.projectileTime = 0;
                    this.attacking = true;
                    this.hasFired = false;
                }
            }
        }
    }
    //Unit.prototype.update.call(this);
};