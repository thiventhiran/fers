// const crypto = require('crypto')
const util = require('util')
const { Initializer, api } = require('actionhero')

module.exports = class DataProcessingTaskMiddleware extends Initializer {
    constructor() {
        super()
        this.name = 'task_dataprocessing'
    }

    async initialize() {

        api.tasks.addMiddleware({
            name: 'preProcessor_validateRecord',
            global: false,
            priority: 5000,
            preProcessor: async (data) => {
                console.log(data.params);
            }
        });

        api.tasks.addMiddleware({
            name: 'postProcessor_formatRecord',
            global: false,
            priority: 5100,
            postProcessor: async (data) => {
                console.log(data.response);
            }
        });

        api.tasks.addMiddleware({
            name: 'postProcessor_formatData',
            global: false,
            priority: 5200,
            postProcessor: async (data) => {
                console.log(data.response);
            }
        });

    }
}
