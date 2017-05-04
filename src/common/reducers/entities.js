import merge from 'lodash.merge';
import {
  BOOKMARK_ILLUST,
  UNBOOKMARK_ILLUST,
  FOLLOW_USER,
  UNFOLLOW_USER,
} from '../constants/actionTypes';

export default function entities(
  state = {
    illusts: {},
    illustComments: {},
    users: {},
    userPreviews: {},
    userProfiles: {},
  },
  action,
) {
  if (action && action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }
  switch (action.type) {
    case BOOKMARK_ILLUST.REQUEST:
      return {
        ...state,
        illusts: Object.keys(state.illusts).reduce(
          (prev, id) => ({
            ...prev,
            [id]: state.illusts[id].id === action.payload.illustId
              ? { ...state.illusts[id], is_bookmarked: true }
              : state.illusts[id],
          }),
          {},
        ),
      };
    case UNBOOKMARK_ILLUST.REQUEST:
      return {
        ...state,
        illusts: Object.keys(state.illusts).reduce(
          (prev, id) => ({
            ...prev,
            [id]: state.illusts[id].id === action.payload.illustId
              ? { ...state.illusts[id], is_bookmarked: false }
              : state.illusts[id],
          }),
          {},
        ),
      };
    case FOLLOW_USER.REQUEST:
      return {
        ...state,
        users: Object.keys(state.users).reduce(
          (prev, id) => ({
            ...prev,
            [id]: state.users[id].id === action.payload.userId
              ? { ...state.users[id], is_followed: true }
              : state.users[id],
          }),
          {},
        ),
      };
    case UNFOLLOW_USER.REQUEST:
      return {
        ...state,
        users: Object.keys(state.users).reduce(
          (prev, id) => ({
            ...prev,
            [id]: state.users[id].id === action.payload.userId
              ? { ...state.users[id], is_followed: false }
              : state.users[id],
          }),
          {},
        ),
      };
    default:
      return state;
  }
}
