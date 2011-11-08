
var api = require('app/service.js')
,server = require('app/server.js')
,mysql = require('mysql')
,should = require('should');

server.setConfig();

var config = server.config
,getDb = function(){
	return mysql.createClient(config.mysql);
}

module.exports = {
	"test create user no data":function(beforeExit){
		var z = this,db = getDb();
		api.init(db);
		api.write.user({},function(){
			db.end();
			console.log('write user!! end');
		});
	},
	"test create user missing email":function(){
		var z = this;
		this.setup();
		api.write.user({name:'',email:'lalal@lllll.com',password:'aaaaaa'},function(err,data){
			z.teardown();
			
			(err.name).should.be.an.object;
		});
	},
	"test update user":function(){
		//(false).should.be.true;
	},
	"test login":function(){
		//(false).should.be.true;
	}
};