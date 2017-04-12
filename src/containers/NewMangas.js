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
import * as newMangaActionCreators from '../common/actions/newMangas';

class NewMangas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { fetchNewMangas } = this.props;
    fetchNewMangas();
  }

  loadMoreItems = () => {
    const { fetchNewMangas, newMangas: { nextUrl } } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      fetchNewMangas("", nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchNewMangas, clearNewMangas } = this.props;
    this.setState({
      refereshing: true
    });
    clearNewMangas();
    fetchNewMangas().finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { newMangas } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={newMangas}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  return {
    newMangas: state.newMangas,
  }
}, newMangaActionCreators)(NewMangas);