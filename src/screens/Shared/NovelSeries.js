import React, { Component } from 'react';
import { View, StyleSheet, InteractionManager, Text } from 'react-native';
import { connect } from 'react-redux';
import { connectLocalization } from '../../components/Localization';
import NovelList from '../../components/NovelList';
import NoResult from '../../components/NoResult';
import ViewMoreButton from '../../components/ViewMoreButton';
import * as novelSeriesActionCreators from '../../common/actions/novelSeries';
import { makeGetNovelSeriesItems } from '../../common/selectors';
import { globalStyles } from '../../styles';
import { SCREENS } from '../../common/constants';

const styles = StyleSheet.create({
  viewMoreButtonContainer: {
    margin: 10,
  },
});

class NovelSeries extends Component {
  componentDidMount() {
    const {
      novelSeries,
      seriesId,
      fetchNovelSeries,
      clearNovelSeries,
    } = this.props;
    // will render blank unless scrolled
    // https://github.com/facebook/react-native/issues/10142
    if (!novelSeries || !novelSeries.items) {
      clearNovelSeries(seriesId);
      InteractionManager.runAfterInteractions(() => {
        fetchNovelSeries(seriesId);
      });
    }
  }

  loadMoreItems = () => {
    const { novelSeries, seriesId, fetchNovelSeries } = this.props;
    if (novelSeries && !novelSeries.loading && novelSeries.nextUrl) {
      fetchNovelSeries(seriesId, null, novelSeries.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { seriesId, fetchNovelSeries, clearNovelSeries } = this.props;
    clearNovelSeries(seriesId);
    fetchNovelSeries(seriesId, null, null, true);
  };

  handleOnPressViewMoreNovelSeries = () => {
    const { seriesId, navigation: { navigate } } = this.props;
    navigate(SCREENS.NovelSeries, {
      seriesId,
    });
  };

  render() {
    const {
      novelSeries,
      items,
      isFeatureInDetailPage,
      maxItems,
      i18n,
      listKey,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        <NovelList
          data={{ ...novelSeries, items }}
          listKey={listKey}
          loadMoreItems={!isFeatureInDetailPage ? this.loadMoreItems : null}
          onRefresh={!isFeatureInDetailPage ? this.handleOnRefresh : null}
          maxItems={isFeatureInDetailPage && maxItems}
        />
        {isFeatureInDetailPage &&
        novelSeries &&
        novelSeries.loaded &&
        items &&
        items.length &&
        items.length > maxItems
          ? <View style={styles.viewMoreButtonContainer}>
              <ViewMoreButton onPress={this.handleOnPressViewMoreNovelSeries} />
            </View>
          : null}
      </View>
    );
  }
}

export default connectLocalization(
  connect(() => {
    const getNovelSeriesItems = makeGetNovelSeriesItems();
    return (state, props) => {
      const { novelSeries } = state;
      const seriesId = props.seriesId || props.navigation.state.params.seriesId;
      return {
        novelSeries: novelSeries[seriesId],
        items: getNovelSeriesItems(state, props),
        seriesId,
        listKey: `${props.navigation.state.key}-${seriesId}-NovelSeries`,
      };
    };
  }, novelSeriesActionCreators)(NovelSeries),
);
