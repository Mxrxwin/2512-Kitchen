import React from "react";
import { FlatList, StyleSheet, View, ImageBackground, Text, useWindowDimensions, Animated } from "react-native";
import axios from "axios";
import { Loading } from "./loading";
import { PicturePaginator } from "./picturePaginator";

export const PictureScroll = ({pictures}) => {
  const [data, setData] = React.useState([]);
  const {width} = useWindowDimensions();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const slidesRef = React.useRef(null);

  const viewConfig = React.useRef({ viewAreaCoveragePercentThreshold: 50}).current;

  const viewableItemsChanges = React.useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]);
  }).current;

  return (
    <View style={styles.container}>
      <View style={{flex: 3}}>
      <View style={{alignItems: 'center'}}>
        <PicturePaginator data={pictures} scrollX={scrollX}/>
      </View>
        <FlatList
          data={pictures}
          renderItem={({item}) => ( 
            <ImageBackground style={[styles.image, {width}]} source={{ uri: item[0]}}/>
          )}
          horizontal
          showsHorizontalScrollIndicator = {false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item[0]}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: {x: scrollX} } }], {
              useNativeDriver:false,
          })}
          onViewableItemsChanged={viewableItemsChanges}
          scrollEventThrottle={32}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 2
  },
  image:{
    height: 500,
    justifyContent: 'center',
    zIndex: 1
  }
});
