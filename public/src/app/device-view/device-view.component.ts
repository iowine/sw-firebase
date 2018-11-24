import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
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

  chartType = 'line'
  chartLabels = []

  temperatureData = [{ 
    data: [], 
    label: 'Temperature'
  }]
  temperatureColors = [{
    backgroundColor: 'rgba(219, 68, 55, 0.1)',
    borderColor: 'rgba(219, 68, 55, 1.0)'
  }]

  humidityData = [{ 
    data: [], 
    label: 'Humidity'
  }]
  humidityColors = [{
    backgroundColor: 'rgba(66,133,244, 0.1)',
    borderColor: 'rgb(66,133,244, 1.0)'
  }]

  chartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'hour'
        },
        /* Vertical time */
        ticks: {
          maxRotation: 90,
          minRotation: 90
        }
      }]
    }
  }
  temperatureOptions = this.chartOptions
  humidityOptions = this.chartOptions

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
    data = this.filterLastTime(data)
    console.log(data)
    /* For every datapoint */
    data.forEach(dataPoint => {
      /* Add to temperature */
      this.temperatureData[0].data.push({
        x: dataPoint.time * 1000,
        y: dataPoint.data.temperature
      })
      /* Add to humidity */
      this.humidityData[0].data.push({
        x: dataPoint.time * 1000,
        y: dataPoint.data.humidity
      })
    })
  }

  /**
   * Limits to data to a given cutoff time.
   * E.g. show past <4> hours of data `filterLastTime(data, <4> * 60 ** 2)
   * @param data 
   * @param cutoff 
   */
  filterLastTime(data, cutoff = 4 * 60 ** 2) {
    /* Get cutoff time */
    let cutoffTime = new Date((data[data.length - 1].time - cutoff) * 1000)
    /* Set up filtered array and loop backwards until cutoff */
    let index = data.length - 1
    let filteredData = []
    while (index > 0) {
      let latestTime = new Date(data[index].time * 1000)
      if (latestTime < cutoffTime) return filteredData
      filteredData.push(data[index--])
    }
  }

}
