import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrls: ['./device-view.component.sass']
})
export class DeviceViewComponent implements OnInit {

  device
  deviceRef: AngularFireList<any>
  deviceData: Observable<any[]> = new Observable()

  constructor(route: ActivatedRoute, db: AngularFireDatabase) {
    this.device = route.snapshot.params.device
    
    /* Get device ref */
    this.deviceRef = db.list(`devices/${this.device}/data`)
    /* Get observable of database */
    //this.deviceData = this.deviceRef.snapshotChanges().pipe(
    //  map(changes => 
    //    changes.map(c => ({key: c.payload}))
    //  )
    //)
    this.deviceData = this.deviceRef.valueChanges()
    console.log(this.deviceData)
  }

  ngOnInit() {
  }

}
