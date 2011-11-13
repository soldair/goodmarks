module.exports = {
	ValidationError:ValidationError
	,setErrors:function(obj){
		Object.keys(obj).forEach(function(v,k){
			ValidationError.errors[v] = obj[v];
		});
	}
}

/**
 * core validation error class
 */
function ValidationError(key){
	this.code = key;
	this.message = ValidationError.getMessage(key);
	Error.call(this,[this.message]);
};

/**
 * instance members
 */
ValidationError.prototype = new Error();
// translate this error key to message, array of keys = array of messages; 
ValidationError.prototype.getMessage = function(lang){
	if(this.code instanceof Array){
		var messages = [];
		this.code.forEach(function(v,k){
			messages.push(ValidationError.getMessage(this.code,lang));
		});
		return messages;
	}
	
	return ValidationError.getMessage(this.code,lang);
}

/**
 * static/class member methods/vars
 */
//loads the error message
ValidationError.getMessage = function(key,lang){
	return (this.errors[key]||{})[lang||this.lang];
};
//default error language
ValidationError.lang = 'en';
ValidationError.errors = {};