var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var mongooseHistory = require('mongoose-history');

var CaseSchema = new mongoose.Schema({
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
    assignedto: {
        type: String,
        trim: true,
        required: [true, "can't be blank"]
    },
    priority: {
        type: String,
        required: [true, "can't be blank"]
    },
    startdate: {
        type: Date,
        required: [true, "can't be blank"]
    },
    enddate: {
        type: Date
    },
    location: {
        type: String,
        required: [true, "can't be blank"]
    }
}, {
        runSettersOnQuery: true,
        timestamps: true,
        createdby: true,
        updatedby: true
    });

CaseSchema.statics.createCRUD = true
CaseSchema.plugin(uniqueValidator, { message: 'is already taken.' });
CaseSchema.plugin(mongooseHistory);

module.exports = mongoose.model('Case', CaseSchema);