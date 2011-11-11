
var API = require('app/service.js')
,server = require('app/server.js')
,mysql = require('mysql')
,should = require('should');

server.setConfig();

var config = server.config
,getDb = function(){
	return mysql.createClient(config.mysql);
};

module.exports = {
	"test create user no data":function(beforeExit){
		var z = this
		,api = new API(getDb());
		
		api.write.user({},function(){
			console.log('write user!! end');

			api.end();
			beforeExit();
		});
	},
	"test create user missing email":function(beforeExit){
		var z = this
		,api = new API(getDb());
		
		api.write.user({name:'',email:'lalal@lllll.com',password:'aaaaaa'},function(err,data){
			//z.teardown();
			
			(err.name).should.be.an.object;

			api.end();
			beforeExit();
		});
	},
	"test update user":function(beforeExit){
		//(false).should.be.true;
		beforeExit();
	},
	"test login":function(beforeExit){
		//(false).should.be.true;
		beforeExit();
	}
};