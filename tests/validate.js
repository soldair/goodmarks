var valid = require('../lib/validate.js')
,should = require('should');

module.exports  = {
	validEmail:function(){
		//valid email should be valid
		valid.email('soldair@gmail.com').should.eql(true);

		//valid email with no tld chunk should not be considered valid
		valid.email('soldair@gmail').should.eql(false);

		//invalid email should be invalid
		valid.email('soldair').should.eql(false);
	}
}