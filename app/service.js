var util = require('util')
,libPath = __dirname+'/../lib' 
,EventEmitter = require('events').EventEmitter
,valid = require(libPath+'/validate.js')
,sqlutil = require(libPath+'/sql.js')
,_u = require(libPath+'/util.js');

var api = {
	db:false,
	init:function(db){
		this.db = db;
	},
	get:{
		user:function(data,cb){
			var sql = "select * from users where id=?';"
			this.db.query(sql,[data.id],cb);
		}
		,parents:function(data,cb){
			var sql = "select * from users u inner join parents_to_kids p on(p.parents_id=u.id) where p.kids_id=?;";
			this.db.query(sql,[data.id],cb);
		}
		,kids:function(data,cb){
			var sql = "select * from users u inner join parents_to_kids p on(p.kids_id=u.id) where p.parents_id=?;";
			this.db.query(sql,[data.id],cb);
		}
		,job:function(data,cb){
			var sql = "select * from jobs where id=?;";
			this.db.query(sql,[data.id],cb);
		}
		,kidsJobs:function(data,cb){
			var params = [data.id]
			,sql = "select j.* from jobs j inner join parent_to_kids p on(p.parents_id=j.parents_id) where p.kids_id=?";
			if(data.approved) {
				params.push(data.approved?1:0);
				sql += " approved=?";
			}
			this.db.query(sql,[data.id],cb);
			
		}
		,parentsToKid:function(data,cb){
			var sql = "select * from parents_to_kids where id='"+parseInt(data.id)+"';";
		}
		,parentsToKids:function(data,cb){
			var field = data.field||'parents_id'
			,id = parseInt(data.id)
			,sql = "select * from parents_to_kids where "+field+";";
		}
		,mark:function(data,cb){
			var sql = "select * from marks where id='"+parseInt(data.id)+"';";
		}
		,marks:function(data,cb){
			var sql = "select * from marks where ;";
		}
		,sticker:function(data,cb){
			var sql = "select * from sticker where id='"+parseInt(data.id)+"';";
		}
		,stickers:function(data,cb){
			var sql = "select * from stickers where ;";
		}
		,forkedJob:function(data,cb){
			var sql = "select * from forked_jobs where id='"+parseInt(data.id)+"';";
		}
		,forkedJobs:function(data,cb){
			var sql = "select * from forked_jobs where ;";
		}
	}
	,write:{
		user:function(data,cb){
			var sql;

			if(data.id) {

				var toValidate = {};
				if(data.password) toValidate.password = data.password;
				if(data.name) toValidate.name = data.name;
				if(data.email) toValidate.email = data.email;

				valid.validate(toValidate,function(errors,validData){
					delete validData.id;
					//data is cleaned and/or cast in validation
					if(!errors){
						if(validData.assword) {
							validData.password = _u.encodePassword(validData.password);
						}
						
						var update = sqlutil.updateValues(data)
						,sql = "update users set "+update.set+" where id=?";
						update.values.push(+data.id);
						
						this.db.query(sql,update.values,function(err,data){
							cb(err,true);
						});
					} else {
						//send errors to caller;
						cb(errors,null);
					}
				});


			} else {

				valid.validate({
					name:data.name
					,email:data.email
					,password:data.password
				},function(errors,validData){
					var vs = sqlutil.values(validData);
					sql = "insert into users("+sqlutil.fields(validData)+") values("+vs.set+");";
					this.db.query(sql,vs.values,function(err,data){
						//TODO handle duplicate key messaging etc.
						cb(err,data.insertId);
					});
				});
			}
		}
		,parent:function(){
			
		}
		,job:function(){
			//mask
		}
		,parentsToKid:function(){
			
		}
		,mark:function(){
			
		}
		,sticker:function(){
			
		}
		,forkedJob:function(){
			
		}
	}
	,delete:{
		kid:function(data,cb){

		}
		,parent:function(){
			
		}
		,job:function(){
			
		}
		,parentsToKid:function(){
			
		}
		,mark:function(){
			
		}
		,sticker:function(){
			
		}
		,forkedJob:function(){
			
		}
	}
}

function UpdateError(){Error.call(this,arguments);}
UpdateError.prototype = new Error();

function InsertError(){Error.call(this,arguments);}
InsertError.prototype = new Error();

//TODO
function QueryProxy() {
  if (!(this instanceof Client) || arguments.length) {
    throw new Error('deprecated: use mysql.createClient() instead');
  }
  EventEmitter.call(this);
  
};
util.inherits(QueryProxy, EventEmitter);


module.exports = api;