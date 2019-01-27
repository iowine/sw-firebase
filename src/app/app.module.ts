import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DeviceViewComponent } from './device-view/device-view.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';
import { ChartsModule } from 'ng2-charts';
import { LoadingComponent } from './loading/loading.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DeviceEditComponent } from './device-edit/device-edit.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    DeviceViewComponent,
    DeviceListComponent,
    HomeComponent,
    LoadingComponent,
    DeviceEditComponent,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    ChartsModule,
    AngularFontAwesomeModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
