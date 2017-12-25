'use strict'
const { Action, api } = require('actionhero')
const mongoose = require('mongoose');

exports.ProcessbyAppforMultipleIds = class ProcessbyAppforMultipleIds extends Action {
	constructor() {
		super()
		this.name = 'dataelement:processbyappidformultipleids'
		this.description = this.name
		this.middleware = ['postProcessor_formatData']
		this.outputExample = {}
		this.authenticate = true
		this.applevel = true
		this.inputs = {
			appid: {
				required: true
			},
			metadataids: {
				required: true
			},
			filter: {
				required: false
			}
		}
	}

	async run(data) {
		const params = data.params;
		try {
			data.response = await api.modelactions.processDataElements(params.appid, params.metadataids, params.filter)
		} catch (error) {
			data.response.status = 'error'
			if (data.response.errormessages) {
				data.response.errormessages.push('Error while processing dataelement')
			} else {
				data.response.errormessages = ['Error while processing dataelement']
			}
			throw error.errors[0]
		}
	}
}


exports.ProcessbyAppandMetadataId = class ProcessbyAppandMetadataId extends Action {
	constructor() {
		super()
		this.name = 'dataelement:processbyappandmetadataid'
		this.description = this.name
		this.middleware = ['postProcessor_formatData']
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
			filter: {
				required: false
			}
		}
	}

	async run(data) {
		const params = data.params;
		try {
			data.response = await api.modelactions.processDataElements(params.appid, JSON.stringify([params.metadataid]), params.filter);
		} catch (error) {
			data.response.status = 'error'
			if (data.response.errormessages) {
				data.response.errormessages.push('Error while processing dataelement')
			} else {
				data.response.errormessages = ['Error while processing dataelement']
			}
			throw error.errors[0]
		}
	}
}