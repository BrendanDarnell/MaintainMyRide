const express = require('express');

const router = express.Router();

const {Users} = require('./models');


router.post('/', (req, res) => {
	const requiredFields = ['firstName', 'lastName', 'username', 'password'];
	requiredFields.forEach(field => {
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).json({message});
		}	
	});

	const sizedFields = {
		username: {min: 3, max: 40},
		password: {min: 7, max: 40},
	};

	
	try {
		const tooSmall = Object.keys(sizedFields).forEach(field => {
			console.log(req.body[field].length < sizedFields[field].min);
			console.log(sizedFields[field].min);
			console.log(sizedFields.username.min);
			if (req.body[field].length < sizedFields[field].min) {
				return res.status(400).json({message: `${field} needs to be at least ${sizedFields[field].min} characters long`});
			}
		});

		const tooLarge = Object.keys(sizedFields).forEach(field => {
			if (req.body[field].length > sizedFields[field].max) {
				return res.status(400).json({message: `${field} needs to be less than ${sizedFields[field].max} characters long`});
			}
		});
	}

	
	catch (err) {
		console.log(err);
		res.status(500).json({message: 'Internal server error...'})
	}


	Users.find()
	.then(users => {
		users.forEach(user => {
			if (user.username === req.body.username) {
				// Promise.reject('User exists');
				return res.status(400).json({message: 'username already exists'});
				
			}
		})
	})
	.then(() => {
		return Users.create({
	 		firstName: req.body.firstName,
	 		lastName: req.body.lastName,
	 		username: req.body.username,
	 		password: req.body.password,
 		})
	})
	.then(user => res.status(201).json(user.serialize()))
	.catch(err=> {
    	console.error(err);
    	res.status(500).json({message: "Internal server error"})
 	});


 	// Users.create({
 	// 	firstName: req.body.firstName,
 	// 	lastName: req.body.lastName,
 	// 	username: req.body.username,
 	// 	password: req.body.password,
 	// })
 	// .then(user => res.status(201).json(user.serialize()))
 	// .catch(err => {
  //   	console.error(err);
  //     	res.status(500).json({ message: "Internal server error" });
  //   });
});


module.exports = router;