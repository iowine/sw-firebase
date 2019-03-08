import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { DataSnapshot } from 'firebase-functions/lib/providers/database';

admin.initializeApp()

/**
 * Device API endpoint. Inserts data to Firestore and updates latest.
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

/**
 * Device Health Check. Run as cronjob.
 */
export const deviceHealth: functions.HttpsFunction = functions.https.onRequest(
    (_: functions.Request, response: functions.Response): void => {
        console.log("Health Check starting, getting devices...")

        admin.database().ref('devices').orderByKey().once('value').then((snapshot: DataSnapshot): void => {
            console.log("Parent obtained, checking every child...")

            const now: number = Date.now()
            console.log("Current time: ", now)

            snapshot.forEach((child: DataSnapshot): any => {

                /* Get latest details */
                const device = child.key
                const last: number = child.val().latest.time
                const diff = (now / 1000) - last
                console.log(`Checking child ${device}`, last, diff)

                /* 30 minute cutoff */
                if (diff >= 30 * 60) {
                    console.warn("Device offline.")

                    const payload = {
                        notification: {
                            title: `${child.key} has gone offline.`,
                            body: `Device ${child.key} hasn't been seen for ${diff / 60} minutes.`
                        } /*,
                        webpush: {
                            notification: {
                                timestamp: now,
                                vibrate: [200, 100, 200],
                                icon: 'https://angularfirebase.com/images/logo.png',
                            }
                        }
                        */
                    }

                    admin.messaging().sendToTopic('health', payload)
                        .then(console.log)
                        .catch(console.error)

                }

            })

            response.status(200).send()

        }).catch(console.error)

    }
)


/** https://angularfirebase.com/lessons/fcm-topic-notifications-angularfire-and-callable-functions/#Send-a-Notification-on-Firestore-Document-Create */
export const subscribeToTopic = functions.https.onCall(
    async (data, context) => {
        await admin.messaging().subscribeToTopic(data.token, data.topic);

        return `subscribed to ${data.topic}`;
    }
);

/** https://angularfirebase.com/lessons/fcm-topic-notifications-angularfire-and-callable-functions/#Send-a-Notification-on-Firestore-Document-Create */
export const unsubscribeFromTopic = functions.https.onCall(
    async (data, context) => {
        await admin.messaging().unsubscribeFromTopic(data.token, data.topic);

        return `unsubscribed from ${data.topic}`;
    }
);

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
