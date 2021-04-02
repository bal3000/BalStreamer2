import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import { tap } from 'rxjs/operators';

import { LiveFixture } from '../models/live-fixture';
import { Streams } from '../models/streams';
import { LivestreamingService } from '../services/livestreaming.service';
import {
  GetStreams,
  PopulateFixtures,
  SelectFixture,
} from './actions/livestreaming.actions';

export interface LiveStreamingStateModel {
  fixtures: LiveFixture[];
  selectedFixture: LiveFixture | undefined;
  streams: { [key: string]: Streams };
}

@State<LiveStreamingStateModel>({
  name: 'livestreaming',
  defaults: {
    fixtures: [],
    selectedFixture: undefined,
    streams: {},
  },
})
@Injectable()
export class LiveStreamingState {
  constructor(private readonly streamingService: LivestreamingService) {}

  @Selector()
  static fixtures(state: LiveStreamingStateModel) {
    return state.fixtures;
  }

  @Selector()
  static selectedFixture(state: LiveStreamingStateModel) {
    return state.selectedFixture;
  }

  @Selector()
  static selectFixtureStreams(state: LiveStreamingStateModel) {
    return (timerId: string) => {
      return state.streams[timerId];
    };
  }

  @Action(PopulateFixtures)
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

  @Action(GetStreams)
  getStreams(ctx: StateContext<LiveStreamingStateModel>, action: GetStreams) {
    // if it already exists, return
    if (ctx.getState().streams[action.timerId]) {
      return;
    }

    return this.streamingService.getStreams(action.timerId).pipe(
      tap((results) => {
        ctx.setState(
          produce((draft) => {
            draft.streams[action.timerId] = results;
          })
        );
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
