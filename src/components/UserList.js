import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import FollowButtonContainer from '../containers/FollowButtonContainer';
import OverlayImagePages from '../components/OverlayImagePages';

const windowWidth = Dimensions.get('window').width; // full width
const windowHeight = Dimensions.get('window').height; // full height
const avatarSize = 50;
const ILLUST_PREVIEW_COLUMNS = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#E9EBEE',
  },
  imagePreviews: {
    flex: 1,
    flexDirection: 'row',
  },
  userInfoContainer: {
    // backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // margin: 5,
    marginLeft: 80,
    marginRight: 5,
    marginVertical: 5,
    //left: 70,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    // top: 0,
    left: 10,
    right: 0,
    bottom: 10,
    flex: 1,
    width: avatarSize,
    // paddingBottom: 40
  },
});

class UserList extends Component {
  renderItem = ({ item }) => {
    const { screenProps } = this.props;
    return (
      <View
        key={item.user.id}
        style={{
          backgroundColor: '#fff',
          marginBottom: 20,
        }}
      >
        <View style={styles.imagePreviews}>
          {
            item.illusts &&
            item.illusts.map(illust => (
              <PXTouchable
                style={{
                  borderWidth: 1,
                  borderColor: '#E9EBEE',
                  width: windowWidth / ILLUST_PREVIEW_COLUMNS - 1,
                  height: windowWidth / ILLUST_PREVIEW_COLUMNS - 1,
                }}
                key={illust.id}
                onPress={() => this.handleOnPressImagePreview(illust)}
              >
                <View>
                  <PXImage
                    uri={illust.image_urls ? illust.image_urls.square_medium : ''}
                    style={[styles.cardImage, {
                      resizeMode: 'cover',
                      width: windowWidth / ILLUST_PREVIEW_COLUMNS - 1,
                      height: windowWidth / ILLUST_PREVIEW_COLUMNS - 1,
                    }]}
                  />
                  {
                      (illust.meta_pages && illust.meta_pages.length) ?
                        <OverlayImagePages total={illust.meta_pages.length} />
                      :
                      null
                    }
                </View>
              </PXTouchable>
              ))
          }
        </View>
        <View style={styles.userInfoContainer}>
          <PXTouchable
            style={styles.userInfo}
            onPress={() => this.handleOnPressAvatar(item)}
          >
            <Text>{item.user.name}</Text>
          </PXTouchable>
          <FollowButtonContainer user={item.user} screenProps={screenProps} />
        </View>
        <View style={styles.avatarContainer}>
          <PXThumbnailTouchable
            uri={item.user.profile_image_urls.medium}
            size={avatarSize}
            style={{
              borderColor: '#E9EBEE',
              borderWidth: 1,
            }}
            onPress={() => this.handleOnPressAvatar(item.user.id)}
          />
        </View>
      </View>
    );
  }

  handleOnPressImagePreview= item => {
    const { navigate } = this.props.navigation;
    navigate('Detail', { item });
  }

  handleOnPressAvatar = userId => {
    const { navigate } = this.props.navigation;
    navigate('UserDetail', { userId });
  }

  renderFooter = () => {
    const { userList: { nextUrl } } = this.props;
    return (
      nextUrl ?
        <View style={{ marginBottom: 20 }}>
          <Loader />
        </View>
      :
      null
    );
  }

  render() {
    const { userList: { items, loading, loaded, refreshing }, loadMoreItems, onRefresh } = this.props;
    return (
      <View style={styles.container}>
        {
          !loaded && loading &&
          <Loader />
        }
        {
          (items && items.length) ?
            <FlatList
              data={items}
              keyExtractor={(item, index) => item.user.id}
              renderItem={this.renderItem}
              removeClippedSubviews={false}
              onEndReachedThreshold={0.1}
              onEndReached={loadMoreItems}
              ListFooterComponent={this.renderFooter}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
            }
            />
          :
          null
        }
      </View>
    );
  }
}

export default UserList;
