import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrls: ['./device-view.component.sass']
})
export class DeviceViewComponent implements OnInit {

  /** Back-end variables */
  private route: ActivatedRoute
  private db: AngularFireDatabase

  /** Front-end variables */
  device
  deviceData: Observable<any[]> = new Observable()

  temperatureData = [{ data: [], label: 'Temperature' }]
  humidityData = [{ data: [], label: 'Humidity' }]
  chartType = 'line'
  chartLabels = []

  constructor(route: ActivatedRoute, db: AngularFireDatabase) {
    this.route = route
    this.db = db
  }

  ngOnInit() {
    /* Get device name */
    this.device = this.route.snapshot.params.device
    /* Get device ref */
    let deviceRef = this.db.list(`devices/${this.device}/data`)
    /* Get observable of database */
    this.deviceData = deviceRef.valueChanges()
    /* Subscribe to deviceData */
    this.deviceData.subscribe(data => {
      this.update(data)
    }, error => {
      console.error(error)
    })
  }

  update(data) {
    /* Wipe existing data */
    this.temperatureData[0].data.length = 0
    this.humidityData[0].data.length    = 0
    /* Limit incoming data */
    data = data.slice(Math.max(data.length - 100, 1))
    /* For every datapoint */
    data.forEach(dataPoint => {
      /* Add to temperature */
      this.temperatureData[0].data.push({
        X: dataPoint.time,
        y: dataPoint.data.temperature
      })
      /* Add to humidity */
      this.humidityData[0].data.push({
        X: dataPoint.time,
        y: dataPoint.data.humidity
      })
    })
  }

}
