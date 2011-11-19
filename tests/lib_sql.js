var sql = require('lib/sql.js')
,should = require('should');

module.exports = {
	'test updateValues':function(){
		var val = sql.updateValues({a:1,b:2});
		val.set.should.eql("`a`=?,`b`=?");
		val.values.should.eql([1,2]);
	},
	'test values':function(){
		var o = sql.values([1,2]);
		o.set.should.eql('?,?');
		o.values.should.eql([1,2]);
	},
	'test fields':function(){
		var fields = sql.fields({a:1,b:2});
		fields.should.eql('`a`,`b`');
	},
	'test select no config no data':function(){
		var o = sql.select('test');
		o.params.length.should.eql(1);
		o.sql.should.eql('select * from `test` limit ?');
	},
	'test select no config longhand filter':function(){
		var o = sql.select('test',{filter:[{field:'id',value:10,op:'!='},{field:'happy',value:[1,2,3],op:'in'}]});

		o.params.length.should.eql(5);
		o.params[0].should.eql(10);
		o.sql.should.eql('select * from `test` where `id` != ? `happy` in (?,?,?) limit ?');
	},
	'test select no config with sort':function(){
		var o = sql.select('test',{sort:{created:true,id:false}});

		o.params.length.should.eql(1);
		o.sql.should.eql('select * from `test` order by `created` DESC,`id` ASC limit ?');
	},
	'test select config filters':function(){
		try{
			var o = sql.select('test',{filter:[{field:'pandas',value:1}]},{filterable:{id:true}});
		} catch(e){
			e.length.should.eql(1);
			
			(e[0] instanceof sql.SQLUtilError).should.be.true;
			e[0].message.indexOf('pandas').should.be.above(-1);
			
			return;
		}
		('should have caught bad filter field exception').should.be.true;
	}
}