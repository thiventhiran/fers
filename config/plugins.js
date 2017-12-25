const path = require('path')
const fs = require('fs')

exports['default'] = {
	plugins: (api) => {
		const isDirectory = source => fs.lstatSync(source).isDirectory();
		const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
		const plugin_path = path.join(__dirname, path.sep + '..' + path.sep + 'node_modules');
		const ahRegex = new RegExp("ah-*");
		const x1Regex = new RegExp("x1-*");

		var plugins = {};
		try {
			getDirectories(plugin_path)
				.forEach(function (dirPath) {
					const pathParts = dirPath.split(path.sep);
					const name = pathParts[(pathParts.length - 1)];
					if (name && (ahRegex.test(name) || x1Regex.test(name))) {
						// api.log('>>> Loading Plugin - ' + name);
						plugins[name] = { path: dirPath };
					}
				});
		} catch (error) {
			api.log(error, 'error');
		}

		/*
		------------------------------------------------------------------------
		If you want to use npm plugins in your application, include them here to override parameters:
	
		plugins['myPlugin'] = { path: __dirname + '/../node_modules/myPlugin' };
	
		You can also toggle on or off sections of a plugin to include (default true for all sections):
	
		plugins['myPlugin'] = {
			path: __dirname + '/../node_modules/myPlugin',
			actions: true,
			tasks: true,
			initializers: true,
			servers: true,
			public: true, 
			cli: true
		  }
		------------------------------------------------------------------------
		*/
		return plugins;
	}

}
