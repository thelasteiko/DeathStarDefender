function Enemy(game, x, y, hp, ap, speed, approachAnim, waitAnim, attackAnim, attackInterval) {
    Unit.call(this, game, x, y, hp, ap);
    this.speed = speed;
    this.waiting = false;
    this.attacking = false;
    this.approachAnim = approachAnim; // enemy moving from right to left
    this.waitAnim = waitAnim; // enemy waiting between attacks
    this.attackAnim = attackAnim; // enemy attacking
    this.attackInterval = attackInterval ? attackInterval : 3000;
}

Enemy.prototype = new Unit();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    if (this.x <= 0) {
        this.removeFromWorld = true;
        return;
    }
    if (this.attacking) { // attacking
        if (this.attackAnim.isDone()) {
            this.attackAnim.reset();
            var enemyDead = this.target.takeDamage(this.ap);
            this.attacking = false;
            this.waiting = !enemyDead;

            var that = this;
            window.setTimeout(function () {
                that.waiting = false;
            }, this.attackInterval);

        }
    } else if (this.waiting) { // waiting between attacks
        if (this.target.hp <= 0) { //if someone else kills the target
            this.waiting = false;
        }
    } else { // approaching from the right
        this.x += this.speed * this.game.game.clockTick;
    }
// something happens here
    Entity.prototype.update.call(this);
}
;

Enemy.prototype.draw = function (ctx) {
    if (this.waiting && this.waitAnim) { // waiting between attacks
        this.waitAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    } else if (this.attacking) { // attacking
        var frameDrawn = this.attackAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
        //if the attack is finished, then a frame will not be drawn. So draw an idle frame
        if (!frameDrawn) this.waitAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    } else { // approaching from the right
        this.approachAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
};

Enemy.prototype.setBoundaries = function (idleLeft, idleRight, attackLeft, attackRight, approachLeft, approachRight) {
    if (this.waiting) {
        Unit.prototype.setBoundaries.call(this, idleLeft, idleRight);
    } else if (this.attacking) {
        Unit.prototype.setBoundaries.call(this, attackLeft, attackRight);
    } else { // approaching
        Unit.prototype.setBoundaries.call(this, approachLeft, approachRight);
    }
};

Enemy.prototype.attemptAttack = function (other) {
    var collision = this.collide(other);
    if (collision && !this.waiting) {
        this.attacking = true;
        this.target = other;
    }
    return collision;
};

// Luke
function Luke(game, x, y) {
    var approachAnim = new Animation(ASSET_MANAGER.getAsset("./assets/img/enemy/luke/LukeRun.png"), 0, 0, 64, 96, 0.1, 7,
        true, true, true, null, null, 0, -32);
    var waitingAnim = new Animation(ASSET_MANAGER.getAsset("./assets/img/enemy/luke/LukeIdle.png"), 0, 0, 64, 64, 0.25, 6,
        true, true, false, null, null, 0, 28 - 32);
    var attackAnim = new Animation(ASSET_MANAGER.getAsset("./assets/img/enemy/luke/LukeJumpAttack.png"), 0, 0, 128, 96,
        0.05, 10, true, false, false, null, null, -38, -6 - 32);
    Enemy.call(this, game, x, y, 10, 10, -50, approachAnim, waitingAnim, attackAnim);
}

Luke.prototype = new Enemy();
Luke.prototype.constructor = Luke;

Luke.prototype.setBoundaries = function () {
    Enemy.prototype.setBoundaries.call(this, this.x, this.x + 32, this.x, this.x + 32, this.x, this.x + 32);
};

function Leia(game, x, y) {
    var spritesheet = ASSET_MANAGER.getAsset("./assets/img/enemy/leia.png");
    var approachAnim = new Animation(spritesheet, 0, 0, 64, 64, .1, 8, true, true, false, null, null, 0, 0);
    var waitAnim = new Animation(spritesheet, 0, 192, 64, 64, .3, 3, true, true, false, null, null, 0, 0);
    var attackAnim = new Animation(spritesheet, 0, 64, 96, 64, .1, 9, true, false, false, null, null, -32, 0);
    Enemy.call(this, game, x, y, 10, 10, -50, approachAnim, waitAnim, attackAnim);
}

Leia.prototype = new Enemy();
Leia.prototype.constructor = Leia;

Leia.prototype.setBoundaries = function () {
    Enemy.prototype.setBoundaries.call(this, this.x, this.x + 32, this.x, this.x + 32, this.x, this.x + 32);
};

function XWing(game, x, y) {
    var spritesheet = ASSET_MANAGER.getAsset("./assets/img/enemy/xwing_sprite.png");
    var approachAnim = new Animation(spritesheet, 0, 0, 64, 64, .5, 4, true, true, false, null, null, 0, 0);
    var attackAnim = new Animation(spritesheet, 0, 64, 64, 64, .15, 4, true, false, false, null, null, 0, 0);
    Enemy.call(this, game, x, y, 10, 10, -50, approachAnim, approachAnim, attackAnim);
}

XWing.prototype = new Enemy();
XWing.prototype.constructor = XWing;

XWing.prototype.setBoundaries = function () {
    Enemy.prototype.setBoundaries.call(this, this.x, this.x + 32, this.x, this.x + 32, this.x, this.x + 32);
};

