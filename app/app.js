var stage, text;
var angle;
function init() {
    angle = 0;
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
    var dirctionStatus = '';
    stage = new createjs.Stage("demoCanvas");
    
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;
    
    var container = new createjs.Container();
    var bodyWidth = 305;
    var body = new createjs.Shape();
    body.graphics.beginLinearGradientFill(["#e5dddd", "#745858"], [0, 1], 0, 0, 300, 450).drawRoundRect(0, 0, bodyWidth, stage.canvas.height, 5);
    container.addChild(body);

    var screen = new createjs.Shape();
    screen.graphics.beginFill("Green").drawRect(10, 10, bodyWidth - 25, bodyWidth - 25);
    container.addChild(screen);
    
    var text = new createjs.Text("Hello World", "20px Arial", "black");
    text.x = 100;
    text.y = 100;
    text.textBaseline = "alphabetic";
    container.addChild(text);
    
    var heart = new createjs.Shape();
			heart.graphics.beginFill(createjs.Graphics.getHSL(Math.random() * 30 - 45, 100, 50 + Math.random() * 30));
			heart.graphics.moveTo(0, -12).curveTo(1, -20, 8, -20).curveTo(16, -20, 16, -10).curveTo(16, 0, 0, 12);
			heart.graphics.curveTo(-16, 0, -16, -10).curveTo(-16, -20, -8, -20).curveTo(-1, -20, 0, -12);
    heart.x = 100;
			heart.y = 100 * Math.random();
    container.addChild(heart);
    
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
    btnA.pressed = false;
    container.addChild(btnA);
    
    var btnB = new createjs.Shape();
    btnB.graphics.beginFill("Red").drawCircle(0, 0, 30);
    btnB.x = 250;
    btnB.y = cirY -20;
    btnB.shadow = new createjs.Shadow("#000000", 5, 5, 10);
    btnB.pressed = false;
    container.addChild(btnB);
    
    container.x = 7.5 * fixScale;
    container.y = 7.5 * fixScale;
    container.scaleX = container.scaleY = fixScale;
    //container.alpha = 0;
    
    stage.addChild(container);
    stage.update();
    
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
    

    function tick(event) {
        if(angle > Math.PI/2) {
            createjs.Ticker.removeEventListener("tick", tick);
        }
		angle += 0.1;
		var value = Math.sin(angle);

		//container.rotation = value;
		//container.scaleX = container.scaleY = value / 360;
        text.y = 120 - value * 20;
        //container.alpha = value;
		stage.update(event);
	}
    
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
        btnUnPress(evt);
    });
    btnA.addEventListener("mouseout", function (evt) {
        btnUnPress(evt);
    });
    btnA.addEventListener("mousedown", function (evt) {
        btnPress(evt);
    });
    btnA.addEventListener("mouseover", function (evt) {
        btnPress(evt);
    });    

    
    btnB.addEventListener("pressup", function (evt) {
        btnUnPress(evt);
    });
    btnB.addEventListener("mousedown", function (evt) {
        btnPress(evt);
    });
    
    function btnPress(evt) {
        var o = evt.target;
        o.pressed = true;
        o.shadow = null;
        Refresh();
    }
    
    function btnUnPress(evt) {
        var o = evt.target;
        o.pressed = false;
        o.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        Refresh();
    }
    
    
    function Refresh() {
        text.text = "Direction:" + dirctionStatus +"\n\nButton A: " + (btnA.pressed?"Press":"UnPress") +"\n\nButton B: " + (btnB.pressed?"Press":"UnPress") + "\n\nViewWidth: " + viewWidth + "\n\nViewHeight: " + viewHeight;
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
