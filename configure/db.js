const mongoose = require('mongoose');
const colours = require('colours');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected ${mongoose.connection.host}`.bgGreen);
    } catch (error) {
        console.log(`MongoDB server issue ${error}`.bgRed.white);
    }
};

module.exports = connectDB;
