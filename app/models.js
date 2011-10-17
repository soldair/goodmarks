module.exports = {
	kids:function(){
		return {
			id:null
			,name:""
			,created:null
		}
	},
	parents:function(){
		return {
			id:null
			,name:""
			,email:null
			,password:null
			,created:null
		}
	},
	parentsToKids:function(){
		return {
			id:null
			,parents_id:null
			,kids_id:null
			,created:null
		}
	},
	jobs:function(){
		return {
			id:null
			,title:""
			,description:""
			,points:1
			,created:null
			,approved:0
			,parents_id:null // the parent who approved the job.
			,kids_id:null // the kid who created the job
			,public:1
		}
	}
	,marks:function(){
		return {
			id:null
			,good:1
			,jobs_id:null
			,kids_id:null
			,stickers_id:null
			,note:''
			,created:null
			,approved:-1
		}
	}
	,stickers:function(){
		return {
			id:null
			,file:null
			,public:1
			,kids_id:null
		}
	}
	,forkedJobs:function(){
		return {
			id:null
			,jobs_id:null
			,parent_jobs_id:null
			,created:null
		};
	}
}