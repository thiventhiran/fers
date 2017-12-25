// const crypto = require('crypto')
const util = require('util')
const { Initializer, api } = require('actionhero')

module.exports = class ActionAuthInitializer extends Initializer {
	constructor() {
		super()
		this.name = 'action_auth'
	}

	async initialize() {
		if (!api.info)
			api.info = {};

		api.actions.addMiddleware({
			name: 'mw_auth',
			global: true,
			priority: 100,
			preProcessor: async (data) => {

				// is it required to have a valid token to access an action?
				var tokenRequired = false;
				if (data.actionTemplate.authenticate && api.config.auth.enabled[data.connection.type]) {
					tokenRequired = true;
				}

				// get request data from the required sources
				var token = '';
				var req = {
					headers: data.params.httpHeaders || (data.connection.rawConnection.req ? data.connection.rawConnection.req.headers : undefined) || data.connection.mockHeaders || {},
					uri: data.connection.rawConnection.req ? data.connection.rawConnection.req.uri : {}
				};

				var authHeader = req.headers.authorization || req.headers.Authorization || false;

				// extract token from http headers
				if (authHeader) {
					var parts = authHeader.split(' ');
					if (parts.length != 2 || parts[0].toLowerCase() !== 'bearer') {

						// return error if token was required and missing
						if (tokenRequired) {
							throw ({ code: 500, message: 'Invalid Authorization Header' });
						}
						else {
							return null;
						}
					} else {
						token = parts[1];
					}
				}

				// if GET parameter for tokens is allowed, use it
				if (!token && api.config.auth.enableGet && req.uri.query && req.uri.query.token) {
					token = req.uri.query.token;
				}

				// return error if token was missing but marked as required
				if (tokenRequired && !token) {
					throw ({ code: 500, message: 'Authorization Header Not Set' });
				}
				//Process Token
				else if (token) {
					try {
						const userInfo = await api.user.processToken(token);
						api.info.user = JSON.parse(JSON.stringify(await api.user.getUser(userInfo.email)));
					} catch (error) {
						api.log('Error Processing Token')
						throw error;
					}
				}
			},
			postProcessor: async (data) => {
			}
		});
	}
}
