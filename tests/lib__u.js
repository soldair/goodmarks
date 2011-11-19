var _u = require('lib/_u.js')
,should = require('should');

module.exports = {
	'test each object':function(){
		tests = [
			function(k,v){
				k.should.eql('a');
				v.should.eql(1)
			},
			function(k,v){
				k.should.eql('b');
				v.should.eql(2)
			}
		];
		
		_u.each({a:1,b:2},function(k,v){
			var t = tests.shift();
			
			(typeof t).should.eql('function');
			
			t(k,v);
		});
	}
	,'test isObject':function(){
		_u.isObject(null).should.be.false;
		_u.isObject(1).should.be.false;
		_u.isObject(false).should.be.false;
		_u.isObject('hi').should.be.false;
		_u.isObject([1,2,3]).should.be.false;
		//grey area
		_u.isObject(function(){}).should.be.true;
		_u.isObject(Error).should.be.true;
		
		_u.isObject(new Error()).should.be.true;
		_u.isObject({}).should.be.true;
		_u.isObject(new Boolean(false)).should.be.true;
		
	}
}