var stage, text;

function init() {
    var btnAStatus = false;
    var btnBStatus = true;
    var dirctionStatus = '';
    stage = new createjs.Stage("demoCanvas");
    
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;
    
    var screen = new createjs.Shape();
    screen.graphics.beginFill("Green").drawRect(20, 20, stage.canvas.width-40, stage.canvas.width - 40);
    stage.addChild(screen);
    
    var text = new createjs.Text("Hello World", "20px Arial", "black");
    text.x = 100;
    text.y = 100;
    text.textBaseline = "alphabetic";
    stage.addChild(text);
    
    var cirRid = 45;
    var cirX = 70;
    var cirY = 350;
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, cirRid);
    circle.x = cirX;
    circle.y = cirY;
    circle.shadow = new createjs.Shadow("#000000", 5, 5, 10);
    stage.addChild(circle);
    
    var btnA = new createjs.Shape();
    btnA.graphics.beginFill("Red").drawCircle(0, 0, 30);
    btnA.x = 180;
    btnA.y = cirY + 20;
    btnA.shadow = new createjs.Shadow("#000000", 5, 5, 10);
    stage.addChild(btnA);
    
    var btnB = new createjs.Shape();
    btnB.graphics.beginFill("Red").drawCircle(0, 0, 30);
    btnB.x = 250;
    btnB.y = cirY -20;
    btnB.shadow = new createjs.Shadow("#000000", 5, 5, 10);
    stage.addChild(btnB);
    
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
        var offset = {x: (evt.stageX - o.x) / cirRid, y: -(evt.stageY - o.y) / cirRid};
        var arc = Math.atan2(offset.y, offset.x);
        var arcSin = Math.sin(arc - Math.PI * 1 / 4);
        var arcCos = Math.cos(arc - Math.PI * 1 / 4);
        //console.log(o.x+'|'+o.y+'|' +evt.stageX+'|' + evt.stageY);
        
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
        text.text = "Direction:" + dirctionStatus +"\n\nButton A: " + (btnAStatus?"Press":"UnPress") +"\n\nButton B: " + (btnBStatus?"Press":"UnPress");
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
    //sprite.scaleY = sprite.scaleX = 1.4;
    stage.addChild(sprite);
    
    sprite.on("click", function() { 
        sprite.gotoAndPlay("jump"); 
    });*/
    
    
    createjs.Ticker.on("tick", stage);
}
