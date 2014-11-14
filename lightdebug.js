//定义常量
//todo:注释
var PORT = 3000;

//载入所需库文件
//todo:注释
var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	watch = require('glob-watcher'),
	config = require('../lightdebug-config');


console.log(config);



/**
 * 文件监控处理函数
 */
function watchInit(){
	//定义
	var watcher = watch(config.files);

	watcher.on("change",function(ev){
		var filename = ev.path.split('\\').pop(),
			suffix = ev.path.split('.').pop();

		ev.filename = filename || undefined;
		ev.suffix = suffix || undefined;

		//通知客户端文件已经修改
		io.emit('message',{type:ev.suffix,data:ev});
		console.log(new Date().toString()+":["+ev.suffix+"]"+filename+"已经修改！\n");
	});
}


/**
 * 开启监听客户端连接
 */
io.on('connection', function(){ 
	console.log(new Date().toString()+":客户端连接成功！\n");

	//开启文件监控
	watchInit();
	io.emit("message",{type:"msg",data:{}});
});
server.listen(3000);

