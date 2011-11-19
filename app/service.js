var util = require('util')
,libPath = __dirname+'/../lib' 
,EventEmitter = require('events').EventEmitter
,valid = require(libPath+'/validate.js')
,sqlutil = require(libPath+'/sql.js')
,_u = require(libPath+'/_u.js')
,dbConstants=require('mysql/lib/constants');

function API(db){
	this.init(db);
}

API.prototype = {
	init:function(db){
		this.db = db;
		this.get = this.initGet(this);
		this.write = this.initWrite(this);
		this.delete = this.initDelete(this);
	},
	initGet:function(parent){
		return {
			_parent:parent
			,user:function(data,cb){
				var sql = "select u.*,group_concat(r.name) as roles from users u left join roles_names r on(u.perms & r.mask) where u.id=? group by u.id;"
				parent.db.query(sql,[data.id],function(err,data){
					if(err) {
						cb(err,data);
					} else {
						cb(err,data[0]);
					}
				});
			}
			,parents:function(data,cb){
				var sql = "select * from users u inner join parents_to_kids p on(p.parents_id=u.id) where p.kids_id=? order by p.id desc;";
				parent.db.query(sql,[data.id],cb);
			}
			,kids:function(data,cb){
				var sql = "select * from users u inner join parents_to_kids p on(p.kids_id=u.id) where p.parents_id=? order by p.id desc;";
				parent.db.query(sql,[data.id],cb);
			}
			,job:function(data,cb){
				var sql = "select * from jobs where id=?;";
				parent.db.query(sql,[data.id],cb);
			}
			,kidsJobs:function(data,cb){
				var params = [data.id]
				,sql = "select j.* from jobs j inner join parent_to_kids p on(p.parents_id=j.parents_id) where p.kids_id=?";
				if(data.approved) {
					params.push(data.approved?1:0);
					sql += " approved=?";
				}
				parent.db.query(sql,[data.id],cb);
			}
			,parentsToKids:function(data,cb){
				var obj;
				try{
					obj = sqlutil.select('parents_to_kids',data,{
						filterable:{
							id:true
							,parents_id:true
							,kids_id:true
						}
						,sortable:{
							created:true
						}
					});
				} catch (e){
					process.nextTick(function(){
						cb(e,null);
					});
					return;
				}
				
				parent.db.query(obj.sql,obj.params,cb);
			}
			,marks:function(data,cb){
				var obj;
				try{
					obj = sqlutil.select('marks',data,{
						filterable:{
							id:true
							,kids_id:true
							,jobs_id:true
							,created:true
							,good:true
							,approved:true
						}
						,sortable:{
							created:true
						}
					});
				} catch (e){
					process.nextTick(function(){
						cb(e,null);
					});
					return;
				}
				
				parent.db.query(obj.sql,obj.params,cb);;
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
			,rolesName:function(data,cb){
				var values = []
				,where='';
				
				if(data.id) {
					where ='`id`=?';
					values.push(data.id);
				}
				
				if(data.name){
					where = (where?where+' and ':'')+'`name`=?';
					values.push(data.name);
				}
				
				if(where == ''){
					cb(new SelectError('could not find valid fields to filter roles_names.'),null);
					return;
				}
				
				parent.db.query("select * from roles_names where "+where+" limit 1",values,function(err,data){
					if(!err){
						cb(null,data[0]);
					} else {
						cb(err,null);
					}
				});
			}
			,rolesNames:function(data,cb){
				var sql = "select * from roles_names";
				parent.db.query(sql,function(err,data){
					cb(err,data);
				});
			}
		};
	}
	,initWrite:function(parent){
		return {
			user:function(data,cb){
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
							if(validData.password) {
								validData.password = _u.encodePassword(validData.password);
							}
							
							var update = sqlutil.updateValues(data)
							,sql = "update users set "+update.set+" where id=?";
							update.values.push(+data.id);

							parent.db.query(sql,update.values,function(err,data){
								cb(err,data?validData.id:null);
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

						if(validData.password) {
							validData.password = _u.encodePassword(validData.password);
						}
						
						if(!errors){
							var vs = sqlutil.values(validData)
							,sql = "insert into users("+sqlutil.fields(validData)+") values("+vs.set+");";
							
							parent.db.query(sql,vs.values,function(err,data){
								//TODO handle duplicate key messaging etc.
								cb(err,data?data.insertId:data);
							});
						} else {
							//send errors to caller;
							cb(errors,null);
						}
					});
				}
			},
			grantUserRole:function(data,cb){

				valid.validate({
					id:data.id
					,role:{
						errors:{
							roleInvalid:{
								en:'the user role is invalid'
							}
						},
						valid:function fn(role,cb){
							if(role) {
								role = role+''.replace(/[^a-zA-Z]/g,'');

								parent.get.rolesName({name:role},function(error,data){
									if(!error){
										if(data.id){
											role = data.name
											cb(false,role);
											return;
										}
									}
									
									cb(new fn.ValidationError('roleInvalid'),null);
								});
							} else {
								cb(new fn.ValidationError('roleInvalid'),null);
							}
						},
						value:data.role
					}
				},function(errors,validData){
					var values = [validData.role,validData.id]
					,sql = "update users set perms=perms | (select mask from roles_names where name=?) where id=?;"
					
					parent.db.query(sql,values,function(err,data){
						cb(err,data);
					})
				});
			}
			,parentsToKids:function(data,cb){

				valid.validate({
					parents_id:{
						valid:'id'
						,value:data.parents_id
					}
					,kids_id:{
						valid:'id'
						,value:data.kids_id
					}
				},function(errors,validData){
					//has approved record in kid requests?

					//is a parent?: select * from users u inner join roles_names r on(r.name='parent' && u.perms & r.mask);
					//set parent: update users set perms=perms | (select mask from roles_names where name='parent') where id=10;
					//get all roles: select name from roles_names where (select perms from users where id=10) & mask;
					
					var vs = sqlutil.values(validData)
					,sql = "insert into parents_to_kids("+sqlutil.fields(validData)+") values("+vs.set+") on duplicate key update `id`=`id`;";
					
					parent.db.query(sql,function(err,data){
						cb(err,data?data.insertId:id);
					});
				});
			}
			,job:function(){
				/* 
				`title` varchar(150) NOT NULL,
				`description` text NOT NULL,
				`points` int(11) unsigned NOT NULL DEFAULT '1',
				`parents_id` int(11) unsigned DEFAULT NULL,
				`kids_id` int(11) unsigned DEFAULT NULL,
				`public` tinyint(1) unsigned NOT NULL DEFAULT '0',
				`approved` tinyint(1) unsigned NOT NULL DEFAULT '0',
				 */
				var sql,z=this;

				if(data.id) {

					var toValidate = {};
					if(data.points) toValidate.points = {valid:'id',value:data.points};
					if(data.parents_id) toValidate.parents_id = {valid:'id',value:data.parents_id};
					if(data.kids_id) toValidate.kids_id = {valid:'id',value:data.kids_id};
					if(data.description) toValidate.description = {valid:'text',value:data.description};
					
					if(_u.undef != data.public) toValidate.public = {valid:'intBool',value:data.public}; 
					if(_u.undef != data.approved) toValidate.approved = {valid:'intBool',value:data.approved};
					
					valid.validate(toValidate,function(errors,validData){
						delete validData.id;
						//data is cleaned and/or cast in validation
						if(!errors){
							//take all validated values from valid data 
							
							var update = sqlutil.updateValues(validData)
							,sql = "update users set "+update.set+" where id=?";
							update.values.push(+data.id);

							parent.db.query(sql,update.values,function(err,data){
								cb(err,data?validData.id:null);
							});
						} else {
							//send errors to caller;
							cb(errors,null);
						}
					});

				} else {
					throw "incomplete insert job";
					/*
					valid.validate({
						name:data.name
						,email:data.email
						,password:data.password
					},function(errors,validData){

						if(validData.password) {
							validData.password = _u.encodePassword(validData.password);
						}
						
						if(!errors){
							var vs = sqlutil.values(validData)
							,sql = "insert into users("+sqlutil.fields(validData)+") values("+vs.set+");";
							
							parent.db.query(sql,vs.values,function(err,data){
								//TODO handle duplicate key messaging etc.
								cb(err,data?data.insertId:data);
							});
						} else {
							//send errors to caller;
							cb(errors,null);
						}
					});*/
				}
				
			}
			,mark:function(){
				/*
				`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
				`good` tinyint(1) NOT NULL DEFAULT '1',
				`jobs_id` int(11) unsigned NOT NULL,
				`kids_id` int(11) unsigned NOT NULL,
				`stickers_id` int(11) unsigned DEFAULT NULL,
				`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				`approved` tinyint(1) NOT NULL DEFAULT '-1',
				`note` varchar(150) NOT NULL DEFAULT '',
				 */
			}
			,sticker:function(){
				/*
				`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
				`file` varchar(100) NOT NULL,
				`public` tinyint(1) unsigned NOT NULL,
				`kids_id` int(11) unsigned NOT NULL,
				*/
			}
			,forkedJob:function(){
				/*
				`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
				`jobs_id` int(11) unsigned NOT NULL,
				`parent_jobs_id` int(11) unsigned NOT NULL,
				`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				*/
			}
		};
	}
	,initDelete:function(parent){
		return {
			user:function(data,cb){
				valid.validate({id:data.id},function(errors,validData){
					var sql = "delete from users where id=?;"
					parent.db.query(sql,[validData.id],function(err,data){
						cb(err,data);
					});
				});
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
		};
	},
	end:function(){
		this.db.end();
		this.db = null;
	}
}

function UpdateError(){Error.call(this,arguments);}
UpdateError.prototype = new Error();

function InsertError(){Error.call(this,arguments);}
InsertError.prototype = new Error();

function SelectError(){Error.call(this,arguments);}
SelectError.prototype = new Error();

//TODO
function QueryProxy() {
  if (!(this instanceof Client) || arguments.length) {
    throw new Error('deprecated: use mysql.createClient() instead');
  }
  EventEmitter.call(this);
  
};
util.inherits(QueryProxy, EventEmitter);


module.exports = API;