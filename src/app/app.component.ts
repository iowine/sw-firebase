import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PwaService } from './pwa.service'

import * as app from 'firebase'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit { 
  
  title
  version
  hash

  /* Notification message */
  message

  constructor(
    private pwaService: PwaService
  ) { 
    // Bind methods to fix temporary bug in AngularFire
    try {
      const _messaging = app.messaging();
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    } catch(e) { }
  }

  ngOnInit() {
    this.title = environment.name
    this.version = environment.version
    this.hash = environment.hash

    this.pwaService.requestPermission()
    this.pwaService.receiveMessage()
    this.message = this.pwaService.currentMessage
  }
}
