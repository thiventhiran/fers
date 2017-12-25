var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var mongooseHistory = require('mongoose-history');

var RecordSchema = new mongoose.Schema({
    caseid: {
        type: String,
        lowercase: true,
        required: [
            true, "can't be blank"
        ],
        index: true
    },
    id: {
        type: String,
        lowercase: true,
        unique: true,
        required: [
            true, "can't be blank"
        ],
        index: true
    },
    name: {
        type: String,
        trim: true,
        required: [true, "can't be blank"]
    },
    type: {
        type: String,
        trim: true,
        required: [true, "can't be blank"]
    },
    details: {
        type: String,
        trim: true,
        required: [true, "can't be blank"]
    },
    collectedby: {
        type: String,
        trim: true,
        required: [true, "can't be blank"]
    },
    collectiondate: {
        type: Date,
        required: [true, "can't be blank"]
    }
}, {
        runSettersOnQuery: true,
        timestamps: true,
        createdby: true,
        updatedby: true
    });

RecordSchema.statics.createCRUD = true
RecordSchema.plugin(uniqueValidator, { message: 'is already taken.' });
RecordSchema.plugin(mongooseHistory);

module.exports = mongoose.model('Record', RecordSchema);