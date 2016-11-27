import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import OverlayImagePages from './OverlayImagePages';

const windowWidth = Dimensions.get('window').width; //full width
const windowHeight = Dimensions.get('window').height; //full height
const avatarSize = 50;
const ILLUST_PREVIEW_COLUMNS = 3;
const CONTAINER_MARGIN = 10;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#E9EBEE',
    margin: CONTAINER_MARGIN,
  },
  imagePreviews: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  }
});

const IllustCollection = (props) => {
  const { items, title, viewAllTitle, maxItems } = props;
  if (!items || !items.length) {
    return null;
  }
  const illusts = items.slice(0, maxItems || 6);
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text>{title}</Text>
        <Text>{viewAllTitle}</Text>
      </View>
      <View style={styles.imagePreviews}>
        {
          illusts && illusts.length &&
          illusts.map(illust => {
            return (
              <PXTouchable 
                style={{ 
                  backgroundColor: '#fff',
                  width: (windowWidth - (CONTAINER_MARGIN * 2)) / ILLUST_PREVIEW_COLUMNS, 
                  height: (windowWidth - (CONTAINER_MARGIN * 2)) / ILLUST_PREVIEW_COLUMNS,
                }} 
                key={illust.id} 
                onPress={() => Actions.detail({ item: illust })}
              >
                <View>
                  <PXImage 
                    uri={illust.image_urls ? illust.image_urls.square_medium : ""}
                    style={[styles.cardImage, {
                      resizeMode: 'cover',
                      width: (windowWidth - (CONTAINER_MARGIN * 2)) / ILLUST_PREVIEW_COLUMNS, 
                      height: (windowWidth - (CONTAINER_MARGIN * 2)) / ILLUST_PREVIEW_COLUMNS,
                    }]}
                  />
                  {
                    (illust.meta_pages && illust.meta_pages.length) ?
                    <OverlayImagePages total={illust.meta_pages.length} />
                    :
                    null
                  }
                </View>
              </PXTouchable>
            )
          })
        }
      </View>
    </View>
  );
}

export default IllustCollection;
