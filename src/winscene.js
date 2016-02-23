function WinScene(gameEngine) {
    Scene.call(this, gameEngine);
    this.startInput();
}

WinScene.prototype = new Scene();
WinScene.prototype.constructor = WinScene;

WinScene.prototype.init = function () {
    this.addEntity(new Play(this));
}