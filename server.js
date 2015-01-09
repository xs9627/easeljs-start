var connect = require('connect');
var serveStatic = require('serve-static');
var MongoClient = require('mongodb').MongoClient;

connect().use(function(req, res, next) {
  var userAgent = req.headers['user-agent'];
  var url = req.url;
  var date = new Date();
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
  next();
}).use(serveStatic(__dirname)).listen(process.env.PORT);

console.log("server started!");