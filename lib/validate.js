var ve = require('./validationerror.js')
,_u = require('./_u.js')
,ValidationError = ve.ValidationError;

module.exports = {
	id:function(id,cb){
		process.nextTick(function(){
			var error;

			if(!id || isNaN(+id)) error = 'idInvalid';
			id  = +id;
			
			cb(error?new ValidationError(error):error,id,'name');
		});
	}
	,name:function(name,cb){
		process.nextTick(function(){
			var error;
			if(!name || (name+='').trim().length == 0) error = 'nameEmpty';
			
			cb(error?new ValidationError(error):error,(name||'').trim(),'name');
		});
	}
	,email:function(email,cb){
		email  = email?(email+'').trim():email;
		process.nextTick(function(){
			var error;
			if(!email || !email.length) error = 'emailEmpty';
			else if(!isRFC822ValidEmail(email)) error = 'emailInvalid';
			else if(email.split('@')[1].indexOf('.') == -1) error = 'emailTLD'; 
				
			cb(error?new ValidationError(error):error,email,'email');
		});
	}
	,password:function(pass,cb){
		var self = this;
		process.nextTick(function(){
			var error;
			if(!pass || !(pass+='').length) error = 'passwordEmpty';
			else if(pass.length < 6) error = 'passwordShort';

			cb(error?new ValidationError(error):error,pass,'password');
		});
	}
	,intBool:function(i,cb){
		var self = this;
		process.nextTick(function(){
			i = +i;
			var error;
			
			if(isNaN(i)) error = 'mustBeNumber';

			i = i?1:0
			
			cb(error?new ValidationError(error):error,i,'intBool');
		});
	}
	,text:function(text,cb){
		var self = this;
		process.nextTick(function(){
			var error;
			if(_u.undef === text) error = 'mustBeText';
			if(_u.isObject(text)) error = 'mustBeText';
			if(text instanceof Array) error = 'mustBeText';
				 
			cb(error?new ValidationError(error):error,text+'','text');
		});
	}
	,notEmptyText:function(text,cb){
		var self = this;
		
		self.text(text,function(error,v){
			if(error){
				cb(error,null);
			} else if(!v.length) {
				cb(new ValidationError('notEmptyText'),v);
				return;
			}
			cb(null,v);
		});
	}
	,ValidationError:ValidationError
	,setValidationErrors:function(obj){
		ve.setErrors(obj);
	}
	,validate:function(obj,cb){
		var counter = 0,error={},results={},i,z=this;
		var parallel = function(k,err,data){
			counter--;
			results[k] = data;
			if(err) error[k] = err;
			if(!counter) {
				if(Object.keys(error).length == 0) error = null;
				cb(error,results);
			}
		}
		
		_u.each(obj,function(k,v){
			counter++;
			if(_u.isObject(v)) {
				if(v.errors){
					ve.setErrors(v.errors);
				}
				
				if(typeof v.valid == 'function') {
					//helper handle to ve object
					v.valid.ValidationError = ValidationError;
					v.valid(v.value,function(err,data){
						parallel(k,err,data);
					});
				} else if(z[v.valid]){
					z[v.valid](v.value,function(err,data){
						parallel(k,err,data);
					});
				}
			} else if(!z[k]) {
				parallel(k,new ValidationError('invalidMethod'),null);
			} else {
				z[k](v,function(err,data){
					parallel(k,err,data);
				});
			}
				
		});
	}
};

ve.setErrors({
	idInvalid:{
		en:'id is invalid'
	}
	,passwordEmpty:{
		en:'password may not be empty'
	}
	,passwordShort:{
		en:'password must be at least 6 characters'
	}
	,emailEmpty:{
		en:'email may not be empty'
	}
	,emailInvalid:{
		en:'email is invalid'
	}
	,emailTLD:{
		en:'email must be issued from a known domain'
	}
	,nameEmpty:{
		en:'name may not be empty'
	}
	,mustBeNumber:{
		en:'number required'
	}
	,mustBeText:{
		en:'must be text'
	}
	,invalidMethod:{
		en:'invalid validation method'
	}
	,notEmptyText:{
		en:'cannot be empty'
	}
});


/**
* JavaScript function to check an email address conforms to RFC822 (http://www.ietf.org/rfc/rfc0822.txt)
*
* Version: 0.2
* Author: Ross Kendall
* Created: 2006-12-16
* Updated: 2007-03-22
*
* Based on the PHP code by Cal Henderson
* http://iamcal.com/publish/articles/php/parsing_email/
*
* downloaded from:
* http://rosskendall.com/files/rfc822validemail.js.txt
*
* (Licensed under a Creative Commons Attribution-ShareAlike 2.5 License, or the GPL)
*
*/
function isRFC822ValidEmail(sEmail) {

	var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]'
	,sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]'
	,sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+'
	,sQuotedPair = '\\x5c[\\x00-\\x7f]'
	,sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d'
	,sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22'
	,sDomain_ref = sAtom
	,sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')'
	,sWord = '(' + sAtom + '|' + sQuotedString + ')'
	,sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*'
	,sLocalPart = sWord + '(\\x2e' + sWord + ')*'
	,sAddrSpec = sLocalPart + '\\x40' + sDomain // complete RFC822 email address spec
	,sValidEmail = '^' + sAddrSpec + '$' // as whole string
	,reValidEmail = new RegExp(sValidEmail);

	if (reValidEmail.test(sEmail)) {
		return true;
	}

	return false;
}

