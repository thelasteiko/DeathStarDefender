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

function MenuItem (game, x, y, title, price, animation, availablepic, selectedpic) {
    Entity.prototype.call(this, game, x, y);
    this.title = title;
    this.price = price;
    this.animation = animation;
    this.availablepic = availablepic;
    this.selectedpic = selectedpic;
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

Menu.prototype.setSelection = function (x, y) {
    //bounds x > 64, x < 64 * items.length
    //bounds y > 0, y < 64
    if (y > 0 && y < 64) {
        var i = x % 64;
    }
}

Menu.prototype.addItem(game, title, price, animation, availablepic, selectedpic) {
    var x = (this.items.length+1) * 64;
    var y = this.y;
    this.items.push(new MenuItem(game, x, y, title, price, animation, availablepic, selectedpic));
}