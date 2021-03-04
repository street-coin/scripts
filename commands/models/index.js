const { promises, createWriteStream } = require('fs');
const { get } = require('https');

const { prompt } = require('inquirer');
const chalk = require('chalk');

module.exports = async function () {
    if (!(await promises.readdir(`${__dirname}/schemas`)).length) {
        return get(
            {
                host: 'api.github.com',
                path: `/repos/street-coin/api/contents/models`,
                method: 'GET',
                headers: { 'User-Agent': 'street-coin' }
            }, function (models) {
            }
        );
    }

    const awsr = prompt([
        {
            type: 'confirm',
            message: chalk`{cyan There is already some schemas would you like to fetch schemas ?}`,
            name: 'fetch'
        }
    ]);

    if (awsr.fetch) {}
};