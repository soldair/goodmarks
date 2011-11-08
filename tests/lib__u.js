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
			
			//(!!k).should.be.true;
			//(!!v).should.be.true;
			
			(typeof t).should.eql('function');
			
			t(k,v);
		});
	}
}