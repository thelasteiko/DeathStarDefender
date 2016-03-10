function TextBlock2(game, x, y, block, align, fontSize, font) {
    if (font) {
        console.log("chose " + font);
    }
    this.color = "White";
    this.block = block;
    this.align = align ? align : "center";
    this.fontSize = fontSize ? fontSize : 24;
    this.font = font ? font : "Lucida Console";
    console.log(this.font);
    Entity.call(this, game, x, y);
}

TextBlock2.prototype = new Entity();
TextBlock2.prototype.constructor = TextBlock2;

TextBlock2.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.font = this.fontSize + "px " + this.font;
    var str = "";
    var nc = 0;
    for (var i = 0; i < this.block.length; i++) {
        var c = this.block.charAt(i);
        if (c === "\n") {
            nc += 1;
            ctx.fillText(str, this.x, this.y + (50 * nc));
            str = "";
        } else {
            str += c;
        }
    }

};

function InstructionsScene(gameEngine) {
    Scene.call(this, gameEngine);
    this.startInput();
}

InstructionsScene.prototype = new Scene();
InstructionsScene.prototype.constructor = InstructionsScene;

InstructionsScene.prototype.init = function (ctx) {
    Scene.prototype.init.call(this, ctx);
    this.background = new Background(this);
    this.play = new Play2(this);
    this.addEntity(new TextBlock2(this, 400, 0,
        "Instructions\n", "center", 30));
    this.addEntity(new TextBlock2(this, 400, 45,
        "Allies\n", "center", 24));
    this.addEntity(new TextBlock2(this, 400, 80,
        "Click on an ally in the menu and then \n", "center", 20));
    this.addEntity(new TextBlock2(this, 400, 100,
        "click on a grid square to place the ally.\n", "center", 20));
    this.addEntity(new Battery(this, 168, 170));
    this.addEntity(new TextBlock2(this, 200, 220,
        "Makes Power\n", "center", 20));
    this.addEntity(new TieFighter(this, 368, 170));
    this.addEntity(new TextBlock2(this, 400, 220,
        "Fires Bullets\n", "center", 20));
    this.addEntity(new Stormtrooper(this, 568, 170));
    this.addEntity(new TextBlock2(this, 600, 220,
        "Absorbs Damage\n", "center", 20));
    this.addEntity(new TextBlock2(this, 400, 260,
        "Power\n", "center", 24));
    this.addEntity(new Sun(this, 368, 310));
    this.addEntity(new TextBlock2(this, 400, 340,
        "Power is required to place allies.\n", "center", 20));
    this.addEntity(new TextBlock2(this, 400, 360,
        "Available power increases over time automatically.\n", "center", 20));
    this.addEntity(new TextBlock2(this, 400, 380,
        "Batteries produce more power (shown above). Click to harvest it.\n", "center", 20));
    
    this.addEntity(new TextBlock2(this, 400, 450,
        "Win by killing all enemies that attack your base.\n", "center", 20));
    this.addEntity(new TextBlock2(this, 400, 470,
        "Lose by allowing an enemy to reach your base twice in a lane.\n", "center", 20));
    this.addEntity(new TextBlock2(this, 400, 500,
        "Click anywhere to return to the title screen.\n", "center", 16));
    this.startInput();
};

InstructionsScene.prototype.startInput = function () {
    if (!this.ctx) return;
    var that = this;
    var clickFunction = function () {
        that.ctx.canvas.removeEventListener("click", clickFunction);
        that.game.changeScene(new TitleScene(that.game, 1));
    };
    this.ctx.canvas.addEventListener("click", clickFunction);
};

InstructionsScene.prototype.draw = function (ctx) {
    ctx.save();
    this.background.draw(ctx);
    Scene.prototype.draw.call(this, ctx);
    ctx.restore();
};