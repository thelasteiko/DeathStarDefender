function SpriteImage(spritesheet, x, y, w, h) {
    this.spritesheet = spritesheet;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

SpriteImage.prototype.drawImage = function(ctx) {
     ctx.drawImage(spritesheet, this.x, this.y, this.w, this.h);
}

function MenuCounter (game, x, y) {
    this.energycount = 50; //initial energy
    this.energyTime = 0;
    this.textoffset = {x: 26, y: 46};
    //this.spritesheet = ASSET_MANAGER.getAsset();
    Entity.prototype.call(this, game, x, y);
}

MenuCounter.prototype = new Entity();
MenuCounter.prototype.constructor = MenuCounter;

MenuCounter.prototype.update = function() {
    this.energyTime += this.game.game.clockTick;
    if(energyTime >= 10) {
        this.energycount += 25;
        this.energyTime = 0;
    }
    Entity.prototype.update.call(this);
}

MenuCounter.prototype.draw = function(ctx) {
    /*ctx.drawImage(this.spritesheet,
        this.x, this.y, 64, 64);*/
    ctx.font="20px Verdana";
    ctx.fillText(this.energycount,
        this.x + this.textoffset.x, this.y + this.textoffset.y);
}

//initializes a modular menu item
//each item's spritesheet should be layed out the same
function MenuItem (game, x, y, title, price, spritesheet, objtype) {
    Entity.prototype.call(this, game, x, y);
    this.title = title; //string to describe item
    this.price = price; //the cost of the item
    //player must wait until item is fully charged
    this.animation = new Animation(spritesheet, 0, 0, 96, 96, 0.1,
        12, false, false, false);
    //item is availabel to choose
    this.availablepic = new SpriteImage(spritesheet, 96, 288, 96, 96);
    //item is selected by player
    this.selectedpic = new SpriteImage(spritesheet, 192, 288, 96, 96);
    //item is unavailable b/c of cost
    this.shadedpic = new SpriteImage(spritesheet, 0, 288, 96, 96);
    this.shadow = new SpriteImage(spritesheet, 288, 288, 64, 64);
    this.isSelected = false;
    this.isAvailable = false;
    this.isCharging = false;
    this.objtype = objtype;
}

MenuItem.prototype = new Entity();
MenuItem.prototype.constructor = MenuItem;

MenuItem.prototype.draw = function(ctx) {
    if (this.isSelected) {
        this.selectedpic.draw(ctx);
    } else {
        
    }
}

MenuItem.prototype.update = function() {
    
}

MenuItem.prototype.trySelect = function () {
    if(this.isAvailable) {
        this.isAvailable = false;
        this.isSelected = true;
    }
    return this.isSelected;
}

//items should appear in a row
function Menu (game, x, y) {
    Entity.prototype.call(this, game, x, y);
    //this.spritesheet = ASSET_MANAGER.getAsset("./main/img");
    this.current = null;
    this.counter = new MenuCounter(game, this.x, this.y);
    this.items = [];
}

Menu.prototype = new Entity();
Menu.prototype.constructor = Menu;

Menu.prototype.update = function() {
    if(current) {
        
    }
}

Menu.prototype.draw = function() {
    
}
//this will see if an item can be selected
Menu.prototype.setSelection = function (x, y) {
    //bounds x > 96, x < 96 * items.length
    //bounds y > 0, y < 96
    if (y >= 0 && y <= 96) {
        var i = Math.floor(x / 96)-1;
        if(i >= 0 && i < this.items.length){
            if (this.items[i].trySelect())
                this.current = this.items[i];
        }
    }
}

Menu.prototype.addItem = function(game, title, price, animation, availablepic, selectedpic) {
    var x = (this.items.length+1) * 64;
    var y = this.y;
    this.items.push(new MenuItem(game, x, y, title, price, animation, availablepic, selectedpic));
}

Menu.prototype.placeItem = function(x, y, attackCallBack) {
    if (current) {
        return new this.current.objtype(this.game, x, y, attackCallBack);
    }
}