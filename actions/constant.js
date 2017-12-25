'use strict'
const { Action, api } = require('actionhero')
const mongoose = require('mongoose');

exports.Create = class ConstantCreate extends Action {
	constructor() {
		super()
		this.name = 'constant:create'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = false
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
				required: true
			}
		}
	}

	async run(data) {
		var constantdata;
		try {
			data.response.constant = await api
				.models
				.constant
				.create(data.params)
			data.response.status = 'ok'
		} catch (error) {
			throw error.errors[0]
		}

	}
}

exports.Update = class ConstantUpdate extends Action {
	constructor() {
		super()
		this.name = 'constant:update'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = false
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
		var constantdata;
		var attributes = {}
		try {
			await api
				.models
				.constant
				.update({
					"id": data.params.id
				}, data.params.fields)
			data.response.status = 'ok'
			data.response.constant = await api
				.models
				.constant
				.findOne({ id: data.params.id })
		} catch (error) {
			throw error.errors[0]
		}

	}
}

exports.Read = class ConstantGet extends Action {
	constructor() {
		super()
		this.name = 'constant:read'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = false
		this.inputs = {
			id: {
				required: true
			}
		}
	}

	async run(data) {
		var constantdata;
		try {
			data.response.constant = await api
				.models
				.constant
				.findOne({ id: data.params.id })
			data.response.status = 'ok'
		} catch (error) {
			throw error.errors[0]
		}

	}
}

exports.Find = class ConstantFind extends Action {
	constructor() {
		super()
		this.name = 'constant:find'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = false
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
			data.response.results = await api
				.models
				.constant
				.find(filter.where)
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

exports.Delete = class ConstantDelete extends Action {
	constructor() {
		super()
		this.name = 'constant:delete'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = false
		this.inputs = {
			id: {
				required: true
			}
		}
	}

	async run(data) {
		var constantdata;
		var attributes = {}
		try {
			await api
				.models
				.constant
				.remove({
					"id": data.params.id
				})
			data.response.status = 'ok'
		} catch (error) {
			throw error.errors[0]
		}

	}
}
