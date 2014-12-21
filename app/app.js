var stage, text;

function init() {
    var canvas = document.getElementById("demoCanvas");
    var designWidth = 640;
    var designHeight = 1136;
    var viewWidth = document.documentElement.clientWidth;
    var viewHeight = document.documentElement.clientHeight;
    var scale = viewWidth / designWidth;
    canvas.width = designWidth;
    canvas.height = viewHeight / scale;
    canvas.style.width = viewWidth + "px";
    canvas.style.height = viewHeight + "px";
    
    var fixScale = designWidth / 320;
    var btnAStatus = false;
    var btnBStatus = false;
    var dirctionStatus = '';
    stage = new createjs.Stage("demoCanvas");
    
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;
    
    var container = new createjs.Container();
    var bodyWidth = 305;
    var body = new createjs.Shape();
    body.graphics.beginFill("Gray").drawRect(0, 0, bodyWidth, stage.canvas.height);
    container.addChild(body);

    var screen = new createjs.Shape();
    screen.graphics.beginFill("Green").drawRect(10, 10, bodyWidth - 20, bodyWidth - 20);
    container.addChild(screen);
    
    var text = new createjs.Text("Hello World", "20px Arial", "black");
    text.x = 100;
    text.y = 100;
    text.textBaseline = "alphabetic";
    container.addChild(text);
    
    var cirRid = 45;
    var cirX = 70;
    var cirY = bodyWidth + 80;
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, cirRid);
    circle.x = cirX;
    circle.y = cirY;
    circle.shadow = new createjs.Shadow("#000000", 5, 5, 10);
    container.addChild(circle);
    
    var btnA = new createjs.Shape();
    btnA.graphics.beginFill("Red").drawCircle(0, 0, 30);
    btnA.x = 180;
    btnA.y = cirY + 20;
    btnA.shadow = new createjs.Shadow("#000000", 5, 5, 10);
    container.addChild(btnA);
    
    var btnB = new createjs.Shape();
    btnB.graphics.beginFill("Red").drawCircle(0, 0, 30);
    btnB.x = 250;
    btnB.y = cirY -20;
    btnB.shadow = new createjs.Shadow("#000000", 5, 5, 10);
    container.addChild(btnB);
    
    container.x = 7.5 * fixScale;
    container.y = 7.5 * fixScale;
    container.scaleX = container.scaleY = fixScale;
    
    stage.addChild(container);
    stage.update();
    
    circle.addEventListener("pressup", function (evt) {
        var o = evt.target;
        o.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        dirctionStatus = '';
        Refresh();
    });
    
    circle.addEventListener("mousedown", function (evt) {
        dirction(evt);
    });
    
    circle.addEventListener("pressmove", function (evt) {
        dirction(evt);
    });
    
    function dirction (evt) {
        var o = evt.target;
        var offset = {x: (evt.stageX - o.x * fixScale) / cirRid, y: -(evt.stageY - o.y * fixScale) / cirRid};
        var arc = Math.atan2(offset.y, offset.x);
        var arcSin = Math.sin(arc - Math.PI * 1 / 4);
        var arcCos = Math.cos(arc - Math.PI * 1 / 4);
        console.log(o.x+'|'+o.y+'|' +evt.stageX+'|' + evt.stageY);
        
        var absArc = Math.abs(arc);
        console.log(arc + '|' + arcSin + '|' + absArc);
        if(absArc > 0 && absArc <= Math.PI / 4) {
            dirctionStatus = 'Right';
        }else if(absArc > Math.PI / 4 && absArc <= Math.PI * 3 / 4) {
            dirctionStatus = arc > 0 ? 'Up' : 'Down';
        }else if(absArc > Math.PI * 3 / 4 && absArc <= Math.PI) {
            dirctionStatus = 'Left';
        }
        o.shadow = new createjs.Shadow("#000000", 5 + 5 * arcSin, 5 + 5 * arcCos, 10);
        Refresh();
    }
    
    btnA.addEventListener("pressup", function (evt) {
        btnAStatus = false;
        var o = evt.target;
        o.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        Refresh();
    });
    btnA.addEventListener("mousedown", function (evt) {
        btnAStatus = true;
        var o = evt.target;
        o.shadow = null;
        Refresh();
    });
    
    btnB.addEventListener("pressup", function (evt) {
        btnBStatus = false;
        var o = evt.target;
        o.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        Refresh();
    });
    btnB.addEventListener("mousedown", function (evt) {
        btnBStatus = true;
        var o = evt.target;
        o.shadow = null;
        Refresh();
    });
    
    function Refresh() {
        text.text = "Direction:" + dirctionStatus +"\n\nButton A: " + (btnAStatus?"Press":"UnPress") +"\n\nButton B: " + (btnBStatus?"Press":"UnPress") + "\n\nViewWidth: " + viewWidth + "\n\nViewHeight: " + viewHeight;
    }
    /*var data = {
        images: ["bower_components/easeljs/icon.png"],
        frames: {width:50, height:80},
        animations: {
            stand:0,
            run:[1,5],
            jump:[6,8,"run"]
        }
    };
    var spriteSheet = new createjs.SpriteSheet(data);
    
    var sprite = new createjs.Sprite(spriteSheet, "run");
    //sprite.fixScaleY = sprite.fixScaleX = 1.4;
    stage.addChild(sprite);
    
    sprite.on("click", function() { 
        sprite.gotoAndPlay("jump"); 
    });*/
    
    
    createjs.Ticker.on("tick", stage);
}
