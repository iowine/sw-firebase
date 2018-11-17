import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

/** Heartbeat function */
export const helloWorld = functions.https.onRequest((_, response) => {
    response.send("Hello from IoWine!")
})

/**
 * Attempts to insert body.
 * 200 - Success.
 * 400 - DB Error.
 */
export const pushData = functions.https.onRequest((request, response) => {

    /* Debug log request body */
    console.log(request.body)

    /* Put in raw data */
    admin.database().ref('/raw').push(request.body)

    /* Parse request */
    const device = request.body.device
    const data = {
        time: request.body.time,
        data: {
            temperature: request.body.temperature,
            humidity: request.body.humidity
        }
    }

    /* Insert and return */
    admin.database().ref(`/devices/${device}/data`).push(data).once('child_added').then(value => {
        response.status(200).send(value)
    }, reason => {
        response.status(400).send(reason)
    })
    
})

/**
 * Attempts to get and return data.
 * 200 - Success.
 * 400 - DB Error.
 */
export const getData = functions.https.onRequest((request, response) => {
    console.log(request)
    admin.database().ref('/data').once('value').then(value => {
        response.status(200).send(value)
    }, reason => {
        response.status(400).send(reason)
    })
})