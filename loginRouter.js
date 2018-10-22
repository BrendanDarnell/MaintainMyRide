const express = require('express');

const router = express.Router();

const {Users} = require('./models');


router.post('/', (req, res) => {
	const requiredFields = ['username', 'password'];
	requiredFields.forEach(field => {
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).json({message});
		}	
	});

	Users.findOne({username: req.body.username})
	.then(user => {	
		if (!user) { 
			console.log('username does not exist');
			res.status(400).json({message: 'username does not exist'});
			return Promise.reject('username does not exist');		
		}
		else if (user.password !== req.body.password) {
			res.status(400).json({message: 'wrong password'});
			return Promise.reject('wrong password');
		}
		else if (user.password === req.body.password) {
			return res.status(200).json(user.serialize());			
		}
		else {
			res.status(400).json({message: 'could not login'});
			return Promise.reject('could not login');			
		}
	})
	.catch(err=> {
    	console.error(err);
    	res.status(500).json({message: "Internal server error"})
 	});

});


module.exports = router;