'use strict';

const chai = require('chai');

const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;

const faker = require('faker');

const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');

const {TEST_DATABASE_URL} = require('../config');

const {Users} = require('../models');


function generateUserData() {
	return {
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		username: faker.internet.userName(),
		password: faker.internet.password()
	}
}


function seedUserData() {
  console.info('seeding user data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateUserData());
  }
  
  return Users.insertMany(seedData);
}


function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}


describe('POST requests to /login', function(){

	let existingUser;

	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
    	return seedUserData() 
			.then(users => {
				existingUser = users[0];
				console.log(existingUser);
				return existingUser;
			});
  	});

  	afterEach(function() {
    	return tearDownDb();
  	});

	after(function(){
		return closeServer();
	});

	it('Should login existing users on POST requests', function(){
		// console.log(existingUser);
		return chai.request(app)
			.post('/login')
			.send({username: existingUser.username, password: existingUser.password})
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
		        expect(res.body).to.include.keys('name','username','vehicles')
		        expect(res.body.username).to.equal(existingUser.username);
		        expect(res.body.vehicles).to.be.an('array');
		        expect(res.body.vehicles).to.have.lengthOf(existingUser.vehicles.length);
		    })
		
			 //        return Users.findOne({username: newUser.username})
				// });
				// .then(function(user) {
				// 	console.log(user);
				// 	expect(user.username).to.equal(newUser.username);
				// 	expect(user.firstName).to.equal(newUser.firstName);
				// 	expect(user.lastName).to.equal(newUser.lastName);
				// 	expect(user.password).to.equal(newUser.password);
				// 	expect(user._id).to.not.be.empty;
				// })
	// 	});
	});

	it('Should reject login requests without credentials', function() {
		return chai.request(app)
			.post('/login')
			.send({})
			.then(function(res) {
				expect(res).to.have.status(400);
			})
	});

	it('Should reject login requests without invalid credentials', function() {
		return chai.request(app)
			.post('/login')
			.send({username: "fakeUsername", password: "fakePassword"})
			.then(function(res) {
				expect(res).to.have.status(400);
			})
	});




});