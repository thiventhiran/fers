const { Action, api } = require('actionhero')
const mongoose = require('mongoose');

exports.UserSignup = class UserSignup extends Action {
	constructor() {
		super()
		this.name = 'user:signup'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = false
		this.inputs = {
			email: {
				required: true
			},
			password: {
				required: true
			},
			firstname: {
				required: true
			},
			lastname: {
				required: true
			}
		}
	}

	async run(data) {
		try {
			const user = await api.models.user.create(data.params);

			if (!user) {
				data.response.status = 'error';
				data.response.message = 'User not created';
			} else {
				data.response.user = await api.user.toAuthJSON(JSON.parse(JSON.stringify(user)));
				data.response.status = 'ok';
			}
		} catch (error) {

			data.response.error = error;
			data.response.status = 'error';
			data.response.message = 'User not Created';
		}
	}
}

exports.UserView = class UserView extends Action {
	constructor() {
		super()
		this.name = 'user:view'
		this.description = this.name
		this.middleware = ['mw_auth']
		this.outputExample = {}
		this.authenticate = true
		this.inputs = {
			email: {
				required: true
			}
		}
	}

	async run(data) {
		try {
			var user = await api.user.getUser(data.params.email);
			if (!user) {
				data.response.status = 'error';
				data.response.message = 'User not found';
			} else {
				data.response.user = user;
				data.response.status = 'ok';
			}
		} catch (error) {
			data.response.error = error;
			data.response.status = 'error';
			data.response.message = 'User not Found';
		}
	}
}

exports.UserEdit = class UserEdit extends Action {
	constructor() {
		super()
		this.name = 'user:update'
		this.description = this.name
		this.middleware = ['mw_auth']
		this.outputExample = {}
		this.authenticate = true
		this.inputs = {
			email: {
				required: true
			},
			password: {
				required: false
			},
			firstname: {
				required: false
			},
			lastname: {
				required: false
			}
		}
	}

	async run(data) {
		try {
			var user = await api.user.getUser(data.params.email);
			if (!user) {
				data.response.status = 'error';
				data.response.message = 'User not found';
			} else {
				if (data.params.password) {
					await api.user.updatePassword(data.params.password)
				} else {
					await user.updateAttributes(data.params);
					data.response.user = await api.user.getUser(data.params.email);
				}
				data.response.status = 'ok';
			}
		} catch (error) {
			data.response.error = error;
			data.response.status = 'error';
			data.response.message = 'User not Updated';
		}
	}
}

exports.UserLogin = class UserLogin extends Action {
	constructor() {
		super()
		this.name = 'user:login'
		this.description = this.name
		this.middleware = []
		this.outputExample = {}
		this.authenticate = false
		this.inputs = {
			email: {
				required: true
			},
			password: {
				required: true
			}
		}
	}

	async run(data) {
		try {
			data.response.user = await api.user.authenticate(data.params.email, data.params.password);
			data.response.status = 'ok';
		} catch (error) {
			data.response.error = error;
			data.response.status = 'error';
			data.response.message = 'User not Logged in';
		}
	}
}