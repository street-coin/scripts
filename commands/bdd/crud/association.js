const mongoose = require('mongoose');
const AssoModel = require('../../../tmp/association.js');

module.exports = async function (userData) {
    console.log(userData);
    await mongoose.connection.close();
}