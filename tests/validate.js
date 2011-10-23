if(process.env.EXPRESSO_TEST_PATH) require.paths.unshift(process.env.EXPRESSO_TEST_PATH);

var valid = require('lib/validate.js')
,should = require('should');

module.exports  = {
	validEmail:function(){
		//valid email should be valid
		valid.email('soldair@gmail.com').should.be.true;
		//valid email with no tld chunk should not be considered valid
		valid.email('soldair@gmail').should.be.false;
		//invalid email should be invalid
		valid.email('soldair').should.be.false;
	}
	,validName:function(){
		valid.name('ryan').should.be.true;
		valid.name('').should.be.false;
		valid.name('  ').should.be.false;
	}
	,validPass:function(){
		valid.password('aaaaaa').should.be.true;
		valid.password('12345').should.be.false;
		valid.password('').should.be.false;
	}
};