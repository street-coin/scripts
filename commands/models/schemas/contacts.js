const {Schema, model, Types} = require('mongoose');
const mongoose = require("mongoose");
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const AssoModel = require('./association');

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

ContactSchema.post('save', async function (doc, next) {
    try {
        await AssoModel.findByIdAndUpdate(
            doc.association,
            {
                $push: { contacts: doc._id }
            }
        ).lean();
        next();
    } catch (error) {
        throw error;
    }
})

module.exports = model('Contacts', ContactSchema);