import { Chromecast } from '../../models/chromecast';
import { LiveFixture } from '../../models/live-fixture';
import { ActionType } from '../action-types';
import {
  AddChromecastAction,
  RemoveChromecastAction,
  SelectChromecastAction,
  SelectFixtureAction,
} from '../actions';

export const selectFixture = (fixture: LiveFixture): SelectFixtureAction => {
  return {
    type: ActionType.SELECT_FIXTURE,
    payload: fixture,
  };
};

export const selectChromecast = (
  chromecast: Chromecast
): SelectChromecastAction => {
  return {
    type: ActionType.SELECT_CHROMECAST,
    payload: chromecast,
  };
};

export const addChromecast = (chromecast: Chromecast): AddChromecastAction => {
  return {
    type: ActionType.ADD_CHROMECAST,
    payload: chromecast,
  };
};

export const removeChromecast = (
  chromecast: Chromecast
): RemoveChromecastAction => {
  return {
    type: ActionType.REMOVE_CHROMECAST,
    payload: chromecast,
  };
};
