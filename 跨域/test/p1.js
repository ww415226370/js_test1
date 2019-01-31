var express = require('express');
var app = express();

const whiteList = ["http://localhost:8082"]
 
app.get('/', function (req, res) {
	res.status(200);
   	res.sendFile( __dirname + "/" + "p1.html" );
})

app.get('/jsonp', function (req, res) {
	// res.type('json');
	res.status(200);
   	res.send(`${req.query.callback}(123)`);
})

app.all('/notSimpleCors', function (req, res) {
	if(whiteList.indexOf(req.headers.origin) > -1) {
		res.header('Access-Control-Allow-Methods', "DELETE, PUT")//该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法，上例是PUT。
		res.header('Access-Control-Allow-Headers', 'X-Custom-Header')//该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段，上例是X-Custom-Header。
		res.header('Access-Control-Allow-Origin', req.headers.origin)//设置跨域允许
		res.header('Access-Control-Allow-Credentials', true)//设置可以接受cookies
		res.header('Access-Control-Expose-Headers', 'aa')
		
		//该字段可选。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。上面的例子指定，getResponseHeader('FooBar')可以返回FooBar字段的值。
		res.header('Access-Control-Max-Age', 1728000)
		//用来指定本次预检请求的有效期
	}
	res.status(200);
   	res.send(`all notSimpleCors requst`);
})

app.get('/simplecors', function (req, res) {
	// res.type('json');
	if(whiteList.indexOf(req.headers.origin) > -1) {
		
		res.header('Access-Control-Allow-Origin', req.headers.origin)//设置跨域允许
		res.header('Access-Control-Allow-Credentials', true)//设置可以接受cookies
		res.header('Access-Control-Expose-Headers', 'aa')
		//该字段可选。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。上面的例子指定，getResponseHeader('FooBar')可以返回FooBar字段的值。
	}
	res.status(200);
   	res.send(`cors requst`);
})
 
var server = app.listen(8081, function () {
 
	var host = server.address().address
	var port = server.address().port
 
	console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})