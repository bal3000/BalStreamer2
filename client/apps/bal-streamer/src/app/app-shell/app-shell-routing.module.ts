import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'live-streaming',
    loadChildren: () =>
      import('./live-streaming/live-streaming.module').then(
        (m) => m.LiveStreamingModule
      ),
  },
  {
    path: '**',
    redirectTo: 'live-streaming',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppShellRoutingModule {}
