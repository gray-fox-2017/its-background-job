const User = require('../models/user')
const helpersCronJob = require('../helpers/cronJob').cronUser

module.exports = {
	insert : (req, res)=>{
		User.create({
			name : req.body.name,
			phone : req.body.phone,
			email : req.body.email
		})
		.then(response=>{
			helpersCronJob(response)
			res.send(response)
		})
		.catch(err=>{
			res.send(err)
		})
	},
	getAll : (req, res)=>{
		User.find({},(err, response)=>{
			if(err){
				res.send(err)
			}else{
				res.send(response)
			}
		})
	}
}