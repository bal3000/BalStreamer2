import produce from 'immer';

import { LiveFixture } from '../../models/live-fixture';
import { ActionType } from '../action-types';
import { Actions } from '../actions';

interface FixtureState {
  selectedFixture: LiveFixture | null;
}

const initialState: FixtureState = {
  selectedFixture: null,
};

const reducer = produce(
  (state: FixtureState = initialState, action: Actions) => {
    switch (action.type) {
      case ActionType.SELECT_FIXTURE:
        state.selectedFixture = action.payload;
      default:
        return state;
    }
  }
);

export default reducer;
