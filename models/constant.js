const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
var mongooseHistory = require('mongoose-history');
// var patchHistory = require('mongoose-patch-history');

const ConstantSchema = new mongoose.Schema({
    id: {
        type: String,
        lowercase: true,
        trim: true,
        required: [
            true, "can't be blank"
        ],
        index: true
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
        required: [
            true, "can't be blank"
        ]
    },
    pluralname: {
        type: String,
        trim: true,
        required: [
            true, "can't be blank"
        ]
    },
    description: {
        type: String,
        trim: true,
        required: [
            true, "can't be blank"
        ]
    },
    data: Schema.Types.Mixed
}, {
        timestamps: true,
        createdby: true,
        updatedby: true
    });

ConstantSchema.statics.createCRUD = true
ConstantSchema.index({ id: 1, type: 1 }, { unique: true });
ConstantSchema.plugin(mongooseHistory);


module.exports = mongoose.model('Constant', ConstantSchema);

