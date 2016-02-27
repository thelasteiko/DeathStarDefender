// GameBoard code below

// Provides the data used to generate waves in each level. 
// Each row is a level, each column is a wave in that level.
// Probababilities for each enemy type are strictly increasing and
// are calculated as the difference between the probability given
// and the previous probability (which is 0 if first element). 
// Last probability must be 1. 
// Ex: [["Luke", 0.3], ["Leia", 1]] gives a 30% chance of a Luke
// and a 70% chance of a Leia.
var levelWaves = DEBUG ?
    [
        [], // No waves in level 0 (does not exist... yet. Maybe this will be used for survival mode)
        [
            [1000, 4, [["XWing", 1]], 3000], // Wave data for level 1
            [3000, 4, [["Luke", 0.5], ["Leia", 1]], 2000],
            [3000, 4, [["Leia", 1]], 1000]
        ]
    ]
    :
    [
        [], // No waves in level 0 (does not exist... yet. Maybe this will be used for survival mode)
        [
            [30000, 4, [["XWing", .75], ["Luke", 1]], 7500], // Wave data for level 1
            [15000, 4, [["XWing", .5], ["Luke", 0.75], ["Leia", 1]], 5000],
            [15000, 4, [["XWing", .5], ["Luke", 0.75], ["Leia", 1]], 1000],
            [10000, 8, [["XWing", .5], ["Leia", 1]], 500],
            [5000, 4, [["XWing", .5], ["Luke", 0.75], ["Leia", 1]], 1000],
            [10000, 10, [["XWing", .5], ["Luke", 0.7], ["Leia", 1]], 300]
        ]
    ];


function BoardBase(game) {
    Entity.call(this, game, 0, 0);
}

BoardBase.prototype = new Entity();
BoardBase.prototype.constructor = BoardBase;

BoardBase.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./assets/img/boardbase.png"), this.x, this.y, 800, 576);
};

function BoardTop(game) {
    Entity.call(this, game, 0, 0);
}

BoardTop.prototype = new Entity();
BoardTop.prototype.constructor = BoardTop;

BoardTop.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./assets/img/boardtop.png"), this.x, this.y, 800, 576);
};

function Wave(waveDataArray) {
    this.startDelay = waveDataArray[0]; // How long we wait before starting the wave
    this.remainingEnemies = waveDataArray[1]; // How many enemies remain in the wave
    this.difficulty = waveDataArray[2]; // The difficulty of the levels in the game (will be
                                        // used in conjunction with a random number generator
                                        // to select an enemy
    this.enemyInterval = waveDataArray[3];  // How often an enemy gets sent. 
}

// LevelScene code

function LevelScene(gameEngine, level) {
    Scene.call(this, gameEngine);
    this.level = level; // The current level. Right now, the first level is level 1, and
                        // level 0 is being ignored. 
    this.wave = 0; // The current wave within the level (0-indexed)
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
    this.vaders = [];
    for (var i = 0; i < this.numRows; i++) {
        this.suns.push([]);
        this.allies.push([]);
        this.enemies.push([]);
        this.projectiles.push([]);
    }
}

LevelScene.prototype = new Scene();
LevelScene.prototype.constructor = LevelScene;

LevelScene.prototype.init = function (ctx) {
    Scene.prototype.init.call(this, ctx);
    this.boardbase = new BoardBase(this);
    this.boardtop = new BoardTop(this);
    this.menu = new Menu(this, 0, 0);
    this.addEntity(this.menu);

    var that = this;

    function gameOver() {
        that.ctx.canvas.removeEventListener("click", this.clickFunction);
        that.ctx.canvas.removeEventListener("mousemove", this.mouseMoveListener);
        that.game.changeScene(new LoseScene(that.game));
    }

    for (var i = 0; i < this.numRows; i++)
        this.vaders.push(new Vader(this, 0, this.cornerOffsetY + (64 * i), i, gameOver));
    this.startInput();
    this.startTimerToNextWave();
};

LevelScene.prototype.startTimerToNextWave = function () {
    this.nextWaveTimer = 0;
    //if (!this.level || !this.wave) return;
    this.waveData = new Wave(levelWaves[this.level][this.wave]);
};

