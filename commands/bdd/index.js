#!/usr/bin/env node
require('dotenv').config();
const chalk = require('chalk');
const mongoose = require('mongoose');
const { prompt } = require('inquirer');
const { promises } = require("fs");

const mongooseActions = require('./crudActions');

module.exports = async function () {
    process.stdout.write('SDJGDFKGJ');
    if ((await promises.readdir(`${process.cwd()}/commands/models/schemas`)).length) {
        console.log(chalk`
        {cyan Welcome on the bdd services, here you can add, edit, delete datas you want.}
        `);

        const crudServices = await promises.readdir(`${__dirname}/crud`, { withFileTypes: true });

        if (crudServices.every(file => file.isFile())) {
            const services = crudServices.map(file => file.name.split('.')[0]);
            const aswr = await prompt([
                {
                    type: 'list',
                    message: chalk`{cyan In which collections would you like to handle datas.}`,
                    name: 'collection',
                    choices: [...services]
                },
                {
                    type: 'list',
                    name: 'action',
                    message: chalk`{cyan What would you like to do ?}`,
                    choices: ['add', 'delete', 'update']
                },
                {
                    type: 'confirm',
                    message: chalk`{cyan Would you like to add real datas ?}`,
                    name: 'realDatas',
                    when(a) {
                        if (a.action === 'add') return true;
                        return false;
                    }
                },
                {
                    type: 'number',
                    message: chalk`{cyan How many datas would you like to manipulate ?}`,
                    name: 'items',
                    when(a) {
                        if (a.action === 'add' || a.action === 'delete') return true;
                        return false;
                    }
                }
            ]);

            if (!mongoose.connection.readyState === 1) {
                try {
                    await mongoose.connect(process.env.DB_URL, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useCreateIndex: true,
                        useFindAndModify: false,
                    });
                } catch (error) {
                    throw process.exit(-1);
                }
            }

            switch (aswr.collection) {
                case 'association':
                    await mongooseActions.Assos(aswr);
                case 'contacts':
                    await mongooseActions.Contacts(aswr);
                default:
                    break;
            }

            await mongoose.connection.close();
            process.exit(0);
        }

        console.error(chalk`{bgRed Crud folder must only contains files}`);
        return process.exit(-1);
    }

    console.error(chalk`{bgRed You must add models before creating datas, choose the 'models' service.}`);
    return process.exit(-1);
};