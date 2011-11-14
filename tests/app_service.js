
var API = require('app/service.js')
,server = require('app/server.js')
,mysql = require('mysql')
,mysql_constants = require('mysql/lib/constants')
,should = require('should');

server.setConfig();

var config = server.config
,getDb = function(){
	return mysql.createClient(config.mysql);
};

module.exports = {
	"test create user no data":function(){
		var z = this
		,api = new API(getDb());
		
		api.write.user({},function(error,data){
			
			error.name.code.should.eql('nameEmpty');
			error.email.code.should.eql('emailEmpty');
			error.password.code.should.eql('passwordEmpty');

			(error.name.message||false).should.be.ok;
			(error.email.message||false).should.be.ok;
			(error.password.message||false).should.be.ok;
			
			api.end();
		});
	},
	"test create user missing name":function(beforeExit){
		var z = this
		,api = new API(getDb());
		
		api.write.user({name:'',email:'lalal@lllll.com',password:'aaaaaa'},function(err,data){
			
			(err.name).should.be.an.object;

			(err.email||false).should.be.false;
			
			api.end();
		});
	},
	"test crud user":function(beforeExit){
		var z = this
		,api = new API(getDb())
		,id,email=Date.now()+'lalal@lllll.fake';
		
		var tests = [
			function(){
				//create test
				api.write.user({name:'joetest',email:email,password:'aaaaaa'},function(err,data){
					(err||false).should.be.false;
					id=data;
					(id > 0).should.be.true;
					done();
				});
			},
			function(){
				//email key constraint test
				api.write.user({name:'duplicate key test',email:email,password:'aaaaaa'},function(err,data){
					(err||false).should.be.ok;
					(mysql_constants.ERROR_DUP_ENTRY == err.number).should.be.true;
					
					done();
				});
			},
			function(){
				//update user
				api.write.user({id:id,name:'pandaquest'},function(err,data){
					(err||false).should.be.false;
					done();
				});
			},
			function(){
				api.get.user({id:id},function(err,data){
					(err||false).should.be.false;
					data.id.should.eql(id);
					data.password.length.should.eql(45);
					done();
				});
			},
			function(){
				api.delete.user({id:id},function(err,data){
					(err||false).should.be.false;
					done();
				});
			},
			function(){
				api.get.user({id:id},function(err,data){
					(err||false).should.be.false;
					(data||false).should.be.false;
					done();
				});
			}
		], done = function(){
			if(tests.length) {
				cb = tests.shift();
				cb();
				return;
			}
			api.end();
		};
		done();
	}/*,
	"test login":function(beforeExit){
		//(false).should.be.true;
	}*/
};