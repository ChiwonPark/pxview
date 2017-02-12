import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentContainer: {
    flexDirection: 'row',
    margin: 10
  },
  nameCommentContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  date: {
    marginLeft: 10,
    fontSize: 10
  },
  comment: {
    marginTop: 5
  }
});
class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data: { items: prevItems } } = this.props;
    const { data: { items }, maxItems } = nextProps;
    if (items && items !== prevItems) {
      const { dataSource } = this.state;
      this.setState({
        dataSource: dataSource.cloneWithRows(maxItems ? items.slice(0, maxItems) : items)
      });
    }
  }
  
  renderRow = (item) => {
    return (
      <View
        key={item.id}
        style={styles.commentContainer}
      >
        <PXThumbnailTouchable
          uri={item.user.profile_image_urls.medium}
          onPress={() => this.handleOnPressUser(item.user.id)}
        />
        <View style={styles.nameCommentContainer}>
          <View style={styles.nameContainer}>
            <PXTouchable onPress={() => this.handleOnPressUser(item.user.id)}>
              <Text>{item.user.name}</Text>
            </PXTouchable>
            <Text style={styles.date}>{moment(item.date).format('YYYY-MM-DD HH:mm')}</Text>
          </View>
          <View style={styles.comment}>
            <Text>{item.comment}</Text>
          </View>
        </View>
      </View>
    );
  }

  renderFooter = () => {
    const { data: { nextUrl, loading } } = this.props;
    return (
      (nextUrl && loading) ?
      <View style={{ marginBottom: 20 }}>
        <Loader />
      </View>
      :
      null
    );
    /*return (
      (nextUrl && loading) ?
      <View style={{ 
        width: width,
        marginBottom: 20
      }}>
        <Loader verticalCenter={false} />
      </View>
      :
      null
    )*/
  }

  handleOnPressUser = (userId) => {
    const { navigate } = this.props.navigation;
    navigate('UserDetail', { userId });
  }

  render() {
    const { data: { items, loading, loaded }, refreshing, onRefresh, loadMoreItems } = this.props;
    const { dataSource } = this.state;
    return (
      <View style={styles.container}>
        {
          !loaded && loading &&
          <Loader />
        }
        {
          (items && items.length) ?
          <ListView
            dataSource={dataSource}
            renderRow={this.renderRow}
            enableEmptySections={true}
            renderFooter={this.renderFooter}
            onEndReached={loadMoreItems}
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

export default CommentList;