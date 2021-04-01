import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import { tap } from 'rxjs/operators';

import { LiveFixture } from '../models/live-fixture';
import { LivestreamingService } from '../services/livestreaming.service';
import {
  PopulateFixtures,
  SelectFixture,
} from './actions/livestreaming.actions';

export interface LiveStreamingStateModel {
  fixtures: LiveFixture[];
  selectedFixture: LiveFixture | undefined;
}

@State<LiveStreamingStateModel>({
  name: 'livestreaming',
  defaults: {
    fixtures: [],
    selectedFixture: undefined,
  },
})
@Injectable()
export class LiveStreamingState {
  constructor(private readonly streamingService: LivestreamingService) {}

  @Selector()
  // tslint:disable-next-line: typedef
  static fixtures(state: LiveStreamingStateModel) {
    return state.fixtures;
  }

  @Selector()
  // tslint:disable-next-line: typedef
  static selectedFixture(state: LiveStreamingStateModel) {
    return state.selectedFixture;
  }

  @Action(PopulateFixtures)
  // tslint:disable-next-line: typedef
  populateFixtures(
    ctx: StateContext<LiveStreamingStateModel>,
    action: PopulateFixtures
  ) {
    const { sportType, fromDate, toDate } = action;
    return this.streamingService
      .getFixtures(
        sportType,
        this.convertDateToString(fromDate),
        this.convertDateToString(toDate)
      )
      .pipe(
        tap((results) => {
          ctx.setState(
            produce((draft) => {
              draft.fixtures = results;
            })
          );
        })
      );
  }

  @Action(SelectFixture)
  // tslint:disable-next-line: typedef
  selectFixture(
    ctx: StateContext<LiveStreamingStateModel>,
    action: SelectFixture
  ) {
    ctx.setState(
      produce((draft) => {
        draft.selectedFixture = action.fixture;
      })
    );
  }

  private convertDateToString(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }
}
