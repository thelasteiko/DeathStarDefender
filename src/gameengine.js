// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


function Timer() {
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    return Math.min(wallDelta, this.maxStep);
};

function GameEngine() {
    this.scene = null;
    this.showOutlines = false;
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    //this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
};

GameEngine.prototype.start = function (scene) {
    console.log("starting game");
    this.scene = scene;
    scene.init(this.ctx);
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
};

GameEngine.prototype.changeScene = function (scene) {
    this.scene = scene;
    scene.init(this.ctx);
};

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.scene.update();
    this.scene.draw(this.ctx);
    this.click = null;
};

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
};

Entity.prototype.draw = function (ctx) {
};

//Entity.prototype.rotateAndCache = function (image, angle) {
//    var offscreenCanvas = document.createElement('canvas');
//    var size = Math.max(image.width, image.height);
//    offscreenCanvas.width = size;
//    offscreenCanvas.height = size;
//    var offscreenCtx = offscreenCanvas.getContext('2d');
//    offscreenCtx.save();
//    offscreenCtx.translate(size / 2, size / 2);
//    offscreenCtx.rotate(angle);
//    offscreenCtx.translate(0, 0);
//    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
//    offscreenCtx.restore();
//    //offscreenCtx.strokeStyle = "red";
//    //offscreenCtx.strokeRect(0,0,size,size);
//    return offscreenCanvas;
//};

function Scene(gameEngine) {
    this.entities = [];
    this.game = gameEngine;
    this.click = null;
    this.mouse = null;
    this.showOutlines = false;
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

Scene.prototype.addEntity = function (entity) {
    this.entities.push(entity);
};

Scene.prototype.draw = function (ctx) {
    //ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];
        entity.draw(ctx);
    }
    //ctx.restore();
};

Scene.prototype.update = function () {
    var entitiesCount = this.entities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
};

Scene.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
};

Scene.prototype.startInput = function () {
};
