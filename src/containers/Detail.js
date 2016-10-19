import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  ListView,
  RecyclerViewBackedScrollView,
  InteractionManager,
  Platform,
  PanResponder,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import GridView from 'react-native-grid-view';
import HtmlView from 'react-native-htmlview';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import * as Animatable from 'react-native-animatable';
import PixivApi from 'pixiv-api-client';
// import Image from 'react-native-image-progress';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import PXImageTouchable from '../components/PXImageTouchable';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import Tags from '../components/Tags';
import RelatedIllust from './RelatedIllust';
import IllustComment from './IllustComment';
import { fetchRecommendedIllusts, fetchRecommendedIllustsPublic } from '../common/actions/recommendedIllust';
import { fetchRecommendedManga } from '../common/actions/recommendedManga';
const windowWidth = Dimensions.get('window').width; //full width
const windowHeight = Dimensions.get('window').height; //full height

const pixiv = new PixivApi();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  infoContainer: {
    margin: 10,
    // backgroundColor: 'transparent',
    // position: 'absolute',
    // overflow: 'hidden',
    // bottom: 200,
    // left: 0
  },
  header: {
    paddingTop: 0,
    top: 15,
    right: 0,
    left: 100,
    position: 'absolute',
  },
  thumnailNameContainer: {
    flexDirection: 'row',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nameContainer: {
    flexDirection: 'column',
    marginLeft: 10
  },
  cardImage: {
    //resizeMode: 'contain',
    //margin: 5,
    //height: Dimensions.get('window').width / 2, //require for <Image />
    // width: 130,
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    //height: Dimensions.get('window').height - 150
  },
  captionContainer: {
    marginVertical: 10
  },
  bottomTabs: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    overflow: 'hidden',
    //top: 0,
    bottom: 0,
    left: 0,
    //right: 0,
  },
  imagePageNumberContainer: {
    top: 10,
    right: 10,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 10,
    paddingHorizontal: 8,
    // height: 32,
  },
  imagePageNumber: {
    color: '#fff',
    padding: 2
  },
  tabContainer: {
    flex: 1
  }
});

