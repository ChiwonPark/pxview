import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Linking,
  RefreshControl,
  Platform,
  findNodeHandle,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import Hyperlink from 'react-native-hyperlink';
import Icon from 'react-native-vector-icons/FontAwesome';
import truncate from 'lodash.truncate';
import * as Animatable from 'react-native-animatable';
import { BlurView } from 'react-native-blur';
import Share from 'react-native-share';
import FollowButtonContainer from '../../containers/FollowButtonContainer';
import { connectLocalization } from '../../components/Localization';
import IllustCollection from '../../components/IllustCollection';
import PXTouchable from '../../components/PXTouchable';
import PXThumbnail from '../../components/PXThumbnail';
import PXThumbnailTouchable from '../../components/PXThumbnailTouchable';
import PXImage from '../../components/PXImage';
import Loader from '../../components/Loader';
import * as userDetailActionCreators from '../../common/actions/userDetail';
import * as userIllustsActionCreators from '../../common/actions/userIllusts';
import * as userMangasActionCreators from '../../common/actions/userMangas';
import * as userBookmarkIllustlActionCreators
  from '../../common/actions/userBookmarkIllusts';
import { makeGetUserDetailPageItems } from '../../common/selectors';

const avatarSize = 70;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#E9EBEE',
  },
  coverOuterContainer: {
    // backgroundColor: '#5cafec',
    height: 150,
  },
  coverInnerContainer: {
    // backgroundColor: '#5cafec',
    height: 100,
  },
  cover: {
    backgroundColor: '#5cafec',
    // height: 100,
    flex: 1,
    //flexDirection: 'row',
  },
  avatarContainer: {
    position: 'absolute',
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    // top: 0,
    // left: 10,
    // right: 0,
    bottom: -(avatarSize / 2),
    // flex: 1,
    width: windowWidth,
    alignItems: 'center',
    //paddingBottom: 40
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
  },
  statType: {
    color: '#90949c',
  },
  row: {
    flexDirection: 'row',
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 5,
  },
  commentContainer: {
    padding: 10,
  },
  hyperlink: {
    color: '#2980b9',
  },
  externalLink: {
    color: '#90949c',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 16,
    color: '#90949c',
    marginHorizontal: 5,
  },
  navbarHeader: {
    margin: 10,
    ...Platform.select({
      ios: {
        top: 15,
      },
    }),
    alignItems: 'center',
    opacity: 0,
  },
  thumnailNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

class UserDetail extends Component {
  static defaultProps = {
    userDetail: { refreshing: false },
    userIllusts: {},
    userMangas: {},
    userBookmarkIllusts: {},
  };

  static navigationOptions = ({ navigation }) => {
    const { isShowTitle, isScrolled, user } = navigation.state.params;
    const shareOptions = user
      ? {
          message: `${user.name} #pixivrn`,
          url: `http://www.pixiv.net/member.php?id=${user.id}`,
        }
      : {};
    return {
      headerTitle: user && isScrolled
        ? <Animatable.View
            style={styles.thumnailNameContainer}
            animation={isShowTitle ? 'fadeIn' : 'fadeOut'}
            duration={300}
          >
            <PXThumbnailTouchable uri={user.profile_image_urls.medium} />
            <View style={styles.nameContainer}>
              <Text>{user.name}</Text>
              <Text>{user.account}</Text>
            </View>
          </Animatable.View>
        : null,
      headerRight: user &&
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          <FollowButtonContainer user={user} />
          <PXTouchable
            style={{ marginLeft: 10 }}
            onPress={() =>
              Share.open(shareOptions).catch(err => {
                err && console.log(err);
              })}
          >
            <Icon name="share-alt" size={20} />
          </PXTouchable>
        </View>,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      viewRef: 0,
    };
  }

