import { normalize } from 'normalizr';
import { takeEvery, apply, put, select } from 'redux-saga/effects';
import {
  fetchIllustBookmarkDetailSuccess,
  fetchIllustBookmarkDetailFailure,
} from '../actions/illustBookmarkDetail.js'
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { ILLUST_BOOKMARK_DETAIL } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchIllustBookmarkDetail(action) {
  const { illustId } = action.payload;
  try {
    const response = yield apply(pixiv, pixiv.illustBookmarkDetail, [illustId]);
    yield put(fetchIllustBookmarkDetailSuccess(response.bookmark_detail, illustId));
  } 
  catch(err) {
    yield put(fetchIllustBookmarkDetailFailure(illustId));
    yield put(addError(err));    
  }
}

export function* watchFetchIllustBookmarkDetail() {
  yield takeEvery(ILLUST_BOOKMARK_DETAIL.REQUEST, handleFetchIllustBookmarkDetail);
}