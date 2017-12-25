var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var mongooseHistory = require('mongoose-history');
// var patchHistory = require('mongoose-patch-history');

var AppSchema = new mongoose.Schema({
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
    owner: {
        type: String,
        required: [true, "can't be blank"]
    },
    description: {
        type: String,
        trim: true,
        required: [true, "can't be blank"]
    },
    definition: {
        type: Schema.Types.Mixed,
        default: {}
    },
    settings: {
        type: Schema.Types.Mixed,
        default: {}
    },
    versions: {
        type: Array,
        default: [0.1]
    }
}, {
        runSettersOnQuery: true,
        timestamps: true,
        createdby: true,
        updatedby: true
    });

AppSchema.statics.createCRUD = true
AppSchema.plugin(uniqueValidator, { message: 'is already taken.' });
AppSchema.plugin(mongooseHistory);

module.exports = mongoose.model('App', AppSchema);