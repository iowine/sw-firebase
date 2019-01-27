import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { TIMEOUT } from 'dns';

admin.initializeApp()

/**
 * Attempts to insert body.
 * 200 - Success.
 * 400 - DB Error.
 */
export const pushData = functions.https.onRequest((request, response) => {

    /* Parse request */
    const device = request.body.device
    const data = {
        time: Date.now() / 1000,
        data: {
            time: request.body.time,
            temperature: request.body.temperature,
            humidity: request.body.humidity
        }
    }

    /* Update and insert data */
    insertData(device, data)
        .then(
            _ => updateLatest(device, data),
            reason => response.status(400).send(reason)
        )
        .then(
            value => response.status(200).send(value),
            reason => response.status(400).send(reason)
        )
    
})

function updateLatest(device, data) {
    return new Promise<any>((resolve, reject) => {
        admin.database()
            .ref(`/devices/${device}/latest`)
            .set(data)
            .then(
                value => resolve(value),
                reason => reject(reason)
            )
    })
}

function insertData(device, data) {
    return new Promise<any>((resolve, reject) => {
        admin.database()
            .ref(`/devices/${device}/data`)
            .push(data)
            .once('child_added')
            .then(
                value => resolve(value),
                reason => reject(reason)
            )
    })
}