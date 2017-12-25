var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var mongooseHistory = require('mongoose-history');
// var patchHistory = require('mongoose-patch-history');

var RecordSchema = new mongoose.Schema({
    // id: {
    //     type: String,
    //     lowercase: true,
    //     unique: true,
    //     required: [
    //         true, "can't be blank"
    //     ],
    //     index: true
    // },
    entityid: {
        type: String,
        index: true
    },
    appid: {
        type: String,
        index: true
    },
    data: Schema.Types.Mixed
}, {
        timestamps: true,
        createdby: true,
        updatedby: true
    });

RecordSchema.statics.createCRUD = true
RecordSchema.plugin(mongooseHistory);

module.exports = mongoose.model('Record', RecordSchema);