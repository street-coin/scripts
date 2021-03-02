const mongoose = require('mongoose');

module.exports = async function () {
    if (mongoose.connection.readyState === 1) return;

    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
    } catch (error) {
        throw process.exit(-1);
    }
}