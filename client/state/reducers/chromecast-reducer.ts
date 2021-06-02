import produce from 'immer';
import { CastedFixture } from '../../models/casted-fixture';

import { ActionType } from '../action-types';
import { Actions } from '../actions';

interface ChromecastState {
  chromecasts: string[];
  selectedChromecast: string | null;
  error: string | null;
  loading: boolean;
  currentlyCasting: CastedFixture | null;
}

const initialState: ChromecastState = {
  chromecasts: [],
  selectedChromecast: null,
  error: null,
  loading: false,
  currentlyCasting: null,
};

const reducer = produce(
  (state: ChromecastState = initialState, action: Actions) => {
    switch (action.type) {
      case ActionType.FETCH_CHROMECASTS:
        state.loading = true;
        state.error = null;
        return state;
      case ActionType.FETCH_CHROMECASTS_COMPLETE:
        state.loading = false;
        state.chromecasts = action.payload;
        state.selectedChromecast = null;
        return state;
      case ActionType.FETCH_CHROMECASTS_ERROR:
        state.loading = false;
        state.error = action.payload;
        return state;
      case ActionType.SELECT_CHROMECAST:
        state.selectedChromecast = action.payload;
        return state;
      case ActionType.ADD_CHROMECAST:
        if (!state.chromecasts.find((c) => c === action.payload.chromecast)) {
          state.chromecasts.push(action.payload.chromecast);
        }
        return state;
      case ActionType.REMOVE_CHROMECAST:
        const index = state.chromecasts.findIndex(
          (c) => c === action.payload.chromecast
        );
        if (index > 0) {
          state.chromecasts.splice(index, 1);
        }
        return state;
      case ActionType.NOW_CASTING:
        state.currentlyCasting = action.payload;
        return state;
      case ActionType.STOPPED_CASTING:
        state.currentlyCasting = null;
        return state;
      default:
        return state;
    }
  }
);

export default reducer;
