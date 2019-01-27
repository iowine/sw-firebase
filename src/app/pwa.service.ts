import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PwaService {

  updateEvent

  promptEvent

  constructor(private swUpdate: SwUpdate) {

    swUpdate.available.subscribe(event => this.updateEvent = event);

    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });
    
  }
}
