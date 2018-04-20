/* eslint-disable max-len, no-confusing-arrow */
/* eslint-env es6 */

import { createSelector, createSelectorCreator } from 'reselect';
import equals from 'shallow-equals';
import { denormalize } from 'normalizr';
import parseNovelText from '../helpers/novelTextParser';
import Schemas from '../constants/schemas';

function defaultEqualityCheck(currentVal, previousVal) {
  return currentVal === previousVal;
}

function specialMemoize(
  func,
  resultEqCheck,
  argEqCheck = defaultEqualityCheck,
) {
  let lastArgs = null;
  let lastResult = null;
  const isEqualToLastArg = (value, index) => argEqCheck(value, lastArgs[index]);
  return (...args) => {
    if (
      lastArgs === null ||
      lastArgs.length !== args.length ||
      !args.every(isEqualToLastArg)
    ) {
      // Only update result if it has changed according to resultEqCheck
      const nextResult = func(...args);
      if (!resultEqCheck(lastResult, nextResult)) {
        lastResult = nextResult;
      }
    }
    lastArgs = args;
    return lastResult;
  };
}

const getProps = (state, props) => props;
const selectEntities = state => state.entities;
const selectRanking = state => state.ranking;
const selectWalkthroughIllusts = state => state.walkthroughIllusts;
const selectRecommendedIllusts = state => state.recommendedIllusts;
const selectRecommendedMangas = state => state.recommendedMangas;
const selectRecommendedNovels = state => state.recommendedNovels;
const selectTrendingIllustTags = state => state.trendingIllustTags;
const selectTrendingNovelTags = state => state.trendingNovelTags;
const selectSearchIllusts = state => state.searchIllusts;
const selectSearchNovels = state => state.searchNovels;
const selectRelatedIllusts = state => state.relatedIllusts;
const selectFollowingUserIllusts = state => state.followingUserIllusts;
const selectFollowingUserNovels = state => state.followingUserNovels;
const selectNewIllusts = state => state.newIllusts;
const selectNewMangas = state => state.newMangas;
const selectNewNovels = state => state.newNovels;
const selectMyPixivIllusts = state => state.myPixivIllusts;
const selectMyPixivNovels = state => state.myPixivNovels;
const selectUserBookmarkIllusts = state => state.userBookmarkIllusts;
const selectMyPrivateBookmarkIllusts = state => state.myPrivateBookmarkIllusts;
const selectUserBookmarkNovels = state => state.userBookmarkNovels;
const selectMyPrivateBookmarkNovels = state => state.myPrivateBookmarkNovels;
const selectUserIllusts = state => state.userIllusts;
const selectUserMangas = state => state.userMangas;
const selectUserNovels = state => state.userNovels;

const selectRecommendedUsers = state => state.recommendedUsers;
const selectSearchUsersAutoComplete = state => state.searchUsersAutoComplete;
const selectUserFollowing = state => state.userFollowing;
const selectUserFollowers = state => state.userFollowers;
const selectUserMyPixiv = state => state.userMyPixiv;
const selectSearchUsers = state => state.searchUsers;

const selectUserDetail = state => state.userDetail;

const selectIllustComments = state => state.illustComments;
const selectNovelComments = state => state.novelComments;
const selectNovelCommentReplies = state => state.novelCommentReplies;

const selectNovelSeries = state => state.novelSeries;
const selectNovelText = state => state.novelText;

const selectBrowsingHistoryIllusts = state => state.browsingHistoryIllusts;
const selectBrowsingHistoryNovels = state => state.browsingHistoryNovels;

const selectHighlightTags = state => state.highlightTags.items;
const selectMuteTags = state => state.muteTags.items;

const selectMuteUsers = state => state.muteUsers;

const defaultArray = [];
const defaultObject = {};

export const getAuth = state => state.auth;
export const getAuthUser = state => state.auth.user;
export const getLang = state => state.i18n.lang;

const createIllustItemsSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(
      prev,
      next,
      (p, n) =>
        p.id === n.id &&
        p.is_bookmarked === n.is_bookmarked &&
        p.user.is_followed === n.user.is_followed,
    );
  },
);

const createIllustItemSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev || !next) {
      return false;
    }
    return (
      prev.id === next.id &&
      prev.is_bookmarked === next.is_bookmarked &&
      (prev.user && prev.user.is_followed) ===
        (next.user && next.user.is_followed)
    );
  },
);

const createNovelItemsSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(
      prev,
      next,
      (p, n) =>
        p.id === n.id &&
        p.is_bookmarked === n.is_bookmarked &&
        p.user.is_followed === n.user.is_followed,
    );
  },
);

const createNovelItemSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev || !next) {
      return false;
    }
    return (
      prev.id === next.id &&
      prev.is_bookmarked === next.is_bookmarked &&
      (prev.user && prev.user.is_followed) ===
        (next.user && next.user.is_followed)
    );
  },
);

const createUserItemsSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(
      prev,
      next,
      (p, n) => p.id === n.id && p.is_followed === n.is_followed,
    );
  },
);

const createUserPreviewItemsSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(
      prev,
      next,
      (p, n) => p.id === n.id && p.user.is_followed === n.user.is_followed,
    );
  },
);

const createUserItemSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev || !next) {
      return false;
    }
    return prev.id === next.id && prev.is_followed === next.is_followed;
  },
);

const createUserDetailItemSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev || !next) {
      return false;
    }
    return (
      prev.id === next.id &&
      (prev.user && prev.user.is_followed) ===
        (next.user && next.user.is_followed)
    );
  },
);

const createMuteUserItemsSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(
      prev,
      next,
      (p, n) => p.id === n.id && p.is_followed === n.is_followed,
    );
  },
);

const createTagItemsSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(prev, next, (p, n) => p.tag === n.tag);
  },
);

const createTagsWithStatusSelector = createSelectorCreator(
  specialMemoize,
  (prev, next) => {
    if (!prev && !next) {
      return false;
    }
    return equals(
      prev,
      next,
      (p, n) =>
        p.name === n.name &&
        p.isHighlight === n.isHighlight &&
        p.isMute === n.isMute,
    );
  },
);

export const makeGetIllustRankingItems = () =>
  createIllustItemsSelector(
    [selectRanking, selectEntities, getProps],
    (ranking, entities, props) =>
      denormalize(
        ranking[props.rankingMode].items,
        Schemas.ILLUST_ARRAY,
        entities,
      ),
  );

export const makeGetSearchIllustsItems = () =>
  createIllustItemsSelector(
    [selectSearchIllusts, selectEntities, getProps],
    (searchIllusts, entities, props) =>
      searchIllusts[props.navigationStateKey]
        ? denormalize(
            searchIllusts[props.navigationStateKey].items,
            Schemas.ILLUST_ARRAY,
            entities,
          )
        : defaultArray,
  );

export const makeGetSearchNovelsItems = () =>
  createNovelItemsSelector(
    [selectSearchNovels, selectEntities, getProps],
    (searchNovels, entities, props) =>
      searchNovels[props.navigationStateKey]
        ? denormalize(
            searchNovels[props.navigationStateKey].items,
            Schemas.NOVEL_ARRAY,
            entities,
          )
        : defaultArray,
  );

