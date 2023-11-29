import React, { useContext, useEffect, useState, useRef } from "react";
import {
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	View,
	RefreshControl,
	FlatList,
	Modal,
	Animated,
	Easing,
	StatusBar,
} from "react-native";
import { SimpleLineIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { Post } from "../components/post";
import themeContext from "../components/themeContext";
import { Loading } from "../components/loading";
import { listenToDishes } from "../components/photoUploadFunc";
import userContext from "../components/userContext";
import { CheckUserAdmin } from "../components/authFunctions";
import BottomSheet from "../components/bottomSheet";

export default function MenuScreen({ navigation }) {
	const [isLoading, setIsLoading] = useState(false);
	const [items, setItems] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const theme = useContext(themeContext);

	const user = useContext(userContext);
	const [ifUserAdmin, setIfUserAdmin] = useState(false);
	const [darker, setDarker] = useState(false);
	const [showSort, setShowSort] = useState(false);
	const [sortType, setSortType] = useState(["Название", 0]);

	const animatedColorValue = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		if (user !== null) {
			CheckUserAdmin(user, setIfUserAdmin);
		} else {
			setIfUserAdmin(false);
		}
	}, [user]);

	function FetchPosts() {
		setItems([]);
		setFilteredItems([]);
		listenToDishes(setItems);
		listenToDishes(setFilteredItems);
		
	}

	useEffect(() => {
		FetchPosts();
		if (user !== null) {
			CheckUserAdmin(user, setIfUserAdmin);
		}
	}, []);

	const contains = ({ title }, query) => {
		const lowerCaseTitle = title.toLowerCase();
		return lowerCaseTitle.includes(query);
	};

	const handleSearch = (query) => {
		setSearchQuery(query);
		const formatedQuery = query.toLowerCase();
		const filteredData = filteredItems.filter((item) =>
			contains(item, formatedQuery)
		);
		setItems(filteredData);
		setSortType(["Название", 0]);
	};

	const sorting = (sortType) => {
		let newItems = [...items];
		switch (sortType[0]) {
			case "Название":
				if (sortType[1]) {
					newItems.sort((a,b) => b.title.localeCompare(a.title));
					setItems(newItems);
					return;
				}
				newItems.sort((a,b) => a.title.localeCompare(b.title));
				setItems(newItems);
			break;
			case "Калории":
				if (sortType[1]) {
					newItems.sort((a,b) => parseInt(a.CPFCP[0]) - parseInt(b.CPFCP[0]));
					setItems(newItems);
					return;
				}
				newItems.sort((a,b) => parseInt(b.CPFCP[0]) - parseInt(a.CPFCP[0]));
				setItems(newItems);
			break;
			case "Белки":
				if (sortType[1]) {
					newItems.sort((a,b) => parseInt(a.CPFCP[1]) - parseInt(b.CPFCP[1]));
					setItems(newItems);
					return;
				}
				newItems.sort((a,b) => parseInt(b.CPFCP[1]) - parseInt(a.CPFCP[1]));
				setItems(newItems);
			break;
			case "Жиры":
				if (sortType[1]) {
					newItems.sort((a,b) => parseInt(a.CPFCP[2]) - parseInt(b.CPFCP[2]));
					setItems(newItems);
					return;
				}
				newItems.sort((a,b) => parseInt(b.CPFCP[2]) - parseInt(a.CPFCP[2]));
				setItems(newItems);
			break;
			case "Углеводы":
				if (sortType[1]) {
					newItems.sort((a,b) => parseInt(a.CPFCP[3]) - parseInt(b.CPFCP[3]));
					setItems(newItems);
					return;
				}
				newItems.sort((a,b) => parseInt(b.CPFCP[3]) - parseInt(a.CPFCP[3]));
				setItems(newItems);
			break;	
			case "Цена":
				if (sortType[1]) {
					newItems.sort((a,b) => parseInt(a.CPFCP[4]) - parseInt(b.CPFCP[4]));
					setItems(newItems);
					return;
				}
				newItems.sort((a,b) => parseInt(b.CPFCP[4]) - parseInt(a.CPFCP[4]));
				setItems(newItems);
			break;		
			default:
			break;
		}
	}

	useEffect(() => {
		sorting(sortType);
	}, [sortType]);

	useEffect(() => {
		animation(darker ? 1 : 0);
	}, [darker]);

	function animation(to) {
		to === 1 && setShowSort(true);
		if (to) {
			StatusBar.setBackgroundColor("rgba(0, 0, 0, 0.2)", true);

		} else {
			StatusBar.setBackgroundColor("rgba(0, 0, 0, 0)", true);
		}
		Animated.timing(animatedColorValue, {
			toValue: to,
			duration: 100,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start(() => to === 0 && setShowSort(false));
	}

	const interpolatedColor = animatedColorValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.2)"],
	});

	if (filteredItems.length === 0) {
		return <Loading />;
	}

	return (
		<View style={[styles.page, { backgroundColor: theme.backgroundColor }]}>
			<Modal transparent={true} visible={showSort}>
				<View style={{ flex: 1 }}>
					<Animated.View
						style={{ backgroundColor: interpolatedColor, flex: 1 }}
					></Animated.View>
				</View>
			</Modal>
			<BottomSheet
				visible={showSort}
				close={(prop) => setDarker(prop)}
				func={(name, type) => setSortType([name, type])}
			/>
			<SafeAreaView style={{ flex: 1 }}>
				<View
					style={{ flexDirection: "row", alignItems: "center", marginTop: 27 }}
				>
					<TouchableOpacity
						style={{ alignItems: "flex-start", margin: 16 }}
						onPress={navigation.openDrawer}
					>
						<SimpleLineIcons name="menu" size={24} color={theme.textColor} />
					</TouchableOpacity>
					<View style={[styles.search, { backgroundColor: theme.searchColor }]}>
						<Ionicons
							style={{ padding: 5 }}
							name="search"
							size={20}
							color={theme.searchPlaceholderColor}
						/>
						<TextInput
							placeholder="Search   "
							placeholderTextColor={theme.searchPlaceholderColor}
							clearButtonMode="always"
							autoCapitalize="none"
							style={{ fontFamily: "stolzl", color: theme.textColor }}
							value={searchQuery}
							onChangeText={(query) => handleSearch(query)}
						/>
					</View>
					<TouchableOpacity
						style={{ alignItems: "flex-start", margin: 10 }}
						onPress={() => setDarker(true)}
					>
						<Ionicons name="funnel-outline" size={28} color={theme.textColor} />
					</TouchableOpacity>
				</View>

				<FlatList
					style={{ flex: 1 }}
					refreshControl={
						<RefreshControl refreshing={isLoading} onRefresh={FetchPosts} />
					}
					showsVerticalScrollIndicator={false}
					data={items}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={async () =>
								navigation.navigate("FullPost", {
									id: item.id,
								})
							}
						>
							<Post
								title={item.title}
								imageUrl={item.previewImg}
								recipe={item.recipe}
								CPFCP={item.CPFCP}
							/>
						</TouchableOpacity>
					)}
				/>

				{ifUserAdmin ? (
					<TouchableOpacity
						style={styles.addPostButton}
						onPress={() => {
							navigation.navigate("AddPost", { countDishes: items.length });
						}}
					>
						<FontAwesome5 name="plus" size={35} color={theme.backgroundColor} />
					</TouchableOpacity>
				) : null}
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
	},
	addPostButton: {
		height: 80,
		width: 80,
		borderRadius: 999,
		backgroundColor: "#83E144",
		position: "absolute",
		alignSelf: "flex-end",
		bottom: 20,
		right: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	search: {
		width: "74%",
		borderWidth: 1,
		borderColor: "#3333",
		borderRadius: 20,
		height: 40,
		flexDirection: "row",
		alignItems: "center",
	},
	postImage: {
		width: "100%",
		height: 250,
		borderRadius: 10,
		marginRight: 20,
	},
	postText: {
		fontSize: 18,
		lineHeight: 24,
		fontFamily: "stolzl",
	},
	postDescription: {
		fontSize: 15,
		lineHeight: 24,
		fontWeight: "200",
		alignItems: "center",
		position: "absolute",
		padding: 20,
		bottom: 0,
	},
});
