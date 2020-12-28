const chance = require('chance').Chance();
const chalk = require('chalk');
const {MongoClient} = require('mongodb');
const {prompt} = require('inquirer');
const {hash} = require('bcrypt');

module.exports = async function () {
    try {
        const m = await MongoClient.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        (await m.db('streetcoin').listCollections({}).toArray()).map(c => c.name);

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
                choices: (await m.db('streetcoin').listCollections({}).toArray()).map(c => c.name)
            },
            {
                type: 'confirm',
                name: 'random',
                when(instance) {
                    if (instance.action === 'add') return true;
                    return false;
                }
            },
            {
                type: 'number',
                name: 'amount',
                when(instance) {
                    if (instance.random) return true;
                    return false;
                }
            }
        ]);

        if (aswr.collection === 'users') {
            const collection = m.db('streetcoin').collection(aswr.collection);

            const fields = [
                { value: 'name', type: String },
                { value: 'familyname', type: String },
                { value: 'mail', type: String },
                { value: 'password', type: String },
                { value: 'admin', type: Boolean }
            ];

            if (aswr.random) {
                const newData = [];

                console.log(chance.address({short_suffix: true}));
                return true;
                return collection.insertMany();
            }

            const newPrompt = fields.map(function (prompt) {
                const p = {
                    message: chalk`{cyan Add a value for ${prompt.value} field.}`,
                    name: prompt.value
                }
                
                if (prompt.type === Boolean) {
                    p.type = 'confirm';
                } else {
                    p.type = 'input';
                }
                
                if (prompt.value === 'password') {
                    p.filter = async function (v) {
                        return await hash(v, 10);
                    }
                }
                
                return p;
            });
            
            const userData = await prompt(newPrompt);
            await collection.insertOne({ ...userData });
        }

        await m.close();
    } catch (error) {
        throw error;
    }
};