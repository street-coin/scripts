const {Schema, model, Types} = require('mongoose');

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
            type: [Types.ObjectId],
            required: true,
            ref: 'Contacts'
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

AssoSchema.post('find', function (doc) {
    console.log(doc);
})

module.exports = model('Association', AssoSchema);