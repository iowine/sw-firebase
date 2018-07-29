import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!")
})

/**
 * Attempts to insert body.
 * 200 - Success.
 * 400 - DB Error.
 */
export const pushData = functions.https.onRequest((request, response) => {
    const data = {
        time: Date.now(),
        data: request.body
    }
    admin.database().ref('/data').push(data).once('child_added').then(value => {
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
    admin.database().ref('/data').once('value').then(value => {
        response.status(200).send(value)
    }, reason => {
        response.status(400).send(reason)
    })
})