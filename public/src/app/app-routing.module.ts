import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceViewComponent } from './device-view/device-view.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'device/:device',
    component: DeviceViewComponent
  },
  {
    path: 'device-list',
    component: DeviceListComponent,
    data: { db : AngularFireDatabase }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
