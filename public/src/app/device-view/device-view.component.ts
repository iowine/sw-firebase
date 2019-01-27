import { ViewChildren, Component, OnInit, QueryList } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import * as _ from 'lodash';

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrls: ['./device-view.component.sass']
})
export class DeviceViewComponent implements OnInit {
  @ViewChildren(BaseChartDirective)
  private charts: QueryList<BaseChartDirective>

  /** Back-end variables */
  private route: ActivatedRoute
  private db: AngularFireDatabase
  private dataSubscriber: Subscription
  private routeSubscriber: Subscription // For device
  private querySubscriber: Subscription // For graph

  /** Front-end variables */
  /* Device name */
  device: String
  /* How many hours to show */
  DEFAULT_CUTOFF = 1
  private scales = [
    { text: "hour",     value: 1 },
    { text: "6 hours",  value: 6 },
    { text: "12 hours", value: 12 },
    { text: "day",      value: 24 },
    { text: "week",     value: 168 },
    { text: "month",    value: 720 }
  ]
  /* Device data observable required to show graph */
  deviceData: Observable<any[]> = new Observable()
  lastHours: number

  /* Global chart options */
  rawData: any
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
    /* Performence */
    animation: { duration: 0 },
    hover: { animationDuration: 0 },
    responsiveAnimationDuration: 0,
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
    /* Subscribe to query (scale update) */
    this.querySubscriber = this.route.queryParamMap.subscribe(queryParams => {
      /* Get parameter */
      let lastHours = Number(queryParams.get('scale'))
      /* Ignore invalid variable */
      this.lastHours = (lastHours > 0) ? lastHours : this.DEFAULT_CUTOFF
      /* Update graph */
      if (this.rawData) this.filterUpdate(this.rawData)
    })
    /* Subscribe to route (device update) */
    this.routeSubscriber = this.route.params.subscribe(params => {
      /* Get new device's name */
      this.device = params.device
      /* Get new devices' ref */
      this.deviceData = this.db.list(
        `devices/${this.device}/data`, 
        ref => ref.orderByChild('time')
      ).valueChanges()
      /* Subscribe to new device's data */
      this.dataSubscriber = this.deviceData.subscribe(data => {
        this.filterUpdate(data)
      }, error => {
        console.error(error)
      })
    })
  }
  ngOnDestroy(): void {
    this.routeSubscriber.unsubscribe()
    this.querySubscriber.unsubscribe()
    this.dataSubscriber.unsubscribe()
  }

  filterUpdate(data) {
    /* Save data */
    this.rawData = data
    /* Cutoff is in ms */
    let cutoff = this.getCutoff() / 1000
    /* +1h to show data before graph start */
    cutoff -= 60 ** 2
    /* Filter recent data */
    data = _.filter(data, o => {
      return (<any>o).time > cutoff
    })
    /* Update graph */
    this.update(data)
  }

  update(data) {
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
    temperatureOptions.scales.xAxes[0].time.min = new Date(this.getCutoff())
    temperatureOptions.scales.xAxes[0].time.max = Date.now()
    this.temperatureOptions = temperatureOptions

    let humidityOptions = this.humidityOptions
    humidityOptions.scales.xAxes[0].time.min = new Date(this.getCutoff())
    humidityOptions.scales.xAxes[0].time.max = Date.now()
    this.humidityOptions = humidityOptions

    this.charts.forEach(chart => {
      // Hack TypeScript to make it work
      // refresh is private but works regardless
      (<any>chart).refresh()
    })
  }

  /**
   * Returns Date object for cutoff.
   *  e.g. show past <4> hours of data 
   *  `getCutoff(<4> [h] * 60 [min] ** 2 [s] * 1000 [ms])
   * @param cutoff 
   */
  getCutoff(cutoff = null) {
    /* Value fallbacks */
    cutoff = cutoff || this.lastHours || this.DEFAULT_CUTOFF
    cutoff *= 60 ** 2 * 1000
    /* Get cutoff time */
    return Date.now() - cutoff
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
  }
};