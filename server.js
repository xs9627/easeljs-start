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
port = parseInt(process.env.PORT, 10),
MongoClient = require('mongodb').MongoClient,
root = __dirname + '/app';

app.get("/", function (req, res) {
    addRequestLog(req);
    res.redirect("/bulk.html");
});

app.listen(port,  function () {
    console.log('Server listening on port ' + port);
});

/*Express static web server.*/
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(root + '/'));
if (process.env.NODE_ENV == 'dev') {
    app.use('/bower_components', express.static(root + '/../bower_components'));
}
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));

function addRequestLog(req){
  var userAgent = req.headers['user-agent'];
  var url = req.url;
  var date = new Date();
  var request = {userAgent:userAgent, url:url, date:date};
  console.log(date+ ', ' + userAgent + ', ' + url);
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
      //console.log("Connect to Database");
      
      var request = {userAgent:userAgent, url:url, date:date};
      
      db.collection('requests').insert(request, function(err, records){
          if(err) throw err;
          console.log("Record added as " + records[0]._id);
      });
  });
}