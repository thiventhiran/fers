var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var jsonwebtoken = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var mongooseHistory = require('mongoose-history');
// var patchHistory = require('mongoose-patch-history');

var UserSchema = new mongoose.Schema({

	email: {
		type: String,
		lowercase: true,
		unique: true,
		trim: true,
		required: [
			true, "can't be blank"
		],
		match: [
			/\S+@\S+\.\S+/, 'is invalid'
		],
		index: true
	},
	password: {
		type: String,
		required: [
			true, "can't be blank"
		]
	},
	firstName: {
		type: String,
		required: [
			true, "can't be blank"
		]
	},
	lastName: {
		type: String,
		required: [
			true, "can't be blank"
		]
	},
	bio: String,
	image: String,
	hash: String,
	salt: String
}, {
		timestamps: true,
		createdby: true,
		updatedby: true
	});

// Hash the user's password before inserting a new user
UserSchema.pre('save', function (next) {
	var user = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) { return next(err); }
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) { return next(err); }
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

UserSchema.statics.createCRUD = false
UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });
UserSchema.plugin(mongooseHistory);

module.exports = mongoose.model('User', UserSchema);