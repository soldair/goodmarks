var util = require('util')
,libPath = __dirname+'/../lib' 
,EventEmitter = require('events').EventEmitter
,valid = require(libPath+'/validate.js')
,sqlutil = require(libPath+'/sql.js')
,_u = require(libPath+'/_u.js')
,dbConstants=require('mysql/lib/constants');

function API(db){
	this.init();
}

API.prototype = {
	init:function(db){
		this.db = db;
		this.get.db = db;
		this.write.db = db;
	},
	
	get:{
		db:false
		,user:function(data,cb){
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
		db:false
		,user:function(data,cb){
			var sql,z=this;

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
						
						z.db.query(sql,update.values,function(err,data){
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
					
					var vs = sqlutil.values(validData)
					,sql = "insert into users("+sqlutil.fields(validData)+") values("+vs.set+");";
					
					z.db.query(sql,vs.values,function(err,data){
						console.log('query came back',data,err);
						//TODO handle duplicate key messaging etc.
						cb(err,data?data.insertId:data);
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
		db:false
		,kid:function(data,cb){

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
	},
	end:function(){
		this.db.end();
		this.db = null;
		this.get.db = null
		this.write.db = null
		this.delete.db = null
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


module.exports = API;