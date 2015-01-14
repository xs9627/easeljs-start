// var connect = require('connect');
// var serveStatic = require('serve-static');
// var MongoClient = require('mongodb').MongoClient;

// connect().use(function(req, res, next) {
//   var userAgent = req.headers['user-agent'];
//   var url = req.url;
//   var date = new Date();
//   console.log(date+ ', ' + userAgent + ', ' + url);
//   MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
//       if(err) throw err;
//       //console.log("Connect to Database");

//       var request = {userAgent:userAgent, url:url, date:date};

//       db.collection('requests').insert(request, function(err, records){
//           if(err) throw err;
//           console.log("Record added as " + records[0]._id);
//       });
//   });
//   next();
// }).use(serveStatic(__dirname)).listen(process.env.PORT);

var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    port = parseInt(process.env.PORT, 10) || 3000,
    MongoClient = require('mongodb').MongoClient,
    root = __dirname + '/app'
    crypto = require('crypto');

/*Express static web server.*/
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use("/pics/*", function (req, res, next) {
    addRequestLog(req);
    next();
});
app.use(express.static(root + '/'));
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));

app.get("/", function (req, res) {
    res.redirect("/bulk.html");
});

app.get("/weichat", function (req, res) {
    var token = "sonix";
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var array = [token,timestamp,nonce];
    
    var temp = array.sort().join('');
    
    var hasher = crypto.createHash('sha1');
    hasher.update(temp);
    var hashmsg=hasher.digest('hex');
    console.log(signature + '|' + hashmsg);
    if(signature == hashmsg){
        console.log(echostr);
        res.send(echostr);
    }else{
        res.send("check failed, detail: " + hashmsg);
    }
    
});

app.post("/weichat", function (req, res) {
    console.log(req);
    res.send({ToUserName:"123"});
});

app.post("/score", function (req, res) {
    addScore({
        img: req.body.img,
        playTime: req.body.time,
        data: new Date()
    }, function (err, data) {
        res.send(data);
    });
});

app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

function addScore(score, callback) {
    console.log(score);
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
        if (err) throw err;
        
        db.collection('scores').insert(score, function (err, records) {
            if (err) throw err;
            callback(err, {
                result: 'ok'
            });
            console.log("Score added as " + records[0]._id);
        });
    });
}

function addRequestLog(req) {
    var userAgent = req.headers['user-agent'];
    var url = req.originalUrl;
    var date = new Date();
    var request = {
        userAgent: userAgent,
        url: url,
        date: date
    };
    console.log(date + ', ' + userAgent + ', ' + url);
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
        if (err) throw err;
        //console.log("Connect to Database");

        var request = {
            userAgent: userAgent,
            url: url,
            date: date
        };

        db.collection('requests').insert(request, function (err, records) {
            if (err) throw err;
            console.log("Record added as " + records[0]._id);
        });
    });
}