LevelScene.prototype.sendEnemyInWave = function (wave) {
    var that = this;
    if (wave.remainingEnemies <= 0) {
        console.log("end of wave");
        this.endWave();
    } else {
        this.sendEnemy();
        wave.remainingEnemies--;
        this.nextEnemyTimer = 0;
    }
};

LevelScene.prototype.endWave = function () {
    this.wave++;
    if (this.wave < levelWaves[this.level].length) {
        this.startTimerToNextWave();
    } else {
        console.log("end of enemies");
        this.noEnemiesRemainInQueue = true;
    }
};

LevelScene.prototype.getRowAndCol = function (x, y) {

    var col = Math.floor((x - this.cornerOffsetX) / this.colWidth);
    var row = Math.floor((y - this.cornerOffsetY) / this.rowHeight);

    return {row: row, col: col};
};

LevelScene.prototype.attackCallback = function (projectile, col, row) {
    if (projectile instanceof Sun) {
        // remove current sun from entities list
        if (this.suns[row][col]) {
            this.suns[row][col].removeFromWorld = true;
        }
        this.addEntity(projectile, this.suns, row, col);
    } else {
        this.addEntity(projectile, this.projectiles, row);
        this.projectiles[row][col] = projectile;
    }
};

LevelScene.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    this.mouseMoveListener = function (e) {
        that.mouse = that.getRowAndCol(e.clientX, e.clientY);
    };
    this.ctx.canvas.addEventListener("mousemove", this.mouseMoveListener, false);

    var clickSun = function (row, col) {
        that.suns[row][col].removeFromWorld = true;
        that.menu.counter.energycount += 25;
    };

    this.clickFunction = function (e) {
        var x = e.clientX - that.game.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.game.ctx.canvas.getBoundingClientRect().top;

        that.click = that.getRowAndCol(e.clientX, e.clientY);

        var attackCallback = function (projectile, col, row) {
            if (projectile instanceof Sun) {
                // remove current sun from entities list
                if (that.suns[row][col]) {
                    that.suns[row][col].removeFromWorld = true;
                }
                that.addEntity(projectile, that.suns, row, col);
            } else {
                that.addEntity(projectile, that.projectiles, row);
            }
        };

        if (that.menu.setSelection(x, y)) {
            return;
        }

        var inGrid = (that.click && that.click.col < that.numCols
        && that.click.row < that.numRows
        && that.click.col >= 0 && that.click.row >= 0);

        if (inGrid) {
            var row = that.click.row;
            var col = that.click.col;
            if (that.suns[row][col]) {
                clickSun(that.click.row, that.click.col);
            } else if (!that.allies[row][col]) {
                var obj = that.menu.placeItem(
                    col * that.colWidth + that.cornerOffsetX,
                    row * that.rowHeight + that.cornerOffsetY,
                    col, row, attackCallback);
                if (obj) that.addEntity(obj, that.allies, row, col);
            }
        } else if (DEBUG && that.click && that.click.col == that.numCols
            && that.click.row < that.numRows && that.click.row >= 0)
            that.sendEnemy(that.click.row);
    };
    this.ctx.canvas.addEventListener("click", this.clickFunction, false);

    console.log('Input started');
};

