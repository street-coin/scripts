const mongoose = require('mongoose');
const chance = require('chance').Chance();
const { prompt } = require('inquirer');
const chalk = require('chalk');

const AssosModel = require('../../models/schemas/association');
const ContactsModel = require("../../models/schemas/contacts");
const ContactsSchemas = require('mongoose').model('Contacts').schema.obj;

async function add(userData) {
    const arrayOfDocs = [];
    const arrayPrompt = [];
    const assosData = await AssosModel.find({}, 'name').lean();

    for (let index = 0; index < userData.items; index++) {
        const newDoc = {};
        arrayPrompt[index] = {};

        Object.keys(ContactsSchemas).forEach(function (schemaKey) {
            const message = `Document n°${index} ajoutez le champ ${schemaKey}`;

            if (ContactsSchemas[schemaKey].type === mongoose.Types.ObjectId) {
                if (userData.realDatas) {
                    return arrayOfDocs.push({
                        type: 'list',
                        message,
                        name: `${schemaKey}-${index}`,
                        choices() {
                            return assosData.map(assos => {
                                return {
                                    name: assos.name,
                                    value: assos._id
                                }
                            })
                        },
                        filter(value) {
                            arrayPrompt[index][schemaKey] = value;
                            return value;
                        }
                    });
                }

                return newDoc[schemaKey] = assosData[Math.round(Math.random()  * assosData.length)]._id
            }

            if (ContactsSchemas[schemaKey].type === String && schemaKey === 'name') {
                if (userData.realDatas) {
                    return arrayOfDocs.push({
                        type: 'input',
                        name: `${schemaKey}-${index}`,
                        message,
                        validate: function (value) {
                            if (typeof value === 'string') return true;
                            return false;
                        },
                        filter(value) {
                            arrayPrompt[index][schemaKey] = value;
                            return value;
                        }
                    });
                }

                return newDoc[schemaKey] = chance.name().split(' ')[0];
            }

            if (ContactsSchemas[schemaKey].type === String && schemaKey === 'familyname') {
                if (userData.realDatas) {
                    return arrayOfDocs.push({
                        type: 'input',
                        name: `${schemaKey}-${index}`,
                        message,
                        validate: function (a) {
                            if (typeof a === 'string') return true;
                            return false;
                        },
                        filter(value) {
                            arrayPrompt[index][schemaKey] = value;
                            return value;
                        }
                    });
                }

                return newDoc[schemaKey] = chance.name().split(' ')[1];
            }
        });

        if (!userData.realDatas) {
            arrayOfDocs.push(newDoc);
        }
    }

    if (userData.realDatas) {
        await prompt(arrayOfDocs);
    }

    try {
        await ContactsModel.insertMany(userData.realDatas ? arrayPrompt : arrayOfDocs);
        process.stdout.write(chalk`
        {bgGreen Add ${userData.realDatas ? arrayPrompt.length : arrayOfDocs.length} documents in ${userData.collection}}`);
    } catch (error) {
        throw error;
    }
}

module.exports = async function (userData) {
    switch (userData.action) {
        case 'add':
            return await add(userData);
        default:
            break;
    }
};