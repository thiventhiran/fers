exports.default = {
	routes: function (api) {
		return {

			get: [
				{ path: '/docs', action: 'showDocumentation' },
				{ path: '/status', action: 'status' },
				{ path: '/swagger', action: 'swagger' },

				{ path: '/constant', action: 'constant:find' },

				{ path: '/records', action: 'record:find' },
				{ path: '/records/:caseid', action: 'record:findbycase' },
				{ path: '/cases', action: 'case:find' },
			],

			post: [
				{ path: '/cases', action: 'case:create' },
				{ path: '/constant', action: 'constant:create' },
				{ path: '/records', action: 'record:create' },
				{ path: '/user/signup', action: 'user:signup' },
				{ path: '/user/login', action: 'user:login' }
			],

			put: [
				{ path: '/cases/:id', action: 'case:update' },
				{ path: '/cases/clone/:oldid/:newid', action: 'case:clone' },

				{ path: '/constant', action: 'constant:update' },
				{ path: '/records/:_id', action: 'record:update' },

				{ path: '/user/update', action: 'user:update' },
				{ path: '/user/change', action: 'user:changepassword' },
				{ path: '/user/forgot', action: 'user:forgotpassword' }
			],

			delete: [

				{ path: '/cases/:id', action: 'case:delete' },

				{ path: '/constant/:id', action: 'constant:delete' },

				{ path: '/records/:appid/:entityid/:id', action: 'record:delete' }
			]

		}
	}
}
