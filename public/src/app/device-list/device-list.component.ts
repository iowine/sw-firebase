import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.sass']
})
export class DeviceListComponent implements OnInit {

  public devices

  constructor(db: AngularFireDatabase) {
    this.devices = db.list('/devices')
  }

  ngOnInit() {
    
  }

}
