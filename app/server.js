
var express = require('express')
,mysql = require('mysql')
,fs = require('fs');
, server = {
	express:null,
	app:null,
	config:{},
	init:function(){
		this.app = express.createServer();
		this.setConfig();
		this.logger();
		this.routes();
		this.prepare();
		this.listen();
	},
	setConfig:function(){
		//config
		var nconf = require('nconf');
		nconf.argv = nconf.env = true;
		nconf.use('file',{file:__dirname+'/config.json'});
		nconf.use('file',{file:__dirname+'/config.user.json'});
		this.config = nconf;
	},
	logger:function(){
		var logDir = config.logDir || __dirname+'/logs'
		,logPrefix = config.logPrefix || 'access_'+__dirname.split('/').pop()
		,logPath = logDir+'/'+logPrefix+'.log';
		
		//TODO: add sighup rotator for logs. fake writeableStream?
		self.app.use(express.logger({format:'default',stream:logPath?fs.createWriteStream(logPath, {flags:'a',encoding:'UTF-8'}):process.stdout}));
	},
	routes:function(){
		var self = this;
		//routes
		self.app.get('/',function(req,res){
			res.render('index.ejs',{layout:'layout'});
		});

		self.app.get("/svc/:model",function(req,res){
			console.log(req);
			req.query;
			req.params;
			
			res.send('{hi:1}');
		});
	},
	prepare:function(){
		var self = this;
		self.app.use(express.bodyParser());
		self.app.use(express.cookieParser());
		self.app.use(express.session({secret:'goodmarks!'}));
		self.app.use(express.static(__dirname + '/public'));
	},
	listen:function(){
		var p = this.config.port||3000;
		self.app.listen(p,function(err){
			if(err){
				console.error("failed to connect =(");
				throw err;
			} else {
				console.log('server started on port '+p);
			}
		});
	}
}


module.exports = server;


