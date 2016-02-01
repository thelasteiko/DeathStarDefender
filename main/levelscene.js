// GameBoard code below

function GameBoard(game, numRows, numCols) {
    Entity.call(this, game, 0, 0);
}

GameBoard.prototype = new Entity();
GameBoard.prototype.constructor = GameBoard;

GameBoard.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/gameboard.png"), this.x, this.y, 800, 797);
}

function LevelScene(gameEngine) {
    Scene.call(this, gameEngine);
    this.numRows = 5;
    this.numCols = 9;
    this.cornerOffsetX = 64;
    this.cornerOffsetY = 224;
    this.rowHeight = 64;
    this.colWidth = 64;
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
}

LevelScene.prototype = new Scene();
LevelScene.prototype.constructor = LevelScene;

LevelScene.prototype.init = function (ctx) {
    Scene.prototype.init.call(this, ctx);
    this.board = new GameBoard(this, 5, 9);
    this.sendEnemy(2);
    this.sendEnemy(4);
    this.startInput();
}

LevelScene.prototype.getRowAndCol = function (x, y) {

    var col = Math.floor((x - this.cornerOffsetX) / this.colWidth);
    var row = Math.floor((y - this.cornerOffsetY) / this.rowHeight);

    return {row: row, col: col};
}

LevelScene.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        //console.log(getXandY(e));
        that.mouse = that.getRowAndCol(e.clientX, e.clientY);
    }, false);

    this.ctx.canvas.addEventListener("click", function (e) {
        // console.log({x: e.clientX, y: e.clientY});
        // console.log(that.getRowAndCol(e.clientX, e.clientY));
        that.click = that.getRowAndCol(e.clientX, e.clientY);
        if (that.click && that.click.col < that.numCols
            && that.click.row < that.numRows
            && that.click.col >= 0 && that.click.row >= 0) {
            var that2 = that;
            var attackCallback = function (projectile) {
            // console.log(projectile);
                var row = that2.getRowAndCol(projectile.x, projectile.y).row;
                //that2.projectiles[row].push(projectile);
                that2.addEntity(projectile, that2.projectiles, row);
            }
            var ally = new TieFighter(that,
                that.click.col * that.colWidth + that.cornerOffsetX,
                that.click.row * that.rowHeight + that.cornerOffsetY, attackCallback);
            //that.allies[that.click.row][that.click.col] = ally;
            that.addEntity(ally, that.allies, that.click.row, that.click.col); 
        }
    }, false);

    console.log('Input started');
}

LevelScene.prototype.update = function () {
    Scene.prototype.update.call(this);
    
    this.board.update();
    
    for(var i = 0; i < this.numRows; i++) {
        for (var j = 0; j < this.numCols; j++) {
            if (this.allies[i] && this.allies[i][j]) {
                if (!this.allies[i][j].removeFromWorld) {
                    this.allies[i][j].update();
                }
            }
            if (this.enemies[i] && this.enemies[i][j]) {
                if (!this.enemies[i][j].removeFromWorld) {
                    this.enemies[i][j].update();
                }
            }
            if (this.suns[i] && this.suns[i][j]) {
                if (!this.suns[i][j].removeFromWorld) {
                    this.suns[i][j].update();
                }
            }
            if (this.projectiles && this.projectiles[i][j]) {
                if (!this.projectiles[i][j].removeFromWorld) {
                    this.projectiles[i][j].update();
                }
            }
        }
    }
    
    for(var i = 0; i < this.numRows; i++) {
        for (var j = 0; j < this.numCols; j++) {
            if (this.suns[i] && this.suns[i][j]
                && this.suns[i][j].removeFromWorld) {
                this.suns[i].splice(j, 1);
            }
            if (this.allies[i] && this.allies[i][j]
                && this.allies[i][j].removeFromWorld) {
                this.allies[i].splice(j, 1);
            }
            if (this.enemies[i] && this.enemies[i][j]
                && this.enemies[i][j].removeFromWorld) {
                this.enemies[i].splice(j, 1);
            }
            if (this.projectiles && this.projectiles[i][j]
                && this.projectiles[i][j].removeFromWorld) {
                this.projectiles[i].splice(j, 1);
            }
        }
    }
}

LevelScene.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    this.board.draw(ctx);
    for(var i = 0; i < this.numRows; i++) {
        for (var j = 0; j < this.numCols; j++) {
            if (this.allies[i] && this.allies[i][j]) {
                this.allies[i][j].draw(ctx);
            }
            if (this.enemies[i] && this.enemies[i][j]) {
                    this.enemies[i][j].draw(ctx);
            }
            if (this.suns[i] && this.suns[i][j]) {
                    this.suns[i][j].draw(ctx);
            }
            if (this.projectiles[i] && this.projectiles[i][j]) {
                    this.projectiles[i][j].draw(ctx);
            }
        }
    }
    ctx.restore();
    // draw mouse shadow
    if (this.mouse && this.mouse.row >= 0 && this.mouse.row < this.numRows
        && this.mouse.col >= 0 && this.mouse.col < this.numCols) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        //get current image from menu
        ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/enemy/luke/LukeImg.png"),
            this.mouse.col * this.colWidth + this.cornerOffsetX,
            this.mouse.row * this.rowHeight + this.cornerOffsetY, 64, 64);
        ctx.restore();
    }
}

LevelScene.prototype.sendEnemy = function (row) {
    var x = this.cornerOffsetX + (this.numCols * this.colWidth);
    var y = this.cornerOffsetY + ((row-1) * this.rowHeight);
    //console.log("[" + x + ", " + y + "]");
    var enemy = new LukeEnemy(this, x, y);
    this.addEntity(enemy, this.enemies, row);
}

LevelScene.prototype.addEntity = function (entity, list, row, col) {
    console.log('added entity');
    if (col) list[row][col] = entity;
    else list[row].push(entity);
}