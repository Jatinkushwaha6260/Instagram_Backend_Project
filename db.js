const mongoose = require('mongoose');
require('dotenv').config();

// define the mongoDB connection URL
const mongoURL = "mongodb://localhost:27017/Instagram_Practice";

// setup mongoDB connection
mongoose.connect(mongoURL);

// get the default connection
// mongoose maintains a default connection object representing the mongoDB connection
const db = mongoose.connection;

db.on('connected' , () => {
    console.log('connected to mongoDB server');
});

db.on('error' , (err) => {
    console.error('mongoDB connection error:' , err);
});

db.on('disconnected' , () => {
    console.log('mongoDB disconnected');
});

// Export the database connection
module.exports = db;