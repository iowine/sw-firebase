import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { of, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-device-edit',
  templateUrl: './device-edit.component.html',
  styleUrls: ['./device-edit.component.sass']
})
export class DeviceEditComponent implements OnInit {

  /* Device name */
  device: String

  /* Database reference */
  db: AngularFireDatabase

  /* Device and data references */
  devicesRef: AngularFireList<any>
  deviceData: Observable<any[]> = new Observable()

  /* Route references */
  private route: ActivatedRoute
  private routeSubscriber: Subscription // For device

  /**
   * Constructor
   */
  constructor(route: ActivatedRoute, db: AngularFireDatabase) {
    this.route = route
    this.db = db
  }

  /**
   * Angular start.
   */
  ngOnInit() { 
    this.routeSubscriber = this.route.params.subscribe(params => {
      /* Get new device's name */
      this.device = params.device
      /* Get device ref */
      this.devicesRef = this.db.list(`devices/${this.device}`)
      /* Get device names */
      this.devicesRef.snapshotChanges().subscribe(values => {
        let deviceData = [ "name", "desc" ];

        values.forEach((value, index) => {
          if (value.key == "name") {
            deviceData[0] = value.payload.val()
          } else if (value.key == "desc") {
            deviceData[1] = value.payload.val()
          }
        })        

        this.deviceData = of(deviceData)
      })
    })
  }

  /**
   * Angular end.
   */
  ngOnDestroy(): void {
    this.routeSubscriber.unsubscribe()
  }

  /**
   * Update device name.
   */
  onName(value) {
    this
      .db
      .object(`/devices/${this.device}`)
      .update({ name: value })
  }

  /**
   * Update device description.
   */
  onDesc(value) {
    this
      .db
      .object(`/devices/${this.device}`)
      .update({ desc: value })
  }

}
