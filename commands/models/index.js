#!/usr/bin/env node
const { promises, createWriteStream } = require('fs');

const axios = require('axios');
const { prompt } = require('inquirer');
const chalk = require('chalk');

async function populateSchemas() {
    const modelsData = await axios.get(`https://api.github.com/repos/street-coin/api/contents/models`);
    
    await Promise.all(modelsData.data.map(async function (model) {
        const t = await axios.get(model.download_url, { responseType: 'stream' });
        t.data.pipe(createWriteStream(`${__dirname}/schemas/${model.name}`));
    }));

    console.log(chalk`{cyan It's done your Schemas are created you can now manipulate your database.}`);
    process.exit(0);
}

module.exports = async function () {
    if (!(await promises.readdir(`${__dirname}/schemas`)).length) {
        return await populateSchemas();
    }

    const awsr = prompt([
        {
            type: 'confirm',
            message: chalk`{cyan There is already some schemas would you like to fetch schemas ?}`,
            name: 'fetch'
        }
    ]);

    if (awsr.fetch) {
        return await populateSchemas();
    }
};