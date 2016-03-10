function SpriteImage(spritesheet, x, y, w, h) {
    /*Convenience object for printing images to a canvas from a spritesheet.*/
    this.spritesheet = spritesheet;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

SpriteImage.prototype.drawImage = function (ctx, dx, dy) {
    if (!!this.spritesheet)
        ctx.drawImage(this.spritesheet, this.x, this.y, this.w, this.h,
            dx, dy, this.w, this.h);
};

function MenuCounter(game, x, y) {
    /*Keeps track of and displays the amount of energy*/
    this.energycount = 50; //initial energy
    this.energyTime = 0;
    this.textoffset = {x: 26, y: 65};
    this.spritesheet = ASSET_MANAGER.getAsset("./assets/img/menucounter.png");
    Entity.call(this, game, x, y);
}

MenuCounter.prototype = new Entity();
MenuCounter.prototype.constructor = MenuCounter;

MenuCounter.prototype.update = function () {
    this.energyTime += this.game.game.clockTick;
    if (this.energyTime >= 10) {
        this.energycount += 25;
        this.energyTime = 0;
    }
    Entity.prototype.update.call(this);
};

MenuCounter.prototype.draw = function (ctx) {
    ctx.drawImage(this.spritesheet,
        this.x, this.y, 96, 96);
    ctx.font = "20px Verdana";
    ctx.fillStyle = "white";
    ctx.textAlign = "Center";
    ctx.fillText(this.energycount,
        this.x + 48, this.y + this.textoffset.y, 96);
};

MenuCounter.prototype.payTheMan = function (cost) {
    if (cost <= this.energycount) {
        this.energycount -= cost;
        return true;
    }
    return false;
};

function MenuItem(game, x, y, title, price, state, spritesheet, objtype) {
    /*Initializes a modular menu item.
     Each spritesheet should be layed out the same.*/

    // TODO: pull the hard-coded numbers out into constructor variables

    this.title = title; //string to describe item
    this.price = price;
    //charging animation
    this.animation = new Animation(spritesheet, 0, 0, 96, 96, .8,
        12, false, false, false);
    this.availablepic = new SpriteImage(spritesheet, 96, 288, 96, 96);
    //item is selected by player
    this.selectedpic = new SpriteImage(spritesheet, 192, 288, 96, 96);
    //item is unavailable b/c of cost
    this.shadedpic = new SpriteImage(spritesheet, 0, 288, 96, 96);
    this.shadow = new SpriteImage(spritesheet, 288, 288, 64, 64);
    this.state = state; //starts in ready
    //the type of object that can be created from this menu item
    this.objtype = objtype;
    Entity.call(this, game, x, y);
}

MenuItem.prototype = new Entity();
MenuItem.prototype.constructor = MenuItem;

MenuItem.prototype.draw = function (ctx, drawPrice) {
    switch (this.state) {
        case "ready": //charge has completed but price hasn't been met
            this.shadedpic.drawImage(ctx, this.x, this.y);
            break;
        case "available": //can be selected
            this.availablepic.drawImage(ctx, this.x, this.y);
            break;
        case "selected": //item is selected by player
            this.selectedpic.drawImage(ctx, this.x, this.y);
            break;
        case "charging": //item has been used recently
            var isDrawn = this.animation.drawFrame(this.game.game.clockTick, ctx, this.x, this.y);
            if (!isDrawn) this.shadedpic.drawImage(ctx, this.x, this.y);
            break;
        default:
            console.log("Assertion Failed: State was \"" + this.state + "\"");
    }
    if (drawPrice) {
        ctx.textAlign = "center";
        ctx.fillText(this.title, this.x + 48, this.y + 50, 96);
        ctx.fillText(this.price, this.x + 48, this.y + 70, 96);
    }

};

MenuItem.prototype.update = function (energy) {
    if (energy >= this.price && this.state === "ready") {
        this.state = "available";
    } else if (energy < this.price && this.state === "available") {
        this.state = "ready";
    } else if (this.animation.isDone()) {
        this.state = "ready";
        this.animation.elapsedTime = 0;
    }
};

MenuItem.prototype.trySelect = function () {
    if (this.state === "available") {
        this.state = "selected";
        return true;
    }
    return false;
};

function Shovel(game, x, y) {
    this.spritesheet = ASSET_MANAGER.getAsset("./assets/img/menushovel.png");
    MenuItem.call(this, game, x, y, "KILL", 0, "available", this.spritesheet, null);
}

Shovel.prototype = new MenuItem();
Shovel.prototype.constructor = Shovel;

Shovel.prototype.draw = function (ctx) {
    if (!!this.spritesheet) {
        MenuItem.prototype.draw.call(this, ctx);
        ctx.textAlign = "Center";
        ctx.fillStyle = "White";
        ctx.fillText(this.title, this.x + 48, this.y + 55, 96);
    }
};

//items should appear in a row
function Menu(game, x, y) {
    Entity.call(this, game, x, y);
    this.current = null;
    this.counter = new MenuCounter(game, this.x, this.y);
    this.shovel = new Shovel(game, 96 * 6 - 32, this.y);
    this.items = [];
    this.addItem(game, "Battery", 50, ASSET_MANAGER.getAsset("./assets/img/menubattery.png"),
        Battery);
    this.addItem(game, "Fighter", 75, ASSET_MANAGER.getAsset("./assets/img/menutie.png"),
        TieFighter);
    this.addItem(game, "Trooper", 50, ASSET_MANAGER.getAsset("./assets/img/menustormtrooper.png"),
        Stormtrooper);
    this.addItem(game, "AT-ST", 100, ASSET_MANAGER.getAsset("./assets/img/menuatst.png"),
        ATST);
}

Menu.prototype = new Entity();
Menu.prototype.constructor = Menu;

Menu.prototype.update = function () {
    this.counter.update();
    this.shovel.update();
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].update(this.counter.energycount);
    }
};

