"use strict";

const events = require("events");
const worker_threads = require("worker_threads");

class WorkerPool extends events.EventEmitter {
    constructor(threads, workerConfig, taskCallback) {
        super();
        console.log("Creating workerpool...");
        this.workerConfig = workerConfig;
        this.workers = [];
        this.freeWorkers = [];
        this.tasksQueue = [];
        this.taskCallback = taskCallback;
       
        for (let iterator = 0; iterator < threads; iterator++) {
            console.log(`New worker thread spawned ${iterator}`);
            this.createWorker(iterator);
        }
        this.on("newEvent", () => {
            if (this.freeWorkers.length &&
                this.tasksQueue.length <= this.freeWorkers.length) {
                const worker = this.freeWorkers.shift();
                const task = this.tasksQueue.shift();
                if (worker) {
                    worker.instance.postMessage(task);
                }
            }
        });
        this.on("workerIsFree", () => {
            if (this.tasksQueue.length && this.freeWorkers.length) {
                const worker = this.freeWorkers.shift();
                const task = this.tasksQueue.shift();
                if (worker) {
                    worker.instance.postMessage(task);
                }
            }
        });
        console.log(`Workerpool has been created with ${threads} threads!`);
    }
   
    createWorker = (index) => {
        const instance = new worker_threads.Worker(this.workerConfig.path, this.workerConfig.options);
        const worker = { instance, index };
        worker.instance.on("message", async (result) => {
            await this.taskCallback(null, result);
            this.freeWorkers.push(worker);
            this.emit("workerIsFree");
        });
        worker.instance.on("error", async (err) => {
            await this.taskCallback(err, null);
            this.workers.splice(this.workers.indexOf(worker), 1);
            this.createWorker(index);
        });
        this.workers.push(worker);
        this.freeWorkers.push(worker);
        this.emit("workerIsFree");
    }

    runTask = (task) => {
        this.tasksQueue.push(task);
        this.emit("newEvent");
    }

    async close() {
        return new Promise((resolve, reject) => {
            console.log("Checking for free workers...");
            this.on("workerIsFree", () => {
                if (this.freeWorkers.length === this.workers.length) {
                    for (const worker of this.workers) {
                        worker.instance.terminate();
                    }
                    console.log("Objective achieved...Closed the workers");
                    this.emit("closeWorkers");
                }
            });
            if (this.freeWorkers.length === this.workers.length) {
                for (const worker of this.workers) {
                    worker.instance.terminate();
                }
                console.log("Closing the workers as all tasks are completed");
                this.emit("closeWorkers");
            }
            this.once("closeWorkers", () => {
                console.log("Workerpool closed");
                resolve(null);
            });
        });
    }
}
exports.WorkerPool = WorkerPool;
