module.exports = {
	name:function(name){
		return (name+'').trim().length > 0;
	}
	,email:function(email){
		return this.isRFC822ValidEmail(email+='') && email.split('@')[1].indexOf('.') > -1;
	}
	,password:function(pass){
		return (pass+='').length > 5;
	}
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
	,isRFC822ValidEmail:function(sEmail) {

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
	,ValidationError:ValidationError
}

function ValidationError(){Error.call(this,arguments);}
ValidationError.prototype = new Error();
