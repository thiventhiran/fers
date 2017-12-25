const { api, Task } = require('actionhero')

exports.stats = class Stats extends Task {
    constructor() {
        super()
        this.name = 'stats'
        this.description = 'I report the stats'
        this.frequency = (30 * 1000)
        this.queue = 'default'
        this.middleware = []
    }

    async run(data) {
        api.log('*** STATUS ***', 'info')
    }
}