const { promises} = require("fs");
const { get } = require('https');

module.exports = async function (data) {
    get(
        {
            host: 'api.github.com',
            path: `/repos/street-coin/api/contents/models/${data.service}.js`,
            method: 'GET',
            headers: { 'User-Agent': 'street-coin' }
        }, function (model) {
            let modelData = '';
            
            model.setEncoding('utf8');
            model
            .on('data', d => modelData += d)
            .on('end', async function () {
                await promises.mkdir(`${process.cwd()}/tmp`, { recursive: true });
                const modelContent = Buffer.from(JSON.parse(modelData).content, 'base64').toString('utf-8');
                await promises.writeFile(`${process.cwd()}/tmp/${data.service}.js`, modelContent);
            });
        });
};