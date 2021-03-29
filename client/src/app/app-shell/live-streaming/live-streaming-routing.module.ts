import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LiveStreamingComponent } from './live-streaming.component';

const routes: Routes = [
  {
    path: '',
    component: LiveStreamingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveStreamingRoutingModule {}
