const mongoose = require('mongoose');

module.exports = async function (userData) {
    console.log(userData);
    await mongoose.connection.close();
}