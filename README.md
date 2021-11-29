# Sirene Invader

This Node.js reads and store in a database large files in a time efficient manner.

## Prerequisites

- [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/): `npm i -g pm2`
- [MongoDB](https://docs.mongodb.com/manual/installation/)

## Getting started

```shell
npm install `at the beginning seulement`
pm2 start process.json
pm2 delete all (delete all the running processes)
pm2 monit (to monitor any running process)
```

## Features

- Thread pool to share work between workers
- mongoose is the only dependency


## How it works

We are managing the workers in the workerpool. As soon as the worker is done with saving the data, its free to take the next 10 000 records to save (every worker takes 10 000 tasks per time). This continues until all the workers are done saving the data. 
PM2 will keep the workers active untill you kill the workers via the terminal.
