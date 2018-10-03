'use strict';

const SIGNUP_URL = '/signup'


function postNewUser() {
	let newUser = {
		firstName: 'Brendan',
		lastName: 'Darnell',
		username: 'Kayla',
		password: 'password',
	}
	
	return $.ajax({
		url: SIGNUP_URL,
		type: 'POST',
		data: JSON.stringify(newUser),
		contentType: 'application/json',
		dataType: 'json',
	})
	.fail(()=> console.log('failed to create user'));
}

function handleNewUserSubmit() {
	$('button').on('click', (event) => {
		event.preventDefault();
		console.log('post request for new user');
	postNewUser()
		.then(user => console.log(user));
	})
}


$(handleNewUserSubmit);