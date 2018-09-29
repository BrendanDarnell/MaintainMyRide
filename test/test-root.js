'use strict';

const chai = require('chai');

const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;

const {app, runServer, closeServer} = require('../server');

const {TEST_DATABASE_URL} = require('../config');



describe('Requests to root directory', function(){

	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	after(function(){
		return closeServer();
	});

	it('Should serve static files on GET requests', function(){

		return chai.request(app)
			.get('/')
			.then(function(res){
				expect(res).to.have.status(200);
			});
	})
})