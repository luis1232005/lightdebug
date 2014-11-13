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



//开启监控
function watchInit(){
	//定义
	var watcher = watch(config.files);

	watcher.on("change",function(ev){
		var filename = ev.path.split('\\').pop(),
			suffix = ev.path.split('.').pop();

		ev.filename = filename || undefined;
		ev.suffix = suffix || undefined;

		console.log(ev);
	});
}

watchInit();

// //监听连接服务
// io.on('connection', function(){ 
// 	console.log("connectioned");
// 	io.emit("event",{"ll":"ishead"});

// 	//polling();
// });
// server.listen(3000);