export const makeGetRelatedIllustsItems = () =>
  createIllustItemsSelector(
    [selectRelatedIllusts, selectEntities, getProps],
    (relatedIllusts, entities, props) => {
      const illustId = props.illustId || props.navigation.state.params.illustId;
      return relatedIllusts[illustId]
        ? denormalize(
            relatedIllusts[illustId].items,
            Schemas.ILLUST_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetUserBookmarkIllustsItems = () =>
  createIllustItemsSelector(
    [selectUserBookmarkIllusts, selectEntities, getProps],
    (userBookmarkIllusts, entities, props) => {
      const userId =
        props.userId ||
        props.navigation.state.params.userId ||
        parseInt(props.navigation.state.params.id, 10) ||
        parseInt(props.navigation.state.params.uid, 10);
      return userBookmarkIllusts[userId]
        ? denormalize(
            userBookmarkIllusts[userId].items,
            Schemas.ILLUST_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetUserIllustsItems = () =>
  createIllustItemsSelector(
    [selectUserIllusts, selectEntities, getProps],
    (userIllusts, entities, props) => {
      const userId =
        props.userId ||
        props.navigation.state.params.userId ||
        parseInt(props.navigation.state.params.id, 10) ||
        parseInt(props.navigation.state.params.uid, 10);
      return userIllusts[userId]
        ? denormalize(userIllusts[userId].items, Schemas.ILLUST_ARRAY, entities)
        : defaultArray;
    },
  );

export const makeGetUserMangasItems = () =>
  createIllustItemsSelector(
    [selectUserMangas, selectEntities, getProps],
    (userMangas, entities, props) => {
      const userId =
        props.userId ||
        props.navigation.state.params.userId ||
        parseInt(props.navigation.state.params.id, 10) ||
        parseInt(props.navigation.state.params.uid, 10);
      return userMangas[userId]
        ? denormalize(userMangas[userId].items, Schemas.ILLUST_ARRAY, entities)
        : defaultArray;
    },
  );

export const makeGetUserNovelsItems = () =>
  createNovelItemsSelector(
    [selectUserNovels, selectEntities, getProps],
    (userNovels, entities, props) => {
      const userId =
        props.userId ||
        props.navigation.state.params.userId ||
        parseInt(props.navigation.state.params.id, 10) ||
        parseInt(props.navigation.state.params.uid, 10);
      return userNovels[userId]
        ? denormalize(userNovels[userId].items, Schemas.NOVEL_ARRAY, entities)
        : defaultArray;
    },
  );

export const makeGetUserFollowingItems = () =>
  createUserPreviewItemsSelector(
    [selectUserFollowing, selectEntities, getProps],
    (userFollowing, entities, props) => {
      const userId = props.userId || props.navigation.state.params.userId;
      const { followingType } = props;
      return userFollowing[followingType][userId]
        ? denormalize(
            userFollowing[followingType][userId].items,
            Schemas.USER_PREVIEW_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetUserFollowersItems = () =>
  createUserPreviewItemsSelector(
    [selectUserFollowers, selectEntities, getProps],
    (userFollowers, entities, props) => {
      const userId = props.userId || props.navigation.state.params.userId;
      return userFollowers[userId]
        ? denormalize(
            userFollowers[userId].items,
            Schemas.USER_PREVIEW_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetUserMyPixivItems = () =>
  createUserPreviewItemsSelector(
    [selectUserMyPixiv, selectEntities, getProps],
    (userMyPixiv, entities, props) => {
      const userId = props.userId || props.navigation.state.params.userId;
      return userMyPixiv[userId]
        ? denormalize(
            userMyPixiv[userId].items,
            Schemas.USER_PREVIEW_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetSearchUsersItems = () =>
  createUserPreviewItemsSelector(
    [selectSearchUsers, selectEntities, getProps],
    (searchUsers, entities, props) =>
      searchUsers[props.navigationStateKey]
        ? denormalize(
            searchUsers[props.navigationStateKey].items,
            Schemas.USER_PREVIEW_ARRAY,
            entities,
          )
        : defaultArray,
  );

export const makeGetIllustCommentsItems = () =>
  createUserItemsSelector(
    [selectIllustComments, selectEntities, getProps],
    (illustComments, entities, props) => {
      const illustId = props.illustId || props.navigation.state.params.illustId;
      return illustComments[illustId]
        ? denormalize(
            illustComments[illustId].items,
            Schemas.ILLUST_COMMENT_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetNovelRankingItems = () =>
  createNovelItemsSelector(
    [selectRanking, selectEntities, getProps],
    (ranking, entities, props) =>
      denormalize(
        ranking[props.rankingMode].items,
        Schemas.NOVEL_ARRAY,
        entities,
      ),
  );

export const makeGetUserBookmarkNovelsItems = () =>
  createNovelItemsSelector(
    [selectUserBookmarkNovels, selectEntities, getProps],
    (userBookmarkNovels, entities, props) => {
      const userId =
        props.userId ||
        props.navigation.state.params.userId ||
        parseInt(props.navigation.state.params.id, 10) ||
        parseInt(props.navigation.state.params.uid, 10);
      return userBookmarkNovels[userId]
        ? denormalize(
            userBookmarkNovels[userId].items,
            Schemas.NOVEL_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetNovelCommentsItems = () =>
  createUserItemsSelector(
    [selectNovelComments, selectEntities, getProps],
    (novelComments, entities, props) => {
      const novelId = props.novelId || props.navigation.state.params.novelId;
      return novelComments[novelId]
        ? denormalize(
            novelComments[novelId].items,
            Schemas.NOVEL_COMMENT_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetNovelCommentRepliesItems = () =>
  createUserItemsSelector(
    [selectNovelCommentReplies, selectEntities, getProps],
    (novelCommentReplies, entities, props) => {
      const { commentId } = props;
      return novelCommentReplies[commentId]
        ? denormalize(
            novelCommentReplies[commentId].items,
            Schemas.NOVEL_COMMENT_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetNovelSeriesItems = () =>
  createNovelItemsSelector(
    [selectNovelSeries, selectEntities, getProps],
    (novelSeries, entities, props) => {
      const seriesId = props.seriesId || props.navigation.state.params.seriesId;
      return novelSeries[seriesId]
        ? denormalize(
            novelSeries[seriesId].items,
            Schemas.NOVEL_ARRAY,
            entities,
          )
        : defaultArray;
    },
  );

export const makeGetParsedNovelText = () =>
  createSelector([selectNovelText, getProps], (novelText, props) => {
    const novelId = props.novelId || props.navigation.state.params.novelId;
    return novelText[novelId] && novelText[novelId].text
      ? parseNovelText(novelText[novelId].text)
      : null;
  });

export const makeGetUserItem = () =>
  createUserItemSelector([selectEntities, getProps], (entities, props) => {
    const userId = props.userId || props.navigation.state.params.userId;
    return denormalize(userId, Schemas.USER, entities);
  });

const makeGetUserDetailItem = () =>
  createUserDetailItemSelector(
    [selectUserDetail, selectEntities, getProps],
    (userDetail, entities, props) => {
      const userId =
        props.userId ||
        props.navigation.state.params.userId ||
        parseInt(props.navigation.state.params.id, 10) ||
        parseInt(props.navigation.state.params.uid, 10);
      return userDetail[userId]
        ? denormalize(userDetail[userId].item, Schemas.USER_PROFILE, entities)
        : defaultObject;
    },
  );

export const makeGetUserDetailPageItems = () => {
  const getUserDetailItem = makeGetUserDetailItem();
  const getUserIllustsItems = makeGetUserIllustsItems();
  const getUserMangasItems = makeGetUserMangasItems();
  const getUserNovelsItems = makeGetUserNovelsItems();
  const getUserBookmarkIllustsItems = makeGetUserBookmarkIllustsItems();
  const getUserBookmarkNovelsItems = makeGetUserBookmarkNovelsItems();

  return createSelector(
    [
      getUserDetailItem,
      getUserIllustsItems,
      getUserMangasItems,
      getUserNovelsItems,
      getUserBookmarkIllustsItems,
      getUserBookmarkNovelsItems,
      getProps,
    ],
    (
      userDetailItem,
      userIllustsItems,
      userMangasItems,
      userNovelsItems,
      userBookmarkIllustsItems,
      userBookmarkNovelsItems,
    ) => ({
      userDetailItem,
      userIllustsItems,
      userMangasItems,
      userNovelsItems,
      userBookmarkIllustsItems,
      userBookmarkNovelsItems,
    }),
  );
};

export const makeGetDetailItem = () =>
  createIllustItemSelector([selectEntities, getProps], (entities, props) => {
    const {
      illust_id: illustIdFromQS, // from deep link query string
      illustId, // from deep link params
      items,
      index,
    } = props.navigation.state.params;
    let id;
    if (illustIdFromQS) {
      id = parseInt(illustIdFromQS, 10);
    } else if (illustId) {
      id = parseInt(illustId, 10);
    } else {
      id = items[index].id;
    }
    return denormalize(id, Schemas.ILLUST, entities);
  });

export const makeGetDetailNovelItem = () =>
  createNovelItemSelector([selectEntities, getProps], (entities, props) => {
    const {
      id: novelIdFromQS, // from deep link query string
      novelId, // from deep link params
      items,
      index,
    } = props.navigation.state.params;
    let id;
    if (novelIdFromQS) {
      id = parseInt(novelIdFromQS, 10);
    } else if (novelId) {
      id = parseInt(novelId, 10);
    } else {
      id = items[index].id;
    }
    return denormalize(id, Schemas.NOVEL, entities);
  });

export const makeGetIllustItem = () =>
  createIllustItemSelector([selectEntities, getProps], (entities, props) => {
    const { illustId } = props;
    return denormalize(illustId, Schemas.ILLUST, entities);
  });

export const makeGetNovelItem = () =>
  createNovelItemSelector([selectEntities, getProps], (entities, props) => {
    const { novelId } = props;
    return denormalize(novelId, Schemas.NOVEL, entities);
  });

export const makeGetTagsWithStatus = () =>
  createTagsWithStatusSelector(
    [selectHighlightTags, selectMuteTags, getProps],
    (highlightTags, muteTags, { item }) =>
      item.tags.map(tag => ({
        ...tag,
        isHighlight: highlightTags.includes(tag.name),
        isMute: muteTags.includes(tag.name),
      })),
  );

export const getWalkthroughIllustsItems = createIllustItemsSelector(
  [selectWalkthroughIllusts, selectEntities],
  (walkthroughIllusts, entities) =>
    denormalize(walkthroughIllusts.items, Schemas.ILLUST_ARRAY, entities),
);

export const getRecommendedIllustsItems = createIllustItemsSelector(
  [selectRecommendedIllusts, selectEntities],
  (recommendedIllusts, entities) =>
    denormalize(recommendedIllusts.items, Schemas.ILLUST_ARRAY, entities),
);

export const getRecommendedMangasItems = createIllustItemsSelector(
  [selectRecommendedMangas, selectEntities],
  (recommendedMangas, entities) =>
    denormalize(recommendedMangas.items, Schemas.ILLUST_ARRAY, entities),
);

export const getRecommendedNovelsItems = createIllustItemsSelector(
  [selectRecommendedNovels, selectEntities],
  (recommendedNovels, entities) =>
    denormalize(recommendedNovels.items, Schemas.NOVEL_ARRAY, entities),
);

export const getFollowingUserIllustsItems = createIllustItemsSelector(
  [selectFollowingUserIllusts, selectEntities],
  (followingUserIllusts, entities) =>
    denormalize(followingUserIllusts.items, Schemas.ILLUST_ARRAY, entities),
);

export const getFollowingUserNovelsItems = createIllustItemsSelector(
  [selectFollowingUserNovels, selectEntities],
  (followingUserNovels, entities) =>
    denormalize(followingUserNovels.items, Schemas.NOVEL_ARRAY, entities),
);

export const getNewIllustsItems = createIllustItemsSelector(
  [selectNewIllusts, selectEntities],
  (newIllusts, entities) =>
    denormalize(newIllusts.items, Schemas.ILLUST_ARRAY, entities),
);

export const getNewMangasItems = createIllustItemsSelector(
  [selectNewMangas, selectEntities],
  (newMangas, entities) =>
    denormalize(newMangas.items, Schemas.ILLUST_ARRAY, entities),
);

export const getNewNovelsItems = createIllustItemsSelector(
  [selectNewNovels, selectEntities],
  (newNovels, entities) =>
    denormalize(newNovels.items, Schemas.NOVEL_ARRAY, entities),
);

export const getMyPixivIllustsItems = createIllustItemsSelector(
  [selectMyPixivIllusts, selectEntities],
  (myPixivIllusts, entities) =>
    denormalize(myPixivIllusts.items, Schemas.ILLUST_ARRAY, entities),
);

export const getMyPixivNovelsItems = createIllustItemsSelector(
  [selectMyPixivNovels, selectEntities],
  (myPixivNovels, entities) =>
    denormalize(myPixivNovels.items, Schemas.NOVEL_ARRAY, entities),
);

export const getMyPrivateBookmarkIllustsItems = createIllustItemsSelector(
  [selectMyPrivateBookmarkIllusts, selectEntities],
  (myPrivateBookmarkIllusts, entities) =>
    denormalize(myPrivateBookmarkIllusts.items, Schemas.ILLUST_ARRAY, entities),
);

export const getMyPrivateBookmarkNovelsItems = createIllustItemsSelector(
  [selectMyPrivateBookmarkNovels, selectEntities],
  (myPrivateBookmarkNovels, entities) =>
    denormalize(myPrivateBookmarkNovels.items, Schemas.NOVEL_ARRAY, entities),
);

export const getTrendingIllustTagsItems = createTagItemsSelector(
  [selectTrendingIllustTags, selectEntities],
  (trendingIllustTags, entities) =>
    denormalize(trendingIllustTags.items, Schemas.ILLUST_TAG_ARRAY, entities),
);

export const getTrendingNovelTagsItems = createTagItemsSelector(
  [selectTrendingNovelTags, selectEntities],
  (trendingNovelTags, entities) =>
    denormalize(trendingNovelTags.items, Schemas.ILLUST_TAG_ARRAY, entities),
);

export const getRecommendedUsersItems = createUserPreviewItemsSelector(
  [selectRecommendedUsers, selectEntities],
  (recommendedUsers, entities) =>
    denormalize(recommendedUsers.items, Schemas.USER_PREVIEW_ARRAY, entities),
);

export const getSearchUsersAutoCompleteItems = createUserPreviewItemsSelector(
  [selectSearchUsersAutoComplete, selectEntities],
  (searchUsersAutoComplete, entities) =>
    denormalize(
      searchUsersAutoComplete.items,
      Schemas.USER_PREVIEW_ARRAY,
      entities,
    ),
);

export const getBrowsingHistoryIllustsItems = createIllustItemsSelector(
  [selectBrowsingHistoryIllusts, selectEntities],
  (browsingHistoryIllusts, entities) =>
    denormalize(browsingHistoryIllusts.items, Schemas.ILLUST_ARRAY, entities),
);

export const getBrowsingHistoryNovelsItems = createNovelItemsSelector(
  [selectBrowsingHistoryNovels, selectEntities],
  (browsingHistoryNovels, entities) =>
    denormalize(browsingHistoryNovels.items, Schemas.NOVEL_ARRAY, entities),
);

export const getMuteUsersItems = createMuteUserItemsSelector(
  [selectMuteUsers, selectEntities],
  (muteUsers, entities) =>
    denormalize(muteUsers.items, Schemas.USER_ARRAY, entities),
);
