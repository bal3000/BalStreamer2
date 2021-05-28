import produce from 'immer';

import { Chromecast } from '../../models/chromecast';
import { ActionType } from '../action-types';
import { Actions } from '../actions';

interface ChromecastState {
  chromecasts: Chromecast[];
  selectedChromecast: Chromecast | null;
  error: string | null;
  loading: boolean;
}

const initialState: ChromecastState = {
  chromecasts: [],
  selectedChromecast: null,
  error: null,
  loading: false,
};

const reducer = produce(
  (state: ChromecastState = initialState, action: Actions) => {
    switch (action.type) {
      //   case ActionType.FETCH_CHROMECASTS:
      //     state.loading = true;
      //     state.error = null;
      //     return state;
      //   case ActionType.FETCH_CHROMECASTS_COMPLETE:
      //     state.loading = false;
      //     state.chromecasts = action.payload;
      //     state.selectedChromecast = null;
      //     return state;
      //   case ActionType.FETCH_CHROMECASTS_ERROR:
      //     state.loading = false;
      //     state.error = action.payload;
      //     return state;
      case ActionType.SELECT_CHROMECAST:
        state.selectedChromecast = action.payload;
        return state;
      case ActionType.ADD_CHROMECAST:
        if (
          !state.chromecasts.find(
            (c) => c.chromecast === action.payload.chromecast
          )
        ) {
          state.chromecasts.push(action.payload);
        }
        return state;
      case ActionType.REMOVE_CHROMECAST:
        const index = state.chromecasts.findIndex(
          (c) => c.chromecast === action.payload.chromecast
        );
        if (index > 0) {
          state.chromecasts.splice(index, 1);
        }
        return state;
      default:
        return state;
    }
  }
);

export default reducer;
