//items should appear in a row
//the first item is a counter for energy
function Menu (game, x, y, minpick) {
    Entity.prototype.call(game, x, y);
    //this.spritesheet = ASSET_MANAGER.getAsset("./main/img");
    this.current = null;
    this.minpick = minpick;
    this.items = [];
}

Menu.prototype = new Entity();
Menu.prototype.constructor = Menu;

Menu.prototype.update = function() {
    //update items in the
}