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
    this.menu = new Menu(this, 0, 0)
    this.addEntity(this.menu);
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

    var clickSun = function (row, col) {
        that.suns[row][col].removeFromWorld = true;
        // console.log("sun clicked");
        // TODO increment menu power counter
    }

    this.ctx.canvas.addEventListener("click", function (e) {
        // console.log({x: e.clientX, y: e.clientY});
        // console.log(that.getRowAndCol(e.clientX, e.clientY));
        that.click = that.getRowAndCol(e.clientX, e.clientY);
        if (that.click && that.click.col < that.numCols
            && that.click.row < that.numRows
            && that.click.col >= 0 && that.click.row >= 0) {

            // if the cell is occupied with an ally, check for suns
            if (that.allies[that.click.row][that.click.col]) {
                // this nested if could be condensed, but I want to keep the logic separate for now
                if (that.suns[that.click.row][that.click.col]) {
                    clickSun(that.click.row, that.click.col);
                }
            } else { // if the cell is not occupied, place an ally
                var that2 = that;
                var attackCallback = function (projectile, col, row) {
                    // console.log(projectile);
                    //that2.projectiles[row].push(projectile);
                    if (projectile instanceof Sun) {
                        // remove current sun from entities list
                        if (that2.suns[row][col]) {
                            that2.suns[row][col].removeFromWorld = true;
                        }
                        that2.addEntity(projectile, that2.suns, row, col);
                    } else {
                        that2.addEntity(projectile, that2.projectiles, row);
                        that2.projectiles[row][col] = projectile;
                    }
                }
                var ally = new Battery(that,
                    that.click.col * that.colWidth + that.cornerOffsetX,
                    that.click.row * that.rowHeight + that.cornerOffsetY,
                    that.click.col, that.click.row, attackCallback);
                //that.allies[that.click.row][that.click.col] = ally;
                that.addEntity(ally, that.allies, that.click.row, that.click.col);
            }
        }
    }, false);

    console.log('Input started');
}

LevelScene.prototype.update = function () {
    Scene.prototype.update.call(this);

    this.board.update();

    for (var i = 0; i < this.numRows; i++) {
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

    for (var i = 0; i < this.numRows; i++) {
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
    for (var i = 0; i < this.numRows; i++) {
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

    // draw mouse shadow
    if (this.mouse && this.mouse.row >= 0 && this.mouse.row < this.numRows
        && this.mouse.col >= 0 && this.mouse.col < this.numCols //&& this.menu.current //TODO uncomment when implemented menu.current
        && !(this.allies[this.mouse.row] && this.allies[this.mouse.row][this.mouse.col])) {
        ctx.globalAlpha = 0.5;
        //TODO get current image from menu?
        ctx.drawImage(ASSET_MANAGER.getAsset("./main/img/enemy/luke/LukeImg.png"), //this.menu.current, //TODO replace with above
            this.mouse.col * this.colWidth + this.cornerOffsetX,
            this.mouse.row * this.rowHeight + this.cornerOffsetY, 64, 64);
    }

    ctx.restore();
    Scene.prototype.draw.call(this, ctx);
}

LevelScene.prototype.sendEnemy = function (row) {
    var x = this.cornerOffsetX + (this.numCols * this.colWidth);
    var y = this.cornerOffsetY + (row * this.rowHeight);
    //console.log("[" + x + ", " + y + "]");
    var enemy = new LukeEnemy(this, x, y);
    this.addEntity(enemy, this.enemies, row);
}

LevelScene.prototype.addEntity = function (entity, list, row, col) {
    console.log('added entity');
    if (list == null) Scene.prototype.addEntity.call(this, entity);
    else if (col == null) list[row].push(entity);
    else  list[row][col] = entity;
    // console.log("row", list[row]);
}