Menu.prototype.draw = function (ctx) {
    this.counter.draw(ctx);
    this.shovel.draw(ctx, false);
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].draw(ctx, true);
    }
};

//this will see if an item can be selected
Menu.prototype.setSelection = function (x, y) {
    /*Checks the given coordinates against the range of
     the menu and sets the current item if valid.*/
    //bounds x > 96, x < 96 * items.length
    //bounds y > 0, y < 96
    if (y >= 0 && y <= 96) {
        var i = Math.floor(x / 96) - 1;
        if (x >= 96 * 6 - 32 && x < 96 * 7 - 32) {
            if (this.current)
                this.current.state = "available";

            if (this.current !== this.shovel && this.shovel.trySelect()) {
                this.current = this.shovel;
                return true;
            } else {
                this.current = null;
            }
        } else if (i >= 0 && i < this.items.length) {
            if (this.current)
                this.current.state = "available";
            if (this.items[i] !== this.current && this.items[i].trySelect()) {
                this.current = this.items[i];
                return true;
            } else {
                this.current = null;
            }
        } else if (DEBUG && i == -1) {
            this.counter.energycount += 25;
        }
    }
    return false;
};

Menu.prototype.addItem = function (game, title, price, spritesheet, objtype) {
    /*Adds a menu item to the menu using the parameters.*/
    console.log("adding menu item : " + title);
    var x = (this.items.length + 1) * 96;
    var y = this.y;
    this.items.push(new MenuItem(game, x, y, title, price, "ready", spritesheet, objtype));
};

Menu.prototype.placeItem = function (x, y, col, row, attackCallBack) {
    /*Returns an item of the correct type or null if no item is selected.*/
    if (this.current === this.shovel) {
        this.shovel.state = "available";
        this.current = null;
        return null;
    } else if (this.current && this.counter.payTheMan(this.current.price)) {
        this.current.state = "charging";
        var obj = new this.current.objtype(this.game, x, y, col, row, attackCallBack);
        this.current = null;
        return obj;
    }
    return null;
};