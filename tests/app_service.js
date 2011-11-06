
var api = require('app/service.js')
,should = require('should');

module.exports = {
	"test create user bad name":function(){
		api.write.user({id:1,name:''});
	},
	"test create user":function(){
		api.write.user({id:1,name:'bob'});
	},
	"test update user":function(){
		(false).should.be.true;
	},
	"test login":function(){
		(false).should.be.true;
	}
};