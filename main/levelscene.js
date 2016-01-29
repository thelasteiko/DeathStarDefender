// GameBoard code below

function GameBoard(game) {
    Entity.call(this, game, 20, 20);
    this.grid = false;
    this.player = 1;
    this.board = [];
    for (var i = 0; i < 19; i++) {
        this.board.push([]);
        for (var j = 0; j < 19; j++) {
            this.board[i].push(0);
        }
    }
}

GameBoard.prototype = new Entity();
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.update = function () {
    if (this.game.click) {
        this.board[this.game.click.x][this.game.click.y] = this.player;
        this.player = this.player === 1 ? 2 : 1;
    }
    Entity.prototype.update.call(this);
}

GameBoard.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/960px-Blank_Go_board.png"), this.x, this.y, 760, 760);

    var size = 39.55;
    var offset = 3.5 + size / 2;

    for (var i = 0; i < 19; i++) {
        for (var j = 0; j < 19; j++) {
            //ctx.strokeStyle = "Green";
            //ctx.strokeRect(i * size + offset, j * size + offset, size, size);

            if (this.board[i][j] === 1) {
                ctx.drawImage(ASSET_MANAGER.getAsset("./img/black.png"), i * size + offset, j * size + offset, 40, 40);
            }
            if (this.board[i][j] === 2) {
                ctx.drawImage(ASSET_MANAGER.getAsset("./img/white.png"), i * size + offset, j * size + offset, 40, 40);
            }
        }
    }

    // draw mouse shadow
    if (this.game.mouse) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        if (this.player === 1) ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/black.png"), this.game.mouse.x * size + offset, this.game.mouse.y * size + offset, 40, 40);
        else ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/white.png"), this.game.mouse.x * size + offset, this.game.mouse.y * size + offset, 40, 40);
        ctx.restore();
    }
}

GameBoard.prototype.update = function () {
    if (this.game.click) {
        this.board[this.game.click.x][this.game.click.y] = this.player;
        this.player = this.player === 1 ? 2 : 1;
    }
    Entity.prototype.update.call(this);
}

GameBoard.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/960px-Blank_Go_board.png"), this.x, this.y, 760, 760);

    var size = 39.55;
    var offset = 3.5 + size/2;

    for (var i = 0; i < 19; i++) {
        for (var j = 0; j < 19; j++) {
            //ctx.strokeStyle = "Green";
            //ctx.strokeRect(i * size + offset, j * size + offset, size, size);

            if (this.board[i][j] === 1) {
                ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/black.png"), i * size + offset, j * size + offset, 40, 40);
            }
            if (this.board[i][j] === 2) {
                ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/white.png"), i * size + offset, j * size + offset, 40, 40);
            }
        }
    }

    // draw mouse shadow
    if (this.game.mouse) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        if(this.player === 1) ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/black.png"), this.game.mouse.x * size + offset, this.game.mouse.y * size + offset, 40, 40);
        else ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/white.png"), this.game.mouse.x * size + offset, this.game.mouse.y * size + offset, 40, 40);
        ctx.restore();
    }
}

function LevelScene(gameEngine, numRows) {
    Scene.call(this, gameEngine);
    this.suns = [];
    this.allies = [];
    this.enemies = [];
    this.projectiles = [];
    // whether Vader is still active in a row
    this.vaderActive = [];
    for (var i = 0; i < numRows; i++) {
        this.suns.push([]);
        this.allies.push([]);
        this.enemies.push([]);
        this.projectiles.push([]);
        vaderActive.push(true);
    }
    this.startInput();
}

LevelScene.prototype = new Scene();
LevelScene.prototype.constructor = LevelScene;

LevelScene.prototype.init = function () {
    this.addEntity(new Background(this));
    this.addEntity(new GameBoard(this.game));
}

LevelScene.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    var getXandY = function (e) {
        var x = e.clientX - that.game.ctx.canvas.getBoundingClientRect().left - 23.5;
        var y = e.clientY - that.game.ctx.canvas.getBoundingClientRect().top - 23.5;

        x = Math.floor(x / 39.55);
        y = Math.floor(y / 39.55);

        return { x: x, y: y };
    }

    this.game.ctx.canvas.addEventListener("mousemove", function (e) {
        //console.log(getXandY(e));
        that.game.mouse = getXandY(e);
    }, false);

    this.game.ctx.canvas.addEventListener("click", function (e) {
        //console.log(getXandY(e));
        that.game.click = getXandY(e);
    }, false);

    console.log('Input started');
}