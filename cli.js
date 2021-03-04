#!/usr/bin/env node
require('dotenv').config();

const chalk = require('chalk');
const { prompt } = require('inquirer');
const { promises } = require('fs');

const bdd = require('./commands/bdd/index');
const models = require('./commands/models/index');

(async function () {
    try {
        const cmd = await promises.readdir(`${process.cwd()}/commands`, { withFileTypes: true });

        const actions = cmd.map(action => action.name);
        const aswr = await prompt([
            {
                type: 'list',
                name: 'service',
                message: chalk`{cyan Which services would you like to use ?}`,
                choices: [...actions]
            }
        ]);

        switch (aswr.service) {
            case 'bdd':
                await bdd();
            case 'models':
                return await models();
            default:
                break;
        }

        return process.exit(0);
    } catch (error) {
        throw error;
    }
})();