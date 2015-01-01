var emptyBulk = {};
var bulkWidth;
var spanX = 3;
var spanY;
var mark;
var start = false;

function init() {
    stage = new createjs.Stage("bulkCanvas");

    createjs.Touch.enable(stage);
    
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
    var s = new createjs.Shape();
    s.graphics.beginBitmapFill(evt.target).drawRect(0, 0, evt.target.width, evt.target.height);
    s.alpha = 0.25;
    stage.addChild(s);
    stage.update();

    mark = new Array();
    bulkWidth = Math.floor(evt.target.width / spanX);
    spanY = Math.floor(evt.target.height / bulkWidth);
    var ss = new createjs.SpriteSheet({
        images: [evt.target],
        frames: {
            width: bulkWidth,
            height: bulkWidth,
            regX: 0,
            regY: 0,
            spacing: 0,
            margin: 0
        }
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
    for (var row = 0; row < spanY; row++) {
        mark[row] = new Array();
        for (var col = 0; col < spanX; col++) {

            //            var idx = row * spanX + col;
            //
            //            var tile = new createjs.Sprite(ss);
            //            tile.gotoAndStop(idx);
            //            tile.x = bulkWidth * col;
            //            tile.y = bulkWidth * row;

            var tile = new createjs.Shape();
            //var mtx = new createjs.Matrix2D().rotate(1);
           //tile.graphics.beginBitmapFill(evt.target).setStrokeStyle(1).drawRect(col * bulkWidth, row * bulkWidth, bulkWidth, bulkWidth);
            tile.graphics.beginBitmapFill(evt.target).setStrokeStyle(1).beginStroke("#000000").drawRect(col * bulkWidth, row * bulkWidth, bulkWidth, bulkWidth);
            tile.posX = col;
            tile.posY = row;
            tile.on("click", handleClick);
            mark[row][col] = tile;
            stage.addChild(tile);

        }
    }

    // update the stage to draw to screen:
    stage.update();

}

function randomStart(bulk) {
    emptyBulk.x = bulk.posX;
    emptyBulk.y = bulk.posY;
    stage.removeChild(bulk);

    var count = 100;
    while (count > 0) {
        move();
    }
    stage.update();

    function move() {
        var x = emptyBulk.x;
        var y = emptyBulk.y;
        if (Math.random() > 0.5) {
            if (x == 0) {
                x++;
            } else if (x == spanX - 1) {
                x--;
            } else {
                x += Math.random() > 0.5 ? 1 : -1;
            }
        } else {
            if (y == 0) {
                y++;
            } else if (y == spanY - 1) {
                y--;
            } else {
                y += Math.random() > 0.5 ? 1 : -1;
            }
        }
        moveBulk(mark[y][x], false);
        count--;
    }
}

function handleClick(evt) {
    var bulk = evt.target;
    if (!start) {
        start = true;
        randomStart(bulk);
    } else {
        if (Math.abs(bulk.posX - emptyBulk.x) + Math.abs(bulk.posY - emptyBulk.y) == 1) {
            moveBulk(bulk, true);
        }
    }

}

function moveBulk(bulk, isAnimate) {
    var moveX = bulkWidth * (emptyBulk.x - bulk.posX);
    var moveY = bulkWidth * (emptyBulk.y - bulk.posY);

    var tmpX = emptyBulk.x;
    var tmpY = emptyBulk.y;
    mark[tmpY][tmpX] = bulk;
    emptyBulk.x = bulk.posX;
    emptyBulk.y = bulk.posY;
    bulk.posX = tmpX;
    bulk.posY = tmpY;


    if (isAnimate) {
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", tick);
        var count = 3;
        moveX = moveX / count;
        moveY = moveY / count;

        function tick(event) {
            if (count-- < 2) {
                createjs.Ticker.removeEventListener("tick", tick);
            }
            bulk.x += moveX;
            bulk.y += moveY;
            stage.update(event);
        }
    } else {
        bulk.x += moveX;
        bulk.y += moveY;
        //stage.update();
    }




}