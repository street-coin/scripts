const {Schema, model, Types} = require('mongoose');

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

module.exports = model('Contacts', ContactSchema);