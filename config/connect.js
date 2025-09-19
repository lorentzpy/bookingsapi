const mongoose = require('mongoose');

const username = process.env.MONGO_USER;
const password = encodeURIComponent(process.env.MONGO_PASSWORD); // Encode les caractères spéciaux
const cluster = process.env.MONGO_CLUSTER;
const dbName = process.env.MONGO_DB;

const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

const connectDb = async () => {
    try {
        connection= await mongoose.connect(uri);
        console.log("MongoDB instance connected successfully");
    } catch (err) {
        console.error("MongoDB connection error", err);
        process.exit(1);
    }
};

module.exports = { connectDb };