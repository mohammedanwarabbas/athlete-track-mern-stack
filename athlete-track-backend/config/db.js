const mongoose = require('mongoose');
require('dotenv').config();

const connetDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB Connected');
    }
    catch (err) {
        console.error('DB Error:', err.message);
        process.exit(1);
    }
}

module.exports = connetDB;