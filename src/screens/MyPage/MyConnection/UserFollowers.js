import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserListContainer from '../../../containers/UserListContainer';
import * as userFollowersActionCreators
  from '../../../common/actions/userFollowers';
import { makeGetUserFollowersItems } from '../../../common/selectors';

class UserFollowers extends Component {
  componentDidMount() {
    const { fetchUserFollowers, clearUserFollowers, userId } = this.props;
    clearUserFollowers(userId);
    fetchUserFollowers(userId);
  }

  loadMoreItems = () => {
    const { fetchUserFollowers, userFollowers, userId } = this.props;
    if (userFollowers && !userFollowers.loading && userFollowers.nextUrl) {
      fetchUserFollowers(userId, userFollowers.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { clearUserFollowers, fetchUserFollowers, userId } = this.props;
    clearUserFollowers(userId);
    fetchUserFollowers(userId, null, true);
  };

  render() {
    const { userFollowers, items } = this.props;
    return (
      <UserListContainer
        userList={{ ...userFollowers, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(() => {
  const getUserFollowersItems = makeGetUserFollowersItems();
  return (state, props) => {
    const { userFollowers } = state;
    const userId = props.userId || props.navigation.state.params.userId;
    return {
      userFollowers: userFollowers[userId],
      items: getUserFollowersItems(state, props),
      userId,
    };
  };
}, userFollowersActionCreators)(UserFollowers);
