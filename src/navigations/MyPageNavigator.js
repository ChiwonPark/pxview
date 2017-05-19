import { StackNavigator } from 'react-navigation';
import MyPage from '../screens/MyPage/MyPage';
import MyWorks from '../screens/MyPage/MyWorks';
import MyConnection from '../screens/MyPage/MyConnection/MyConnection';
import MyCollection from '../screens/MyPage/MyCollection/MyCollection';
import BrowsingHistory from '../screens/MyPage/BrowsingHistory';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';

const MyPageNavigator = StackNavigator(
  {
    MyPage: {
      screen: MyPage,
      navigationOptions: {
        header: null,
      },
    },
    MyConnection: {
      screen: MyConnection,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        title: i18n.connection,
      }),
    },
    MyCollection: {
      screen: MyCollection,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        title: i18n.collection,
      }),
    },
    MyWorks: {
      screen: MyWorks,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        title: i18n.myWorks,
      }),
    },
    BrowsingHistory: {
      screen: BrowsingHistory,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        title: i18n.browsingHistory,
      }),
    },
    ...sharedRouteConfig,
  },
  {
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerBackTitle: null,
    },
    cardStyle: {
      backgroundColor: '#fff',
    },
  },
);

export default enhanceRouter(MyPageNavigator);
