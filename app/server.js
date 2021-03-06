
var express = require('express')
,mysql = require('mysql')
,fs = require('fs')
,_ = require('underscore')
, server = {
	express:null,
	app:null,
	config:{},
	db:null,
	init:function(){
		this.app = express.createServer();
		this.setConfig();
		this.logger();
		this.prepareDB();
		this.routes();
		this.prepare();
		this.listen();
	},
	setConfig:function(){
		//config
		var base = require(__dirname+'/../config.json')
		,user = require(__dirname+'/../config.user.json');
		
		this.config = _.extend(base,user);

	},
	logger:function(){
		var logDir = config.logDir || __dirname+'/logs'
		,logPrefix = config.logPrefix || 'access_'+__dirname.split('/').pop()
		,logPath = logDir+'/'+logPrefix+'.log';
		
		//TODO: add sighup rotator for logs. fake writeableStream?
		self.app.use(express.logger({format:'default',stream:logPath?fs.createWriteStream(logPath, {flags:'a',encoding:'UTF-8'}):process.stdout}));
	},
	prepareDB:function(){
		console.log(this.config.mysql);
		
		this.db = mysql.createClient({
			user: this.config.mysql.user,
			password: this.config.mysql.password,
			name: this.config.mysql.name,
			host: this.config.mysql.host
		});
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


