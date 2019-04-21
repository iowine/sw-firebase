import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.sass']
})
export class DeviceListComponent implements OnInit {

  /* Database reference */
  db: AngularFireDatabase

  /* Device reference */
  devicesRef: AngularFireList<any>
  devices: Observable<any[]> = new Observable()

  /**
   * Constructor
   */
  constructor(db: AngularFireDatabase) {
    this.db = db
  }

  /**
   * Angular start.
   */
  ngOnInit() { 
    /* Get device ref */
    this.devicesRef = this.db.list('devices')
    /* Get device names */
    this.devices = this.devicesRef.snapshotChanges()
  }

  /**
   * Prevent events.
   */
  stop(event: Event) {
    event.stopPropagation()
  }

}
