import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import { fetchSearch, clearSearch, SortType } from '../common/actions/search';

class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, navigationStateKey, word, options } = this.props;
    dispatch(clearSearch(navigationStateKey));
    InteractionManager.runAfterInteractions(() => {
      this.search(word, options);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { options: prevOptions, word: prevWord } = this.props;
    const { dispatch, navigationStateKey, word, options } = nextProps;
    if ((word && word !== prevWord) || (options && options !== prevOptions)) {
      console.log('word prevWord ', word, prevWord);
      console.log('options prevOptions ', options, prevOptions);
      dispatch(clearSearch(navigationStateKey));
      this.search(word, options);
    }
  }

  loadMoreItems = () => {
    const { dispatch, navigationStateKey, search, word } = this.props;
    console.log('load more ', search[navigationStateKey].nextUrl)
    if (search[navigationStateKey] && search[navigationStateKey].nextUrl) {
      this.search(word, null, search[navigationStateKey].nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { dispatch, navigationStateKey, word, options } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearSearch(navigationStateKey));
    this.search(word, options, null).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  search = (word, options, nextUrl) => {
    const { dispatch, navigationStateKey, search } = this.props;
    return dispatch(fetchSearch(navigationStateKey, word, options, nextUrl, search));
  }

  render() {
    const { search, word, options, navigation, navigationStateKey } = this.props;
    const { refreshing } = this.state;
    return (
      (search[navigationStateKey] ? true : false) &&
      <IllustList
        data={search[navigationStateKey]}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        navigation={navigation}
      />
    );
  }
}

export default connect((state, props) => {
  return {
    search: state.search,
  }
})(SearchResult);