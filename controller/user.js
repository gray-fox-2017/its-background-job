const user = require('../models/users');
const cronJob = require('../helper/cronJob').cronUser;


function createData(req, res, next){
	console.log(req.body)
	user.create({
		name: req.body.name,
		username: req.body.username,
		password: req.body.password,
		email: req.body.email
	}, (err, response)=>{
		if(!err){
			res.send(response)
		} else {
			res.send(err)
		}
	})
	// .then((response)=>{
	// 	console.log(cronJob(response))
	// 	console.log("ini punya controller", response)
	// 	cronJob(response)
	// 	res.send(response)
	// })
	// .catch((err)=>{
	// 	res.send(err)
	// })
};


function getAllData(req, res, next){
	user.find({}, (err, result)=>{
		if(err){
			res.send(err)
		} else {
			res.send(result)
		}
	})
};

function getOneData(req, res, next){
	user.findById(req.params.id, (err, result)=>{
		if(err){
			res.send(err)
		} else {
			res.send(result);
		}
	})
};

module.exports = {
	createData,
	getAllData,
	getOneData
}