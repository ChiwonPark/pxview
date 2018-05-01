import React, { Component } from 'react';
import { connect } from 'react-redux';
import NovelList from '../../../components/NovelList';
import * as myPrivateBookmarkNovelsActionCreators from '../../../common/actions/myPrivateBookmarkNovels';
import { getMyPrivateBookmarkNovelsItems } from '../../../common/selectors';

class MyPrivateBookmarkNovels extends Component {
  componentDidMount() {
    const {
      userId,
      tag,
      fetchMyPrivateBookmarkNovels,
      clearMyPrivateBookmarkNovels,
    } = this.props;
    clearMyPrivateBookmarkNovels(userId);
    fetchMyPrivateBookmarkNovels(userId, tag);
  }

  componentWillReceiveProps(nextProps) {
    const { userId: prevUserId, tag: prevTag } = this.props;
    const {
      userId,
      tag,
      fetchMyPrivateBookmarkNovels,
      clearMyPrivateBookmarkNovels,
    } = nextProps;
    if (userId !== prevUserId || tag !== prevTag) {
      clearMyPrivateBookmarkNovels(userId);
      fetchMyPrivateBookmarkNovels(userId, tag);
    }
  }

  loadMoreItems = () => {
    const {
      myPrivateBookmarkNovels: { loading, nextUrl },
      tag,
      userId,
      fetchMyPrivateBookmarkNovels,
    } = this.props;
    if (!loading && nextUrl) {
      fetchMyPrivateBookmarkNovels(userId, tag, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const {
      userId,
      tag,
      fetchMyPrivateBookmarkNovels,
      clearMyPrivateBookmarkNovels,
    } = this.props;
    clearMyPrivateBookmarkNovels(userId);
    fetchMyPrivateBookmarkNovels(userId, tag, null, true);
  };

  render() {
    const { myPrivateBookmarkNovels, items, listKey } = this.props;
    return (
      <NovelList
        data={{ ...myPrivateBookmarkNovels, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { myPrivateBookmarkNovels } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  return {
    myPrivateBookmarkNovels,
    items: getMyPrivateBookmarkNovelsItems(state),
    userId,
    listKey: props.navigation.state.key,
  };
}, myPrivateBookmarkNovelsActionCreators)(MyPrivateBookmarkNovels);
