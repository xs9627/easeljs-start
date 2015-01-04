var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(function(req, res, next) {
  var userAgent = req.headers['user-agent'];
  console.log(new Date() + ', ' + userAgent + ', ' + req.url);
  next();
}).use(serveStatic(__dirname)).listen(process.env.PORT);

console.log("server started!");