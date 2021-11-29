"use strict";

const path = require("path");
const fs = require("fs");
const readline = require("readline");
const os = require("os");
const worker_pool = require("./worker/workerPool");
const stock = require("./model/stockModel");
const mongodb = require("./database/db");

async function main() {
    if(fs.existsSync(path.join(__dirname, "../stock.csv.bak"))){
        //console.log("File has been processed already...Please delete the bak file and place a new stock.csv");
        process.exit(0);
    }
    console.time(__filename);   
    await mongodb.createConnection();

    const filePath = path.join(__dirname, "../stock.csv");
    const workerPath = path.join(__dirname, "./worker/worker.js");
   
    const inputStream = fs.createReadStream(filePath, {
        encoding: "utf-8",
        start: 1305,
    });

    const rl = readline.createInterface({
        input: inputStream,
        crlfDelay: Infinity,
        terminal: false,
    });

    const NUM_OF_ROWS = 10000; //Change this to change the number of tasks to load
    let lines = [];
    let total_rows_inserted = 0;    

    const workerPoolCallback = async (err, models) => {
        if (models) {
            const data = await stock.StockModel.collection.insertMany(models);
            console.log(`Inserted ${data.insertedCount} documents in MongoDB`);
            total_rows_inserted += data.insertedCount;
            console.log(`Inserted ${total_rows_inserted} documents till now`);
        }
        if (err) {
            console.error(err);
            rl.close();
        }
    };

    const workerPool = new worker_pool.WorkerPool(os.cpus().length - 1, {
        path: workerPath,
        options: { workerData: { path: "./worker/worker.js" } },
    }, workerPoolCallback);

    console.log("Reading file...");

    rl.on("line", (line) => {
        lines.push(line);
        if (lines.length === NUM_OF_ROWS) {
            const taskData = [...lines];
            lines = [];
            workerPool.runTask(taskData);
        }
    });

    rl.on("close", async () => {
        workerPool.runTask(lines);
        await workerPool.close();
        console.log(`Inserted ${total_rows_inserted} documents in total`);
        console.timeEnd(__filename);
        fs.renameSync(filePath, path.join(__dirname, "../stock.csv.bak"));
        const data = await stock.StockModel.collection.countDocuments();
        console.log(`Final count of records in Db: ${JSON.stringify(data)}`);
        await mongodb.closeConnection();        
        process.exit(0);
    });
}
main();
