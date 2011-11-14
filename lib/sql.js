var _u = require('./_u.js');

module.exports = {
	updateValues:function(o){
		//returns string with ?s placed
		//returns [] args
		var kv = [],values=[];
		_u.each(o,function(k,v){
			var ck=k.replace(/[^a-z0-9_ ]/g,'');
			
			if(ck != k) console.error('sqlutil changed the name of a field because it contained invalid characters! '+k+' to '+ck);
				
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

function SQLUtilError(){Error.call(this,arguments);}
SQLUtilError.prototype = new Error();