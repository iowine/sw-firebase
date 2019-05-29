import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.sass']
})
export class DeviceListComponent implements OnInit {

  /* Device reference */
  devicesRef: AngularFireList<any>
  devices: Observable<any[]> = new Observable()

  /**
   * Constructor
   */
  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {  }

  /**
   * Angular start.
   */
  ngOnInit() { 
    this.afAuth.user.subscribe((user) => {
      /* Get device ref */
      this.devicesRef = this.db.list(`users/${user.uid}`)
      /* Get device names */
      this.devices = this.devicesRef.snapshotChanges()
    });
  }

}
