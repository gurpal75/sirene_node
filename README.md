# Sirene Invader

This Node.js reads and store in a database large files in a time efficient manner.

## Prerequisites

- [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/): `npm i -g pm2`
- [MongoDB](https://docs.mongodb.com/manual/installation/)

## Getting started

```shell
npm install
pm2 start process.json
pm2 delete all (delete all the running processes)
pm2 monit (to monitor any running process)
```

## Features

- Thread pool to share work between workers
- Use Readable Streams
- Efficient write in bulk in MongoDB
- mongoose is the only dependency

## Benchmark

CSV file with 31 957 997 lines: `5:57:193 (m:ss:mmm)`
