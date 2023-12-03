import React from "react";
import {
	FlatList,
	StyleSheet,
	View,
	Image,
	useWindowDimensions,
	Animated,
} from "react-native";
import { PicturePaginator } from "./picturePaginator";
import { PopupMenu } from "./popupMenu";

export const PictureScroll = ({
	pictures,
	deletePosibitity,
	setImage,
	setFiles,
	changePosibility,
	navigation,
	dishId
}) => {
	const { width } = useWindowDimensions();
	const scrollX = React.useRef(new Animated.Value(0)).current;
	const [currentIndex, setCurrentIndex] = React.useState("");
	const slidesRef = React.useRef(null);

	const viewConfig = React.useRef({
		viewAreaCoveragePercentThreshold: 50,
	}).current;

	const viewableItemsChanges = React.useRef(({ viewableItems }) => {
		const indexData = viewableItems[0].key;
		setCurrentIndex(indexData);
	}).current;

	return (
		<View>
			<View>
				<PicturePaginator data={pictures} scrollX={scrollX} />
				{deletePosibitity ? (
					<View style={styles.deleteButton}>
						<PopupMenu
							setImage={setImage}
							currentIndex={currentIndex}
							setFiles={setFiles}
							optionsType="delete"
						/>
					</View>
				) : null}
				{changePosibility ? (
					<View style={styles.deleteButton}>
						<PopupMenu
							setImage={setImage}
							currentIndex={currentIndex}
							setFiles={setFiles}
							optionsType="change"
							navigation={navigation}
							dishId={dishId}
						/>
					</View>
				) : null}
				<FlatList
					data={pictures}
					keyExtractor={(item) => item.createdAt}
					renderItem={({ item }) => (
						<View style={{ flex: 1 }}>
							<Image
								style={[styles.image, { width }]}
								source={{ uri: item.url }}
							></Image>
						</View>
					)}
					horizontal
					showsHorizontalScrollIndicator={false}
					pagingEnabled
					bounces={false}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { x: scrollX } } }],
						{
							useNativeDriver: false,
						}
					)}
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
	image: {
		height: 420,
		zIndex: 2,
	},
	deleteButton: {
		zIndex: 1,
		position: "absolute",
		marginTop: 25,
		right: 15,
	},
});
