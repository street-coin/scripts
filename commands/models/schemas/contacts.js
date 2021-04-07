const {Schema, model, Types} = require('mongoose');
const mongoose = require("mongoose");
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const ContactSchema = new Schema(
    {
        association: {
            type: Types.ObjectId,
            required: true,
            ref: 'Association'
        },
        name: {
            type: String,
            required: true,
        },
        familyname: {
            type: String,
            required: true
        }
    },
    { timestamps: false }
);

ContactSchema.plugin(deepPopulate);

module.exports = model('Contacts', ContactSchema);