LevelScene.prototype.update = function () {
    var that = this;
    Scene.prototype.update.call(this);

    for (var i = 0; i < this.numRows; i++) {
        // projectiles vs enemies check
        if (this.projectiles[i] && this.enemies[i]) {
            this.projectiles[i].forEach(function (projectile) {
                return that.enemies[i].some(function (enemy) {
                    return projectile.attemptAttack(enemy);
                });
            });
        }
        // enemy vs allies check
        if (this.enemies[i] && that.allies[i]) {
            this.enemies[i].forEach(function (enemy) {
                return that.allies[i].some(function (ally) {
                    return enemy.attemptAttack(ally);
                });
            });
        }
    }

    for (i = 0; i < this.numRows; i++) {
        for (var j = 0; j < this.numCols; j++) {
            if (this.allies[i] && this.allies[i][j]) {
                if (!this.allies[i][j].removeFromWorld) {
                    this.allies[i][j].update();
                }
            }
            if (this.enemies[i] && this.enemies[i][j]) {
                // Why are we checking enemies by their column?
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
        if (this.vaders && this.vaders[i])
            this.vaders[i].update();
    }

    for (i = 0; i < this.numRows; i++) {
        for (j = 0; j < this.numCols; j++) {
            if (this.suns[i] && this.suns[i][j]
                && this.suns[i][j].removeFromWorld) {
                this.suns[i][j] = undefined;
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

    // Check for victory
    if (this.noEnemiesRemainInQueue) { // If the last wave has finished sending enemies
        var allEnemiesKilled = true;
        for (i = 0; i < this.enemies.length; i++) { // Check if all enemies dead
            if (this.enemies[i].length > 0) {
                allEnemiesKilled = false;
                break;
            }
        }
        if (allEnemiesKilled) { // If all enemies dead, win!
            this.ctx.canvas.removeEventListener("click", this.clickFunction);
            this.ctx.canvas.removeEventListener("mousemove", this.mouseMoveListener);
            this.game.changeScene(new WinScene(this.game));
        }
    }

    this.nextWaveTimer += this.game.clockTick * 1000;
    this.nextEnemyTimer += this.game.clockTick * 1000;

    if (this.waveData.startDelay && this.nextWaveTimer > this.waveData.startDelay) {
        this.nextWaveTimer = Number.NEGATIVE_INFINITY;
        this.sendEnemyInWave(this.waveData);
    }

    if (this.waveData.enemyInterval && this.nextEnemyTimer > this.waveData.enemyInterval) {
        this.nextEnemyTimer = Number.NEGATIVE_INFINITY;
        this.sendEnemyInWave(this.waveData);
    }
};

LevelScene.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    this.boardbase.draw(ctx);
    for (var i = 0; i < this.numRows; i++) {
        if (this.vaders && this.vaders[i])
            this.vaders[i].draw(ctx);
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

    this.boardtop.draw(ctx);

    // draw mouse shadow
    if (this.mouse && this.mouse.row >= 0 && this.mouse.row < this.numRows
        && this.mouse.col >= 0 && this.mouse.col < this.numCols && this.menu.current != null
        && !(this.allies[this.mouse.row] && this.allies[this.mouse.row][this.mouse.col])) {
        ctx.globalAlpha = 0.5;
        var img = this.menu.current.shadow;
        img.drawImage(ctx,
            this.mouse.col * this.colWidth + this.cornerOffsetX,
            this.mouse.row * this.rowHeight + this.cornerOffsetY);
    }

    ctx.restore();
    Scene.prototype.draw.call(this, ctx);
};

LevelScene.prototype.sendEnemy = function (row) {
    if (!row) {
        row = Math.floor(Math.random() * 5);
    }
    var x = this.cornerOffsetX + (this.numCols * this.colWidth) + 64;
    var y = this.cornerOffsetY + (row * this.rowHeight);
    var enemyString;
    var rand = Math.random();
    var difficultyArray = levelWaves[this.level][this.wave][2];
    for (var i = 0; i < difficultyArray.length; i++) {
        if (rand < difficultyArray[i][1]) {
            // console.log(rand, difficultyArray[i][1]);
            enemyString = difficultyArray[i][0];
            // console.log(enemyString);
            break;
        }
    }
    var enemyType;
    switch (enemyString) {
        case "Luke":
            enemyType = Luke;
            break;
        case "Leia":
            enemyType = Leia;
            break;
        case "XWing":
            enemyType = XWing;
            break;
        default:
            enemyType = XWing;
            break;
    }
    var enemy = new enemyType(this, x, y);
    this.addEntity(enemy, this.enemies, row);
};

LevelScene.prototype.addEntity = function (entity, list, row, col) {
    if (list == null) Scene.prototype.addEntity.call(this, entity);
    else if (col == null) list[row].push(entity);
    else  list[row][col] = entity;
};