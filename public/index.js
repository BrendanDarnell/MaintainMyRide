'use strict';

function getSignupData() {
	return {
		firstName: $('[name="signup-firstname"]').val(),
		lastName: $('[name="signup-lastname"]').val(),
		username: $('[name="signup-username"]').val(),
		password: $('[name="signup-password"]').val(),
	}
}


function getLoginData() {
	return {
		username: $('[name="login-username"]').val(),
		password: $('[name="login-password"]').val(),
	}
}


function postNewUser() {
	let newUser = getSignupData();
	
	return $.ajax({
		url: '/signup',
		type: 'POST',
		data: JSON.stringify(newUser),
		contentType: 'application/json',
		dataType: 'json',
	})
	.fail(()=> console.log('failed to create user'));
}


function loginUser() {
	let existingUser = getLoginData();
	
	return $.ajax({
		url: '/login',
		type: 'POST',
		data: JSON.stringify(existingUser),
		contentType: 'application/json',
		dataType: 'json',
	})
	.fail(()=> console.log('failed to login'));
}


function renderUserData(user) {
	console.log(user);
	$('.user').empty();
	$('.user').append(
		`<h2 class="username">${user.username}</h2>
		<button type="button" class="add-vehicle-button">Add Vehicle</button>
		<form class="add-vehicle" aria-live="assertive" hidden>
			<label for="year">Year</label>
			<input type="text" name="year">
			
			<label for="make">Make</label>
			<input type="text" name="make">
			
			<label for="model">Model</label>
			<input type="text" name="model">
			
			<label for="name">Name</label>
			<input type="text" name="name">
			
			<label for="engine">Engine</label>
			<input type="text" name="engine">
			<button type="submit" class="submit-vehicle-button">Submit</button>
		</form>`);

	user.vehicles.forEach(vehicle => {
		let vehicleInfo = '';
		if(vehicle.name === vehicle.model) {
			delete vehicle.name;
		}
		Object.keys(vehicle).forEach(field => {
			if(vehicle[field] && field !== "_id") {
				vehicleInfo += vehicle[field] + " ";
			}
		});
		$('.user').append(`<h3 class="vehicle">${vehicleInfo}</h3>` )
	});
}


function getNewVehicle() {
	return {
		username: $('.username').text(),
		name: $('[name="name"]').val(),
		year: $('[name="year"]').val(),
		make: $('[name="make"]').val(),
		model: $('[name="model"]').val(),
		engine: $('[name="engine"]').val(),
	}
}


function addVehicle() {
	let newVehicle = getNewVehicle();
	
	if(!newVehicle.name) {
		delete newVehicle.name;
	}
	
	return $.ajax({
		url: 'users/vehicle/add',
		type: 'POST',
		data: JSON.stringify(newVehicle),
		contentType: 'application/json',
		dataType: 'json',
	})
	.fail(()=> console.log('failed to add new vehicle'));
}


function getMaintenance() {
	let vehicle = $(event.target).text();
	console.log(vehicle);

}


function handleEvents() {
	// submit data to create a new user
	$('.signup-button').on('click', (event) => {
		event.preventDefault();
		event.stopPropagation();
		$('.signup').prop('hidden', true);
		$('.user').prop('hidden', false);
		console.log('post request for new user');
		postNewUser()
			.then(renderUserData);
	});

	// submit data to login existing users
	$('.login-button').on('click', (event) => {
		event.preventDefault();
		event.stopPropagation();
		$('.login').prop('hidden', true);
		$('.user').prop('hidden', false);
		console.log('post request for login');
		loginUser()
			.then(renderUserData);
	});
	
	// redirect to new user signup
	$('.redirect-button').on('click', (event) => {
		event.preventDefault();
		event.stopPropagation();
		console.log('redirect to user signup');
		$('.login').prop('hidden', true);
		$('.signup').prop('hidden', false);
	});

	// show form to add new vehicle
	$('.user').on('click', '.add-vehicle-button', (event) => {
		event.preventDefault();
		event.stopPropagation();
		$('.add-vehicle').prop('hidden', false);
	});

	//add new vehicle to user account
	$('.user').on('click', '.submit-vehicle-button', (event) => {
		event.preventDefault();
		event.stopPropagation();
		console.log('adding new vehicle');
		addVehicle()
			.then(renderUserData);
		$('.add-vehicle').prop('hidden', true);
	});

	//show maintenance logs for selected vehicle
	$('.user').on('click', '.vehicle', (event) => {
		event.preventDefault();
		event.stopPropagation();
		getMaintenance(event);
	});
}


$(handleEvents);