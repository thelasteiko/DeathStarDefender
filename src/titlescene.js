function Background(game) {
    Entity.call(this, game, 0, 0);
    this.radius = 200;
    this.spriteSheet = ASSET_MANAGER.getAsset("./assets/img/background.png");
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
};

Background.prototype.draw = function (ctx) {
    ctx.drawImage(this.spriteSheet,
        0, 0,  // source from sheet
        801, 762,
        0, 0,
        this.game.game.surfaceWidth,
        this.game.game.surfaceHeight);
    Entity.prototype.draw.call(this);
};

function Title1(game) {
    this.growanimation = new Animation(ASSET_MANAGER.getAsset("./assets/img/title2.png"), 0, 0, 640, 277, 0.05, 13, false, false, false);
    this.radius = 100;
    //calling the constructor of entity
    //put at center of screen with an offset of 64
    Entity.call(this, game, 80, 100);
}

Title1.prototype = new Entity();
Title1.prototype.constructor = Title1;

Title1.prototype.draw = function (ctx) {
    if (this.growanimation.isDone()) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/img/title2.png"),
            7680, 0,  // source from sheet
            640, 277, //size
            80, 100, //target
            640, 277);
        this.game.titleflags[0] = true;
    }
    else {
        this.growanimation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
};

function Title2(game) {
    this.swipeanimation = new Animation(ASSET_MANAGER.getAsset("./assets/img/title2.png"), 0, 277, 496, 112, 0.05, 12, false, false, false);
    this.radius = 100;
    //calling the constructor of entity
    //put at center of screen with an offset of 64
    Entity.call(this, game, 80 + 80, 100 + 136);
}

Title2.prototype = new Entity();
Title2.prototype.constructor = Title2;

Title2.prototype.draw = function (ctx) {
    if (this.swipeanimation.isDone()) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/img/title2.png"),
            5456, 277,  // source from sheet
            496, 112, //size
            80 + 80, 100 + 136, //target
            496, 112);
    }
    else if (this.game.titleflags[1]) {
        this.swipeanimation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
};

function Ship(game) {
    this.flyright = new Animation(ASSET_MANAGER.getAsset("./assets/img/title2.png"), 0, 453, 256, 125, 0.06, 2, false, true, false);
    this.flyleft = new Animation(ASSET_MANAGER.getAsset("./assets/img/title2.png"), 512, 453, 256, 125, 0.06, 2, false, true, false);
    this.radius = 100;
    this.reverse = false;
    //calling the constructor of entity
    //put at center of screen with an offset of 64
    Entity.call(this, game, -256, 100 + 132);
}

Ship.prototype = new Entity();
Ship.prototype.constructor = Ship;

Ship.prototype.update = function () {
    if (!this.reverse) {
        this.x = this.x + 10;
        if (this.game.titleflags[0]) {
            this.x = this.x + 5;
            if (this.x >= 80 - 20)
                this.game.titleflags[1] = true;
            if (this.x >= this.game.game.surfaceWidth) {
                this.reverse = true;
                this.y = 100 + 255;
            }
        }
    } else {
        this.x = this.x - 5;
        if (this.x <= 80 + 187)
            this.game.titleflags[2] = true;
        if (this.x + 256 < 0)
            this.removeFromWorld = true;
    }
};

Ship.prototype.draw = function (ctx) {
    if (!this.reverse)
        this.flyright.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    else if (this.reverse) {
        this.flyleft.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    }
    if (this.flyleft.isDone()) {
        this.game.titleflags[4] = true;
    }
    Entity.prototype.draw.call(this);
};

function Play(game) {
    this.playanimation = new Animation(ASSET_MANAGER.getAsset("./assets/img/title2.png"), 0, 389, 128, 64, 0.1, 8, false, true, false);
    this.radius = 100;
    //calling the constructor of entity
    //put at center of screen with an offset of 64
    Entity.call(this, game, 80 + 256, 100 + 288);
}

Play.prototype = new Entity();
Play.prototype.constructor = Play;

