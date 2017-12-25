'use strict'
const { Action, api } = require('actionhero')
const mongoose = require('mongoose');

exports.Create = class MetadataCreate extends Action {
	constructor() {
		super()
		this.name = 'metadata:create'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			id: {
				required: true
			},
			name: {
				required: true
			},
			type: {
				required: true
			},
			appid: {
				required: true
			},
			pluralname: {
				required: false
			},
			formschema: {
				required: false
			},
			formuischema: {
				required: false
			},
			formdata: {
				required: false
			},
			widgets: {
				required: false
			},
			dataelements: {
				required: false
			},
			description: {
				required: false
			}
		}
	}

	async run(data) {
		var metadatadata;
		try {
			data.response.metadata = await api.models.metadata.create(data.params);
			data.response.status = 'ok'
		} catch (error) {
			data.response.status = 'error'
			data.response.errors = error
			throw error.errors[0]
		}

	}
}

exports.Update = class MetadataUpdate extends Action {
	constructor() {
		super()
		this.name = 'metadata:update'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			appid: {
				required: true
			},
			metadataid: {
				required: true
			},
			fields: {
				required: true
			}
		}
	}

	async run(data) {
		var metadatadata;
		var attributes = {}
		try {
			await api.models.metadata.update({ "metadataid": data.params._id }, data.params.fields)
			data.response.status = 'ok'
			data.response.metadata = await api.models.metadata.findOne({ _id: data.params.metadataid })
		} catch (error) {
			data.response.status = 'error'
			data.response.error = error
			throw error.errors[0]
		}

	}
}


exports.Read = class MetadataGet extends Action {
	constructor() {
		super()
		this.name = 'metadata:read'
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
		var metadatadata;
		try {
			data.response.metadata = await api.models.metadata.findOne({ id: data.params.id })
			data.response.status = 'ok'
		} catch (error) {
			throw error.errors[0]
		}

	}
}

exports.Find = class MetadataFind extends Action {
	constructor() {
		super()
		this.name = 'metadata:find'
		this.description = this.name
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
				.metadata
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

exports.FindbyApp = class FindbyApp extends Action {
	constructor() {
		super()
		this.name = 'metadata:findbyapp'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			appid: {
				required: true
			}
		}
	}

	async run(data) {

		try {
			var filter = { "where": { "appid": "" } }

			if (data.params.appid) {
				filter.where.appid = data.params.appid;
			}
			data.response.results = await api.models.metadata.find(filter.where)
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

exports.FindbyAppandMetadataType = class FindbyAppandMetadataId extends Action {
	constructor() {
		super()
		this.name = 'metadata:findbyappandmetadatatype'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			appid: {
				required: true
			},
			metadatatype: {
				required: true
			}
		}
	}

	async run(data) {

		try {
			var filter = { "where": { "appid": "", "type": "" } }

			if (data.params.appid && data.params.metadatatype) {
				filter.where.appid = data.params.appid;
				filter.where.type = data.params.metadatatype;

				data.response.results = await api.models.metadata.find(filter.where)
				data.response.status = 'ok'
			}
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


exports.FindbyAppMetadataTypeandId = class FindbyAppMetadataTypeandId extends Action {
	constructor() {
		super()
		this.name = 'metadata:findbyappmetadatatypeandmetadataid'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			appid: {
				required: true
			},
			metadatatype: {
				required: true
			},
			metadataid: {
				required: true
			}
		}
	}

	async run(data) {
		const params = data.params;
		if (params.appid && params.metadatatype && params.metadataid) {
			try {
				var filter = { "where": { "appid": "", "type": "", "id": "" } }
				filter.where.appid = params.appid;
				filter.where.type = params.metadatatype;
				filter.where.id = params.metadataid;
				data.response.results = await api.models.metadata.findOne(filter.where)
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
		else {
			data.response.status = 'error'
			data.response.errormessages = ['Missing Params']
			data.response.params = data.params
		}
	}
}

exports.Delete = class MetadataDelete extends Action {
	constructor() {
		super()
		this.name = 'metadata:delete'
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
		var metadatadata;
		var attributes = {}
		try {
			await api
				.models
				.metadata
				.remove({
					"id": data.params.id
				})
			data.response.status = 'ok'
		} catch (error) {
			throw error.errors[0]
		}

	}
}

exports.Clone = class MetadataClone extends Action {
	constructor() {
		super()
		this.name = 'metadata:clone'
		this.description = this.name
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			appid: {
				required: true
			},
			oldid: {
				required: true
			},
			newid: {
				required: true
			}
		}
	}

	async run(data) {
		try {
			await api.tasks.enqueue('cloneMetadata', data.params, 'default')
			data.response.message = 'Clone Task Submitted'
			data.response.status = 'ok'
		} catch (error) {
			throw error.errors[0]
		}
	}
}


