const { Initializer, api } = require('actionhero')
const _ = require('lodash');
const moment = require('moment');
const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

module.exports = class ToolsInitializer extends Initializer {
    constructor() {
        super()
        this.name = 'tools'
        this.loadPriority = 100
        this.startPriority = 100
    }

    async initialize() {
        if (!api.tools)
            api.tools = {};

        api.tools.clone = async (data, overrides) => {
            try {
                var input = JSON.parse(JSON.stringify(data));
                if (Array.isArray(input)) {
                    for (var i = 0; i < input.length; i++) {
                        var document = input[i];
                        delete document['_id'];
                        for (var key in document) {
                            if (overrides[document[key]])
                                document[key] = overrides[document[key]];
                        }
                    }
                } else if (typeof input == 'object') {
                    delete input['_id'];
                    for (var key in input) {
                        if (overrides[input[key]])
                            input[key] = overrides[input[key]];
                    }
                }
                return input;
            } catch (error) {
                response.status = 'error'
                response.error = error
                if (response.errormessages) {
                    response.errormessages.push('Error while cloning data')
                } else {
                    response.errormessages = ['Error while cloning data']
                }
                throw error.errors[0]
            }
        }

        api.tools.getConstants = async () => {
            return {
                "START_OF_DAY": moment().startOf('day').utc().toISOString(),
                "END_OF_DAY": moment().endOf('day').utc().toISOString(),
                "7_DAYSAGO": moment().startOf('day').utc().subtract(7, 'days').toISOString(),
                "30_DAYSAGO": moment().endOf('day').utc().subtract(30, 'days').toISOString(),
                "30_DAYS_AFTER": moment().endOf('day').utc().add(30, 'days').toISOString()
                // "START_OF_YESTERDAY"
                //     value[condition] = moment().subtract(1, 'days').endOf('day').toDate();
                // else if(dateVariable === 'thisweek')
                //     value[condition] = moment().endOf('week').toDate();
                // else if(dateVariable === 'last7days')
                //     value[condition] = moment().endOf('day').toDate();
                // else if(dateVariable === 'lastweek')
                //     value[condition] = moment().subtract(1, 'week').endOf('week').toDate();
                // else if(dateVariable === 'nextweek')
                //     value[condition] = moment().add(1, 'week').endOf('week').toDate();
                // else if(dateVariable === 'thismonth')
                //     value[condition] = moment().endOf('month').toDate();
                // else if(dateVariable === 'lastmonth')
                //     value[condition] = moment().subtract(1, 'month').endOf('month').toDate();
                // else if(dateVariable === 'nextmonth')
                //     value[condition] = moment().add(1, 'month').endOf('month').toDate();
                // else
                //     value[condition] = moment().endOf('day').toDate();
            }
        }

        api.tools.replaceValues = async (data, variables, prefix, suffix) => {

            if (typeof data == 'object') {
                for (var key in data) {
                    data[key] = await api.tools.replaceValues(data[key], variables, prefix, suffix);
                }
            } else if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    data[i] = await api.tools.replaceValues(data[i], variables, prefix, suffix);
                }
            } else {
                data = await api.tools.replaceValue(data, variables, prefix, suffix);
            }

            return data;
        }

        api.tools.replaceValue = async (data, variables, prefix, suffix) => {

            if (!prefix) prefix = '';
            if (!suffix) suffix = '';

            for (const key in variables) {
                const varKey = prefix + key + suffix;
                if (data == varKey) {
                    data = variables[key];
                    break;
                }
            }
            return data;
        }

        api.tools.replaceStrings = async (text, variables) => {

            for (const key in variables) {
                const replacement = variables[key];

                var search = '%' + key + '%';
                if (typeof replacement !== 'string')
                    search = '"%' + key + '%"';

                if (text.indexOf(search) > -1) {
                    text = text.replace(new RegExp(search, 'g'), replacement);
                }
            }
            return text;
        }

        api.tools.replaceAll = async (str, find, replace) => {
            return str.replace(new RegExp(await api.tools.escapeRegExp(find), 'g'), replace);
        }

        api.tools.escapeRegExp = async (str) => {
            return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }

        api.tools.capitalizeFirstLetter = async (data) => {
            return data.charAt(0).toUpperCase() + string.slice(1);
        }

        api.tools.getname = function (data) {
            return [data.firstName, data.lastName].join(' ')
        }

        /*!
         * Convert the id to be a BSON ObjectID if it is compatible
         * @param {*} id The id value
         * @returns {ObjectID}
         */
        // api.tools.convertDate = async (input) => {
        //     var match;
        //     var ISODateString = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

        //     if (typeof input !== 'string') {
        //         return input;
        //     }
        //     try {
        //         // MongoDB's ObjectID constructor accepts number, 12-byte string or 24-byte
        //         // hex string. For LoopBack, we only allow 24-byte hex string, but 12-byte
        //         // string such as 'line-by-line' should be kept as string      
        //         if (match = input.match(ISODateString)) {
        //             var milliseconds = Date.parse(match[0])
        //             if (!isNaN(milliseconds)) {
        //                 return new Date(milliseconds);
        //             }
        //         }
        //         return input;
        //     } catch (e) {
        //         return input;
        //     }
        // }

        /*
           This function converts dates to Mongo DB Format
           * */
        // api.tools.convertDates = async (input) => {
        //     // Ignore things that aren't objects.
        //     if (typeof input !== "object") return input;
        //     for (var key in input) {
        //         if (!input.hasOwnProperty(key)) continue;
        //         var value = input[key];
        //         var match;
        //         // Check for string properties which look like dates.
        //         if (typeof value === "string") {
        //             input[key] = api.tools.convertDate(value);
        //         } else if (typeof value === "object") {
        //             // Recurse into object
        //             api.tools.convertDates(value);
        //         }
        //     }
        // }
        // api.tools.convertDates = async (input) => {
        //     if (api.tools.checkObjectId(input)) {
        //         return new ObjectID(input);
        //     } else if (Array.isArray(input)) {
        //         for (var i = 0; i < input.length; i++) {
        //             input[i] = api.tools.convertObjectIds(input[i]);
        //         }
        //     } else if (typeof input == 'object') {
        //         for (var key in input) {
        //             input[key] = api.tools.convertObjectIds(input[key]);
        //         }
        //     }
        //     return input;
        // }

        // api.tools.checkObjectIdandDate = async (input) => {
        //     var match;
        //     var ISODateString = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

        //     if (input instanceof ObjectID) {
        //         return input;
        //     }
        //     if (typeof input !== 'string') {
        //         return input;
        //     }
        //     try {
        //         // MongoDB's ObjectID constructor accepts number, 12-byte string or 24-byte
        //         // hex string. For LoopBack, we only allow 24-byte hex string, but 12-byte
        //         // string such as 'line-by-line' should be kept as string
        //         if (/^[0-9a-fA-F]{24}$/.test(input)) {
        //             return new ObjectID(input);
        //         }
        //         if (match = id.match(ISODateString)) {
        //             var milliseconds = Date.parse(match[0])
        //             if (!isNaN(milliseconds)) {
        //                 return new Date(milliseconds);
        //             }
        //         }

        //         return id;

        //     } catch (e) {
        //         return id;
        //     }
        // }

        // api.tools.convertObjectIdsandDates = async (input) => {
        //     // Ignore things that aren't objects.
        //     if (typeof input !== "object") return input;
        //     for (var key in input) {
        //         if (!input.hasOwnProperty(key)) continue;
        //         var value = input[key];
        //         var match;
        //         // Check for string properties which look like dates.
        //         if (typeof value === "string") {
        //             input[key] = api.tools.checkObjectIdandDate(value);
        //         } else if (typeof value === "object") {
        //             // Recurse into object
        //             api.tools.convertObjectIdsandDates(value);
        //         }
        //     }
        // }

        api.tools.convertObjectIds = async (data) => {
            if (await api.tools.checkObjectId(data)) {
                return new ObjectID(data);
            } else if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    data[i] = await api.tools.convertObjectIds(data[i]);
                }
            } else if (typeof data == 'object') {
                for (var key in data) {
                    data[key] = await api.tools.convertObjectIds(data[key]);
                }
            }
            return data;
        }

        api.tools.pullObjectIds = async (data) => {
            var idArray = [];
            if (await api.tools.checkObjectId(data)) {
                idArray.push(data);
            } else if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    idArray.push(...(await pullObjectIds(data[i], idArray)));
                }
            } else if (typeof data == 'object') {
                for (var key in data) {
                    idArray.push(...(await pullObjectIds(data[key], idArray)));
                }
            }
            return _.uniq(idArray);
        }

        api.tools.updateObjectIds = async (data, idMap) => {
            if (typeof data == 'object') {
                for (var key in data) {
                    if (data[key] && idMap[data[key]])
                        data[key] = idMap[data[key]];
                    else if (Array.isArray(data[key]) || typeof data[key] == 'object')
                        data[key] = await api.tools.updateObjectIds(data[key], idMap)
                }
            } else if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i] && idMap[data[i]])
                        data[i] = idMap[data[i]];
                    else if (Array.isArray(data[i]) || typeof data[i] == 'object')
                        data[i] = await api.tools.updateObjectIds(data[i], idMap)
                }
            }
            return data;
        }

        api.tools.checkObjectId = async (data) => {
            if (data instanceof ObjectID) { return true; }
            if (typeof data !== 'string') { return false; }
            try {
                if (/^[0-9a-fA-F]{24}$/.test(data)) { return true; } else { return false; }
            } catch (e) {
                return false;
            }
        }
    }
}


