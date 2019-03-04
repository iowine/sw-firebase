import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-device-edit',
  templateUrl: './device-edit.component.html',
  styleUrls: ['./device-edit.component.sass']
})
export class DeviceEditComponent implements OnInit {

  /* Device name */
  device: String

  db: AngularFireDatabase

  devicesRef: AngularFireList<any>
  deviceData: Observable<any[]> = new Observable()

  private route: ActivatedRoute
  private routeSubscriber: Subscription // For device

  constructor(route: ActivatedRoute, db: AngularFireDatabase) {
    this.route = route
    this.db = db
  }
  ngOnInit() { 
    this.routeSubscriber = this.route.params.subscribe(params => {
      /* Get new device's name */
      this.device = params.device
      /* Get device ref */
      this.devicesRef = this.db.list(`devices/${this.device}`)
      /* Get device names */
      this.deviceData = this.devicesRef.snapshotChanges()
      console.log(this.deviceData)
    })
  }
  ngOnDestroy(): void {
    this.routeSubscriber.unsubscribe()
  }

  onName(value) {
    this
      .db
      .object(`/devices/${this.device}`)
      .update({ name: value })
  }

  onDesc(value) {
    this
      .db
      .object(`/devices/${this.device}`)
      .update({ desc: value })
  }

}
