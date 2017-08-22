import { StackNavigator } from 'react-navigation';
import AppTabNavigator from './AppTabNavigator';
import AppDrawerNavigator from './AppDrawerNavigator';
import enhanceRouter from './routers/enhanceRouter';
// import Login from '../screens/Login/Login';
import SearchFilterModal from '../components/SearchFilterModal';
import ImagesViewer from '../screens/ImagesViewer/ImagesViewer';
import AddIllustComment from '../screens/Shared/AddIllustComment';
import AccountSettings from '../screens/MyPage/AccountSettings/AccountSettings';
import Encyclopedia from '../screens/Shared/Encyclopedia';
import myPageRouteConfig from './routeConfigs/myPage';
import sharedRouteConfig from './routeConfigs/shared';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

let appRouteConfig = {
  [SCREENS.Main]: {
    screen: config.navigation.tab ? AppTabNavigator : AppDrawerNavigator,
    navigationOptions: {
      header: null,
    },
  },
  // [SCREENS.Login]: {
  //   screen: Login,
  //   navigationOptions: ({ screenProps: { i18n } }) => ({
  //     title: i18n.login,
  //   }),
  // },
  [SCREENS.SearchFilterModal]: {
    screen: SearchFilterModal,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.searchDisplayOptions,
    }),
  },
  [SCREENS.ImagesViewer]: {
    screen: ImagesViewer,
  },
  [SCREENS.AddIllustComment]: {
    screen: AddIllustComment,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.commentAdd,
    }),
  },
  [SCREENS.AccountSettingsModal]: {
    screen: AccountSettings,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.accountSettings,
    }),
  },
  [SCREENS.Encyclopedia]: {
    screen: Encyclopedia,
  },
};

if (!config.navigation.tab) {
  appRouteConfig = {
    ...appRouteConfig,
    ...myPageRouteConfig,
    ...sharedRouteConfig,
  };
}

const stackConfig = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
    },
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
  mode: config.navigation.tab ? 'modal' : 'card', // only apply to ios for tab navigation
  headerMode: 'screen',
};

const AppNavigator = !config.navigation.tab
  ? enhanceRouter(StackNavigator(appRouteConfig, stackConfig))
  : StackNavigator(appRouteConfig, stackConfig);

export default AppNavigator;
