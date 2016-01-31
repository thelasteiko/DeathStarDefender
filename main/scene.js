function Scene(gameEngine) {
    this.entities = [];
    this.game = gameEngine;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.showOutlines = false;
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

Scene.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

Scene.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(ctx);
    }
    ctx.restore();
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

Scene.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
}

Scene.prototype.startInput = function () {
}

