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
		
			},
			postProcessor: async (data) => {
			}
		});
	}
}
