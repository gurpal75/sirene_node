"use strict";

const mongoose = require("mongoose");
const worker_threads = require("worker_threads");

if (worker_threads.parentPort) {
    worker_threads.parentPort.on("message", (lines) => {
        const models = lines.map((line) => {
            const data = line.split(",");
            const stock = {
                _id: new mongoose.Types.ObjectId().toString(),
                siren: data[0] || undefined, //
                nic: data[1] || undefined, //
                siret: data[2] || undefined, //
                dateCreationEtablissement: data[4] || undefined, //
                dateDernierTraitementEtablissement: data[8] || undefined,
                typeVoieEtablissement: data[14] || undefined,
                libelleVoieEtablissement: data[15] || undefined,
                codePostalEtablissement: data[16] || undefined,
                libelleCommuneEtablissement: data[17] || undefined,
                codeCommuneEtablissement: data[20] || undefined,
                dateDebut: data[39] || undefined,
                etatAdministratifEtablissement: data[40] || undefined
            };
            return Object.fromEntries(Object.entries(stock).filter(([, value]) => value !== undefined));
        });
        if (worker_threads.parentPort) {
            worker_threads.parentPort.postMessage(models);
        }
    });
}
