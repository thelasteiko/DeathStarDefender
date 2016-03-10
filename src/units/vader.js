function Vader(scene, x, y, row, defeatCallback) {
    var spritesheet = ASSET_MANAGER.getAsset("./assets/img/ally/vader.png");
    var lightning = ASSET_MANAGER.getAsset("./assets/img/ally/lightning.png");
    this.readypic = new SpriteImage(spritesheet, 0, 0, 64, 64);
    this.firepic = new SpriteImage(spritesheet, 0, 64, 64, 64);
    this.popup = new Animation(spritesheet, 0, 0, 64, 64, .1, 9, false, false, false);
    this.popdown = new Animation(spritesheet, 0, 128, 64, 64, .1, 9, false, false, false);
    this.donepic = new SpriteImage(spritesheet, 576, 128, 64, 64);
    this.projectile = new Animation(lightning, 0, 0, 576, 64, .08, 12, false, false, false);
    this.row = row;
    this.defeatCallback = defeatCallback;
    this.state = "ready";
    Unit.call(this, scene, x, y, 1000, 1000);
}

Vader.prototype = new Unit();
Vader.prototype.constructor = Vader;

Vader.prototype.update = function () {

    var that = this;

    function theEnemyHasBreachedOurDefenses(margin) {
        var list, i;
        //check row for enemies x <= 64
        list = that.game.enemies[that.row];
        for (i = 0; i < list.length; i++) {
            if (list[i].x <= margin) {
                return true;
            }
        }
        return false;
    }

    switch (this.state) {
        case "ready":
            if (theEnemyHasBreachedOurDefenses(96)) {
                this.state = "popup";
            }
            break;

        case "popup":
            if (this.popup.isDone())
                this.state = "fire";
            break;

        case "fire":
            var list = this.game.enemies[this.row];
            for (var i = 0; i < list.length; i++) {
                list[i].triggerDeath();
            }
            this.state = "firing";
            break;

        case "firing":
            if (this.projectile.isDone())
                this.state = "popdown";
            break;

        case "popdown":
            if (this.popdown.isDone())
                this.state = "done";
            break;

        case "done":
            if (theEnemyHasBreachedOurDefenses(0)) {
                if (!DEBUG)
                    this.defeatCallback();
            }
            break;

        default:
            console.log("Assertion Failed: State was \"" + this.state + "\"");
    }
};

Vader.prototype.draw = function (ctx) {
    switch (this.state) {
        case "ready":
            this.readypic.drawImage(ctx, this.x, this.y);
            break;

        case "popup":
            this.popup.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
            break;

        case "firing":
            this.firepic.drawImage(ctx, this.x, this.y);
            this.projectile.drawFrame(this.game.game.clockTick, ctx, this.x + 64, this.y);
            break;

        case "popdown":
            this.popdown.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
            break;

        case "done":
            this.donepic.drawImage(ctx, this.x, this.y);
            break;

        case "fire":
            //do nothing!
            break;

        default:
            console.log("Assertion Failed: State was \"" + this.state + "\"");
    }
};
