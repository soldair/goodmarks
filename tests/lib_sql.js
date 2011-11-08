var sql = require('lib/sql.js')
,should = require('should');

module.exports = {
	'test updateValues':function(){
		var val = sql.updateValues({a:1,b:2});

		console.log(val);
		
	},
	'test values':function(){
		
	},
	'test fields':function(){
		
	}
}