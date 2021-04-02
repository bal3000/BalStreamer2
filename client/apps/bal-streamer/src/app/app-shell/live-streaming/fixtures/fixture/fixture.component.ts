import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Streams } from '../../../../models/streams';
import { LiveFixture } from '../../../../models/live-fixture';
import { LiveStreamingState } from '../../../../state/livestreaming.state';
import { ChromecastState } from '../../../../state/chromecast.state';
import { CastToChromecast } from '../../../../state/actions/chromecasts.actions';

@Component({
  selector: 'client-fixture',
  templateUrl: './fixture.component.html',
  styleUrls: ['./fixture.component.scss'],
})
export class FixtureComponent implements OnInit {
  @Input() fixture: LiveFixture;

  @Select(ChromecastState.selectedChromecast)
  selectedChromecast$: Observable<string>;

  streams$: Observable<Streams>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.streams$ = this.store
      .select(LiveStreamingState.selectFixtureStreams)
      .pipe(map((fn) => fn(this.fixture.timerId)));
  }

  castStream(stream: string, chromecast: string): void {
    this.store.dispatch(
      new CastToChromecast(this.fixture.title, stream, chromecast)
    );
  }
}
