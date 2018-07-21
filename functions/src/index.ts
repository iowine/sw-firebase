import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!")
})

export const pushData = functions.https.onRequest((request, response) => {
    /* Get data */
    let data = request.body
    /* Set data */
    admin.database().ref('/dump').set(data)
    /* Verify data */
    admin.database().ref('/dump').once('value').then((snapshot) => {
        response.status(200).send(JSON.stringify(snapshot))
    })
})