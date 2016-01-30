// GameBoard code below

function GameBoard(game, numRows, numCols) {
    Entity.call(this, game, 20, 20);
}

GameBoard.prototype = new Entity();
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/960px-Blank_Go_board.png"), this.x, this.y, 760, 760);

    var size = 39.55;
    var offset = 0;
    // draw mouse shadow
    if (this.game.mouse) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/enemy/luke/LukeImg.png"), this.game.mouse.col * size + offset, this.game.mouse.row * size + offset, 40, 40);
        ctx.restore();
    }
}

function LevelScene(gameEngine) {
    Scene.call(this, gameEngine);
    this.numRows = 19;
    this.numCols = 19;
    this.suns = [];
    this.allies = [];
    this.enemies = [];
    this.projectiles = [];
    // whether Vader is still active in a row
    this.vaderActive = [];
    for (var i = 0; i < this.numRows; i++) {
        this.suns.push([]);
        this.allies.push([]);
        this.enemies.push([]);
        this.projectiles.push([]);
        this.vaderActive.push(true);
    }
    this.activeAlly = "Luke";
    this.startInput();
}

LevelScene.prototype = new Scene();
LevelScene.prototype.constructor = LevelScene;

LevelScene.prototype.init = function () {
    this.addEntity(new Background(this));
    this.addEntity(new GameBoard(this.game, 19, 19));
    console.log(new GameBoard(this.game, 19, 19));
}

LevelScene.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    var getRowAndCol = function (e) {
        x = e.clientX - that.game.ctx.canvas.getBoundingClientRect().left - 23.5;
        y = e.clientY - that.game.ctx.canvas.getBoundingClientRect().top - 23.5;

        col = Math.floor((x + 39.55/2) / 39.55);
        row = Math.floor((y + 39.55 / 2) / 39.55);

        // console.log({ row: row, col: col });
        return { row: row, col: col };
    }

    this.game.ctx.canvas.addEventListener("mousemove", function (e) {
        //console.log(getXandY(e));
        that.game.mouse = getRowAndCol(e);
    }, false);

    this.game.ctx.canvas.addEventListener("click", function (e) {
        // console.log(getRowAndCol(e));
        that.game.click = getRowAndCol(e);
    }, false);

    console.log('Input started');
}

LevelScene.prototype.update = function () {
    var attackCallback = function (projectile) {
        this.projectiles.push(projectile);
        this.addEntity(projectile);
    }

    if (this.game.click) {
        var ally = new LukeAlly(this.game, this.game.click.col * 39.55, this.game.click.row * 39.55, attackCallback);
        console.log(ally);
        this.allies[this.game.click.row][this.game.click.col] = ally;
        this.addEntity(ally); // TODO: make this stop breaking the Scene update cycle
        console.log(this.allies);
        console.log(ally instanceof LukeAlly);
        console.log(ally instanceof Entity);
    }
    Scene.prototype.update.call(this);
}
