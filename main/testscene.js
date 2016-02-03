function Battery(game, x, y, callback) {
    var pic = ASSET_MANAGER.getAsset("./main/img/battery.png");
    var idleAnim = new SpriteImage(pic, 192, 64, 64, 64);
    var attackAnim = new Animation(pic, 0, 0, 64, 64, 1, 8, false, true, false);
    Ally.call(this, game, x, y, 10, idleAnim, attackAnim, callback, Sun, 3, false, false)
}

Battery.prototype = new Ally();
Battery.prototype.constructor = Battery;

Battery.prototype.draw = function(ctx) {
    this.attackAnim.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
}

Battery.prototype.update = function () {
    
}

function TestScene(gameEngine) {
    Scene.call(this,gameEngine);
}

TestScene.prototype = new Scene();
TestScene.prototype.constructor = TestScene;

TestScene.prototype.init = function(ctx) {
    Scene.prototype.init.call(this, ctx);
    this.addEntity(new Menu(this, 0, 0));
    this.startInput();
}

TestScene.prototype.startInput = function () {
    var that = this;
    var getXandY = function (e) {
        var x = e.clientX - that.game.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.game.ctx.canvas.getBoundingClientRect().top;
        return { x: x, y: y, radius: 1};
    }
    
    this.ctx.canvas.addEventListener("click", function (e) {
        var menu = that.entities[0];
        that.click = getXandY(e);
        if(!menu.setSelection(that.click.x, that.click.y)) {
            var attackCallback = function (projectile) {
                console.log(projectile);
            }
            var obj = menu.placeItem(that.click.x, that.click.y, attackCallback);
            that.addEntity(obj);
        }
    });
}