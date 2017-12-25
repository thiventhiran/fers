var path = require('path');
var pwd = path.normalize(process.cwd());

exports.default = {
	mongoose: function (api) {
		return {
			auto_start: true,
			connection_string: "mongodb://localhost:27017/fers",
			debug: true,
			model_path: pwd + '/models'
		}
	}
}

exports.sandbox = {
	mongoose: function (api) {
		return {
			auto_start: true,
			connection_string: "mongodb://localhost:27017/fers",
			debug: true,
			model_path: pwd + '/models'
		}
	}
}

exports.trial = {
	mongoose: function (api) {
		return {
			auto_start: true,
			connection_string: "mongodb://localhost:27017/fers",
			debug: true,
			model_path: pwd + '/models'
		}
	}
}

exports.production = {
	mongoose: function (api) {
		return {
			auto_start: true,
			connection_string: "mongodb://localhost:27017/fers",
			debug: false,
			model_path: pwd + '/models'
		}
	}
}