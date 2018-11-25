import { ViewChild, Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrls: ['./device-view.component.sass']
})
export class DeviceViewComponent implements OnInit {

  /** Back-end variables */
  private route: ActivatedRoute
  private db: AngularFireDatabase
  private dataSubscriber: Subscription
  private routeSubscriber: Subscription

  /** Front-end variables */
  /* Device name */
  device: String
  /* Device data observable */
  deviceData: Observable<any[]> = new Observable()

  /* Global chart options */
  chartType = 'line'
  chartLabels = []
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'hour',
          min: undefined,
          max: undefined
        },
        /* Vertical time */
        ticks: {
          maxRotation: 90,
          minRotation: 90
        }
      }]
    },
    elements: { 
      line: { tension: 0 },
      point: { radius: 0 }
    },
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
  temperatureOptions = this.chartOptions

  /* Temperature chart options */
  humidityData = [{ 
    data: [], 
    label: 'Humidity'
  }]
  humidityColors = [{
    backgroundColor: 'rgba(66,133,244, 0.1)',
    borderColor: 'rgb(66,133,244, 1.0)'
  }]
  humidityOptions = this.chartOptions

  constructor(route: ActivatedRoute, db: AngularFireDatabase) {
    this.route = route
    this.db = db
  }

  ngOnInit() {
    /* Subscribe to route */
    this.routeSubscriber = this.route.params.subscribe(params => {
      /* Get device name */
      this.device = params.device
      /* Get device ref */
      let deviceRef = this.db.list(`devices/${this.device}/data`)
      /* Get observable of database */
      this.deviceData = deviceRef.valueChanges()
      /* Subscribe to deviceData */
      this.dataSubscriber = this.deviceData.subscribe(data => {
        this.update(data)
      }, error => {
        console.error(error)
      })
    })
  }
  ngOnDestroy(): void {
    this.routeSubscriber.unsubscribe()
    this.dataSubscriber.unsubscribe()
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

    /* Update data */
    this.temperatureData = temperatureData
    this.humidityData = humidityData
    if (data.length < 2) return

    /* Update graph start/end */
    let temperatureOptions = this.temperatureOptions
    temperatureOptions.scales.xAxes[0].time.min = temperatureData[0].data[0].x
    temperatureOptions.scales.xAxes[0].time.max = temperatureData[0].data[temperatureData[0].data.length -1].x
    this.temperatureOptions = temperatureOptions

    let humidityOptions = this.humidityOptions
    humidityOptions.scales.xAxes[0].time.min = humidityData[0].data[0].x
    humidityOptions.scales.xAxes[0].time.max = humidityData[0].data[temperatureData[0].data.length -1].x
    this.humidityOptions = humidityOptions
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

/**
 * Frankenstien of a fix
 * https://stackoverflow.com/questions/48905692/ng2-charts-chart-js-how-to-refresh-update-chart-angular-4
 * https://github.com/valor-software/ng2-charts/issues/614
 * https://github.com/valor-software/ng2-charts/issues/547
 */
BaseChartDirective.prototype.ngOnChanges = function (changes) {
  if (this.initFlag) {
      // Check if the changes are in the data or datasets
      if (changes.hasOwnProperty('data') || changes.hasOwnProperty('datasets')) {
          if (changes['data']) {
              this.updateChartData(changes['data'].currentValue);
          }
          else {
              this.updateChartData(changes['datasets'].currentValue);
          }
          // add label change detection every time
          if (changes['labels']) { 
              if (this.chart && this.chart.data && this.chart.data.labels) {
                  this.chart.data.labels = changes['labels'].currentValue;    
              }
          }
          if(changes['options']){
            this.chart.options = changes['options'].currentValue
          }
          this.chart.update();
      }
      else {
          // otherwise rebuild the chart
          this.refresh();
      }
  }};