import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import * as newIllustActionCreators from '../common/actions/newIllusts';

class NewIllusts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { fetchNewIllusts } = this.props;
    fetchNewIllusts();
  }

  loadMoreItems = () => {
    const { fetchNewIllusts, newIllusts: { nextUrl } } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      fetchNewIllusts("", nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchNewIllusts, clearNewIllusts } = this.props;
    this.setState({
      refereshing: true
    });
    clearNewIllusts();
    fetchNewIllusts().finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { newIllusts } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={newIllusts}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  return {
    newIllusts: state.newIllusts,
  }
}, newIllustActionCreators)(NewIllusts);