// const crypto = require('crypto')
const util = require('util')
const { Initializer, api } = require('actionhero')

module.exports = class DataProcessingActionMiddleware extends Initializer {
    constructor() {
        super()
        this.name = 'action_dataprocessing'
    }

    async initialize() {

        api.actions.addMiddleware({
            name: 'preProcessor_validateRecord',
            global: false,
            priority: 1000,
            preProcessor: (data) => {
                // console.log(data.params);
            }
        });

        api.actions.addMiddleware({
            name: 'postProcessor_formatRecord',
            global: false,
            priority: 1100,
            postProcessor: (data) => {
                // console.log(data.response.results);
            }
        });

        api.actions.addMiddleware({
            name: 'postProcessor_formatData',
            global: false,
            priority: 1200,
            postProcessor: (data) => {
                // console.log(data.response.dataelementrecords);
            }
        });

    }
}
