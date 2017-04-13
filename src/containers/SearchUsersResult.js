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
import RecommendedUsers from './RecommendedUsers';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import UserListContainer from './UserListContainer';
import { fetchSearchUser, clearSearchUser } from '../common/actions/searchUsers';
import { SearchType } from '../common/actions/searchType';

class SearchUsersResult extends Component {
  constructor(props) {
    super(props);
    const { word } = props;
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, word } = this.props;
    // this.refreshNavigationBar(word);
    clearSearchUser();
    InteractionManager.runAfterInteractions(() => {
      dispatch(fetchSearchUser(word));
    });
  }

  componentWillReceiveProps(nextProps) {
    const { word: prevWord } = this.props;
    const { dispatch, word } = nextProps;
    if (word !== prevWord) {
      dispatch(clearSearchUser());
      dispatch(fetchSearchUser(word));
      // this.refreshNavigationBar(word);
    }
  }
/*
  refreshNavigationBar = (word) => {
    Actions.refresh({
      renderTitle: () => {
        return (
          <SearchBar 
            enableBack={true} 
            onFocus={this.handleOnSearchFieldFocus} 
            onPressRemoveTag={this.handleOnPressRemoveTag}
            isRenderPlaceHolder={true}
            searchType={SearchType.USER}
            word={word}
          />
        )
      }
    });
  }*/

  handleOnSearchFieldFocus = () => {
    const { word } = this.props;
    //Actions.search({ word: word, searchType: SearchType.USER, isPopAndReplaceOnSubmit: true });
  }
  
  loadMoreItems = () => {
    const { dispatch, searchUsers: { nextUrl }, word } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      dispatch(fetchSearchUser(word, nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch, word } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearSearchUser());
    dispatch(fetchSearchUser(word)).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  handleOnPressRemoveTag = (index) => {
    const { dispatch, word } = this.props;
    const newWord = word.split(' ').filter((value, i) => {
      return i !== index;
    }).join(' ');
    console.log('new word ', newWord);
    if (newWord) {
      dispatch(clearSearchUser());
      dispatch(fetchSearchUser(newWord));
      /*Actions.refresh({
        word: newWord,
        renderTitle: () => {
          return (
            <SearchBar 
              enableBack={true} 
              onFocus={this.handleOnSearchFieldFocus} 
              onPressRemoveTag={this.handleOnPressRemoveTag}
              isRenderPlaceHolder={true}
              searchType={SearchType.USER}
              word={newWord}
            />
          )
        }
      });*/
    }
    else {
      //Actions.pop();
    }
  }

  render() {
    const { searchUsers, word, navigation, screenProps } = this.props;
    const { refreshing } = this.state;
    return (
      <UserListContainer
        userList={searchUsers}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        navigation={navigation}
        screenProps={screenProps}
      />
    );
  }
}

export default connect((state, props) => {
  return {
    searchUsers: state.searchUsers,
    word: props.navigation.state.params.word,
  }
})(SearchUsersResult);