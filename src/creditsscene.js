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
    x = 400;
    y = 0;
    this.addEntity(new TextBlock2(this, 400, y,
        "Credits\n", "center", 30));
    
    this.addEntity(new TextBlock2(this, x, y += 45,
        "Red One\n", "center", 24));
    this.addEntity(new TextBlock2(this, x, y += 30,
        "UX Lead: Melinda Robertson\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "QA Lead: Grant Toepfer\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "Engine Lead: Julia Behnen\n", "center", 20));
        
    this.addEntity(new TextBlock2(this, x, y += 45,
        "Spritesheet Sources\n", "center", 24));
    this.addEntity(new TextBlock2(this, x, y += 30,
        "Big Tie-Fighter: kavinveldar\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "Luke Skywalker: MetaKnightX\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "Stormtrooper: Tonberry2K\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "X-Wing: SpartanNJones\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "Lightning: Pierluigi Pesenti\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "AT-ST: Boarder\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "Batman: King Shyguy\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "Sci-Fi Tiles: Sherman3D and DEGICA Co., LT\n", "center", 20));
        
    this.addEntity(new TextBlock2(this, x, y += 45,
        "Original Sprite Creators\n", "center", 24));
    this.addEntity(new TextBlock2(this, x, y += 30,
        "Super NES Star Wars\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "The Adventures of Batman and Robin\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "Lucas Studios\n", "center", 20));
    
    this.addEntity(new TextBlock2(this, x, y += 30,
        "All intellectual property ultimately belongs to Disney.\n", "center", 16));
    
    this.addEntity(new TextBlock2(this, x, 500,
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