  componentDidMount() {
    const {
      userId,
      userDetail,
      userDetailItem,
      navigation: { setParams },
      fetchUserDetail,
      clearUserDetail,
      fetchUserIllusts,
      clearUserIllusts,
      fetchUserMangas,
      clearUserMangas,
      fetchUserBookmarkIllusts,
      clearUserBookmarkIllusts,
    } = this.props;
    InteractionManager.runAfterInteractions(() => {
      if (!userDetail || !userDetail.item) {
        clearUserDetail(userId);
        clearUserIllusts(userId);
        clearUserMangas(userId);
        clearUserBookmarkIllusts(userId);
        fetchUserDetail(userId);
        fetchUserIllusts(userId);
        fetchUserMangas(userId);
        fetchUserBookmarkIllusts(userId);
      } else {
        setParams({ user: userDetailItem.user });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { userDetailItem: prevUserDetailItem } = this.props;
    const { userDetailItem, navigation: { setParams } } = nextProps;
    if (userDetailItem && userDetailItem !== prevUserDetailItem) {
      setParams({ user: userDetailItem.user });
    }
  }

  handleOnLinkPress = url => {
    console.log('clicked link: ', url);
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log(`Can't handle url: ${url}`);
          return null;
        }
        return Linking.openURL(url);
      })
      .catch(err => {
        console.error('Error on link press ', err);
      });
  };

  handleOnRefresh = () => {
    const {
      userId,
      fetchUserDetail,
      clearUserDetail,
      fetchUserIllusts,
      clearUserIllusts,
      fetchUserMangas,
      clearUserMangas,
      fetchUserBookmarkIllusts,
      clearUserBookmarkIllusts,
    } = this.props;
    clearUserDetail(userId);
    clearUserIllusts(userId);
    clearUserMangas(userId);
    clearUserBookmarkIllusts(userId);
    fetchUserDetail(userId);
    fetchUserIllusts(userId);
    fetchUserMangas(userId);
    fetchUserBookmarkIllusts(userId);
  };

  handleOnScroll = ({ nativeEvent }) => {
    const {
      userDetail,
      navigation: { setParams, state: { params: { isShowTitle, isScrolled } } },
    } = this.props;
    if (!isScrolled) {
      setParams({ isScrolled: true });
    }
    if (userDetail && userDetail.item) {
      if (nativeEvent.contentOffset.y >= 135) {
        if (!isShowTitle) {
          setParams({ isShowTitle: true });
        }
      } else if (isShowTitle) {
        setParams({ isShowTitle: false });
      }
    }
  };

  handleOnProfileImageLoaded = () => {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
  };

