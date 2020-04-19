import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import RankingHorizontalList from './RankingHorizontalList';
import NovelRankingPreview from './NovelRankingPreview';
import { RANKING_TYPES, RANKING_FOR_UI } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});

const RankingPreview = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [refreshing, toggleRefreshing] = useState(false);
  const ref = useRef(null);
  useScrollToTop(ref);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        ref={ref}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => toggleRefreshing(true)}
          />
        }
      >
        <RankingHorizontalList
          rankingMode={RANKING_FOR_UI.DAILY_ILLUST}
          rankingType={RANKING_TYPES.ILLUST}
          navigation={navigation}
          refreshing={refreshing}
          theme={theme}
          onRefreshSuccess={() => toggleRefreshing(false)}
        />
        <RankingHorizontalList
          rankingMode={RANKING_FOR_UI.DAILY_MANGA}
          rankingType={RANKING_TYPES.MANGA}
          navigation={navigation}
          refreshing={refreshing}
          theme={theme}
        />
        <NovelRankingPreview
          rankingMode={RANKING_FOR_UI.DAILY_NOVEL}
          navigation={navigation}
          refreshing={refreshing}
          theme={theme}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RankingPreview;
