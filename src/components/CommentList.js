import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList } from 'react-native';
import moment from 'moment';
import { connectLocalization } from '../components/Localization';
import NoResult from '../components/NoResult';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    margin: 10,
  },
  nameCommentContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
  },
  authorBadge: {
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
    marginLeft: 5,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  authorBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  replyToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  replyToUserName: {
    marginLeft: 5,
  },
  dateAndReply: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    color: '#696969',
  },
  replyButtonText: {
    color: globalStyleVariables.PRIMARY_COLOR,
  },
  comment: {
    marginTop: 10,
  },
  nullResultContainer: {
    flex: 1,
    alignItems: 'center',
  },
  footer: {
    marginBottom: 20,
  },
});
class CommentList extends Component {
  handleOnPressUser = userId => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.UserDetail, { userId });
  };

  renderRow = ({ item }) => {
    const {
      authorId,
      i18n,
      onPressReplyCommentButton,
      renderCommentReplies,
    } = this.props;
    return (
      <View key={item.id} style={styles.commentContainer}>
        <PXThumbnailTouchable
          uri={item.user.profile_image_urls.medium}
          onPress={() => this.handleOnPressUser(item.user.id)}
        />
        <View style={styles.nameCommentContainer}>
          <View style={styles.nameContainer}>
            <PXTouchable onPress={() => this.handleOnPressUser(item.user.id)}>
              <Text style={styles.name}>
                {item.user.name}
              </Text>
            </PXTouchable>
            {item.user.id === authorId &&
              <View style={styles.authorBadge}>
                <Text style={styles.authorBadgeText}>
                  {i18n.commentWorkAuthor}
                </Text>
              </View>}
          </View>
          <View style={styles.comment}>
            <Text>
              {item.comment}
            </Text>
          </View>
          <View style={styles.dateAndReply}>
            <Text style={styles.date}>
              {moment(item.date).format('YYYY-MM-DD HH:mm')}
            </Text>
            {onPressReplyCommentButton &&
              <Fragment>
                <Text> ・ </Text>
                <PXTouchable onPress={() => onPressReplyCommentButton(item)}>
                  <Text style={styles.replyButtonText}>
                    {i18n.commentReply}
                  </Text>
                </PXTouchable>
              </Fragment>}
          </View>
          {item.has_replies &&
            renderCommentReplies &&
            renderCommentReplies(item.id)}
        </View>
      </View>
    );
  };

  renderFooter = () => {
    const { data: { nextUrl, loading } } = this.props;
    return nextUrl && loading
      ? <View style={styles.footer}>
          <Loader />
        </View>
      : null;
  };

  handleOnPressUser = userId => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.UserDetail, { userId });
  };

  render() {
    const {
      data: { items, loading, loaded, refreshing },
      onRefresh,
      loadMoreItems,
      maxItems,
      i18n,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        {!loaded && loading && <Loader />}
        {loaded
          ? <FlatList
              data={maxItems ? items.slice(0, maxItems) : items}
              keyExtractor={item => item.id.toString()}
              renderItem={this.renderRow}
              onEndReachedThreshold={0.1}
              onEndReached={loadMoreItems}
              removeClippedSubviews={false}
              ListFooterComponent={this.renderFooter}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          : null}
        {loaded &&
          (!items || !items.length) &&
          <NoResult text={i18n.noComments} />}
      </View>
    );
  }
}

export default connectLocalization(CommentList);
