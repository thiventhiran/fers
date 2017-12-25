// const crypto = require('crypto')
const util = require('util')
const { Initializer, api } = require('actionhero')
var jsonwebtoken = require('jsonwebtoken');
var bcrypt = require('bcrypt');

module.exports = class UserInitializer extends Initializer {
	constructor() {
		super()
		this.name = 'init_user'
	}

	async initialize() {
		if (!api.user)
			api.user = {};

		api.user.getUser = async (email) => {
			try {
				const user = await api.models.user.findOne({ email: email });
				user.password = null;
				return user;
			}
			catch (error) {
				api.log('Error Processing Token', 'notice');
				throw error;
			}
		}

		api.user.authenticate = async (email, password) => {
			try {
				const user = await api.models.user.findOne({ email: email });
				if (!user) {
					throw new Error('Please check ur Email / Password !!!');
				}
				else if (bcrypt.compareSync(password, user.password)) {
					return await api.user.toAuthJSON(JSON.parse(JSON.stringify(user)));
				} else {
					throw new Error('Please check ur Email / Password !!!');
				}
			}
			catch (error) {
				throw new Error('Please check ur Email / Password !!!');
			}
		}

		api.user.processToken = async (token, options) => {
			options = options || {};
			try {
				return jsonwebtoken.verify(token, api.config.auth.secret, options);
			}
			catch (error) {
				api.log('Error Processing Token', 'notice');
				throw error;
			}
		}
		api.user.generateToken = async (data, options) => {

			options = options || {};
			if (!options.algorithm) {
				options.algorithm = api.config.auth.algorithm;
			}

			try {
				var today = new Date();
				var exp = new Date(today);
				exp.setDate(today.getDate() + 60);
				const tokenData = { id: data._id, email: data.email, exp: parseInt(exp.getTime() / 1000) };

				return jsonwebtoken.sign(tokenData, api.config.auth.secret, options);
			}
			catch (error) {
				api.log('Error Generating Token', 'notice');
				throw error;
			}
		}

		api.user.comparePassword = async (password, hash_password) => {
			try {
				return bcrypt.compareSync(password, hash_password);
			}
			catch (error) {
				api.log('Error Comparing Passwords', 'notice');
				throw error;
			}
		};

		api.user.toAuthJSON = async (data) => {
			try {
				const token = await api.user.generateToken(data);
				const name = await api.tools.getname(data);

				return {
					id: data.id,
					email: data.email,
					token: token,
					bio: data.bio,
					image: data.image,
					name: name
				};
			}
			catch (error) {
				api.log('Error Creating Auth JSON', 'notice');
				throw error;
			}
		};
	}
}