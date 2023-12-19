import React, { useContext, useEffect, useState } from "react";
import {
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	FlatList,
	Dimensions,
	Text
} from "react-native";
import { Image } from "react-native";
import themeContext from "./themeContext";
import TopAnimatedHeader from "./topAnimHeader";
import BottomAnimatedHeader from "./bottomAnimHeader"
import {
	GestureHandlerRootView,
	PinchGestureHandler,
  } from 'react-native-gesture-handler';
  import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
  } from 'react-native-reanimated';

export default function MediaPost({ route, navigation }) {
	const theme = useContext(themeContext);
	const { itemData, pressedItem, pressedIndex } = route.params;
	const { createdAt, id, picture, text} = pressedItem;
	const [headerVisible, setHeaderVisible] = useState(true);
	const [headerDate, setHeaderDate] = useState(date(createdAt));
	const [headerText, setHeaderText] = useState(text);
	const { width } = Dimensions.get("window");

	function date(unix) {
		const date = new Date(unix);
		const options = { day: "2-digit", month: "long", year: "numeric" };
		const formattedDate = date.toLocaleDateString("ru-RU", options);
		const formattedTime = date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

		return `${formattedDate} ${formattedTime}`;
	}

	const viewConfig = React.useRef({
		viewAreaCoveragePercentThreshold: 99,
	}).current;

	const viewableItemsChanges = React.useCallback(({ viewableItems }) => {
		if (viewableItems.length !== 0) {
			setHeaderDate(date(viewableItems[0].item.createdAt));
			setHeaderText(viewableItems[0].item.text);
		}
	}, []);

	
	const RenderImageItem = ({ item }) => {
		const scale = useSharedValue(1);
		const focalX = useSharedValue(0);
		const focalY = useSharedValue(0);

		const pinchHandler = useAnimatedGestureHandler({
			onStart: (event) => {
			focalX.value = event.focalX;
			focalY.value = event.focalY;
			},
			onActive: (event) => {
			scale.value = event.scale;
			},
			onEnd: () => {
			scale.value = withTiming(1);
			},
		});

		const rStyle = useAnimatedStyle(() => {
			const translateX = (width / 2  - focalX.value) * (scale.value - 1);
			const translateY = (width / (item.width / item.height) / 2 - focalY.value) * (scale.value - 1);
		
			return {
			transform: [
				{ translateX },
				{ translateY },
				{ scale: scale.value },
			],
			};
		});
			
		return (
			<TouchableOpacity
				style={{ justifyContent: "center", zIndex: 1 }}
				activeOpacity={1}
				onPress={() => {
					setHeaderVisible(!headerVisible);
				}}
			>
				<PinchGestureHandler onGestureEvent={pinchHandler}>
					<Animated.Image
						source={{ uri: item.picture }}
						style={[
							{
								aspectRatio: item.width / item.height,
								width: Dimensions.get("window").width,
							}, rStyle
						]}
						resizeMode="contain"
					/>
				</PinchGestureHandler>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
 			<TopAnimatedHeader
				navigation={navigation}
				visible={headerVisible}
				title={headerDate}
				color={"rgba(0, 0, 0, 0)"}
				durationHeader={"100"}
				durationText={"200"}
				fontSize={20}
				deletePosibility={true}
				currentMedia={pressedItem}
			/> 
			<BottomAnimatedHeader				
				navigation={navigation}
				visible={headerVisible}
				text={headerText}
				color={"rgba(0, 0, 0, 0)"}
				durationHeader={"100"}
				durationText={"200"}
			/>
			<FlatList
				initialScrollIndex={pressedIndex}
				getItemLayout={(data, index) => ({
					length: Dimensions.get("window").width,
					offset: Dimensions.get("window").width * index,
					index,
				})}
				initialNumToRender={1}
				data={itemData}
				keyExtractor={(item) => item.createdAt}
				horizontal
				pagingEnabled
				onViewableItemsChanged={viewableItemsChanges}
				viewabilityConfig={viewConfig}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => <RenderImageItem item={item} />}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	text: {
		color: "white",
		marginStart: 5,
		alignSelf: "center",
		fontFamily: "stolzl",
		fontSize: 18,
	},
});
