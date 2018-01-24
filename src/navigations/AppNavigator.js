import { StackNavigator } from 'react-navigation';
import AppTabNavigator from './AppTabNavigator';
import AppDrawerNavigator from './AppDrawerNavigator';
import enhanceRouter from './routers/enhanceRouter';
import SearchFilterModal from '../components/SearchFilterModal';
import AddIllustComment from '../screens/Shared/AddIllustComment';
import AccountSettings from '../screens/MyPage/AccountSettings/AccountSettings';
import Encyclopedia from '../screens/Shared/Encyclopedia';
import myPageRouteConfig from './routeConfigs/myPage';
import sharedRouteConfig from './routeConfigs/shared';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const appRouteConfig = {
  [SCREENS.Main]: {
    screen: config.navigation.tab ? AppTabNavigator : AppDrawerNavigator,
    navigationOptions: {
      header: null,
    },
  },
  [SCREENS.SearchFilterModal]: {
    screen: SearchFilterModal,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.searchDisplayOptions,
    }),
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
  ...myPageRouteConfig,
  ...sharedRouteConfig,
};

const stackConfig = {
  navigationOptions: {
    headerStyle: globalStyles.header,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
  headerMode: 'screen',
};

const AppNavigator = StackNavigator(appRouteConfig, stackConfig);

export default enhanceRouter(AppNavigator);
