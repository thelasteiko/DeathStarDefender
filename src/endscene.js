function randomColor() {
    var str = "rgb(";
    var num = Math.floor((Math.random() * 1000) % 255);
    str += num;
    for (var i = 1; i < 3; i++) {
        num = Math.floor((Math.random() * 1000) % 255);
        str += "," + num;
    }
    str += ")";
    return str;
}

function Play2(game) {
    //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.playanimation = new Animation(ASSET_MANAGER.getAsset("./assets/img/title2.png"), 0, 389, 128, 64, 0.1, 8, false, true, false);
    this.radius = 100;
    //calling the constructor of entity
    //put at center of screen with an offset of 64
    Entity.call(this, game, 80 + 256, 100 + 288);
}

Play2.prototype = new Entity();
Play2.prototype.constructor = Play2;

//This is where I would change the animation
Play2.prototype.draw = function (ctx) {
    this.playanimation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

function Firework(game) {
    //between 0 and 576
    this.maxheight = Math.floor((Math.random() * 1000) % 500);
    this.speed = Math.floor(Math.random() * 10) + 5;
    this.candynum = Math.floor(Math.random() * 10) + 10;
    //this.candynum = 1;
    this.state = "rising";
    this.color = randomColor();
    var x = Math.floor((Math.random() * 1000) % 800);
    var y = 576;
    Entity.call(this, game, x, y);
    //console.log("Speed: " + this.speed);
    //console.log("(" + x + "," + y + ")");
    //console.log("Max: " + this.maxheight);
    //console.log("Color: " + this.color);
}

Firework.prototype = new Entity();
Firework.prototype.constructor = Firework;

Firework.prototype.update = function () {
    if (this.state === "done") {
        this.removeFromWorld = true;
        this.game.totalfireworks -= 1;
    } else if (this.state === "exploding") {
        this.state = "done";
    } else if (this.y <= this.maxheight) {
        this.state = "exploding";
    } else {
        //console.log("Speed: " + this.speed);
        this.y -= this.speed;
    }
};

Firework.prototype.draw = function (ctx) {
    switch (this.state) {
        case "rising":
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, 10, 20);
            break;
        case "exploding":
            for (var i = 0; i < this.candynum; i++) {
                var negx = Math.random();
                var negy = Math.random();
                var x = Math.floor(Math.random() * 5) + 1;
                var y = Math.floor(Math.random() * 5) + 1;
                x = negx < .5 ? -x : x;
                y = negy < .5 ? -y : y;
                this.game.addEntity(new Firecandy(
                    this.game, this.x, this.y, {x: x, y: y}));
            }
            break;
    }
};

function distance(a, b) {
    var diffx = a.x - b.x;
    var diffy = a.y - b.y;
    return Math.sqrt(diffx * diffx + diffy * diffy);
}

function Firecandy(game, x, y, velocity) {
    this.origin = {x: x, y: y};
    this.friction = .7;
    this.vi = velocity;
    this.velocity = velocity;
    this.color = randomColor();
    this.maxdist = Math.floor(Math.random() * 200) + 30;
    Entity.call(this, game, x, y);
}

Firecandy.prototype = new Entity();
Firecandy.prototype.constructor = Firecandy;

Firecandy.prototype.update = function () {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    var d = distance(this.origin, {x: this.x, y: this.y});
    if (d >= this.maxdist) {
        this.removeFromWorld = true;
    } else {
        var fx = (Math.random() + this.friction) * this.velocity.x;
        var fy = (Math.random() + this.friction) * this.velocity.y;
        this.velocity.x = fx;
        this.velocity.y = fy;
    }
};

Firecandy.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
};

function Congrats(game, x, y, character) {
    this.color = randomColor();
    this.timeout = 300;
    this.character = character;
    Entity.call(this, game, x, y);
}

Congrats.prototype = new Entity();
Congrats.prototype.constructor = Congrats;

Congrats.prototype.update = function () {
    if (this.timeout <= 0) {
        this.color = randomColor();
        this.timeout = 50;
    } else {
        this.timeout -= 1;
    }
};

Congrats.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.font = "92px Lucida Console";
    ctx.textAlign = "start";
    ctx.fillText(this.character, this.x, this.y);
    //console.log("Drawing Text: " + this.character);
};

function TextBlock(game, x, y, block) {
    this.color = "White";
    this.block = block;
    Entity.call(this, game, x, y);
}

TextBlock.prototype = new Entity();
TextBlock.prototype.constructor = TextBlock;

TextBlock.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.textAlign = "center";
    ctx.font = "24px Lucida Console";
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

