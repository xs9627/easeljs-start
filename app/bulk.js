window.shareData = {
        "timeLineLink": "这里是一个链接",   
        "sendFriendLink": window.location.href,
        "weiboLink": "这里是一个链接",
        "tTitle": "这里是title",
        "tContent": "这里是显示的内容",
        "fTitle": "益智拼图",
        "fContent": "小帅哥快来玩吧😊",
        "wContent": "这里是显示的内容"
        };



var emptyBulk = {};
var bulkWidth;
var spanX = 3;
var spanY;
var mark;
var start = false;
var container;
    var designWidth = 580;
    var designHeight = 1029;
var finish = false;
var pics = ['onepiece','transform','wukong', 'op2'];
var picIndex = -1;
var randomMoveTimes = 2;

var logoImg, logoWidth, logoHeight;
var fTitle = "益智拼图", fContent;

document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    
        // 发送给好友
        WeixinJSBridge.on('menu:share:appmessage', function (argv) {
            WeixinJSBridge.invoke('sendAppMessage', {
                "img_url": logoImg,
                "img_width": logoWidth,
                "img_height": logoHeight,
                "link": window.location.href,
                "desc": fContent,
                "title": fTitle
            }, function (res) {
                _report('send_msg', res.err_msg);
            })
        });
        // 分享到朋友圈
        WeixinJSBridge.on('menu:share:timeline', function (argv) {
            WeixinJSBridge.invoke('shareTimeline', {
                "img_url": logoImg,
                "img_width": logoWidth,
                "img_height": logoHeight,
                "link": window.location.href,
                "desc": fContent,
                "title": fTitle
            }, function (res) {
                _report('timeline', res.err_msg);
            });
        });
 
    }, false)
    

function init() {
    stage = new createjs.Stage("bulkCanvas");

    createjs.Touch.enable(stage);
    
    var canvas = document.getElementById("bulkCanvas");

    var viewWidth = document.documentElement.clientWidth;
    var viewHeight = document.documentElement.clientHeight;
    var scale = viewWidth / designWidth;
    canvas.width = designWidth;
    canvas.height = viewHeight / scale;
    canvas.style.width = viewWidth + "px";
    canvas.style.height = viewHeight + "px";
    
    
    drawBulks();
}

function drawBulks(){
    playSecond = 0;
    start = false;
    finish = false;
    var tempIndex = picIndex;
    while(picIndex == tempIndex){
        tempIndex = Math.floor(Math.random() * 1000) % pics.length;
    }
    picIndex = tempIndex;
    stage.removeChild(container);
    var img = new Image();
    img.onload = handleLoad;
    //img.src = "onepiece.jpg";
    img.src = "pics/" + pics[picIndex] + ".jpg";
    
    logoImg = img.src;
    fContent = "小帅哥快来玩吧😊";
    //img.src = "wukong.jpg";
}

function handleLoad(evt) {
    logoWidth = evt.target.width;
    logoHeight = evt.target.height;
    container = new createjs.Container();
    container.scaleX = container.scaleY = designWidth / evt.target.width;
    var s = new createjs.Shape();
    s.graphics.beginBitmapFill(evt.target).drawRect(0, 0, evt.target.width, evt.target.height);
    s.alpha = 0.25;
    container.addChild(s);
    //stage.update();

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
    var index = 0;
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
            tile.index = index++;
            tile.on("click", handleClick);
            mark[row][col] = tile;
            container.addChild(tile);

        }
    }

    // update the stage to draw to screen:
    stage.addChild(container);
    stage.update();

}

function randomStart(bulk) {
    emptyBulk.x = bulk.posX;
    emptyBulk.y = bulk.posY;
    container.removeChild(bulk);

    var count = randomMoveTimes;
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
        timedCount();
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
    mark[bulk.posY][bulk.posX] = undefined;
    emptyBulk.x = bulk.posX;
    emptyBulk.y = bulk.posY;
    bulk.posX = tmpX;
    bulk.posY = tmpY;


    if (isAnimate) {
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", tick);
        var count = 4;
        moveX = moveX / count;
        moveY = moveY / count;

        function tick(event) {
            if (count-- < 1) {
                createjs.Ticker.removeEventListener("tick", tick);
                if(check()){
                    finish = true;
                    stopCount();
                    var second = playSecond / 100;
                    fContent = "完成这块拼图用了" + second + "秒!";
                    $.ajax({
                        type:"POST",
                        url:"/score",
                        data:{img:pics[picIndex] , time:second},
                        success:function(data){
                            var a = 1;
                        }
                    });
//                    $.post('/score',
//                           {img:logoImg, time:second},
//                           function(result){
//                            var a = 1;
//                           });
                    alert(fContent);
                    //drawBulks();
                }
                return;
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

function check(){
    var index = 0;
    var finish = true;
    to:
    for (var row = 0; row < spanY; row++) {
        for (var col = 0; col < spanX; col++){
            if(mark[row][col]!=undefined && mark[row][col].index != index){
                finish =false;
                break to;
            }
            index++;
        }
    }
    
    return finish;
}

var playSecond=0;
var timer;
function timedCount() 
{ 
    //document.getElementById('txt').value=c 
    playSecond += 1;
    timer=setTimeout("timedCount()",10);
} 
function stopCount() 
{ 
    clearTimeout(timer);
} 


    