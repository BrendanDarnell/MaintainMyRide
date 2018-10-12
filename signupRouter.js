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
		password: {min: 8, max: 40},
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


	Users.findOne({username: req.body.username})

	// .count()
	// .then(count => {
	// 	console.log(count);
	// 	if (count > 0) {
	// 		return Promise.reject({
	//         	code: 422,
	//           	reason: 'ValidationError',
	//           	message: 'Username already taken',
	//           	location: 'username'
 //       		});
	// 	}
	// })
	


	.then(user => {
		// users.forEach(user => {
		if (user) { 
			if (user.username === req.body.username) {
				console.log('user exists');
				res.status(400).json({message: 'username already exists'});
				return Promise.reject('User exists');		
			}
		}
		// })
	})
	.then(() => {
		console.log('creating new user')
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

});


module.exports = router;