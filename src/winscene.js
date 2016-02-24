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

/*
 function Background(game) {
 Entity.call(this, game, 0, 0);
 this.radius = 200;
 this.spriteSheet = ASSET_MANAGER.getAsset("./assets/img/background.png");
 }

 Background.prototype = new Entity();
 Background.prototype.constructor = Background;*/

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
/*
 Background.prototype.draw = function (ctx) {
 //I want a picture
 ctx.drawImage(this.spriteSheet,
 0, 0,  // source from sheet
 801, 762,
 0, 0,
 this.game.game.surfaceWidth,
 this.game.game.surfaceHeight);
 Entity.prototype.draw.call(this);
 };*/

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

function WinScene(gameEngine) {
    Scene.call(this, gameEngine);
    this.startInput();
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
    this.tb = new TextBlock(this, 400, 250,
        "You have successfully defeated the rebel scum\n"
        + "and secured your Empire!\n");
    this.startInput();
};

WinScene.prototype.startInput = function () {
    if (!this.ctx) return;
    var that = this;
    var clickFunction = function () {
        that.ctx.canvas.removeEventListener("click", clickFunction);
        that.game.changeScene(new LevelScene(that.game, 1));
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
    this.play.draw(ctx);
    this.tb.draw(ctx);
    ctx.restore();
};