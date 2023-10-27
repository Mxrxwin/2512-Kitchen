import React from "react";
import { StyleSheet, View, Animated, useWindowDimensions} from "react-native";

export const PicturePaginator = ({data, scrollX}) => {
    const {width} = useWindowDimensions();
    return (
        <View style={{flexDirection: 'row', height: 0, zIndex: 2, position: 'absolute', marginTop: 360}}>
            {data.map((_, i) => {
                const inputRange = [(i-1) * width, i *width, (i+1) * width];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [25,50,25],
                    extrapolate: 'clamp',
                })

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp'
                })

                return <Animated.View style={[styles.dot, {width: dotWidth, opacity}]} key={i.toString()}/>
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    dot: {
        height: 5,
        borderRadius : 10, 
        backgroundColor: "#83E144",
        marginHorizontal: 8
    }
  });
  