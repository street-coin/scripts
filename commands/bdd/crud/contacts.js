const mongoose = require('mongoose');
const chance = require('chance').Chance();
const { prompt } = require('inquirer');

const ContactsModel = require("../../models/schemas/contacts");
const ContactsSchemas = require('mongoose').model('Contacts').schema.obj;

function generateDocuments(userData) {
    const arrayOfDocs = [];

    for (let index = 0; index < userData.items; index++) {
        const newDoc = {};

            Object.keys(ContactsSchemas).forEach(function (schemaKey) {
                if (ContactsSchemas[schemaKey].type === mongoose.Types.ObjectId) {
                    if (userData.realDatas) {
                        newDoc.type = 'input';
                        newDoc.default = mongoose.Types.ObjectId();
                        newDoc.name = '_id';
                        return;
                    }

                    return newDoc[schemaKey] = mongoose.Types.ObjectId();
                }
    
                if (ContactsSchemas[schemaKey].type === String && schemaKey === 'name') {
                    if (userData.realDatas) {       
                        newDoc.type = 'input';
                        newDoc.name = 'name';
                        newDoc.validate = function(a) {
                            if (typeof a === 'string') return true;
                            return false;
                        }
                        return;
                    };

                    return newDoc[schemaKey] = chance.name().split(' ')[0];
                }
    
                if (ContactsSchemas[schemaKey].type === String && schemaKey === 'familyname') {
                    if (userData.realDatas) {
                        newDoc.type = 'input';
                        newDoc.name = 'familyname';
                        newDoc.validate = function (a) {
                            if (typeof a === 'string') return true;
                            return false;
                        }
                        return;
                    }

                    return newDoc[schemaKey] = chance.name().split(' ')[1];
                }
            });

            arrayOfDocs.push(newDoc);
        }

    return arrayOfDocs;

};
module.exports = async function (userData) {
    const docs = generateDocuments(userData);
    
    if (userData.realDatas) {
        console.log(docs);
        const aswr = await prompt(docs);
    }
};