class Detail extends Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.state = { 
      mounting: true,
      bottomTabsPosition: "bottom",
      isInitState: true
    };
  }
  componentWillMount(nextProps) {
    const { item } = this.props;
    Actions.refresh({ 
      renderTitle: () => {
        return (
          <View style={[styles.infoContainer, styles.header]}>
            <View style={styles.thumnailNameContainer}>
              <PXTouchable style={{ width: 30, height: 30 }}>
                <PXThumbnail 
                  uri={item.user.profile_image_urls.medium}
                />
              </PXTouchable>
              <View style={styles.nameContainer}>
                <Text>{item.user.name}</Text>
                <Text>{item.user.account}</Text>
              </View>
            </View>
          </View>
        )
      } 
    });
  }

  componentDidMount(){
    const { dispatch, product } = this.props;
    //may not working because component may not unmount on pop
    //dispatch(loadProduct({}, product));
    InteractionManager.runAfterInteractions(() => {
      this.setState({ mounting: false });
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  renderRow = (item, sectionId, rowId) => {
    const { item: baseItem } = this.props;
    const isLastRow = (baseItem.meta_pages.length - 1) == rowId;
    // console.log('render ', item.image_urls)
    // console.log('meta ', item.meta_single_page)
    // {item.image_urls.large}
    // "https://facebook.github.io/react/img/logo_og.png"
    //console.log("img ", item.image_urls.large)
    return (
      <PXImageTouchable 
        key={item.image_urls.original}
        uri={item.image_urls.original}
        initWidth={windowWidth}
        initHeight={200}
        style={{
          backgroundColor: '#E9EBEE',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: 'red'
        }}
        imageStyle={{
          resizeMode: "contain",
        }}
        onFoundImageSize={isLastRow ? this.onFoundImageSize : null}
      />
    )
    //'https://facebook.github.io/react-native/img/header_logo.png'
  }

  renderInfo = () => {
    //2087.5 - 1999 = 88.5
    const { item } = this.props;
    const { selectedBottomTab, selectedBottomTabIndex } = this.state;
    //console.log('render footer ', item)
    let footerStyle = {};
    // if (selectedBottomTab && selectedBottomTabIndex === 0) {
    //   //bottomTabNewStyle.height = windowHeight;
    //   footerStyle = {
    //     flex: 1,
    //     width: windowWidth
    //   }
    // }
    // else {
    //   footerStyle = {
    //     height: 0,
    //     width: 0
    //   }
    // }
    //console.log('fs ', footerStyle)
    return (
      selectedBottomTab &&
      <ScrollView>
        <View style={styles.infoContainer}>
          <View style={styles.profileContainer}>
            <PXTouchable style={styles.thumnailNameContainer}>
              <PXThumbnail uri={item.user.profile_image_urls.medium} />
              <View style={styles.nameContainer}>
                <Text>{item.user.name}</Text>
                <Text>{item.user.account}</Text>
              </View>
            </PXTouchable>
            <PXTouchable>
              <Text>Follow</Text>
            </PXTouchable>
          </View>
          <View style={styles.captionContainer}>
            <HtmlView 
              value={item.caption}
              onLinkPress={this.handleOnLinkPress}
            />
          </View>
          {
            <Tags tags={item.tags} />
          }
        </View>
      </ScrollView>
    );
  }
  renderFooter = () => {
    return (
      <View style={{height: 300}} />
    )
  }
  renderComments = () => {
    const { item } = this.props;
    const { selectedBottomTab } = this.state;
    return (
      selectedBottomTab &&
      <IllustComment illustId={item.id} />
    );
  }

  handleOnChangeVisibleRows= (visibleRows, changedRows) => {
    // Called when the set of visible rows changes. visibleRows maps { sectionID: { rowID: true }} for all the visible rows, and changedRows maps { sectionID: { rowID: true | false }} for the rows that have changed their visibility, with true indicating visible, and false indicating the view has moved out of view.
    const { item } = this.props;
    if (item.meta_pages && item.meta_pages.length && visibleRows.s1) {
      const visibleRowNumbers = Object.keys(visibleRows.s1).map((row) => parseInt(row));
      //console.log('visible row ', visibleRowNumbers)
      //Actions.refresh({ title: `${visibleRowNumbers[0] + 1} / ${item.meta_pages.length}`});
      this.setState({
        imagePageNumber: `${visibleRowNumbers[0] + 1} / ${item.meta_pages.length}`
      });
      if (visibleRowNumbers.length === 2) {
        // console.log('visible row ', visibleRowNumbers[0])
        // Actions.refresh({ title: `${visibleRowNumbers[0] + 1} of ${item.meta_pages.length}`});
          // visible row is visibleRowNumbers[0]
      }
      if (visibleRowNumbers.length === 3) {
          // visible row is visibleRowNumbers[1]
      }
    }
  }
  handleOnScroll = () => {
    const { isInitState, isScrolling } = this.state;
    if (isInitState) {
      this.setState({
        isInitState: false
      });
    }
    this.setState({
      isScrolling: true
    });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.setState({ isScrolling: false }), 500)
  }

  // handleOnEndReached = () => {
  //   console.log('end reached')
  //   // this.setState({
  //   //   endReached: true
  //   // });
  // }
  handleOnChangeTab = ({i, ref}) => {
    const { selectedBottomTabIndex } = this.state;
    //console.log(i, selectedBottomTabIndex)
    if (i === selectedBottomTabIndex) {
      this.setState({
        selectedBottomTab: false,
        selectedBottomTabIndex: -1
      });
      this.refs.bottomTabs.transitionTo({ height: 60, backgroundColor: 'transparent' }, 300);
      InteractionManager.runAfterInteractions(() => {
        this.setState({ bottomTabsPosition: "bottom" });
      });
      if (this.refs.imageListContainer) {
        this.refs.imageListContainer.fadeIn();
      }
    }
    else {
      this.setState({
        selectedBottomTab: true,
        selectedBottomTabIndex: i
      });
      // this.refs.bottomTabs.transitionTo({bottom: 300});
      this.refs.bottomTabs.transitionTo({ height: windowHeight - 64, backgroundColor: '#fff'}, 300);    
      if (this.refs.imageListContainer) {
        this.refs.imageListContainer.slideOutUp();
      }
      this.setState({ bottomTabsPosition: "top" });
    }
  }

  handleOnLinkPress = (url) => {
    console.log('clicked link: ', url)
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => {
      console.error('Error on link press ', err)
    });
  }

  render() {
    const { item } = this.props;
    const { mounting, selectedBottomTab, bottomTabsPosition, imagePageNumber, isScrolling, isInitState } = this.state;
    const dataSource = this.dataSource.cloneWithRows(item.meta_pages);
    //let imageUrls = illust.meta_pages ?
    if (item.meta_pages && item.meta_pages.length){
      
    }
    else {
      // console.log('single img ', item.meta_single_page.original_image_url);
      // console.log('width ', item.width)
      // console.log('height ', item.height)
    }
    let bottomTabNewStyle = {};
    //console.log('selectedBottomTab ', selectedBottomTab)
    if (selectedBottomTab) {
      //bottomTabNewStyle.height = windowHeight;
      // bottomTabNewStyle = {
      //   //height: windowHeight,
      //   //position: 'relative'
      // }
      bottomTabNewStyle = {
        backgroundColor: '#fff'
      }
    }
    else {
      bottomTabNewStyle = {
        backgroundColor: 'transparent',
        //position: 'absolute',
      }
      // bottomTabNewStyle = { 
      //   backgroundColor: 'transparent',
      //   position: 'absolute',
      //   overflow: 'hidden',
      //   bottom: 0,
      //   left: 0
      // }
    }
    //console.log('bottomTabNewStyle ', bottomTabNewStyle)
    return (
      <View style={styles.container}>
        {
          mounting ?
          <Loader />
          :
          (item.meta_pages && item.meta_pages.length) ?
          <View style={{flex: 1}}>
            <Animatable.View style={{flex: 1}} ref="imageListContainer">
              <ListView
                ref="gv"
                dataSource={dataSource}
                renderRow={this.renderRow}
                renderFooter={this.renderFooter}
                enableEmptySections={ true }
                renderDistance={10}
                initialListSize={1}
                scrollRenderAheadDistance={300}
                onChangeVisibleRows={this.handleOnChangeVisibleRows}
                onEndReached={this.handleOnEndReached}
                onScroll={this.handleOnScroll}
              />
            </Animatable.View>
            {
              (isInitState || isScrolling) && imagePageNumber &&
              <View style={styles.imagePageNumberContainer}>
                <Text style={styles.imagePageNumber}>{imagePageNumber}</Text>
              </View>
            }
          </View>
          :
          <ScrollView>
            <PXImageTouchable 
              uri={item.meta_single_page.original_image_url}    
              initWidth={item.width > windowWidth ? windowWidth : item.width}
              initHeight={windowWidth * item.height / item.width}
              style={{
                backgroundColor: '#E9EBEE',
              }}
              imageStyle={{
                resizeMode: "contain",
              }}
            />
            {/*
              this.renderFooter()
            */}
          </ScrollView>
        }
        {
          !mounting &&
          <Animatable.View style={[styles.bottomTabs, bottomTabNewStyle]} ref="bottomTabs">
            <ScrollableTabView 
              tabBarPosition={bottomTabsPosition}
              scrollWithoutAnimation
              onChangeTab={this.handleOnChangeTab}
            >
              <View tabLabel="Info" style={styles.tabContainer}>
                {this.renderInfo()}
              </View>
              <View tabLabel="Comments" style={styles.tabContainer}>
                {this.renderComments()}
              </View>
              <View tabLabel="Related Illustrations" style={styles.tabContainer}>
                {
                  selectedBottomTab &&
                  <RelatedIllust illustId={item.id} />
                }
              </View>
            </ScrollableTabView>
          </Animatable.View>
        }
      </View>
    );
  }
}

export default Detail;