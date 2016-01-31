// GameBoard code below

function GameBoard(game, numRows, numCols) {
    Entity.call(this, game, 20, 20);
}

GameBoard.prototype = new Entity();
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/960px-Blank_Go_board.png"), this.x, this.y, 760, 760);
}

function LevelScene(gameEngine) {
    Scene.call(this, gameEngine);
    this.numRows = 18;
    this.numCols = 18;
    this.cornerOffsetX = 44;
    this.cornerOffsetY = 44;
    this.rowHeight = 39.55;
    this.colWidth = 39.55;
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
    this.sendEnemy(2);
    this.sendEnemy(4);
}

LevelScene.prototype.getRowAndCol = function (x, y) {
    //x -= this.game.ctx.canvas.getBoundingClientRect().left;
    //y -= this.game.ctx.canvas.getBoundingClientRect().top;

    var col = Math.floor((x - this.cornerOffsetX) / this.colWidth);
    var row = Math.floor((y - this.cornerOffsetY) / this.rowHeight);

    //col = Math.floor((x + 39.55 / 2) / 39.55);
    //row = Math.floor((y + 39.55 / 2) / 39.55);

    //console.log({x: x, y: y});
    //console.log({row: row, col: col});

    return {row: row, col: col};
}

LevelScene.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    this.game.ctx.canvas.addEventListener("mousemove", function (e) {
        //console.log(getXandY(e));
        that.game.mouse = that.getRowAndCol(e.clientX, e.clientY);
    }, false);

    this.game.ctx.canvas.addEventListener("click", function (e) {
        console.log({x: e.clientX, y: e.clientY});
        console.log(that.getRowAndCol(e.clientX, e.clientY));
        that.game.click = that.getRowAndCol(e.clientX, e.clientY);
    }, false);

    console.log('Input started');
}

LevelScene.prototype.update = function () {
    var that = this;
    var attackCallback = function (projectile) {
        console.log(projectile);
        var row = that.getRowAndCol(projectile.x, projectile.y).row;
        that.projectiles[row].push(projectile);
        that.addEntity(projectile);
    }

    var coord = this.game.click;
    if (coord && coord.col < this.numCols && coord.row < this.numRows) {
        var ally = new LukeAlly(this.game,
            coord.col * this.colWidth + this.cornerOffsetX,
            coord.row * this.rowHeight + this.cornerOffsetY, attackCallback);
        // console.log(ally);
        this.allies[coord.row][coord.col] = ally;
        this.addEntity(ally); // TODO: make this stop breaking the Scene update cycle
    }
    Scene.prototype.update.call(this);
}

LevelScene.prototype.draw = function (ctx) {
    Scene.prototype.draw.call(this, ctx);

    // draw mouse shadow
    if (this.game.mouse) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/enemy/luke/LukeImg.png"),
            this.game.mouse.col * this.colWidth + this.cornerOffsetX,
            this.game.mouse.row * this.rowHeight + this.cornerOffsetY, 40, 40);
        ctx.restore();
    }
}

LevelScene.prototype.sendEnemy = function (row) {
    var xCoord = (this.numCols - 1) * this.colWidth + 4;
    var yCoord = row * this.rowHeight + 4;
    var enemy = new LukeEnemy(this.game, xCoord, yCoord);
    this.enemies[row].push(enemy);
    this.addEntity(enemy);
}