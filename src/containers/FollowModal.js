import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableWithoutFeedback,
  Modal,
  Switch,
} from 'react-native';
import { connect } from 'react-redux';
import PXTouchable from '../components/PXTouchable';
import FollowButton from '../components/FollowButton';
import * as userFollowDetailActionCreators from '../common/actions/userFollowDetail';
import * as followUserActionCreators from '../common/actions/followUser';
import * as modalActionCreators from '../common/actions/modal';
import { FOLLOWING_TYPES } from '../common/constants/followingTypes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    // borderRadius: 10,
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleContainer: {
    backgroundColor: '#E9EBEE',
    padding: 10,
  },
  form: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionContainer: {
    marginTop: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionWithoutRemoveButtonContainer: {
    marginTop: 20,
    padding: 10,
  },
});

class FollowModal extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    isFollow: PropTypes.bool.isRequired,
    fetchUserFollowDetail: PropTypes.func.isRequired,
    clearUserFollowDetail: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isPrivate: false,
    };
  }

  componentDidMount() {
    const { userId, fetchUserFollowDetail, clearUserFollowDetail } = this.props;
    clearUserFollowDetail(userId);
    fetchUserFollowDetail(userId);
  }

  componentWillReceiveProps(nextProps) {
    const { userFollowDetail: { item: prevItem } } = this.props;
    const { userFollowDetail: { item } } = nextProps;
    if (item && item !== prevItem) {
      this.setState({
        isPrivate: item.restrict === 'private',
      });
    }
  }

  handleOnChangeIsPrivate = value => {
    this.setState({
      isPrivate: value,
    });
  }

  handleOnPressFollowButton = () => {
    const { userId, onPressFollowButton } = this.props;
    const { isPrivate } = this.state;
    const followType = isPrivate ? FOLLOWING_TYPES.PRIVATE : FOLLOWING_TYPES.PUBLIC;
    this.followUser(userId, followType);
    this.handleOnModalClose();
  }

  handleOnPressRemoveButton = () => {
    const { userId, onPressRemoveButton } = this.props;
    this.unfollowUser(userId);
    this.handleOnModalClose();
  }

  handleOnPressModalRemoveButton = userId => {
    this.unfollowUser(userId);
    this.handleOnModalClose();
  }

  handleOnModalClose = () => {
    const { closeModal } = this.props;
    closeModal();
  }

  followUser = (userId, followType) => {
    const { followUser } = this.props;
    followUser(userId, followType);
  }

  unfollowUser = userId => {
    const { unfollowUser } = this.props;
    unfollowUser(userId);
  }

  render() {
    const { isFollow } = this.props;
    const { isPrivate } = this.state;
    return (
      <Modal
        animationType="fade"
        transparent
        visible
        onRequestClose={this.handleOnModalClose}
      >
        <PXTouchable style={styles.container} onPress={this.handleOnModalClose}>
          <TouchableWithoutFeedback>
            <View style={styles.innerContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  {isFollow ? 'Edit Follow' : 'Follow'}
                </Text>
              </View>
              <View style={styles.form}>
                <Text>Private</Text>
                <Switch
                  onValueChange={this.handleOnChangeIsPrivate}
                  value={isPrivate}
                />
              </View>
              {
                isFollow ?
                  <View style={styles.actionContainer}>
                    <PXTouchable onPress={this.handleOnPressRemoveButton}>
                      <Text>Remove</Text>
                    </PXTouchable>
                    <PXTouchable onPress={this.handleOnPressFollowButton}>
                      <Text>Follow</Text>
                    </PXTouchable>
                  </View>
                :
                  <View style={styles.actionWithoutRemoveButtonContainer}>
                    <FollowButton
                      isFollow={isFollow}
                      onPress={this.handleOnPressFollowButton}
                    />
                  </View>
              }
            </View>
          </TouchableWithoutFeedback>
        </PXTouchable>
      </Modal>
    );
  }
}

export default connect((state, props) => ({
  userFollowDetail: state.userFollowDetail,
}), {
  ...userFollowDetailActionCreators,
  ...followUserActionCreators,
  ...modalActionCreators,
})(FollowModal);

