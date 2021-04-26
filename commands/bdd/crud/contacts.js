const mongoose = require('mongoose');
const chance = require('chance').Chance();
const { prompt } = require('inquirer');
const chalk = require('chalk');

const { Asso, Contact} = require('../../models/schemas/index');
const ContactsSchemas = require('mongoose').model('Contacts').schema.obj;

exports.add = async function(userData) {
    const arrayOfDocs = [];
    const assosData = await Asso.find({}, 'name').lean();

    for (let index = 0; index < userData.items; index++) {
        const newDoc = {};

        Object.keys(ContactsSchemas).forEach(function (schemaKey) {
            if (ContactsSchemas[schemaKey].type === mongoose.Types.ObjectId) {
                return newDoc[schemaKey] = assosData[Math.floor(Math.random()  * assosData.length)]._id
            }

            if (ContactsSchemas[schemaKey].type === String && schemaKey === 'name') {
                return newDoc[schemaKey] = chance.name().split(' ')[0];
            }

            if (ContactsSchemas[schemaKey].type === String && schemaKey === 'familyname') {
                return newDoc[schemaKey] = chance.name().split(' ')[1];
            }
        });

        arrayOfDocs.push(newDoc);
    }
    try {
        await Promise.all(arrayOfDocs.map(async function (newDoc) {
            return await new Contact(newDoc).save();
        }));
        process.stdout.write(chalk`
        {bgGreen Add ${userData.realDatas ? arrayPrompt.length : arrayOfDocs.length} documents in ${userData.collection}}`);
    } catch (error) {
        throw error;
    }
}

exports.delete = async function() {
    try {
        const contactsId = await Contact.find({}, '_id name familyname').lean();

        const aswr = await prompt([
            {
                type: "confirm",
                message: "Would you like to delete all datas ?",
                name: 'deleteAll'
            },
            {
                type: 'checkbox',
                message: 'Select contacts to delete',
                name: 'contacts',
                choices() {
                    return contactsId.map(contact => ({
                        name: `${contact.name} ${contact.familyname}`,
                        value: contact._id
                    }))
                },
                when(a) {
                    if (a.deleteAll) return false;
                    return true;
                }
            }
        ]);

        if (aswr.deleteAll) {
            await Contact.deleteMany();
            return process.stdout.write(chalk`
            {bgGreen Delete all contacts data}
            `);
        }

        await Contact.deleteMany(
            {
                _id: { $in: aswr.contacts}
            }
        );
        return process.stdout.write(chalk`
        {bgGreen Delete ${aswr.contacts.length} contacts}
        `);
    } catch (error) {
        throw error;
    }
}