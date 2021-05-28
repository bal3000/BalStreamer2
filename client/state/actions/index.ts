import { Chromecast } from '../../models/chromecast';
import { LiveFixture } from '../../models/live-fixture';
import { ActionType } from '../action-types';

export interface SelectFixtureAction {
  type: ActionType.SELECT_FIXTURE;
  payload: LiveFixture;
}

// export interface FetchChromecastsAction {
//   type: ActionType.FETCH_CHROMECASTS;
// }

// export interface FetchChromecastsCompleteAction {
//   type: ActionType.FETCH_CHROMECASTS_COMPLETE;
//   payload: Chromecast[];
// }

// export interface FetchChromecastsErrorAction {
//   type: ActionType.FETCH_CHROMECASTS_ERROR;
//   payload: string;
// }

export interface SelectChromecastAction {
  type: ActionType.SELECT_CHROMECAST;
  payload: Chromecast;
}

export interface AddChromecastAction {
  type: ActionType.ADD_CHROMECAST;
  payload: Chromecast;
}

export interface RemoveChromecastAction {
  type: ActionType.REMOVE_CHROMECAST;
  payload: Chromecast;
}

export type Actions =
  | SelectFixtureAction
  //   | FetchChromecastsAction
  //   | FetchChromecastsCompleteAction
  //   | FetchChromecastsErrorAction
  | SelectChromecastAction
  | AddChromecastAction
  | RemoveChromecastAction;
