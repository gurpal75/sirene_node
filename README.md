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


