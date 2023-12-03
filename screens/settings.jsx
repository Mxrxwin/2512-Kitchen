import React, { useState, useRef, useEffect } from "react";
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	ScrollView,
	Animated,
	Easing,
	FlatList,
} from "react-native";
import { TempTest } from "../components/tempText";
import { listenToMenu } from "../components/photoUploadFunc";
import { Week } from "../components/week";

export default function Settings({ navigation }) {
	const [title, setTitle] = React.useState("");
	const translateY = useRef(new Animated.Value(-350)).current;
	const [addPost, setAppPost] = useState(false);
	const [items, setItems] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);

	function FetchPosts() {
		setItems([]);
		setFilteredItems([]);
		listenToMenu(setItems);
		listenToMenu(setFilteredItems);
	}

	useEffect(() => {
		FetchPosts();
	}, []);

	useEffect(() => {
		Animated.timing(translateY, {
			toValue: addPost ? 0 : 1,
			duration: 250,
			easing: Easing.elastic(1.1),
			useNativeDriver: true,
		}).start();
	}, [addPost]);

	const interpolatedTranslateY = translateY.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -350],
	});

	return (
		<View style={{ flex: 1, width: "100%", marginTop: 50 }}>
			<ScrollView showsVerticalScrollIndicator={false}>
			{addPost ? (
							<Animated.View style={{ transform: [{ translateY: interpolatedTranslateY }] }}>
								<MenuInputBlock
									id={items.length}
									endOfPrev={endOfPrev}
									title = {title}
									titleFunc={setTitle}
									dishesFunc={setDishes}
									dishes={dishes}
									dateStartFunc={setDateStart}
									dateEndFunc={setDateEnd}
								/>
							</Animated.View>
						) : null}
				{items.map((item) => (
					<View key={item.id}>
						<Week
							title={item.title}
							dishes={item.dishes}
							dateStart={item.dateStart}
							dateEnd={item.dateEnd}
							id={item.id}
						/>
						<Week
							title={item.title}
							dishes={item.dishes}
							dateStart={item.dateStart}
							dateEnd={item.dateEnd}
							id={item.id}
						/>
					</View>
				))}
			</ScrollView>

			<TouchableOpacity
				style={[
					styles.PostButton,
					{
						bottom: 20,
					},
				]}
				onPress={() => {
					console.log(title);
				}}
			></TouchableOpacity>
			<TouchableOpacity
				style={[
					styles.PostButton,
					{
						bottom: 120,
					},
				]}
				onPress={() => {
					setAppPost(!addPost);
				}}
			></TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: "#fff",
	},
	container: {
		flex: 1,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
	},
	input: {
		height: 55,
		borderWidth: 1,
		padding: 8,
		borderColor: "#3333",
		borderRadius: 20,
		backgroundColor: "#fff",
		fontFamily: "stolzl",
		marginVertical: 3,
	},
	PostButton: {
		height: 80,
		width: 80,
		borderRadius: 999,
		backgroundColor: "#83E144",
		position: "absolute",
		alignSelf: "flex-end",
		right: 20,
		alignItems: "center",
		justifyContent: "center",
	},
});
