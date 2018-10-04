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
		let vehicle;
		if (user.vehicles) {
			vehicle = user.vehicles.find((vehicle) => {
				console.log(vehicle.name);
				console.log(req.body.name);
				return vehicle.name === req.body.name;
			})
		}
		return vehicle;
	})
	.then(vehicle => {
		console.log(vehicle);
		if (vehicle) {
			return res.status(400).json({message: 'vehicle already exists'});
		}
		else {
			user.vehicles.push(req.body);
			user.save();
			return res.status(201).json(user.serialize());
		}
	})
	.catch(err=> {
    	console.error(err);
    	res.status(500).json({message: "Internal server error"});
    });
});


router.post('/:vehicleId', (req,res) => {
	const requiredFields = ['username','vehicleId', 'type', 'mileage'];
	requiredFields.forEach((field) => {
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).json({message});
		}	
	});

	if (!(req.params.vehicleId && req.params.vehicleId === req.body.vehicleId)) {
	    const message =
		    `Request path id (${req.params.id}) and request body id ` +
		    `(${req.body.id}) must match`;
		console.error(message);
		return res.status(400).json({ message: message });
    }

    Users.findOne({username: req.body.username})
    .then(user => {
    	let vehicle = user.vehicles.find((vehicle) => {
    		console.log(vehicle._id);
    		console.log(req.body.vehicleId);
    		return vehicle._id == req.body.vehicleId;
    	});
    	console.log(vehicle);
    	return vehicle;
    })
    .then(vehicle => {
    	if (vehicle) {
    		Maintenance.create(req.body);
    	}
    	else {
    		Promise.reject('Could not find vehicle')
    	}
    })
    .catch(err=> {
    	console.error(err);
    	res.status(500).json({message: "Internal server error"});
    });
});
	


module.exports = router;
