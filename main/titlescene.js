function Background(game) {
    Entity.call(this, game, 0, 0);
    this.radius = 200;
    this.spriteSheet = ASSET_MANAGER.getAsset("./img/background.png");
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    //I want a picture
    ctx.drawImage(this.spriteSheet,
                  0, 0,  // source from sheet
                  801, 762,
                  0, 0,
                  this.game.surfaceWidth,
                  this.game.surfaceHeight);
    Entity.prototype.draw.call(this);
}

function Title1(game) {
    //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.growanimation = new Animation(ASSET_MANAGER.getAsset("./img/title2.png"), 0, 0, 640, 277, 0.05, 13, false, false);
    this.radius = 100;
    //calling the constructor of entity
    //put at center of screen with an offset of 64
    Entity.call(this, game, 80, 100);
}

Title1.prototype = new Entity();
Title1.prototype.constructor = Title1;

//this is where I would move the x and y if there is anything to move
Title1.prototype.update = function () {
    
    //calls the entity's update function which is not doing anything right now...
    Entity.prototype.update.call(this);
}
//This is where I would change the animation
Title1.prototype.draw = function (ctx) {
    if (this.growanimation.isDone()) {
            ctx.drawImage(ASSET_MANAGER.getAsset("./img/title2.png"),
                  7680, 0,  // source from sheet
                  640, 277, //size
                  80, 100, //target
                  640, 277);
            this.game.titleflags[0] = true;
    }
    else {
        this.growanimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

function Title2(game) {
    //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.swipeanimation = new Animation(ASSET_MANAGER.getAsset("./img/title2.png"), 0, 277, 496, 112, 0.05, 12, false, false);
    this.radius = 100;
    //calling the constructor of entity
    //put at center of screen with an offset of 64
    Entity.call(this, game, 80+80, 100+136);
}

Title2.prototype = new Entity();
Title2.prototype.constructor = Title2;

//this is where I would move the x and y if there is anything to move
Title2.prototype.update = function () {
    
    //calls the entity's update function which is not doing anything right now...
    Entity.prototype.update.call(this);
}
//This is where I would change the animation
Title2.prototype.draw = function (ctx) {
    if (this.swipeanimation.isDone()) {
            ctx.drawImage(ASSET_MANAGER.getAsset("./img/title2.png"),
                  5456, 277,  // source from sheet
                  496, 112, //size
                  80+80, 100+136, //target
                  496, 112);
    }
    else if(this.game.titleflags[1]){
        this.swipeanimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

function Ship(game) {
    //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.flyright = new Animation(ASSET_MANAGER.getAsset("./img/title2.png"), 0, 453, 256, 125, 0.06, 2, true, false);
    this.flyleft = new Animation(ASSET_MANAGER.getAsset("./img/title2.png"), 512, 453, 256, 125, 0.06, 2, true, false);
    this.radius = 100;
    this.reverse = false;
    //calling the constructor of entity
    //put at center of screen with an offset of 64
    Entity.call(this, game, -256, 100+132);
}

Ship.prototype = new Entity();
Ship.prototype.constructor = Ship;

//this is where I would move the x and y if there is anything to move
Ship.prototype.update = function () {
    if(!this.reverse){
        this.x = this.x + 10;
        if(this.game.titleflags[0]) {
            this.x = this.x + 5;
            if(this.x >= 80-20)
                this.game.titleflags[1] = true;
            if(this.x >= this.game.surfaceWidth) {
                this.reverse = true;
                this.y = 100+255;
            }
        }
    } else {
        this.x = this.x - 5;
        if(this.x <= 80+187)
            this.game.titleflags[2] = true;
        if(this.x+256 < 0)
            this.removeFromWorld = true;
    }
    //calls the entity's update function which is not doing anything right now...
    Entity.prototype.update.call(this);
}
//This is where I would change the animation
Ship.prototype.draw = function (ctx) {
    if(!this.reverse)
        this.flyright.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    else if(this.reverse)
        this.flyleft.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Play(game) {
    //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.playanimation = new Animation(ASSET_MANAGER.getAsset("./img/title2.png"), 0, 389, 128, 64, 0.1, 8, true, false);
    this.radius = 100;
    //calling the constructor of entity
    //put at center of screen with an offset of 64
    Entity.call(this, game, 80+256, 100+288);
}

Play.prototype = new Entity();
Play.prototype.constructor = Play;

//this is where I would move the x and y if there is anything to move
Play.prototype.update = function () {
    
    //calls the entity's update function which is not doing anything right now...
    Entity.prototype.update.call(this);
}
//This is where I would change the animation
Play.prototype.draw = function (ctx) {
    if(this.game.titleflags[2]){
        this.playanimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}


function TitleScene(gameEngine) {
    Scene.call(this,gameEngine);
    //[0:grow done, 1:ship @ x>=titlex-20, 2:ship @ x>=80+187, 3:title done]
    this.titleflags = [false,false,false,false];
    addEntity(new Background(this));
    addEntity(new Title2(this));
    addEntity(new Play(this));
    addEntity(new Ship(this));
    addEntity(new Title1(this));
    this.startInput();
}

TitleScene.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left - 23.5;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top - 23.5;
        x = Math.floor(x / 39.55);
        y = Math.floor(y / 39.55);
        return { x: x, y: y };
    }

    this.ctx.canvas.addEventListener("click", function (e) {
        console.log(getXandY(e));
        that.click = getXandY(e);
    }, false);

    console.log('Input started');
}
