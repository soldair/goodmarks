var hashlib = require('hashlib')
,util = function(obj){
	if(!this._cpy) {
		var cpy = {}
		,z = this;
		this.each(this,function(k,v){
			cpy[k] = function(){
				var args = Array.prototype.slice.apply(arguments);
				args.unshift(obj);
				var r = v.apply(z,args);
				if(k.indexOf('is') == 0 || k.indexOf('get') == 0){
					return r;
				}
				return cpy;
			};
		});
		this._cpy = cpy;
	}
	return this._cpy;
};

util.isObject = function(o){
	return new Object(o) === o && !(o instanceof Array)
}

util.each = function(o,cb){
	if(this.isObject(o)) {
		for(var i=0,keys=Object.keys(o),j=keys.length;i<j;++i) cb(keys[i],o[keys[i]]);
	} else if(o instanceof Array){
		for(var i=0,j=o.length;i<j;++i) cb(i,o[i]);
	} else {
		return false;
	}
	return true;
}


util.values = function(o){
	var values = [];
	util.each(o,function(k,v){
		values.push(v);
	});
	return values;
};

util.encodePassword = function(password){
	var salt = (+(Math.random()+'').substr(4,7)).toString(32).substr(0,4);
	password = hashlib.sha1(password+":"+salt);
	return password+":"+salt;
};

util.comparePassword = function(password,hash){
	var parts = hash.split(':')
	,both = parts[0]
	,salt = parts[1]||'';

	return hashlib.sha1(password+":"+salt) == both;
};


module.exports = util;