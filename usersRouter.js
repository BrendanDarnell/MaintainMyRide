const express = require('express');

const router = express.Router();

const {Users, Vehicles, Maintenance} = require('./models');


router.post('/', (req,res) => {
	const requiredFields = ['username', 'make', 'model', 'year'];
	requiredFields.forEach((field) => {
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).json({message});
		}	
	});

	if (!(typeof req.body.year === 'number' || req.body.year.toString().length === 4)) {
		const message = `Year must be a 4-digit number`;
		console.error(message);
		return res.status(400).json({message});
	}

	let user;

	Users.findOne({username: req.body.username})
	.then(_user => {
		user = _user;
		console.log(user);
		if (user.vehicles) {
			user.vehicles.find((vehicle) => {
				return user[vehicle].name === req.body.name;
			})
		}
	})
	.then(vehicle => {
		if (vehicle) {
			return res.status(400).json({message: 'vehicle already exists'});
		}
		else {
			user.vehicles.push(req.body);
			return res.status(201).json(user.serialize())
		}
	})
	.catch(err=> {
    	console.error(err);
    	res.status(500).json({message: "Internal server error"})
    })
})
	


module.exports = router;
