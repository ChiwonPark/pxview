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

class SearchResultOldest extends Component {
  constructor(props) {
    super(props);
    const { word } = props;
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, navigationStateKey, word, options } = this.props;
    dispatch(clearSearch(navigationStateKey, SortType.ASC));
    InteractionManager.runAfterInteractions(() => {
      this.search(word, options);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { options: prevOptions, word: prevWord } = this.props;
    const { dispatch, navigationStateKey, word, options } = nextProps;
    console.log('oldest word ', word)
    console.log('oldest prevword ', prevWord);
    if ((word !== prevWord) || (options && options !== prevOptions)) {
      const { dataSource } = this.state;
      dispatch(clearSearch(navigationStateKey, SortType.ASC));
      console.log(console.log('receive new options ', options))
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
    const { dispatch, word, options } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearSearch(word, SortType.ASC));
    this.search(word, options, null).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  search = (word, options, nextUrl) => {
    const { dispatch, navigationStateKey, search } = this.props;
    return dispatch(fetchSearch(navigationStateKey, word, options, SortType.ASC, nextUrl, search));
  }

  render() {
    const { navigationStateKey, search, word, options } = this.props;
    const { refreshing } = this.state;
    return (
      (search[navigationStateKey] ? true : false) &&
      <IllustList
        data={search[navigationStateKey]}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  return {
    search: state.searchOldest,
  }
})(SearchResultOldest);