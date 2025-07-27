const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('✅ Mongodb connected')
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

module.exports = connectDB