function AssetManager() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = [];
    this.downloadQueue = [];
}

AssetManager.prototype.queueDownload = function (path) {
    console.log("Queueing " + path);
    this.downloadQueue.push(path);
};

AssetManager.prototype.isDone = function () {
    return this.downloadQueue.length === this.successCount + this.errorCount;
};

AssetManager.prototype.downloadAll = function (callback) {
    var that = this;

    for (var i = 0; i < this.downloadQueue.length; i++) {
        var path = this.downloadQueue[i];
        console.log(path);
        var img = new Image();
        var ev = "load";
        img.src = path;

        //if(path.indexOf(".png") < 0) {
        //    img = new Image();
        //    ev = "load";
        //    img.src = path;
        //} else {
        //    img = new Audio(path);
        //    img.autoplay = false;
        //    ev = "canplay";
        //}

        img.addEventListener(ev, function () {
            console.log("Loaded " + this.src);
            that.successCount++;
            if (that.isDone()) callback();
        });

        img.addEventListener("error", function () {
            console.log("Error loading " + this.src);
            that.errorCount++;
            if (that.isDone()) callback();
        });

        this.cache[path] = img;
    }
};

AssetManager.prototype.getAsset = function (path) {
    return this.cache[path];
};