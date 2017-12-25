'use strict'
const { Action, api } = require('actionhero')
const mongoose = require('mongoose');

exports.Create = class AppCreate extends Action {
	constructor() {
		super()
		this.name = 'app:create'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.inputs = {
			owner: {
				required: true
			},
			id: {
				required: true
			},
			name: {
				required: true
			},
			description: {
				required: true
			},
			definition: {
				required: false
			}
		}
	}

	async run(data) {
		try {
			data.response.app = await api.models.app.create(data.params)
			data.response.status = 'ok'
		} catch (error) {
			throw error.errors[0]
		}

	}
}

exports.Update = class AppUpdate extends Action {
	constructor() {
		super()
		this.name = 'app:update'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.inputs = {
			id: {
				required: true
			},
			fields: {
				required: true
			}
		}
	}

	async run(data) {
		var appdata;
		var attributes = {}
		try {
			await api.models.app.update({ "id": data.params.id }, data.params.fields)
			data.response.status = 'ok'
			data.response.app = await api
				.models
				.app
				.findOne({ id: data.params.id })
		} catch (error) {
			throw error.errors[0]
		}

	}
}

exports.Read = class AppGet extends Action {
	constructor() {
		super()
		this.name = 'app:read'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.inputs = {
			id: {
				required: true
			}
		}
	}

	async run(data) {
		var appdata;
		try {
			data.response.app = await api.models.app.findOne({ id: data.params.id })
			data.response.status = 'ok'
		} catch (error) {
			throw error.errors[0]
		}

	}
}

exports.Find = class AppFind extends Action {
	constructor() {
		super()
		this.name = 'app:find'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.inputs = {
			filter: {
				required: false
			}
		}
	}

	async run(data) {
		try {
			var filter = {}

			if (data.connection.params.filter) {
				var filterstring = data.connection.params.filter;
				try {
					filter = JSON.parse(filterstring)
				} catch (error) {
					data.response.status = 'error'
					if (data.response.errormessages) {
						data.response.errormessages.push('Filter String is malformed')
					} else {
						data.response.errormessages = ['Filter String is malformed']
					}
					throw error.errors[0]
				}
			}
			data.response.results = await api.models.app.find(filter.where)
				.limit(filter.limit)
				.skip(filter.skip)
				.sort(filter.sort)
				.select(filter.fields)
			data.response.status = 'ok'
		} catch (error) {
			data.response.status = 'error'
			if (data.response.errormessages) {
				data.response.errormessages.push('Error while querying database')
			} else {
				data.response.errormessages = ['Error while querying database']
			}
			throw error.errors[0]
		}

	}
}


exports.Delete = class AppDelete extends Action {
	constructor() {
		super()
		this.name = 'app:delete'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.inputs = {
			id: {
				required: true
			}
		}
	}

	async run(data) {
		var appdata;
		var attributes = {}
		try {
			await api.models.app.remove({ "id": data.params.id })
			data.response.status = 'ok'
		} catch (error) {
			throw error.errors[0]
		}

	}
}

exports.Clone = class AppClone extends Action {
	constructor() {
		super()
		this.name = 'app:clone'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.inputs = {
			oldid: {
				required: true
			},
			newid: {
				required: true
			},
			copyrecords: {
				type: Boolean,
				required: false
			},
		}
	}

	async run(data) {
		try {
			await api.tasks.enqueue('app:clone', data.params, 'default')
			data.response.message = 'Clone Task Submitted'
			data.response.status = 'ok'
		} catch (error) {
			throw error.errors[0]
		}
	}
}