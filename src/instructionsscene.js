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
    var x = 400;
    var y = 0;
    this.addEntity(new TextBlock2(this, x, y,
        "Instructions\n", "center", 30));
    this.addEntity(new TextBlock2(this, x, y += 45,
        "Allies\n", "center", 24));
    this.addEntity(new TextBlock2(this, x, y += 35,
        "Click on an available ally in the menu and then \n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "click on a grid square to place the ally.\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 30,
        "Use the KILL crosshair to remove an ally.\n", "center", 20));
    this.addEntity(new Battery(this, x - 300 - 32, y += 70));
    this.addEntity(new TieFighter(this, x - 100 - 32, y));
    this.addEntity(new Stormtrooper(this, x + 100 - 32, y));
    this.addEntity(new ATST(this, x + 300 - 32, y));
    this.addEntity(new TextBlock2(this, x - 300, y += 50,
        "Make Power\n", "center", 20));
    this.addEntity(new TextBlock2(this, x - 100, y,
        "Fire Lasers\n", "center", 20));
    this.addEntity(new TextBlock2(this, x + 100, y,
        "Absorb Damage\n", "center", 20));
    this.addEntity(new TextBlock2(this, x + 300, y,
        "Strong Lasers\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 40,
        "Power\n", "center", 24));
    this.addEntity(new Sun(this, x - 32, y += 50));
    this.addEntity(new TextBlock2(this, x, y += 30,
        "Power is required to place allies.\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "Available power increases over time automatically.\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "Batteries produce more power (shown above). Click to harvest it.\n", "center", 20));

    this.addEntity(new TextBlock2(this, x, y += 40,
        "Win by killing all enemies that attack your base.\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y += 20,
        "Lose by allowing an enemy to reach your base twice in a lane.\n", "center", 20));
    this.addEntity(new TextBlock2(this, x, y + 30,
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