import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_USER_BOOKMARK_ILLUSTS = 'REQUEST_USER_BOOKMARK_ILLUSTS';
export const RECEIVE_USER_BOOKMARK_ILLUSTS = 'RECEIVE_USER_BOOKMARK_ILLUSTS';
export const STOP_USER_BOOKMARK_ILLUSTS = 'STOP_USER_BOOKMARK_ILLUSTS';
export const CLEAR_USER_BOOKMARK_ILLUSTS = 'CLEAR_USER_BOOKMARK_ILLUSTS';
export const CLEAR_ALL_USER_BOOKMARK_ILLUSTS = 'CLEAR_ALL_USER_BOOKMARK_ILLUSTS';

function receiveUserBookmarkIllust(json, userId, offset) { 
  return {
    type: RECEIVE_USER_BOOKMARK_ILLUSTS,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
      userId,
      offset,
      receivedAt: Date.now(),
    }
  };
}

function requestUserBookmarkIllust(userId, offset) {
  return {
    type: REQUEST_USER_BOOKMARK_ILLUSTS,
    payload: {
      userId,
      offset
    }
  };
}

function stopUserBookmarkIllust(userId){
  return {
    type: STOP_USER_BOOKMARK_ILLUSTS,
    payload: {
      userId
    }
  };
}

function shouldFetchUserBookmarkIllust(state, userId) {
  if (!userId) {
    return false;
  }
  const results = state.userBookmarkIllust[userId];
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchUserBookmarkIllustFromApi(userId, tag, nextUrl) {
  return dispatch => {
    let options = {};
    if (tag) {
      options.tag = tag;
    }
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.userBookmarksIllust(userId, options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestUserBookmarkIllust(userId, offset));
    return promise
      .then(json => dispatch(receiveUserBookmarkIllust(json, userId, offset)))
      .catch(err => {
        dispatch(stopUserBookmarkIllust(userId));
        dispatch(addError(err));
      });
  };
}

export function fetchUserBookmarkIllusts(userId, tag, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchUserBookmarkIllust(getState(), userId)) {
      return dispatch(fetchUserBookmarkIllustFromApi(userId, tag, nextUrl));
    }
  };
}

export function clearUserBookmarkIllusts(userId){
  return {
    type: CLEAR_USER_BOOKMARK_ILLUSTS,
    payload: {
      userId,
    }
  };
}

export function clearAllUserBookmarkIllusts(){
  return {
    type: CLEAR_ALL_USER_BOOKMARK_ILLUSTS,
  };
}