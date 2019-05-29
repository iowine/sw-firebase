import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.sass']
})
export class PreviewComponent implements OnInit {

  @Input() device: DataSnapshot

  fullDevice: Observable<any> = new Observable()

  constructor(
    private db: AngularFireDatabase
  ) { }

  ngOnInit() {
    /* Get device ref */
    let devicesRef = this.db.object(`devices/${this.device.key}`)
    /* Get device names */
    this.fullDevice = devicesRef.snapshotChanges()
  }

  /**
   * Prevent events.
   */
  stop(event: Event) {
    event.stopPropagation()
  }

}
