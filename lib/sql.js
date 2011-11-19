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
	,select:function(table,data,config){
		var z = this
		,sql = "select * from `"+table+"`"
		,params = []
		,errors = [];
		
		config = config||{};
		data = data||{};
		
		if(data.filter && data.filter.length) {
			//error if invalid filterables
			sql +=' where';
			_u.each(data.filter,function(i,filter){
				
				if(config.filterable && !config.filterable[filter.field]){
					errors.push(new SQLUtilError(filter.field+' is not a valid field to filter.'));
				} else {
					var placeholder = '?';
					if(filter.value instanceof Array) {
					
						var o = z.values(filter.value);
						placeholder = '('+o.set+')';
						params.push.apply(params,o.values);
					} else {
						params.push(filter.value);
					}
					sql += ' `'+filter.field+'` '+(filter.op||'=')+' '+placeholder;
					
				}
			});
		}
		
		if(data.sort && Object.keys(data.sort).length){
			var _sort = [];
			//error if invalid sortables
			_u.each(data.sort,function(field,descending){
				
				if(config.sortable && !config.sortable[field]){
					errors.push(new SQLUtilError(field+' is not a valid field to sort.'));
				} else {
					_sort.push('`'+field+'` '+(descending?'DESC':'ASC'));
				}
			});
			sql += ' order by '+_sort.join(',');
		}

		if(errors.length) {
			throw errors;
		}
		
		if(data.limit !== -1){
			//unless limit is -1 enforce limit
			params.push(+data.limit||50);
			sql += ' limit ?';
		}
		
		//if offset is not needed dont include it
		if(data.offset > 0) {
			params.push(+data.offset||0);
			sql +=' offset ?'
		}
		
		return {sql:sql,params:params};
	},
	SQLUtilError:SQLUtilError
};

function SQLUtilError(){Error.apply(this,arguments);this.message = arguments[0]}
SQLUtilError.prototype = new Error();