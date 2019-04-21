import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { DeviceViewComponent } from './device-view/device-view.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { HomeComponent } from './home/home.component';
import { DeviceEditComponent } from './device-edit/device-edit.component';

const desktop_routes: Routes = [
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

const mobile_routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'device',
    component: DeviceListComponent,
  },
  {
    path: 'device/edit/:device',
    component: DeviceEditComponent
  },
  {
    path: 'device/view/:device',
    component: DeviceViewComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(desktop_routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

   constructor(router: Router) {
    if (window.innerWidth < 768) router.resetConfig(mobile_routes)
  }

 }
