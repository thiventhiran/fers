'use strict'
const { Action, api } = require('actionhero')
const mongoose = require('mongoose');

exports.Create = class RecordCreate extends Action {
	constructor() {
		super()
		this.name = 'record:create'
		this.description = this.name
		// this.middleware = ['preProcessor_validateRecord', 'postProcessor_formatRecord']
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			caseid: {
				required:true
			},
			id: {
				required:true
				
			},
			name: {
				required:true
			},
			type: {
				required:true
			},
			details: {
				required:true
			},
			collectedby: {
				required:true
			},
			collectiondate: {
				required:true
			}
		}
	}

	async run(data) {
		console.log(data)
		var recorddata;
		try {
			data.response.record = await api.models.record.create(data.params)
			data.response.status = 'ok'
		} catch (error) {
			data.response.status = 'error'
			data.response.error = error
		}

	}
}

exports.Update = class RecordUpdate extends Action {
	constructor() {
		super()
		this.name = 'record:update'
		this.description = this.name
		this.middleware = ['preProcessor_validateRecord', 'postProcessor_formatRecord']
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			appid: {
				required: true
			},
			id: {
				required: true
			},
			fields: {
				required: true
			}
		}
	}

	async run(data) {
		var recorddata;
		var attributes = {}
		try {
			await api.models.record.update({ "id": data.params.id }, data.params.fields)
			data.response.status = 'ok'
			data.response.record = await api.models.record.findOne({ id: data.params.id })
		} catch (error) {
			throw error.errors[0]
		}

	}
}

exports.Read = class RecordGet extends Action {
	constructor() {
		super()
		this.name = 'record:read'
		this.description = this.name
		this.middleware = ['postProcessor_formatRecord']
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			appid: {
				required: true
			},
			id: {
				required: true
			}
		}
	}

	async run(data) {
		var recorddata;
		try {
			data.response.record = await api.models.record.findOne({ id: data.params.id })
			data.response.status = 'ok'
		} catch (error) {
			throw error.errors[0]
		}

	}
}

exports.Find = class RecordFind extends Action {
	constructor() {
		super()
		this.name = 'record:find'
		this.description = this.name
		// this.middleware = ['postProcessor_formatRecord']
		this.outputExample = {}
		this.authenticate = true
		// this.applevel = true
		this.inputs = {
			appid: {
				required: false
			},
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
			data.response.results = await api.models.record.find(filter.where).limit(filter.limit).skip(filter.skip).sort(filter.sort).select(filter.fields)
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


exports.FindbyApp = class FindbyApp extends Action {
	constructor() {
		super()
		this.name = 'record:findbyapp'
		this.description = this.name
		this.middleware = ['postProcessor_formatRecord']
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			appid: {
				required: true
			},
			filter: {
				required: false
			}
		}
	}

	async run(data) {

		try {
			var filter = { "where": { "appid": "" } }

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

			if (!filter.where) {
				filter.where = {
					"appid": data.params.appid
				}
			} else {
				filter.where.appid = data.params.appid
			}


			data.response.results = await api.models.record.find(filter.where).limit(filter.limit).skip(filter.skip).sort(filter.sort).select(filter.fields)

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


exports.FindbyEntityId = class FindbyEntityId extends Action {
	constructor() {
		super()
		this.name = 'record:findbyentityid'
		this.description = this.name
		this.middleware = ['postProcessor_formatRecord']
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			appid: {
				required: true
			},
			entityid: {
				required: true
			},
			filter: {
				required: false
			}
		}
	}

	async run(data) {

		try {
			var filter = { "where": { "appid": "" } }

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

			if (!filter.where) {
				filter.where = {
					"appid": data.params.appid,
					"entityid": data.params.entityid
				}
			} else {
				filter.where.appid = data.params.appid
				filter.where.entityid = data.params.entityid
			}


			data.response.results = await api.models.record.find(filter.where).limit(filter.limit).skip(filter.skip).sort(filter.sort).select(filter.fields)

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

exports.Delete = class RecordDelete extends Action {
	constructor() {
		super()
		this.name = 'record:delete'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			appid: {
				required: true
			},
			id: {
				required: true
			}
		}
	}

	async run(data) {
		var recorddata;
		var attributes = {}
		try {
			await api.models.record.remove({ "id": data.params.id })
			data.response.status = 'ok'
		} catch (error) {
			throw error.errors[0]
		}

	}
}
