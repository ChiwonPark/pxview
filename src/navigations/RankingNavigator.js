import { StackNavigator } from 'react-navigation';
import Ranking from '../containers/Ranking';
import Detail from '../containers/Detail';
import RelatedIllust from '../containers/RelatedIllust';

const RankingNavigator = StackNavigator({
  Ranking: { 
    screen: Ranking,
    path: '/',
    navigationOptions: {
      header: {
        visible: false
      }
    },
  },
  Detail: { 
    screen: Detail,
    path: '/detail'
  },
  RelatedIllust: {
    screen: RelatedIllust,
    path: '/relatedillust',
    navigationOptions: {
      title: "Related Works",
    },
  }
}, {
  navigationOptions: {
    header: ({ state, setParams }, defaultHeader) => ({
      ...defaultHeader,
      style: {
        backgroundColor: '#fff',
      },
    }),
  },
  cardStyle: {
    backgroundColor: '#fff'
  },
  headerMode: "screen"
});

export default RankingNavigator;