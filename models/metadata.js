var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var mongooseHistory = require('mongoose-history');
// var patchHistory = require('mongoose-patch-history');

var MetadataSchema = new mongoose.Schema({
    id: {
        type: String,
        lowercase: true,
        trim: true,
        required: [
            true, "can't be blank"
        ],
        index: true
    },
    appid: {
        type: String,
        index: true,
        required: [
            true, "can't be blank"
        ]
    },
    type: {
        type: String,
        lowercase: true,
        trim: true,
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
    pluralname: {
        type: String,
        trim: true,
        required: [true, "can't be blank"]
    },
    icon: {
        type: String
    },

    description: {
        type: String,
        trim: true,
        required: [true, "can't be blank"]
    },
    definition: {
        type: Schema.Types.Mixed,
        trim: true,
        required: [
            true, "can't be blank"
        ],
        default: {}
    }

}, {
        timestamps: true,
        createdby: true,
        updatedby: true
    });

MetadataSchema.statics.createCRUD = true
MetadataSchema.index({ id: 1, appid: 1, type: 1 }, { unique: true });
MetadataSchema.plugin(uniqueValidator, { message: 'is already taken.' });
MetadataSchema.plugin(mongooseHistory);

module.exports = mongoose.model('Metadata', MetadataSchema);