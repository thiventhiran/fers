const { api, Task } = require('actionhero')
const mongoose = require('mongoose');
const _ = require('lodash');

exports.cloneApp = class CloneApp extends Task {
    constructor() {
        super()
        this.name = 'app:clone'
        this.description = 'Clone App'
        this.frequency = 0
        this.queue = 'default'
        this.middleware = []
    }

    async run(data) {
        try {
            const dataArray = await api.models.metadata.find({ appid: data.oldid });

            var overrides = {};
            overrides[data.oldid] = data.newid;

            api.models.metadata.create(await api.tools.clone(dataArray, overrides));
        } catch (error) {
            throw error
        }

        try {
            if (data.copyrecords) {
                const dataArray = await api.models.record.find({ appid: data.oldid });

                var overrides = {};
                overrides[data.oldid] = data.newid;

                api.models.record.create(await api.tools.clone(dataArray, overrides));
            }
        } catch (error) {
            throw error
        }
    }

}

exports.cloneMetadata = class CloneMetadata extends Task {
    constructor() {
        super()
        this.name = 'metadata:clone'
        this.description = 'Clone Metadata'
        this.frequency = 0
        this.queue = 'default'
        this.middleware = []
    }

    async run(data) {
        try {
            const dataArray = await api.models.metadata.find({ appid: appid, metadataId: data.oldid });

            var overrides = {};
            overrides[data.oldid] = data.newid;

            api.models.metadata.create(await api.tools.clone(dataArray, overrides));
        } catch (error) {
            throw error
        }
    }
}

