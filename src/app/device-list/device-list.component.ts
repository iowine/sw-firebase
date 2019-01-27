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

  db: AngularFireDatabase

  devicesRef: AngularFireList<any>
  devices: Observable<any[]> = new Observable()

  constructor(db: AngularFireDatabase) {
    this.db = db
  }

  ngOnInit() { 
    /* Get device ref */
    this.devicesRef = this.db.list('devices')
    /* Get device names */
    this.devices = this.devicesRef.snapshotChanges()
  }

}
