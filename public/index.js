'use strict';

let maintenanceForm = 
	`<form class="add-maint" aria-live="assertive" hidden>
		<label for="type">Type</label>
		<input type="text" name="type">
		
		<label for="mileage">Mileage</label>
		<input type="text" name="mileage">

		<label for="date">Date</label>
		<input type="text" name="date">
			
		<label for="nextScheduled">Next Scheduled Maintenance</label>
		<input type="text" name="nextScheduled">

		<label for="notes">Notes</label>
		<input type="text" name="notes">
			
		<label for="links">Links</label>
		<input type="text" name="links">
		<button type="submit" class="submit-maint-button">Submit</button>
	</form>`;


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


function signupUser() {
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
		<span class="vehicle-error"></span>	
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
		</form>`
	);
	
	user.vehicles.forEach(vehicle => {
		let vehicleInfo = '';

		$('.user').append(`<div name=${vehicle.name}></div>`);
		$(`[name= ${vehicle.name}]`).append(`<h3 class="vehicle-name">${vehicle.name}</h3>`);
		let vehicleName = vehicle.name;	
		delete vehicle.name;
		
		Object.keys(vehicle).forEach(field => {
			if(vehicle[field] && field !== "_id") {
				vehicleInfo += vehicle[field] + " ";
			}
		});
		$(`[name= ${vehicleName}]`).append(`<h4 class="vehicle">${vehicleInfo}</h4>` )
	});
}


function getVehicleData() {
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
	let newVehicle = getVehicleData();

	$('.vehicle-error').text("");
	
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
	.fail(function(jqXHR) {
		$('.vehicle-error').text(jqXHR.responseJSON.message)
	});
}


function getMaintenance(vehicleName) {
	let reqData = {
		username: $('.username').text(),
		vehicleName: vehicleName
	}

	return $.ajax({
		url: 'users/maintenance',
		type: 'POST',
		data: JSON.stringify(reqData),
		contentType: 'application/json',
		dataType: 'json',
	})
	.fail(()=> console.log('failed to get maintenace logs'));
}


function renderMaintenace(logs) {
	let vehicleName = logs[0].vehicleName;

	logs.sort((a,b) => {
		return Number(b.mileage.replace(/,/g,"")) - Number(a.mileage.replace(/,/g,""));
	});

	
	$(`[name=${vehicleName}] > ul`).remove();
	$(`[name=${vehicleName}] > button`).remove();
	$(`[name=${vehicleName}] > form`).remove();
	
	$(`[name = ${vehicleName}]`).append(`<button type="button" class="add-maint-button">Add Maintenance</button>`);
	$(`[name = ${vehicleName}]`).append(maintenanceForm);
		
	logs.map((log, index) => {
		$(`[name = ${vehicleName}]`).append(`<button class="update-maint-button" name="update-${log._id}">Update</button>`);
		$(`[name = ${vehicleName}]`).append(`<button class="delete-maint-button" name="delete-${log._id}">Delete</button>`);
		$(`[name = ${vehicleName}]`).append(`<ul name="${vehicleName}-${index}" id="${log._id}"></ul>`);
		let displayFields = ["date", "mileage", "type", "notes", "links", "nextScheduled"];
		displayFields.forEach(field => {
			if(field in log) {
				$(`[name=${vehicleName}-${index}]`).append(`<li>${field}: ${log[field]}</li>`)
			}
		});
	});
}


function toggleMaintenance() {
	let vehicleName = $(event.target).text();
	let existingLogs = $(`[name=${vehicleName}] > ul`).text();
	if(existingLogs) {
		$(`[name=${vehicleName}] > ul, [name=${vehicleName}] > .add-maint-button, 
			[name=${vehicleName}] > .delete-maint-button, [name=${vehicleName}] > .update-maint-button`).toggle();
	}
	else {
		getMaintenance(vehicleName)
			.then((logs) => {
				if(logs.length > 0) {
					renderMaintenace(logs);		
				}
				else{
					$(`[name=${vehicleName}] > button`).remove();
					$(`[name=${vehicleName}] > form`).remove();
					$(`[name = ${vehicleName}]`).append(`<button type="button" class="add-maint-button">Add Maintenance</button>`);
					$(`[name = ${vehicleName}]`).append(maintenanceForm);
				}
			});
	}			
}


function newMaintData(vehicleName) { 
	return {
		username: $('.username').text(),
		vehicleName: vehicleName,
		type: $('[name="type"]').val(),
		mileage: $('[name="mileage"]').val(),
		date: $('[name="date"]').val(),
		nextScheduled: $('[name="nextScheduled"]').val(),
		notes: $('[name="notes"]').val(),
		links: $('[name="links"]').val(),
	}
}


function addMaint(vehicleName) {
	let newMaint = newMaintData(vehicleName);
	console.log(newMaint);
	return $.ajax({
		url: 'users/maintenance/add',
		type: 'POST',
		data: JSON.stringify(newMaint),
		contentType: 'application/json',
		dataType: 'json',
	})
	.fail(()=> console.log('failed to add new maintenance'));	
}


function getMaintUpdate(maintId) {
	let updateValues = { 
		_id: maintId,
		type: $('[name="type"]').val(),
		mileage: $('[name="mileage"]').val(),
		date: $('[name="date"]').val(),
		nextScheduled: $('[name="nextScheduled"]').val(),
		notes: $('[name="notes"]').val(),
		links: $('[name="links"]').val(),
	}

	Object.keys(updateValues).forEach(key => {
		if(!updateValues[key]) {
			delete updateValues[key];
		}
	});
	return updateValues;
}


function updateMaint(maintId) {
	let updatedMaint = getMaintUpdate(maintId);
	console.log(updatedMaint);
	return $.ajax({
		url: 'users/maintenance/update',
		type: 'PUT',
		data: JSON.stringify(updatedMaint),
		contentType: 'application/json',
		dataType: 'json',
	})
	.fail(()=> console.log('failed to update maintenance'));	
}


function deleteMaint(maintId) {
	return $.ajax({
		url: 'users/maintenance/delete',
		type: 'DELETE',
		data: `{"_id": "${maintId}"}`,
		contentType: 'application/json',
		dataType: 'json',
	})
	.fail(()=> console.log('failed to update maintenance'));
}


function handleEvents() {
	// submit data to create a new user
	$('.signup-button').on('click', (event) => {
		event.preventDefault();
		event.stopPropagation();
		$('.signup').prop('hidden', true);
		$('.user').prop('hidden', false);
		console.log('post request for new user');
		signupUser()
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

	//toggle maintenance logs for selected vehicle
	$('.user').on('click', '.vehicle-name', (event) => {
		event.preventDefault();
		event.stopPropagation();
		toggleMaintenance();	
	});

	//show form to add new log
	$('.user').on('click', '.add-maint-button', (event) => {
		event.preventDefault();
		event.stopPropagation();
		$('.add-maint').prop('hidden', false);
	});

	//add new log to vehicle
	$('.user').on('click', '.submit-maint-button', (event) => {
		event.preventDefault();
		event.stopPropagation();
		console.log('adding new log');
		let vehicleName = $(event.currentTarget).closest('div').attr('name');
		addMaint(vehicleName)
			// .then(maint=>console.log(maint))
			.then(renderMaintenace);
		$('.add-maint').prop('hidden', true);
	});

	//show form to update existing log
	$('.user').on('click', '.update-maint-button', (event) => {
		event.preventDefault();
		event.stopPropagation();
		let maintId = $(event.target).prop("name");
		maintId = maintId.split('-');
		maintId = maintId[1];
		$('.add-maint').prop('hidden', false);
		$('.submit-maint-button').removeClass('submit-maint-button').addClass('submit-update-button').
			attr('name', `${maintId}`);
	});		
		
	//update an existing user log
	$('.user').on('click', '.submit-update-button', (event) => {
		event.preventDefault();
		event.stopPropagation();
		let maintId = $(event.target).prop("name");
		updateMaint(maintId)
			.then(renderMaintenace);
	});

	//delete an existing user log
	$('.user').on('click', '.delete-maint-button', (event) => {
		event.preventDefault();
		event.stopPropagation();
		let maintId = $(event.target).prop('name');
		maintId = maintId.split('-');
		maintId = maintId[1];
		console.log(maintId);
		deleteMaint(maintId)
			.then(() => {
				$(`[id = ${maintId}]`).remove();
				$(`[name = update-${maintId}]`).remove();
				$(`[name = delete-${maintId}]`).remove();
			});
	});

}


$(handleEvents);