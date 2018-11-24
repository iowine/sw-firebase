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
  /* Device name */
  device
  /* Device data observable */
  deviceData: Observable<any[]> = new Observable()

  /* Global chart options */
  chartType = 'line'
  chartLabels = []
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

  /* Temperature chart options */
  temperatureData = [{ 
    data: [], 
    label: 'Temperature'
  }]
  temperatureColors = [{
    backgroundColor: 'rgba(219, 68, 55, 0.1)',
    borderColor: 'rgba(219, 68, 55, 1.0)'
  }]

  /* Temperature chart options */
  humidityData = [{ 
    data: [], 
    label: 'Humidity'
  }]
  humidityColors = [{
    backgroundColor: 'rgba(66,133,244, 0.1)',
    borderColor: 'rgb(66,133,244, 1.0)'
  }]

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
    /* Limit incoming data */
    data = this.filterLastTime(data)
    /* For every datapoint */
    let temperatureData = [{ 
      data: [], 
      label: 'Temperature'
    }]
    let humidityData = [{ 
      data: [], 
      label: 'Humidity'
    }]
    data.forEach(dataPoint => {
      /* Add to temperature */
      temperatureData[0].data.push({
        x: dataPoint.time * 1000,
        y: dataPoint.data.temperature
      })
      /* Add to humidity */
      humidityData[0].data.push({
        x: dataPoint.time * 1000,
        y: dataPoint.data.humidity
      })
    })
    this.temperatureData = temperatureData
    this.humidityData = humidityData
  }

  /**
   * Limits to data to a given cutoff time.
   *  e.g. show past <4> hours of data 
   *  `filterLastTime(data, <4> [h] * 60 [min] ** 2 [s] * 1000 [ms])
   * @param data 
   * @param cutoff 
   */
  filterLastTime(data, cutoff = 4 * 60 ** 2 * 1000) {
    /* Get cutoff time */
    let cutoffTime = Date.now() - cutoff
    /* Set up filtered array and loop backwards until cutoff */
    let filteredData = []
    data.forEach(dataPoint => {
      let latestTime = dataPoint.time * 1000
      if (latestTime > cutoffTime) filteredData.push(dataPoint)
    })
    return filteredData.sort()
  }

}
