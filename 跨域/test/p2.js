var express = require('express');
var app = express();
 
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "p2.html" );
})
 
var server = app.listen(8082, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})