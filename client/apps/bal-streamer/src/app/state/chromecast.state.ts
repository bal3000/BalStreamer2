import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import {
  AddChromecast,
  RemoveChromecast,
  SetSelectedChromecast,
} from './actions/chromecasts.actions';

export interface ChromecastStateModel {
  chromecasts: string[];
  selectedChromecast: string;
}

@State<ChromecastStateModel>({
  name: 'chromecasts',
  defaults: {
    chromecasts: [],
    selectedChromecast: '',
  },
})
@Injectable()
export class ChromecastState {
  @Selector()
  // tslint:disable-next-line: typedef
  static chromecasts(state: ChromecastStateModel) {
    return state.chromecasts;
  }

  @Selector()
  // tslint:disable-next-line: typedef
  static selectedChromecast(state: ChromecastStateModel) {
    return state.selectedChromecast;
  }

  @Action(AddChromecast)
  // tslint:disable-next-line: typedef
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
  // tslint:disable-next-line: typedef
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
  // tslint:disable-next-line: typedef
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

  private removeFromArray(chromecasts: string[], chromecastName: string): void {
    const index = chromecasts.findIndex((cast) => cast === chromecastName);
    if (index !== -1) {
      chromecasts.splice(index, 1);
    }
  }
}
