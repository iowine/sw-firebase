import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DeviceViewComponent } from './device-view/device-view.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    DeviceViewComponent,
    DeviceListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
