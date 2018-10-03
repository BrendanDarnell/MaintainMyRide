'use strict';

const mongoose = require("mongoose");

const vehiclesSchema = mongoose.Schema({
	make: {type: String, required: true},
	model: {type: String, required: true}, 
	year: {type: Date, required: true},
	name: {type: String, default: this.model},
	engine: {type: String},
});

const usersSchema = mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	username: {type: String, required: true},
	password: {type: String, required: true},
	vehicles: [vehiclesSchema],
});

const maintenanceSchema = mongoose.Schema({
	vehicleId: {type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle'},
	type: {type: String, required: true},
	mileage: {type: String, required: true},
	nextScheduled: {type: String},
	notes: {type: String},
	links: {type: String},
});

usersSchema.virtual('fullName').get(function() {
 	return `${this.firstName} ${this.lastName}`
});

usersSchema.methods.serialize = function() {
	return {
		name: this.fullName,
		userName: this.username,
		vehicles: this.vehicles
	}
}

const Users = mongoose.model('Users', usersSchema);

const Vehicles = mongoose.model('Vehicles', vehiclesSchema);

const Maintenance = mongoose.model('Maintenance', maintenanceSchema)

module.exports = {Users, Vehicles, Maintenance}