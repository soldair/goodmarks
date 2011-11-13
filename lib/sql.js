var _u = require('./_u.js');

module.exports = {
	updateValues:function(o){
		//returns string with ?s placed
		//returns [] args
		var kv = [],values=[];
		_u.each(o,function(k,v){
			kv.push("`"+k+"`=?");
			values.push(v);
		});
		
		return {set:kv.join(','),values:values};
	}
	,fields:function(obj){
		return '`'+Object.keys(obj).join('`,`')+'`';
	}
	,values:function(obj){
		var vs = [],values = _u.values(obj);
		vs[values.length-1] = '';
		return {set:'?'+vs.join(',?'),values:values};
	}
};