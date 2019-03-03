import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceViewComponent } from './device-view/device-view.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { HomeComponent } from './home/home.component';
import { DeviceEditComponent } from './device-edit/device-edit.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'device',
    component: DeviceListComponent,
    children: [
      {
        path: 'edit/:device',
        component: DeviceEditComponent
      },
      {
        path: 'view/:device',
        component: DeviceViewComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
