
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
	},
	"test get roles names":function(){
		var z = this
		,api = new API(getDb());
		
		api.get.rolesName({name:'parent'},function fn(err,data){
			(err||false).should.be.false;
			data.id.should.be.above(0);
			api.end();
		});
	},
	"test grant user role":function(){
		var z = this
		,api = new API(getDb())
		,id,email=Date.now()+Math.random()+'@lllll.fake';
		
		//(false).should.be.true;
		var tests = [
			//prepare: create user
			function(){
				//create user
				api.write.user({name:'joetest',email:email,password:'aaaaaa'},function(err,data){
					(err||false).should.be.false;
					id=data;
					(id > 0).should.be.true;
					done();
				});
			},
			//select user. check roles
			function(){
				api.get.user({id:id},function(err,data){
					//user created with no role should not have role
					(err||false).should.be.false;
					(data.email||'').length.should.be.eql(email.length);
					(data.roles||'').length.should.be.eql(0);
					done();
				});
			},
			//grant user role
			function(){
				api.write.grantUserRole({id:id,role:'parent'},function(err,data){
					//user created with no role should not have role
					(err||false).should.be.false;
					data.affectedRows.should.be.eql(1);
					done();
				});
			},
			//select user with role result
			function(){
				api.get.user({id:id},function(err,data){
					//user created with no role should not have role
					(err||false).should.be.false;
					(data.email||'').length.should.be.eql(email.length);
					(data.roles||'').should.be.eql('parent');

					done();
				});
			},
		], done = function(){
			if(tests.length) {
				cb = tests.shift();
				cb();
				return;
			}
			api.end();
		};
		done();
	}
	,"test cru- job":function(){
		var z = this
		,api = new API(getDb())
		,id,title,desc;
		
		//(false).should.be.true;
		var tests = [
			//prepare: create job
			function(){
				title = 'test job '+Date.now();
				//create user
				api.write.job({kids_id:1,parents_id:2,title:title},function(err,data){
					(err||false).should.be.false;
					id=data;
					(id > 0).should.be.true;
					done();
				});
			}
			//select user. check roles
			,function(){
				api.get.job({id:id},function(err,data){
					//user created with no role should not have role
					(err||false).should.be.false;
					(data.kids_id||0).should.eql(1);
					(data.parents_id||0).should.eql(2);
					(data.title||'').should.eql(title);
					(data.id||0).should.eql(id);
					done();
				});
			}
			,function(){
				desc = 'pandas love this job '+Date.now();
				//create user
				api.write.job({id:id,description:desc},function(err,data){
					(err||false).should.be.false;

					data.should.eql(id);
					//data.description.should.eql(desc);
					
					done();
				});
			}
			,function(){
				api.get.job({id:id},function(err,data){
					//user created with no role should not have role
					(err||false).should.be.false;
					(data.description).should.eql(desc);
					
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
		
	}
};