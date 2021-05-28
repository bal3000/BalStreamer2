import { combineReducers } from 'redux';

import fixtureReducer from './fixture-reducer';
import chromecastReducer from './chromecast-reducer';

const reducers = combineReducers({
  fixture: fixtureReducer,
  chromecasts: chromecastReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
