// initializers/MongoInit.js

const { Initializer, api } = require('actionhero')
const mongoose = require('mongoose')
var path = require('path');
var fs = require('fs');

module.exports = class MongooseInitializer extends Initializer {
    constructor() {
        super()
        this.name = 'mongoose'
        this.loadPriority = 100
        this.startPriority = 100
        this.db

    }

    async initialize() {
        api.mongoose = mongoose
        api.connection = null
        api.models = null

        mongoose.Promise = global.Promise


        if (api.models === null) {
            api.models = {};
            var dir = path.normalize(api.config.mongoose.model_path);
            fs
                .readdirSync(dir)
                .forEach(function (file) {
                    var nameParts = file.split("/");
                    var name = nameParts[(nameParts.length - 1)].split(".")[0];
                    if (name.indexOf('-') > -1) {
                        name = name.split("-")[1];
                    }
                    api.models[name] = require(api.config.mongoose.model_path + '/' + file);
                });
        }

    }

    async connect() {
        if (api.config.mongoose.debug) {
            api.mongoose.set('debug', true);
        }

        if (api.models === null) {
            api.mongoose.init(function () { });
        }
        api.log('Mongoose Connection String : ' + api.config.mongoose.connection_string, 'info');
        await api.mongoose.connect(api.config.mongoose.connection_string);
        api.mongoose.connection = mongoose.connection
        api.mongoose.connection.on('error', console.error.bind(console, 'mongoose error:'));
        this.db = api.mongoose.connection
        api.log('*** Mongoose Connection Successful ***', 'alert');
    }

    async disconnect() {
        await this.db.close()
        api.log('** Mongoose disconnected ***', 'alert');
        ///Disconnect to be added
    }

    async start() {
        await this.connect()
    }

    async stop() {
        await this.disconnect()
    }
}