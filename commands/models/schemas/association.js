const {Schema, model, Types} = require('mongoose');
const mongoose = require("mongoose");
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const AssoSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        },
        contacts: {
            type: [
                {
                    type: Types.ObjectId,
                    ref: 'Contacts'
                }
            ],
            required: true,
        },
        email: {
            type: String,
            required: true,
            match: /^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i
        },
        phone: String
    },
    { timestamps: false }
);

AssoSchema.plugin(deepPopulate);

module.exports = model('Association', AssoSchema);