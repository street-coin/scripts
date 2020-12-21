#!/usr/bin/env node
require('dotenv').config();

const chalk = require('chalk');
const {prompt} = require('inquirer');
const {promises} = require('fs');

const bdd = require('./commands/bdd');

(async function () {
    try {
        const cmd = await promises.readdir(`${process.cwd()}/commands`, {withFileTypes: true});

        if (cmd.every(file => file.isFile)) {
            const actions = cmd.map(action => action.name);
            const aswr = await prompt([
                {
                    type: 'list',
                    name: 'service',
                    message: chalk`{cyan Which services would you like to use ?}`,
                    choices: [ ...actions ]
                }
            ]);

            switch (aswr.service) {
                case 'bdd.js':
                    return await bdd();
                default:
                    break;
            }
        }

        return process.exit(0);
    } catch (error) {
        throw error;
    }
})();