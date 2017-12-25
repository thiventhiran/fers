const { Initializer, api } = require('actionhero')
const mongoose = require('mongoose')
const _ = require('lodash');
const moment = require('moment');

module.exports = class ModelActionsInitializer extends Initializer {
	constructor() {
		super()
		this.name = 'modelactions'
		this.loadPriority = 200
		this.startPriority = 200
	}

	async initialize() {
		if (!api.modelactions)
			api.modelactions = {};

		api.modelactions.processElements = async (appid, metadataids, filter) => {
			if (!appid) return null;
			if (!metadataids) return null;
			if (!filter) filter = {};

			const metadatatype = 'dataelement';
			var data = {};

			try {
				filter.appid = appid;
				const replacements = _.extend({}, await api.tools.getConstants(), filter)
				const metadatafilter = { "where": { "appid": appid, "type": metadatatype, "id": { "$in": metadataids } } };
				const response = await api.models.metadata.find(metadatafilter.where);
				const dataelements = JSON.parse(JSON.stringify(response));

				if (Array.isArray(dataelements) && dataelements.length > 0) {
					var promises = [];
					var dataelementids = [];

					for (let index = 0; index < dataelements.length; index++) {
						const dataelement = dataelements[index];
						dataelementids.push(dataelement.id)

						if (dataelement.query) {
							const query = JSON.parse(dataelement.query);
							const pipeline = await api.tools.replaceValues(query, replacements, '%', '%');
							const aggregatePipeline = await api.tools.convertObjectIds(pipeline)
							promises.push(api.models.record.aggregate(aggregatePipeline));
						}
					}

					const dataArray = await Promise.all(promises);
					for (let index = 0; index < dataArray.length; index++) {
						data[dataelementids[index]] = dataArray[index];
					}
				}
			} catch (error) {
				api.log('Error Processing Data Element(s) ' + metadataids + ' for App: ' + appid, 'alert');
				api.log(error, 'alert');
			}
			return data;
		}

		api.modelactions.processDataElements = async (appid, metadataids, filter) => {
			const metadatatype = 'dataelement';
			if (!filter) filter = {}; else filter = JSON.parse(filter);
			if (!metadataids) metadataids = []; else metadataids = JSON.parse(metadataids);

			var response = {};
			response.params = { appid: appid, metadatatype: metadatatype, metadataids: metadataids, filter: filter };
			response.dataelementrecords = await api.modelactions.processElements(appid, metadataids, filter);
			return response;
		}

		api.modelactions.processView = async (appid, metadataid, filter) => {
			const viewtype = 'view';
			const dataelementtype = 'dataelement';
			if (!filter) filter = {}; else filter = JSON.parse(filter);

			var response = {};
			response.params = { appid: appid, metadatatype: viewtype, metadataid: metadataid, filter: filter };

			try {
				var promises = [];

				//Pull the appdata
				const appfilter = { "where": { "id": appid } }
				promises.push(api.models.case.findOne(appfilter.where));

				//Pull the metadata
				const viewfilter = { "where": { "appid": appid, "type": viewtype, "id": metadataid } }
				promises.push(api.models.metadata.findOne(viewfilter.where));

				const dataArray = await Promise.all(promises);
				const appdata = JSON.parse(JSON.stringify(dataArray[0]))
				response.appdata = appdata;

				const view = JSON.parse(JSON.stringify(dataArray[1]))
				response.view = view;

				var idMap = {};
				var dataelementids = [];
				const dataObjArray = view.dataelements;
				if (Array.isArray(dataObjArray) && dataObjArray.length > 0) {
					for (let index = 0; index < dataObjArray.length; index++) {
						const dataObj = dataObjArray[index];
						idMap[dataObj.key] = dataObj.value;
						if (!(dataelementids.indexOf(dataObj.value) > -1)) {
							dataelementids.push(dataObj.value);
						}
					}
				}
				response.params.metadataids = dataelementids;
				if (Array.isArray(dataelementids) && dataelementids.length > 0) {
					const datarecords = await api.modelactions.processElements(appid, dataelementids, filter);
					response.view.dataelementrecords = await api.tools.replaceValues(idMap, datarecords);
				}
			} catch (error) {
				response.status = 'error'
				response.error = error
				if (response.errormessages) {
					response.errormessages.push('Error while processing view')
				} else {
					response.errormessages = ['Error while processing view']
				}
				throw error.errors[0]
			}
			return response;
		}
	}
}