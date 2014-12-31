var emptyBulk = {};
var bulkWidth;
function init(){
    stage = new createjs.Stage("bulkCanvas");
    
    var canvas = document.getElementById("bulkCanvas");
    var designWidth = 580;
    var designHeight = 1029;
    var viewWidth = document.documentElement.clientWidth;
    var viewHeight = document.documentElement.clientHeight;
    var scale = viewWidth / designWidth;
    canvas.width = designWidth;
    canvas.height = viewHeight / scale;
    canvas.style.width = viewWidth + "px";
    canvas.style.height = viewHeight + "px";
    

    var img = new Image();
    img.onload = handleLoad;
    img.src = "onepiece.jpg";
}

function handleLoad(evt) {
    var spanX = 4;
    var spanY = 7
    bulkWidth = evt.target.width / spanX ;
    var ss = new createjs.SpriteSheet({
        images: [evt.target],
        frames: {width:bulkWidth, height:bulkWidth, regX:0, regY:0, spacing:0, margin:0}
    });

//    var map = [
//        [ 1,  2,  3,  4,  5],
//        [ 6,  7,  8,  9, 10],
//        [11, 12, 13, 14, 15],
//        [16, 17, 18, 19, 20],
//        [21, 22, 23, 24, 25],
//        [26, 27, 28, 29, 30],
//        [31, 32, 33, 34, 35],
//        [36, 37, 38, 39, 40],
//        [41, 42, 43, 44, 45],
//        [46, 47, 48, 49, 50]
//    ]

    // draw the map:
    for (var row=0; row<spanY; row++) {
        for (var col=0; col<spanX; col++) {
            if(!(row==0 && col ==0)){
                var idx = row * spanX + col;

                var tile = new createjs.Sprite(ss);
                tile.gotoAndStop(idx);
                tile.x = bulkWidth*col;
                tile.y = bulkWidth*row;

                tile.posX = col;
                tile.posY = row;
                tile.on("click", handleClick);
                stage.addChild(tile);
            } else {
                emptyBulk.x = col;
                emptyBulk.y = row;
            }
        }
    }

    // update the stage to draw to screen:
    stage.update();
}

function handleClick(evt){
    var bulk = evt.target;
    if(Math.abs(bulk.posX - emptyBulk.x) + Math.abs(bulk.posY - emptyBulk.y) == 1){
        bulk.x += bulkWidth * (emptyBulk.x - bulk.posX);
        bulk.y += bulkWidth * (emptyBulk.y - bulk.posY);
        var tmpX = emptyBulk.x;
        var tmpY = emptyBulk.y
        emptyBulk.x = bulk.posX;
        emptyBulk.y = bulk.posY;
        bulk.posX = tmpX;
        bulk.posY = tmpY;
        stage.update();
    }
    
}