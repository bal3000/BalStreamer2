import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LiveStreamingState } from '../../../state/livestreaming.state';
import { LiveFixture } from '../../../models/live-fixture';
import {
  PopulateFixtures,
  SelectFixture,
} from '../../../state/actions/livestreaming.actions';
import { SportType } from '../../../models/sport-type.enum';

@Component({
  selector: 'client-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.scss'],
})
export class FixturesComponent implements OnInit {
  @Select(LiveStreamingState.fixtures)
  fixtures$!: Observable<LiveFixture[]>;

  @Select(LiveStreamingState.selectedFixture)
  selectedFixture$!: Observable<LiveFixture | undefined>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.store.dispatch(new PopulateFixtures(SportType.Soccer, now, tomorrow));
  }

  selectFixture(fixture: LiveFixture): void {
    this.store.dispatch(new SelectFixture(fixture));
  }
}
