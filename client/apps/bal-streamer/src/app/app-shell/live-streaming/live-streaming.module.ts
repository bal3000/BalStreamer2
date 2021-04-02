import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { LiveStreamingRoutingModule } from './live-streaming-routing.module';

import { LiveStreamingState } from '../../state/livestreaming.state';
import { LiveStreamingComponent } from './live-streaming.component';
import { FixturesComponent } from './fixtures/fixtures.component';
import { FixtureComponent } from './fixtures/fixture/fixture.component';

@NgModule({
  declarations: [LiveStreamingComponent, FixturesComponent, FixtureComponent],
  imports: [
    CommonModule,
    LiveStreamingRoutingModule,
    NgxsModule.forFeature([LiveStreamingState]),
  ],
  exports: [LiveStreamingComponent],
})
export class LiveStreamingModule {}
