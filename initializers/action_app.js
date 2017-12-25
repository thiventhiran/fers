// const crypto = require('crypto')
const util = require('util')
const { Initializer, api } = require('actionhero')

module.exports = class ActionAppInitializer extends Initializer {
	constructor() {
		super()
		this.name = 'action_app'
	}

	async initialize() {
		if (!api.info)
			api.info = {};

		api.actions.addMiddleware({
			name: 'mw_app',
			global: true,
			priority: 200,
			preProcessor: async (data) => {
				//Check if App Level Access Restricted
				if (data.actionTemplate.applevel) {

					const apps = api.info.user.apps;
					const appid = data.params.appid;
					const type = data.params.metadatatype;
					const parts = data.params.action.split(':');
					const group = parts[0];
					const action = parts[1];

					//Allow x1-platform Access for Metadata Read Access
					if (appid && appid == 'x1-platform' &&
						type == 'metadatatype' && group == 'metadata'
						&& action !== 'create' && action !== 'update' && action !== 'delete') {
						return null;

						//Check if App is part of User profile before allowing Access
					} else if (appid && apps && Array.isArray(apps) && apps.indexOf(appid) > -1) {
						api.info.case = JSON.parse(JSON.stringify(await api.models.case.findOne({ id: appid })));

					} else {
						throw new Error('Invalid Data Request');
					}
				}
			},
			postProcessor: async (data) => {
			}
		});
	}
}
