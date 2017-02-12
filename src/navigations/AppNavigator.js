import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import MainNavigator from './MainNavigator';
import Login from '../containers/Login';
import SearchFilterModal from '../components/SearchFilterModal';

const AppNavigator = StackNavigator({
  Main: { 
    screen: MainNavigator,
    path: '/', 
    navigationOptions: {
      // header: {
      //   visible: true,
      //   // style: {
      //   //   // color: 'blue',
      //   //   backgroundColor: 'red'
      //   // }
      //   //visible: false,
      // },
      header: ({ state, setParams }, defaultHeader) => ({
        ...defaultHeader,
        visible: false,
      })
    },
  },
  Login: { 
    screen: Login,
    path: '/login',
    navigationOptions: {
      title: "Login",
    },
  },
  SearchFilterModal: {
    screen: SearchFilterModal,
    navigationOptions: {
      title: "Display Options",
    },
  }
}, {
  // navigationOptions: {
  //   header: {
  //     style: {
  //       backgroundColor: 'green'
  //     }
  //   }
  // },
  cardStyle: {
    backgroundColor: '#fff'
  },
  headerMode: 'screen',
});

export default AppNavigator;