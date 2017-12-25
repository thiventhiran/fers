exports.default = {
	routes: function (api) {
		return {

			get: [
				{ path: '/docs', action: 'showDocumentation' },
				{ path: '/status', action: 'status' },
				{ path: '/swagger', action: 'swagger' },

				{ path: '/apps', action: 'app:find' },
				{ path: '/apps/:id', action: 'app:read' },

				{ path: '/constant', action: 'constant:find' },

				{ path: '/metadata/:appid', action: 'metadata:findbyapp' },
				{ path: '/metadata/:appid/:metadatatype', action: 'metadata:findbyappandmetadatatype' },
				{ path: '/metadata/:appid/:metadatatype/:metadataid', action: 'metadata:findbyappmetadatatypeandmetadataid' },

				{ path: '/dataelement/:appid/:metadataid', action: 'dataelement:processbyappandmetadataid' },
				{ path: '/dataelement/:appid', action: 'dataelement:processbyappidformultipleids' },

				{ path: '/view/:appid/:metadataid', action: 'view:processbyappandmetadataid' },

				{ path: '/records/:appid', action: 'record:findbyapp' },

				{ path: '/records/:appid/:entityid', action: 'record:findbyentityid' },

				{ path: '/user/view', action: 'user:view' },
			],

			post: [
				{ path: '/session', action: 'session:create' },

				{ path: '/apps', action: 'app:create' },

				{ path: '/constant', action: 'constant:create' },
				{ path: '/metadata/:appid', action: 'metadata:create' },
				{ path: '/records/:appid/:entityid', action: 'record:create' },
				{ path: '/user/signup', action: 'user:signup' },
				{ path: '/user/login', action: 'user:login' }
			],

			put: [
				{ path: '/session', action: 'session:check' },

				{ path: '/apps/:id', action: 'app:update' },
				{ path: '/apps/clone/:oldid/:newid', action: 'app:clone' },

				{ path: '/constant', action: 'constant:update' },
				{ path: '/metadata/:appid/:metadataid', action: 'metadata:update' },
				{ path: '/metadata/:appid/clone/:oldid/:newid', action: 'metadata:clone' },

				{ path: '/records/:_id', action: 'record:update' },

				{ path: '/user/update', action: 'user:update' },
				{ path: '/user/change', action: 'user:changepassword' },
				{ path: '/user/forgot', action: 'user:forgotpassword' }
			],

			delete: [
				{ path: '/session/:id', action: 'session:destroy' },

				{ path: '/apps/:id', action: 'app:delete' },

				{ path: '/constant/:id', action: 'constant:delete' },

				{ path: '/metadata/:appid/:id', action: 'metadata:delete' },

				{ path: '/records/:appid/:entityid/:id', action: 'record:delete' }
			]

		}
	}
}
