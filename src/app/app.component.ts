import { Component, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent { 
  
  title
  version
  hash

  constructor() {
    this.title = environment.name
    this.version = environment.version
    this.hash = environment.hash
  }
}
