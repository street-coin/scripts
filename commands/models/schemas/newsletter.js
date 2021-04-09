const {Schema, model} = require('mongoose');

const NewsletterSchema = new Schema(
    {
        mail: {
            type: String,
            required: true,
            match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        }
    },
    { timestamps: false }
);

module.exports = model('Newsletter', NewsletterSchema);