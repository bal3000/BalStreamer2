import { CastedFixture } from '../../models/casted-fixture';
import { Chromecast } from '../../models/chromecast';
import { LiveFixture } from '../../models/live-fixture';
import { ActionType } from '../action-types';

export interface SelectFixtureAction {
  type: ActionType.SELECT_FIXTURE;
  payload: LiveFixture;
}

export interface FetchChromecastsAction {
  type: ActionType.FETCH_CHROMECASTS;
}

export interface FetchChromecastsCompleteAction {
  type: ActionType.FETCH_CHROMECASTS_COMPLETE;
  payload: string[];
}

export interface FetchChromecastsErrorAction {
  type: ActionType.FETCH_CHROMECASTS_ERROR;
  payload: string;
}

export interface SelectChromecastAction {
  type: ActionType.SELECT_CHROMECAST;
  payload: string;
}

export interface AddChromecastAction {
  type: ActionType.ADD_CHROMECAST;
  payload: Chromecast;
}

export interface RemoveChromecastAction {
  type: ActionType.REMOVE_CHROMECAST;
  payload: Chromecast;
}

export interface NowCastingAction {
  type: ActionType.NOW_CASTING;
  payload: CastedFixture;
}

export interface StoppedCastingAction {
  type: ActionType.STOPPED_CASTING;
}

export type Actions =
  | SelectFixtureAction
  | FetchChromecastsAction
  | FetchChromecastsCompleteAction
  | FetchChromecastsErrorAction
  | SelectChromecastAction
  | AddChromecastAction
  | RemoveChromecastAction
  | NowCastingAction
  | StoppedCastingAction;
