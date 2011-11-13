var sql = require('lib/sql.js')
,should = require('should');

module.exports = {
	'test updateValues':function(){
		var val = sql.updateValues({a:1,b:2});
		val.set.should.eql("`a`=?,`b`=?");
		val.values.should.eql([1,2]);
	},
	'test values':function(){
		
	},
	'test fields':function(){
		
	}
}