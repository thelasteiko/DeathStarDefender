function CreditsScene(gameEngine) {
    Scene.call(this, gameEngine);
    this.startInput();
}

CreditsScene.prototype = new Scene();
CreditsScene.prototype.constructor = CreditsScene;

CreditsScene.prototype.init = function (ctx) {
    Scene.prototype.init.call(this, ctx);
    this.background = new Background(this);
    this.play = new Play2(this);
    this.addEntity(new TextBlock2(this, 400, 0,
        "Credits\n", "center", 30));
    
    this.addEntity(new TextBlock2(this, 400, 500,
        "Click anywhere to return to the title screen.\n", "center", 16));
    this.startInput();
};

CreditsScene.prototype.startInput = function () {
    if (!this.ctx) return;
    var that = this;
    var clickFunction = function () {
        that.ctx.canvas.removeEventListener("click", clickFunction);
        that.game.changeScene(new TitleScene(that.game, 1));
    };
    this.ctx.canvas.addEventListener("click", clickFunction);
};

CreditsScene.prototype.draw = function (ctx) {
    ctx.save();
    this.background.draw(ctx);
    Scene.prototype.draw.call(this, ctx);
    ctx.restore();
};