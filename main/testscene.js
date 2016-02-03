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
            menu.placeItem(that.click.x, that.click.y);
        }
    });
}