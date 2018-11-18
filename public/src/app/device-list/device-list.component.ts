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

  devicesRef: AngularFireList<any>
  devices: Observable<any[]> = new Observable()

  constructor(db: AngularFireDatabase) {
    /* Get device ref */
    this.devicesRef = db.list('devices')
    /* Get observable of database */
    this.devices = this.devicesRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({key: c.payload.key}))
      )
    )
  }

  ngOnInit() { }

}
