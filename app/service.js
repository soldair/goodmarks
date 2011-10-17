
var api = {
	db:false,
	init:function(db){
		this.db = db;
	},
	get:{
		kid:function(data,cb){
			var sql = "select * from kids where id='"+parseInt(data.id)+"';";
		}
		,kids:function(data,cb){
			var sql = "select * from kids where ;";
		}
		,parent:function(data,cb){
			var sql = "select * from parents where id='"+parseInt(data.id)+"';";
		}
		,parents:function(data,cb){
			var sql = "select * from parents where ;";
		}
		,job:function(data,cb){
			var sql = "select * from jobs where id='"+parseInt(data.id)+"';";
		}
		,jobs:function(data,cb){
			var sql = "select * from jobs where ;";
		}
		,parentsToKid:function(data,cb){
			var sql = "select * from parents_to_kids where id='"+parseInt(data.id)+"';";
		}
		,parentsToKids:function(data,cb){
			var sql = "select * from parents_to_kids where ;";
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
		kid:function(data,cb){
			var sql
			,nameValid = (data.name && (data.name+'').trim().length);
			
			if(data.id) {
				if(nameValid){
					sql = "update kids set `name`='"+this.db.escape((data.name||'').trim())+"' where id='"+parseInt(data.id)+"'";
					this.db.query(sql,function(err,data){
						cb(err,true);
					});
				} else {
					cb(new UpdateError('name required'),false);
				}
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

module.exports = api;