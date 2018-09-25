import React, { PureComponent } from 'react';
import { View, StyleSheet, Linking, SafeAreaView } from 'react-native';
import { withTheme, Text } from 'react-native-paper';
import moment from 'moment';
import HtmlView from 'react-native-htmlview';
import Icon from 'react-native-vector-icons/FontAwesome';
import RelatedIllusts from '../screens/Shared/RelatedIllusts';
import IllustComments from '../screens/Shared/IllustComments';
import NovelComments from '../screens/Shared/NovelComments';
import NovelSeries from '../screens/Shared/NovelSeries';
import FollowButtonContainer from '../containers/FollowButtonContainer';
import { connectLocalization } from './Localization';
import Tags from './Tags';
import PXTouchable from './PXTouchable';
import PXThumbnail from './PXThumbnail';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: globalStyleVariables.WINDOW_WIDTH,
  },
  infoContainer: {
    margin: 10,
  },
  sectionContainer: {
    marginBottom: 10,
  },
  sectionHeader: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  sectionSeriesTitle: {
    color: globalStyleVariables.PRIMARY_COLOR,
  },
  thumnailNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  captionContainer: {
    marginVertical: 10,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  seriesTitle: {
    color: globalStyleVariables.PRIMARY_COLOR,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

class DetailFooter extends PureComponent {
  handleOnPressAvatar = () => {
    const { onPressAvatar, item } = this.props;
    onPressAvatar(item.user.id);
  };

  handleOnPressLink = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          return null;
        }
        return Linking.openURL(url);
      })
      .catch(err => err);
  };

  render() {
    const {
      item,
      authUser,
      navigation,
      i18n,
      onLayoutView,
      onPressTag,
      onLongPressTag,
      tags,
      theme,
    } = this.props;
    return (
      <SafeAreaView>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
          onLayout={onLayoutView}
        >
          <View style={styles.infoContainer}>
            <View style={styles.profileContainer}>
              <PXTouchable
                style={styles.thumnailNameContainer}
                onPress={this.handleOnPressAvatar}
              >
                <PXThumbnail uri={item.user.profile_image_urls.medium} />
                <View style={styles.nameContainer}>
                  <Text>
                    {item.user.name}
                  </Text>
                  <Text>
                    {item.user.account}
                  </Text>
                </View>
              </PXTouchable>
              {((authUser && authUser.id !== item.user.id) || !authUser) &&
                <FollowButtonContainer userId={item.user.id} />}
            </View>
            <View style={styles.captionContainer}>
              {item.series &&
                item.series.id &&
                <Text style={styles.seriesTitle} selectable>
                  {item.series.title}
                </Text>}
              <Text style={styles.title} selectable>
                {item.title}
              </Text>
              <HtmlView
                value={item.caption}
                onLinkPress={this.handleOnPressLink}
                textComponentProps={{ selectable: true }}
                TextComponent={Text}
              />
            </View>
            <View style={styles.statContainer}>
              <Text>
                {moment(item.create_date).format('YYYY-MM-DD')}
              </Text>
              <Icon
                name="eye"
                style={{ marginLeft: 10 }}
                color={theme.colors.text}
              />
              <Text style={{ marginLeft: 5 }}>
                {item.total_view}
              </Text>
              <Icon
                name="heart"
                style={{ marginLeft: 10 }}
                color={theme.colors.text}
              />
              <Text style={{ marginLeft: 5 }}>
                {item.total_bookmarks}
              </Text>
            </View>
            <Tags
              tags={tags}
              onPressTag={onPressTag}
              onLongPressTag={onLongPressTag}
            />
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {i18n.comments}
              </Text>
            </View>
            {item.text_length
              ? <NovelComments
                  novelId={item.id}
                  authorId={item.user.id}
                  isFeatureInDetailPage
                  maxItems={6}
                  navigation={navigation}
                />
              : <IllustComments
                  illustId={item.id}
                  authorId={item.user.id}
                  isFeatureInDetailPage
                  maxItems={6}
                  navigation={navigation}
                />}
          </View>
          {!item.text_length &&
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {i18n.relatedWorks}
                </Text>
              </View>
              <RelatedIllusts
                illustId={item.id}
                listKey={`relatedIllusts-${navigation.state.key}-${item.id}`}
                isFeatureInDetailPage
                maxItems={6}
                navigation={navigation}
              />
            </View>}
          {item.series &&
            item.series.id &&
            item.text_length > 0 &&
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.sectionTitle, styles.sectionSeriesTitle]}
                  selectable
                >
                  {item.series.title}
                </Text>
              </View>
              <NovelSeries
                seriesId={item.series.id}
                seriesTitle={item.series.title}
                isFeatureInDetailPage
                maxItems={6}
                navigation={navigation}
              />
            </View>}
        </View>
      </SafeAreaView>
    );
  }
}

export default withTheme(connectLocalization(DetailFooter));
