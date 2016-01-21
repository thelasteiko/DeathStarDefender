function Scene(gameEngine) {
  this.entities = [];
  this.game = gameEngine;
  this.click = null;
  this.mouse = null;
  this.wheel = null;
}

Scene.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

Scene.prototype.draw = function() {
    this.game.ctx.clearRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
    this.game.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.game.ctx);
    }
    this.game.ctx.restore();
}

Scene.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
}

Scene.prototype.init = function() {}

Scene.prototype.startInput = function () {}

