import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import { tap } from 'rxjs/operators';
import { CastService } from '../services/cast.service';
import {
  AddChromecast,
  CastToChromecast,
  RemoveChromecast,
  SetSelectedChromecast,
} from './actions/chromecasts.actions';

export interface ChromecastStateModel {
  chromecasts: string[];
  selectedChromecast: string;
  currentlyPlaying: { [key: string]: { title: string; stream: string } };
}

@State<ChromecastStateModel>({
  name: 'chromecasts',
  defaults: {
    chromecasts: [],
    selectedChromecast: '',
    currentlyPlaying: {},
  },
})
@Injectable()
export class ChromecastState {
  constructor(private readonly castService: CastService) {}

  @Selector()
  static chromecasts(state: ChromecastStateModel) {
    return state.chromecasts;
  }

  @Selector()
  static selectedChromecast(state: ChromecastStateModel) {
    return state.selectedChromecast;
  }

  @Action(AddChromecast)
  addChromecast(
    ctx: StateContext<ChromecastStateModel>,
    action: AddChromecast
  ) {
    ctx.setState(
      produce((draft) => {
        draft.chromecasts.push(action.chromecast.name);
      })
    );
  }

  @Action(RemoveChromecast)
  removeChromecast(
    ctx: StateContext<ChromecastStateModel>,
    action: RemoveChromecast
  ) {
    ctx.setState(
      produce((draft) => {
        this.removeFromArray(draft.chromecasts, action.chromecast.name);
      })
    );
  }

  @Action(SetSelectedChromecast)
  selectChromecast(
    ctx: StateContext<ChromecastStateModel>,
    action: SetSelectedChromecast
  ) {
    ctx.setState(
      produce((draft) => {
        draft.selectedChromecast = action.chromecast;
      })
    );
  }

  @Action(CastToChromecast)
  castStream(
    ctx: StateContext<ChromecastStateModel>,
    action: CastToChromecast
  ) {
    const { chromecast, title, streamURL: stream } = action;
    return this.castService.castStream(chromecast, stream).pipe(
      tap(() => {
        ctx.setState(
          produce((draft) => {
            draft.currentlyPlaying[chromecast] = { title, stream };
          })
        );
      })
    );
  }

  private removeFromArray(chromecasts: string[], chromecastName: string): void {
    const index = chromecasts.findIndex((cast) => cast === chromecastName);
    if (index !== -1) {
      chromecasts.splice(index, 1);
    }
  }
}
