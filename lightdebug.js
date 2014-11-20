//定义常量
//todo:注释
var PORT = 3000;

//载入所需库文件
//todo:注释
var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	watch = require('glob-watcher'),
	eszyLogger = require("eazy-logger").Logger({
		useLevelPrefixes: true
	}),
	config = require('../lightdebug-config');


console.log("\n--==###############你的配置如下:################===---");
console.log(config);
console.log("--==###############你的配置如下:################===---\n");

logger('watch',new Date().toString() + "-" + "is start");

/**
 * 自定义日志输出
 * @param  {[type]} type [description]
 * @param  {[type]} msg  [description]
 * @return {[type]}      [description]
 */
function logger(type,msg){
	eszyLogger.log("info","<{green:"+type+"}>",msg);
}

/**
 * 文件监控处理函数
 */
function watchInit() {
	//定义
	var watcher = watch(config.files);

	watcher.on("change", function(ev) {
		var filename = ev.path.split('\\').pop(),
			suffix = ev.path.split('.').pop();

		ev.filename = filename || undefined;
		ev.suffix = suffix || undefined;

		//通知客户端文件已经修改
		io.emit('message', {
			type: ev.suffix,
			data: ev
		});
		//记录日志
		logger(ev.suffix,new Date().toString() + "-" + filename + "已经修改");
	});
}


/**
 * 开启监听客户端连接
 */
io.on('connection', function() {
	logger("info",new Date().toString() + "-" + ":客户端连接成功");
	//开启文件监控
	watchInit();
	io.emit("message", {
		type: "msg",
		data: {}
	});
});
server.listen(3000);