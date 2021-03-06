#!/usr/bin/env node
require('dotenv').config();
const chalk = require('chalk');
const mongoose = require('mongoose');
const { prompt } = require('inquirer');
const { promises } = require("fs");

module.exports = (async function () {
    try {
        const SchemasPath = `${process.cwd()}/commands/models/schemas`;
        await promises.readdir(SchemasPath).length;
        const mongooseActions = require('./crudActions');

        console.log(chalk`
        {cyan Welcome on the bdd services, here you can add, edit, delete datas you want.}
        `);

        const aswr = await prompt([
            {
                type: 'list',
                message: chalk`{cyan In which collections would you like to handle datas.}`,
                name: 'collection',
                choices: Object.keys(mongooseActions)
            },
            {
                type: 'list',
                name: 'action',
                message: chalk`{cyan What would you like to do ?}`,
                choices(a) {
                    const serviceActions = Object.keys(mongooseActions[a.collection]);

                    if (serviceActions.length) {
                        return Object.keys(mongooseActions[a.collection])
                    };

                    process.stdout.write(chalk`
                    {bgRed ${a.collection} service Doesn't contain any actions for the moment come back later.}`);
                    process.exit(-1);
                }
            },
            {
                type: 'number',
                message: chalk`{cyan How many datas would you like to manipulate ?}`,
                name: 'items',
                when(a) {
                    if (a.action === 'add' || a.action === 'update') return true;
                    return false;
                }
            }
        ]);

        if (mongoose.connection.readyState === 0) {
            try {
                await mongoose.connect(process.env.DB_URL, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                    useFindAndModify: false,
                });
                await mongooseActions[aswr.collection][aswr.action](aswr)
                await mongoose.connection.close();
                await promises.rmdir(SchemasPath, { recursive: true });
                process.exit(0);
            } catch (error) {
                throw process.exit(-1);
            }
        }
    } catch (error) {
        process.stderr.write(chalk`
        {bgRed You must add models before creating datas, choose the 'models' service.}
        `);
        process.exit(-1);
    }
})();