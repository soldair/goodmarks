if(process.env.EXPRESSO_TEST_PATH) require.paths.unshift(process.env.EXPRESSO_TEST_PATH);

var valid = require('lib/validate.js')
,should = require('should');

module.exports  = {
	validEmail:function(){
		//valid email should be valid
		valid.email('soldair@gmail.com',function(err,email){
			(!err).should.be.true;
			email.should.eql('soldair@gmail.com');
		});
		//valid email with no tld chunk should not be considered valid
		valid.email('soldair@gmail',function(err,email){
			(!err).should.be.false;
			err.code.should.eql('emailTLD');
		});
		//invalid email should be invalid
		valid.email('soldair',function(err,email){
			(!err).should.be.false;
			err.code.should.eql('emailInvalid');
		});
		//empty email should be empty
		valid.email('',function(err,email){
			(!err).should.be.false;
			err.code.should.eql('emailEmpty');
		});
		//false email should be empty
		valid.email(false,function(err,email){
			(!err).should.be.false;
			err.code.should.eql('emailEmpty');
		});
	}
	,validName:function(){
		valid.name('ryan',function(err,name){
			(!err).should.be.true;
			name.should.eql('ryan');
		});
		//validator trims
		valid.name('  ryan    ',function(err,name){
			(!err).should.be.true;
			name.should.eql('ryan');
		});
		valid.name('',function(err,name){
			(!err).should.be.false;
			err.code.should.eql('nameEmpty');
		});
		valid.name('  ',function(err,name){
			(!err).should.be.false;
			err.code.should.eql('nameEmpty');
		});
	}
	,validPass:function(){
		valid.password('aaaaaa',function(err,pass){
			(!err).should.be.true;
			pass.should.eql('aaaaaa')
		});
		valid.password('12345',function(err,pass){
			(!err).should.be.false;
			err.code.should.eql('passwordShort');
		});
		valid.password('',function(err,pass){
			(!err).should.be.false;
			err.code.should.eql('passwordEmpty');
		});
	}
};