var util = require('util')
,EventEmitter = require('events').EventEmitter
,valid = require(__dirname+'/../lib/validate.js')
,async = require('async');

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
				var validations = [];
				if(data.email) {
					validations.push(function(cb){valid.email(data.email,cb)});
				}
				if(data.name){
					validations.push(function(cb){valid.name(data.name,cb)});
				}
				if(data.password){
					validations.push(function(cb){valid.password(data.password,cb)});
				}

				async.parallel(validations,function(err,data){

					console.log(arguments);
					console.log(this);
					
					var doUpdate = function(){
						if(set.length){
							sql = "update users set `name`=? where id=?";
							this.db.query(sql,[(data.name||'').trim(),data.id],function(err,data){
								cb(err,true);
							});
						}
					}
				});
					
			} else {
				if(nameValid) {
					sql = "insert into kids(`name`) values('"+this.db.escape((data.name||'').trim())+"');";
					this.db.query(sql,function(err,data){
						cb(err,data.insertId);
					});
				} else {
					cb(new InsertError('name required'),false);
				}
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