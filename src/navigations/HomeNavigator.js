import React from 'react';
import { StackNavigator } from 'react-navigation';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';
import Home from '../screens/Home/Home';
import DrawerMenuButton from '../components/DrawerMenuButton';
import DrawerIcon from '../components/DrawerIcon';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';

const navigationOptionsForTab = {
  header: null,
};

const navigationOptionsForDrawer = ({ navigation, screenProps: { i18n } }) => ({
  title: i18n.home,
  drawerLabel: i18n.home,
  drawerIcon: ({ tintColor }) => (
    <DrawerIcon name="home" size={24} color={tintColor} />
  ),
  headerLeft: (
    <DrawerMenuButton onPress={() => navigation.navigate('DrawerOpen')} />
  ),
});

const HomeNavigator = StackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: config.navigation.tab
        ? navigationOptionsForTab
        : navigationOptionsForDrawer,
    },
    ...sharedRouteConfig,
  },
  {
    navigationOptions: {
      headerStyle: config.navigation.tab
        ? globalStyles.headerWithoutShadow
        : globalStyles.headerWithoutShadow,
      headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
      headerBackTitle: null,
    },
    cardStyle: globalStyles.card,
    headerMode: 'screen',
  },
);

export default enhanceRouter(HomeNavigator);
