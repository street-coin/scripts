const chalk = require('chalk');
const { prompt } = require('inquirer');
const { promises } = require("fs");

const initCrud = require('../../utils/initcrud');
const connecBdd = require('../../utils/connectBdd');
const mongooseActions = require('./crudActions');

module.exports = async function () {
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
                name: 'service',
                choices: [ ...services ]
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
                name: 'fakeData',
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

        await initCrud(aswr);
        await connecBdd();

        switch (aswr.service) {
            case 'association':
                await mongooseActions.Assos(aswr);
            default:
                break;
        }

        await promises.rmdir(`${process.cwd()}/tmp`, { recursive: true });
        return process.exit(0);
    }

    console.error(chalk`{red Crud folder must only contains files}`);
    return process.exit(0);
};