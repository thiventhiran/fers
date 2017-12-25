exports.default = {
	auth: function (api) {
		return {
			enabled: {
				web: true,
				websocket: true,
				socket: false,
				testServer: false
			},
			secret: api.config.general.serverToken + 'secretmessage',
			algorithm: 'HS512',
			enableGet: true // enables token as GET parameters in addition to Authorization headers
		}
	}
}

exports.test = {
	auth: function (api) {
		return {
			enabled: {
				web: false,
				websocket: false,
				socket: false,
				testServer: false
			},
			secret: api.config.general.serverToken + 'secretmessage',
			algorithm: 'HS512',
			enableGet: true // enables token as GET parameters in addition to Authorization headers
		}
	}
}

exports.production = {
	auth: function (api) {
		return {
			enabled: {
				web: true,
				websocket: true,
				socket: false,
				testServer: false
			},
			secret: api.config.general.serverToken + 'secretmessage',
			algorithm: 'HS512',
			enableGet: true // enables token as GET parameters in addition to Authorization headers
		}
	}
}