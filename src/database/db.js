"use strict";

const mongoose = require("mongoose");
const stock = require("../model/stockModel");

let db;

const createConnection = async () => {
    //Set up default mongoose connection
    var mongoDB = "mongodb://localhost:27017/sirene";
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, minPoolSize: 5, maxPoolSize: 100 });

    //Get the default connection
    db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    return new Promise(function(resolve, reject) {
        db.once("open", async function () {
            console.log("Connected successfully");
            console.log("Truncating DB");
            await stock.StockModel.deleteMany({});
            console.log("DB Truncate complete");
            resolve(db);
        });
    });
};

const closeConnection = async () => {
    console.log("Close Db Connection");
    await db.close();
    console.log("Connection closed");
};

module.exports = {
    createConnection,
    closeConnection
};