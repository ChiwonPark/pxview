import { 
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT,
  REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAILURE,
  AUTH_REHYDRATE_DONE
} from '../actions/auth';
import { REHYDRATE } from 'redux-persist/constants';
// const defaultUser = {
//   "profile_image_urls": {
//     "px_16x16": "https://source.pixiv.net/common/images/no_profile_ss.png",
//     "px_50x50": "https://source.pixiv.net/common/images/no_profile_s.png",
//     "px_170x170": "https://source.pixiv.net/common/images/no_profile.png"
//   },
//   "id": "17944295",
//   "name": "mysticmana",
//   "account": "mysticmana",
//   "mail_address": "mysticmana@gmail.com",
//   "is_premium": false,
//   "x_restrict": 2,
//   "is_mail_authorized": true,
//   accessToken: "jfkafjlaf",
//   refreshToken: "",
//   expiresIn: 3600,
// }
export default function auth(state = {
  loading: false,
  loaded: false,
  user: null,
  rehydrated: false
}, action) {
  switch (action.type) {
    case LOGOUT:
      return {
        ...state,
        user: null,
        loaded: false,
      }
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.payload.user,
        timestamp: action.payload.timestamp,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case REHYDRATE:
      return {
        ...state,
        ...action.payload.auth,
        rehydrated: false
      }
    case AUTH_REHYDRATE_DONE:
      return {
        ...state,
        rehydrated: true
      }
    case REFRESH_TOKEN_REQUEST:
      return {
        ...state,
        refreshTokenPromise: action.payload.refreshTokenPromise,
      };
    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        timestamp: Date.now(),
        refreshTokenPromise: null,
        //refreshTokenPromise: Promise.resolve(),
      }
    case REFRESH_TOKEN_FAILURE: 
      return {
        ...state,
        user: null,
        timestamp: Date.now(),
        refreshTokenPromise: null,
        //refreshTokenPromise: Promise.resolve(),
      }
    default:
      return state;
  }
}