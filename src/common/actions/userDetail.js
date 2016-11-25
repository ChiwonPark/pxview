import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_USER_DETAIL = 'REQUEST_USER_DETAIL';
export const RECEIVE_USER_DETAIL = 'RECEIVE_USER_DETAIL';
export const STOP_USER_DETAIL = 'STOP_USER_DETAIL';
export const CLEAR_USER_DETAIL = 'CLEAR_USER_DETAIL';
export const CLEAR_ALL_USER_DETAIL = 'CLEAR_ALL_USER_DETAIL';

function receiveUserDetail(json, userId) { 
  return {
    type: RECEIVE_USER_DETAIL,
    payload: {
      item: {
        user: json.user,
        profile: json.profile,
        workspace: json.workspace,
      },
      userId,
      receivedAt: Date.now(),
    }
  };
}

function requestUserDetail(userId) {
  return {
    type: REQUEST_USER_DETAIL,
    payload: {
      userId,
    }
  };
}

function stopUserDetail(userId){
  return {
    type: STOP_USER_DETAIL,
    payload: {
      userId,
    }
  };
}

function shouldFetchUserDetail(state, userId) {
  if (!userId) {
    return false;
  }
  const results = state.userDetail[userId];
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchUserDetailFromApi(userId) {
  return dispatch => {
    dispatch(requestUserDetail(userId));
    return pixiv.userDetail(userId)
      .then(json => dispatch(receiveUserDetail(json, userId)))
      .catch(err => {
        dispatch(stopUserDetail(userId));
        dispatch(addError(err));
      });
  };
}

export function fetchUserDetail(userId) {
  return (dispatch, getState) => {
    if (shouldFetchUserDetail(getState(), userId)) {
      return dispatch(fetchUserDetailFromApi(userId));
    }
  };
}

export function clearUserDetail(userId){
  return {
    type: CLEAR_USER_DETAIL,
    payload: {
      userId,
    }
  };
}

export function clearAllUserDetail(){
  return {
    type: CLEAR_ALL_USER_DETAIL,
  };
}