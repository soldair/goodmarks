
var express = require('express')
,app = express.createServer()
,nconf = require('nconf')
,mysql = require('mysql')
,fs = require('fs');
//,optimist = require('optimist').argv;


//config
nconf.argv = nconf.env = true;
nconf.use('file',{file:__dirname+'/config.json'});
nconf.use('file',{file:__dirname+'/config.user.json'});



//routes
app.get('/',function(req,res){
	res.render('index.ejs',{layout:'layout'});
});

app.get("/svc/:model",function(req,res){
	console.log(req);
	req.query;
	req.params;
	
	res.send('{hi:1}');
});
//db


//logger
var logDir = nconf.logDir || __dirname+'/logs'
,logPrefix = nconf.logPrefix || 'access_'+__dirname.split('/').pop()
,logPath = logDir+'/'+logPrefix+'.log';

app.use(express.logger({format:'default',stream:logPath?fs.createWriteStream(logPath, {flags:'a',encoding:'UTF-8'}):process.stdout}));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret:'goodmarks!'}));
app.use(express.static(__dirname + '/public'));

//listen
var p = nconf.port||3000;
app.listen(p,function(err){
	if(err){
		console.error("failed to connect =(");
		throw err;
	} else {
		console.log('server started on port '+p);
	}
});




