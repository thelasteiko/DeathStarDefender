var DEBUG = window.location.href.indexOf("thelasteiko.github.io/DeathStarDefender") < 0;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./assets/img/background.png");
ASSET_MANAGER.queueDownload("./assets/img/title2.png");

// Go specific; delete later
ASSET_MANAGER.queueDownload("./assets/img/gameboard.png");

// ENEMIES
// Luke
ASSET_MANAGER.queueDownload("./assets/img/enemy/luke/LukeImg.png");
ASSET_MANAGER.queueDownload("./assets/img/enemy/luke/LukeRun.png");
ASSET_MANAGER.queueDownload("./assets/img/enemy/luke/LukeJumpAttack.png");
ASSET_MANAGER.queueDownload("./assets/img/enemy/luke/LukeIdle.png");
ASSET_MANAGER.queueDownload("./assets/img/ally/tiefighter.png");

ASSET_MANAGER.queueDownload("./assets/img/menucounter.png");
ASSET_MANAGER.queueDownload("./assets/img/menubattery.png");
ASSET_MANAGER.queueDownload("./assets/img/menutie.png");
ASSET_MANAGER.queueDownload("./assets/img/menustormtrooper.png");

ASSET_MANAGER.queueDownload("./assets/img/ally/battery.png");
ASSET_MANAGER.queueDownload("./assets/img/ally/stormt.png");
ASSET_MANAGER.queueDownload("./assets/img/ally/vader.png");
ASSET_MANAGER.queueDownload("./assets/img/ally/lightning.png");
ASSET_MANAGER.queueDownload("./assets/img/expl.png");
ASSET_MANAGER.queueDownload("./assets/img/ally/sun.png");

//Audio
ASSET_MANAGER.queueDownload("./assets/audio/bomb.mp3");

ASSET_MANAGER.downloadAll(function () {
    console.log("Downloading...");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start(new TitleScene(gameEngine));
});