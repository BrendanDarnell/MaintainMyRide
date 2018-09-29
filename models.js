'use strict';

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	userName: {type: String, required: true},
	password: {type: String, required: true},
	vehicles: [vehicleSchema]
})

const vehicleSchema = mongoose.Schema({
	make: {type: String, required: true},
	model: {type: String, required: true}, 
	year: {type: Date, required: true},
	name: {type: String default: this.make},
	engine: {type: String}
})

const maintenanceSchema = mongoose.Schema({
	vehicleId: {type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle'},
	type: {type: String, required: true},
	mileage: {type: String, required: true},
	nextScheduled: {type: String},
	notes: {type: String},
	links: {type: String}
})