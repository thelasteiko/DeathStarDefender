function Unit(game, animation, x, y, hp, ap) {
    this.hp = hp; // health points
    this.ap = ap; // attack points
    this.animation = animation; // See explanim in Explosion
    Entity.call(this, game, x, y);
}

Unit.prototype = new Entity();
Unit.prototype.constructor = Unit;

//this is where I would move the x and y if there is anything to move
Unit.prototype.update = function () {
    //calls the entity's update function which is not doing anything right now...
    Entity.prototype.update.call(this);
}
//This is where I would change the animation
Unit.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

// Other is another unit
Unit.prototype.attack = function(other) {
    other.hp -= this.ap;
    if (other.hp <= 0) {
        other.removeFromWorld = true;
    }
}

function Sun(game, animation, x, y) {
    Unit.call(game, animation, x, y, 0, 0);
}

Sun.prototype = new Unit();
Sun.prototype.constructor = Sun;

function Ally(game, animation, x, y, projectile, hp) {
    this.attacking = false;
    this.projectile = projectile; // is the constructor for a new projectile of the right type
    Unit.call(game, animation, x, y, hp, 0);
}

Ally.prototype = new Unit();
Ally.prototype.constructor = Ally;

function Enemy(game, animation, x, y, hp, ap) {
    this.waiting = false;
    this.attacking = false;
    Unit.call(game, animation, x, y, hp, ap);
}

Enemy.prototype = new Unit();
Enemy.prototype.constructor = Enemy;

function Projectile(game, animation, x, y, ap) {
    Unit.call(game, animation, x, y, 0, ap);
}

Projectile.prototype = new Unit();
Projectile.prototype.constructor = Projectile;

Projectile.prototype.attack = function (other) {
    super.attack(other);
    if (this.hp <= 0) {
        this.removeFromWorld = true;
    }
}