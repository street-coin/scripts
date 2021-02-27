const { createWriteStream, mkdir } = require("fs");
const { request } = require('https');
const axios = require('axios');

module.exports = function (data) {
    const modelStream = createWriteStream(`${process.cwd()}/tmp/${data.service}.js`);
    request('https://api.github.com/repos/street-coin/api/contents/models', function (models) {
        models.on('data', d => console.log(d));

        mkdir(`${process.cwd()}/tmp`, { recursive: true }, (err) => {
            if (err) throw err;
            process.exit(0);
        });
    });
};