function WinScene(gameEngine, nextLevel) {
    Scene.call(this, gameEngine);
    this.startInput();
    this.nextLevel = nextLevel; // undefined if no next level
}

WinScene.prototype = new Scene();
WinScene.prototype.constructor = WinScene;

WinScene.prototype.init = function (ctx) {
    Scene.prototype.init.call(this, ctx);
    this.background = new Background(this);
    this.play = new Play2(this);
    this.maxfireworks = 10;
    this.totalfireworks = 0;
    var str = "Congratulations!";
    var pxw = 50;
    for (var i = 0; i < str.length; i++)
        this.addEntity(new Congrats(this, 5 + (i * pxw), 200,
            str.charAt(i)));
    var victoryText = this.nextLevel ?
        "You have successfully held off the rebel scum\n"
        + "... for now\n"
        + "Click to start level " + this.nextLevel + ".\n" 
        + "\n"
        + "Password: " + levelPasswords[this.nextLevel] + "\n" :
        "You have successfully defeated the rebel scum\n"
        + "and secured your Empire!\n"
        + "Click to return to the main menu.\n"
    this.tb = new TextBlock(this, 400, 250, victoryText);
    this.startInput();
};

WinScene.prototype.startInput = function () {
    if (!this.ctx) return;
    var that = this;
    var clickFunction = function () {
        that.ctx.canvas.removeEventListener("click", clickFunction);
        if (that.nextLevel) {
            that.game.changeScene(new LevelScene(that.game, that.nextLevel));
        } else {
            that.game.changeScene(new TitleScene(that.game));
        }
    };
    this.ctx.canvas.addEventListener("click", clickFunction);
};

WinScene.prototype.update = function () {
    if (this.totalfireworks < this.maxfireworks) {
        this.addEntity(new Firework(this));
        this.totalfireworks += 1;
    }
    Scene.prototype.update.call(this);
};

WinScene.prototype.draw = function (ctx) {
    ctx.save();
    this.background.draw(ctx);
    Scene.prototype.draw.call(this, ctx);
    //this.play.draw(ctx);
    this.tb.draw(ctx);
    ctx.restore();
};

function GameOver(game, x, y) {
    this.text = "Game Over";
    this.color = {r: 204, g: 0, b: 0};
    this.timeout = 10;
    this.maxtime = 10;
    this.offsetX = 10;
    //this.offsetY = 10;
    this.colorflip = false;
    Entity.call(this, game, x, y);
}

GameOver.prototype = new Entity();
GameOver.prototype.constructor = GameOver;

GameOver.prototype.update = function () {
    //this.y += this.offsetY;
    //this.offsetY = -this.offsetY;
    if (this.timeout <= 0) {
        this.color.r = (this.color.r + 10) % 255;
        this.color.g = (this.color.r + 10) % 100;
        this.color.b = (this.color.r + 10) % 100;
        this.timeout = this.maxtime;
        this.x += this.offsetX;
        this.offsetX = -this.offsetX;
    } else this.timeout -= 1;
};

GameOver.prototype.draw = function (ctx) {
    ctx.textAlign = "start";
    ctx.font = "92px Lucida Console";
    ctx.fillStyle = "rgb("
        + this.color.r + ","
        + this.color.g + ","
        + this.color.b + ")";
    ctx.fillText(this.text, this.x, this.y);
};

function LoseScene(gameEngine) {
    Scene.call(this, gameEngine);
}

LoseScene.prototype = new Scene();
LoseScene.prototype.constructor = LoseScene;

LoseScene.prototype.init = function (ctx) {
    Scene.prototype.init.call(this, ctx);
    this.background = new Background(this);
    //this.play = new Play2(this);
    this.addEntity(new GameOver(this, 185, 200));
    this.tb = new TextBlock(this, 415, 250,
        "Your hold on the universe has ended.\n"
        + "You may want to consider retiring.\n"
        + "Click to return to the main menu.\n");
    this.startInput();
};

LoseScene.prototype.draw = function (ctx) {
    ctx.save();
    this.background.draw(ctx);
    Scene.prototype.draw.call(this, ctx);
    //this.play.draw(ctx);
    this.tb.draw(ctx);
    ctx.restore();
};

LoseScene.prototype.startInput = function () {
    if (!this.ctx) return;
    var that = this;
    var clickFunction = function () {
        that.ctx.canvas.removeEventListener("click", clickFunction);
        that.game.changeScene(new TitleScene(that.game));
    };
    this.ctx.canvas.addEventListener("click", clickFunction);
};
