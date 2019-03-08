import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireFunctions } from '@angular/fire/functions';
import { TouchSequence } from 'selenium-webdriver';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, subscribeOn } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaService {

  private token
  currentMessage = new BehaviorSubject(null)

  updateEvent

  promptEvent

  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private fun: AngularFireFunctions,
    private swUpdate: SwUpdate
  ) {

    this.angularFireMessaging.messaging.subscribe(_messaging => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging)
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging)
    })

    swUpdate.available.subscribe(event => this.updateEvent = event);

    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });
    
  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this.token = token
        this.sub('health')
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
  
  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messaging.pipe(tap(payload => {
      console.log("new message received. ", payload);
      this.currentMessage.next(payload);
    }))
  }

  sub(topic) {
    this.fun
      .httpsCallable('subscribeToTopic')({ topic, token: this.token })
      .pipe(tap(_ => console.log(`subscribed to ${topic}`)))
      .subscribe();
  }
  
  unsub(topic) {
    this.fun
      .httpsCallable('unsubscribeFromTopic')({ topic, token: this.token })
      .pipe(tap(_ => console.log(`unsubscribed from ${topic}`)))
      .subscribe();
  }

}
