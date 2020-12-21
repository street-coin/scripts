const chance = require('chance').Chance();
const chalk = require('chalk');
const {prompt} = require('inquirer');
const mongoose = require('mongoose');
const {hash} = require('bcrypt');

module.exports = async function () {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        const aswr = await prompt([
            {
                type: 'list',
                name: 'action',
                message: chalk`{cyan What would you like to do ?}`,
                choices: ['add', 'update', 'delete']
            },
            {
                type: 'list',
                name: 'collection',
                message: chalk`{cyan Which collection would you like to use ?}`,
                choices: ['users', 'sessions']
            },
            {
                type: 'confirm',
                name: 'random',
                when(instance) {
                    if (instance.action === 'add') return true;
                    return false;
                }
            }
        ]);

        const col = mongoose.connection.collection(aswr.collection);

        if (aswr.collection === 'users') {
            const fields = [
                { value: 'name', type: String },
                { value: 'familyname', type: String },
                { value: 'mail', type: String },
                { value: 'password', type: String },
                { value: 'admin', type: Boolean }
            ];

            if (aswr.random) {} // Use chance package.

            const newPrompt = fields.map(function (prompt) {
                const p = {
                    message: chalk`{cyan Add a value for ${prompt.value} field.`,
                    name: prompt.value
                }
            
                if (prompt.type === Boolean) {
                    p.type = 'confirm';
                } else {
                    p.type = 'input';
                }

                return p;
            });

            console.log(newPrompt);
            await prompt(newPrompt);
        }

        await co.close();
    } catch (error) {
        
    }
};