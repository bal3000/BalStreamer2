import { Dispatch } from 'react';

import { Chromecast } from '../../models/chromecast';
import { LiveFixture } from '../../models/live-fixture';
import { ActionType } from '../action-types';
import {
  Actions,
  AddChromecastAction,
  RemoveChromecastAction,
  SelectChromecastAction,
  SelectFixtureAction,
} from '../actions';
import streamerApi from '../../helpers/api-caller';

export const selectFixture = (fixture: LiveFixture): SelectFixtureAction => {
  return {
    type: ActionType.SELECT_FIXTURE,
    payload: fixture,
  };
};

export const selectChromecast = (
  chromecast: string
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

export const fetchChromecasts = () => {
  return async (dispatch: Dispatch<Actions>) => {
    dispatch({ type: ActionType.FETCH_CHROMECASTS });

    try {
      const { data } = await streamerApi.get<string[]>('/api/chromecasts');
      dispatch({ type: ActionType.FETCH_CHROMECASTS_COMPLETE, payload: data });
    } catch (err) {
      dispatch({
        type: ActionType.FETCH_CHROMECASTS_ERROR,
        payload: err.message,
      });
    }
  };
};
