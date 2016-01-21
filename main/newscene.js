function NewScene(game) {
  Scene.call(this, game);
}

NewScene.prototype = new Scene();
NewScene.prototype.constructor = NewScene;

NewScene.prototype.init = function() {
    this.addEntity(new Background(this));
}