Play.prototype.draw = function (ctx) {
    if (this.game.titleflags[2]) {
        this.playanimation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
};

function TitleButton(game, x, y, label, callback) {
    Entity.call(this, game, x, y);
    this.label = label;
    this.callback = callback;
}

TitleButton.prototype = new Entity();
TitleButton.prototype.constructor = TitleButton;

TitleButton.prototype.draw = function (ctx) {
    ctx.fillStyle = "#CC2200";
    ctx.fillRect(this.x, this.y, 150, 30);
    ctx.fillStyle = "Black";
    ctx.font = "20px Lucida Console";
    ctx.textAlign = "center";
    ctx.fillText(this.label, this.x + 75, this.y + 22);

    Entity.prototype.draw.call(this);
};

TitleButton.prototype.isSelected = function (x, y) {
    return x >= this.x && x <= this.x + 150
        && y >= this.y && y <= this.y + 30;
};

function TitleButtons(game, x, y, passwordCallback,
                      instructionsCallback, aboutCallback) {
    Entity.call(this, game, x, y);
    this.buttons = [];
    this.addItem(game, "Password", passwordCallback);
    this.addItem(game, "Instructions", instructionsCallback);
    this.addItem(game, "About", aboutCallback);
}

TitleButtons.prototype = new Entity();
TitleButtons.prototype.constructor = TitleButtons;

TitleButtons.prototype.draw = function (ctx) {
    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].draw(ctx);
    }
};

TitleButtons.prototype.addItem = function (game, label, callback) {
    var x = (this.buttons.length + 1) * 172 - 8;
    var y = this.y;
    this.buttons.push(new TitleButton(game, x, y, label, callback));
};

TitleButtons.prototype.getSelection = function (x, y) {
    for (var i = 0; i < this.buttons.length; i++) {
        var button = this.buttons[i];
        if (button.isSelected(x, y)) {
            button.callback();
            return true;
        }
    }
    return false;
};

function TitleScene(gameEngine) {
    Scene.call(this, gameEngine);
    //[0:grow done, 1:ship @ x>=titlex-20, 2:ship @ x>=80+187, 3:title done, 4:ship done]
    this.titleflags = [false, false, false, false, false];
    this.buttons = new TitleButtons(this, 0, 520,
        this.password.bind(this),
        this.instructions.bind(this),
        this.about.bind(this));
}

TitleScene.prototype = new Scene();
TitleScene.prototype.constructor = TitleScene;

TitleScene.prototype.init = function () {
    this.addEntity(new Background(this));
    this.addEntity(new Title2(this));
    this.addEntity(new Play(this));
    this.addEntity(new Ship(this));
    this.addEntity(new Title1(this));
    this.addEntity(this.buttons);
    this.startInput();
};

TitleScene.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    this.removeListeners = function () {
        that.game.ctx.canvas.removeEventListener("click", clickListener);
        that.game.ctx.canvas.removeEventListener("contextmenu", rightClickListener);
    };

    var clickListener = function (e) {
        var x = e.clientX - that.game.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.game.ctx.canvas.getBoundingClientRect().top;

        if (that.buttons.getSelection(x, y)) {
            return;
        }

        that.game.changeScene(new LevelScene(that.game, 1));
        that.removeListeners();
    };

    var rightClickListener = function (e) {
        e.preventDefault();
    };

    this.game.ctx.canvas.addEventListener("click", clickListener);
    this.game.ctx.canvas.addEventListener("contextmenu", rightClickListener);

    console.log('Input started');
};

TitleScene.prototype.password = function () {
    var password = prompt("Enter the password for a level:");
    if (password != null) {
        for (var i = 1; i < levelPasswords.length; i++) {
            if (levelPasswords[i] === password) {
                var start = confirm("Correct password! Start level " + (i + 1) + "?");
                if (start) {
                    this.removeListeners();
                    this.game.changeScene(new LevelScene(this.game, i + 1));
                    return;
                }
            }
        }
        alert("Incorrect password!");
    }
};

TitleScene.prototype.instructions = function () {
    this.game.changeScene(new InstructionsScene(this.game, 1));
};

TitleScene.prototype.about = function () {
    this.game.changeScene(new CreditsScene(this.game, 1));
};