  renderProfile = detail => {
    const { i18n } = this.props;
    const { viewRef } = this.state;
    return (
      <View>
        <View style={styles.coverOuterContainer}>
          <View style={styles.coverInnerContainer}>
            <PXImage
              uri={detail.user.profile_image_urls.medium}
              style={{
                resizeMode: 'cover',
                width: windowWidth,
                height: 100,
                backgroundColor: 'transparent',
              }}
              ref={ref => (this.backgroundImage = ref)}
              onLoadEnd={this.handleOnProfileImageLoaded}
            />
            <BlurView
              blurType="light"
              blurAmount={20}
              overlayColor={'rgba(255, 255, 255, 0.3)'}
              viewRef={viewRef}
              style={styles.blurView}
            />
            <View style={styles.avatarContainer}>
              <PXThumbnail
                uri={detail.user.profile_image_urls.medium}
                size={avatarSize}
              />
            </View>
          </View>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.userName}>{detail.user.name}</Text>
          <View style={{ flexDirection: 'row' }}>
            {detail.profile.webpage
              ? <View style={styles.row}>
                  <Icon name="home" style={styles.icon} />
                  <Hyperlink
                    linkStyle={styles.externalLink}
                    linkText={truncate(
                      detail.profile.webpage.replace(/https?:\/\//i, ''),
                      { length: 15 },
                    )}
                    onPress={url => this.handleOnLinkPress(url)}
                  >
                    <Text style={styles.stat}>{detail.profile.webpage}</Text>
                  </Hyperlink>
                </View>
              : null}
            {detail.profile.twitter_account
              ? <View style={styles.row}>
                  <Icon name="twitter" style={styles.icon} />
                  <Hyperlink
                    linkStyle={styles.externalLink}
                    linkText={detail.profile.twitter_account}
                    onPress={url => this.handleOnLinkPress(url)}
                  >
                    <Text style={styles.stat}>
                      {detail.profile.twitter_url}
                    </Text>
                  </Hyperlink>
                </View>
              : null}
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>{detail.profile.total_follow_users}</Text>
              <Text style={styles.statType}> {i18n.following} </Text>
            </View>
            <View style={styles.row}>
              <Text>{detail.profile.total_follower}</Text>
              <Text style={styles.statType}> {i18n.followers} </Text>
            </View>
            <View style={styles.row}>
              <Text>{detail.profile.total_mypixiv_users}</Text>
              <Text style={styles.statType}> {i18n.myPixiv} </Text>
            </View>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.commentContainer}>
            <Hyperlink
              linkStyle={styles.hyperlink}
              onPress={url => this.handleOnLinkPress(url)}
            >
              <Text>{detail.user.comment}</Text>
            </Hyperlink>
          </View>
        </View>
      </View>
    );
  };

  renderIllustCollection = (items, profile) => {
    const { userId, navigation, i18n } = this.props;
    return (
      <IllustCollection
        title={i18n.userIllusts}
        total={profile.total_illusts}
        viewMoreTitle={i18n.worksCount}
        items={items}
        maxItems={6}
        onPressViewMore={() => navigation.navigate('UserIllusts', { userId })}
        navigation={navigation}
      />
    );
  };

  renderMangaCollection = (items, profile) => {
    const { userId, navigation, i18n } = this.props;
    return (
      <IllustCollection
        title={i18n.userMangas}
        total={profile.total_manga}
        viewMoreTitle={i18n.worksCount}
        items={items}
        maxItems={6}
        onPressViewMore={() => navigation.navigate('UserMangas', { userId })}
        navigation={navigation}
      />
    );
  };

  renderBookmarks = items => {
    const { userId, navigation, i18n } = this.props;
    return (
      <IllustCollection
        title={i18n.illustMangaCollection}
        viewMoreTitle={i18n.list}
        items={items}
        maxItems={6}
        onPressViewMore={() =>
          navigation.navigate('UserBookmarkIllusts', { userId })}
        navigation={navigation}
      />
    );
  };

  renderContent = detail => {
    const {
      userIllusts,
      userMangas,
      userBookmarkIllusts,
      userIllustsItems,
      userMangasItems,
      userBookmarkIllustsItems,
    } = this.props;
    return (
      <View>
        {this.renderProfile(detail)}
        {userIllusts &&
          !userIllusts.loading &&
          userIllusts.items &&
          userIllusts.items.length
          ? this.renderIllustCollection(userIllustsItems, detail.profile)
          : null}
        {userMangas &&
          !userMangas.loading &&
          userMangas.items &&
          userMangas.items.length
          ? this.renderMangaCollection(userMangasItems, detail.profile)
          : null}
        {userBookmarkIllusts &&
          !userBookmarkIllusts.loading &&
          userBookmarkIllusts.items &&
          userBookmarkIllusts.items.length
          ? this.renderBookmarks(userBookmarkIllustsItems)
          : null}
      </View>
    );
  };

  render() {
    const {
      userDetail: { loaded, loading, refreshing, item },
      userDetailItem,
    } = this.props;
    return (
      <View style={styles.container}>
        {(!item || (!loaded && loading)) && <Loader />}
        {item
          ? <ScrollView
              style={styles.container}
              onScroll={this.handleOnScroll}
              scrollEventThrottle={16}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.handleOnRefresh}
                />
              }
            >
              {this.renderContent(userDetailItem)}
            </ScrollView>
          : null}
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    () => {
      const getUserDetailPageItem = makeGetUserDetailPageItems();
      return (state, props) => {
        const {
          userDetail,
          userIllusts,
          userMangas,
          userBookmarkIllusts,
        } = state;
        const userId = props.userId || props.navigation.state.params.userId;
        const {
          userDetailItem,
          userIllustsItems,
          userMangasItems,
          userBookmarkIllustsItems,
        } = getUserDetailPageItem(state, props);
        return {
          userDetail: userDetail[userId],
          userIllusts: userIllusts[userId],
          userMangas: userMangas[userId],
          userBookmarkIllusts: userBookmarkIllusts[userId],
          userDetailItem,
          userIllustsItems,
          userMangasItems,
          userBookmarkIllustsItems,
          userId,
        };
      };
    },
    {
      ...userDetailActionCreators,
      ...userIllustsActionCreators,
      ...userMangasActionCreators,
      ...userBookmarkIllustlActionCreators,
    },
  )(UserDetail),
);
