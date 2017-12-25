'use strict'
const { Action, api } = require('actionhero')
const mongoose = require('mongoose');

exports.ProcessbyAppandMetadataId = class ProcessbyAppandMetadataId extends Action {
	constructor() {
		super()
		this.name = 'view:processbyappandmetadataid'
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
			filter: {
				required: false
			}
		}
	}

	async run(data) {
		const params = data.params;
		try {
			data.response = await api.modelactions.processView(params.appid, params.metadataid, params.filter)
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