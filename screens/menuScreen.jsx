import React, { useContext, useEffect, useState, useRef } from "react";
import {
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	View,
	RefreshControl,
	Animated,
	Easing,
	Modal,
	StatusBar,
} from "react-native";
import {
	SimpleLineIcons,
	Ionicons,
	FontAwesome,
	FontAwesome5,
	Entypo,
} from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Week } from "../components/week";
import themeContext from "../components/themeContext";
import { Loading } from "../components/loading";
import {
	SaveMenuRecond,
	listenToMenu,
	UpdateMenuRecord,
} from "../components/photoUploadFunc";
import { MenuInputBlock } from "../components/addMenuComps";
import { PopupMenuPage } from "../components/popupMenuPage";
import userContext from "../components/userContext";
import { CheckUserAdmin } from "../components/authFunctions";



export default function MenuScreen({ navigation }) {
	const [isLoading, setIsLoading] = useState(false);
	const translateY = useRef(new Animated.Value(-350)).current;
	const translateX = useRef(new Animated.Value(0)).current;
	const animatedColorValue = useRef(new Animated.Value(0)).current;
	const scrollViewRef = useRef(null);
	const [items, setItems] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortType, setSortType] = useState(false);
	const theme = useContext(themeContext);
	const [addPost, setAppPost] = useState(false);
	const [changePost, setChangePost] = useState(-1);

	const [endOfPrev, setEndOfPrev] = useState(null);
	const [nextId, setNextId] = useState();
	const [title, setTitle] = useState("");
	const [dishes, setDishes] = useState(["", "", "", "", "", "", ""]);
	const [dateStart, setDateStart] = useState("");
	const [dateEnd, setDateEnd] = useState("");

	const [visible, setVisible] = useState(false);
	const [changePosibility, setChangePosibility] = useState(true);
	const changeID = useRef(999);
	const user = useContext(userContext);
	const [ifUserAdmin, setIfUserAdmin] = useState(false);

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
		listenToMenu(setItems);
		listenToMenu(setFilteredItems);
	}

	useEffect(() => {
		const maxId = items.reduce(
			(max, current) => (current.id > max.id ? current : max),
			items[0]
		);
		setEndOfPrev(maxId !== undefined ? maxId.dateEnd : undefined);
		setNextId(items.length);
		sortType
			? items.sort((a, b) => a.id - b.id)
			: items.sort((a, b) => b.id - a.id);
	}, [items]);

	useEffect(() => {
		FetchPosts();
	}, []);

	useEffect(() => {
		if (changePost !== -1) {
			const file = items.filter((item) => item.id == changePost)[0];
			setNextId(file.id);
			setTitle(file.title);
			setDateEnd(file.dateEnd);
			setDateStart(file.dateStart);
			setDishes(file.dishes);
			setAppPost(true);
			scrollViewRef.current.scrollTo({ y: 0 });
		}
	}, [changePost]);

	React.useEffect(() => {
		let newItems = [...items];
		sortType
			? newItems.sort((a, b) => a.id - b.id)
			: newItems.sort((a, b) => b.id - a.id);
		setItems(newItems);
	}, [sortType]);

	const contains = ({ title }, query) => {
		const lowerCaseTitle = title.toLowerCase();
		return lowerCaseTitle.includes(query);
	};

	const PopupVisibleChange = (prop) => {
		setVisible(prop);
	};

	const handleSearch = (query) => {
		setSearchQuery(query);
		const formatedQuery = query.toLowerCase();
		const filteredData = filteredItems.filter((item) =>
			contains(item, formatedQuery)
		);
		setItems(filteredData);
	};

	function Save() {
		const dateRegex = /^\d{2}\.\d{2}\.\d{2}$/;
		if (
			title === "" ||
			dishes.includes("") ||
			!dateRegex.test(dateStart) ||
			!dateRegex.test(dateEnd)
		) {
			alert(
				"Вы заполнили не все поля или заполнили дату в неправильном формате"
			);
		} else {
			if (nextId === items.length) {
				SaveMenuRecond(title, dishes, dateStart, dateEnd, nextId);
			} else {
				UpdateMenuRecord(title, dishes, dateStart, dateEnd, nextId);
			}
			setTitle("");
			setDateEnd("");
			setDateStart("");
			setDishes(["", "", "", "", "", "", ""]);
			setAppPost();
		}
	}

	function AddNewPost() {
		setAppPost(!addPost);
		if (!addPost) {
			scrollViewRef.current.scrollTo({ y: 0 });
		} else {
			setNextId(items.length);
			setTitle("");
			setDateEnd("");
			setDateStart("");
			setDishes(["", "", "", "", "", "", ""]);
		}
	}

	function ChangePostPress(itemId) {
		changeID.current = itemId;
		PopupVisibleChange(true);
	}

	useEffect(() => {
		Animated.timing(translateY, {
			toValue: addPost ? 0 : 1,
			duration: 200,
			easing: Easing.elastic(1.1),
			useNativeDriver: true,
		}).start();

		Animated.timing(translateX, {
			toValue: addPost ? 0 : 1,
			duration: 300,
			easing: Easing.elastic(1.3),
			useNativeDriver: true,
		}).start();
	}, [addPost]);

	useEffect(() => {
		Animated.timing(animatedColorValue, {
			toValue: visible ? 1 : 0,
			duration: 200,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start();
	}, [visible]);

	const interpolatedTranslateX = translateX.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 150],
	});

	const interpolatedTranslateY = translateY.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -350],
	});

	const interpolatedColor = animatedColorValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.2)"],
	});

	if (filteredItems.length === 0) {
		return <Loading />;
	}

	return (
		<View style={[styles.page, { backgroundColor: theme.backgroundColor }]}>
			<Modal transparent={true} visible={visible}>
				<SafeAreaView style={styles.modalContainer}>
					<Animated.View
						style={{ backgroundColor: interpolatedColor, flex: 1 }}
					></Animated.View>
				</SafeAreaView>
			</Modal>
			<StatusBar
				backgroundColor={visible ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0)"}
				translucent={true}
			/>
			<PopupMenuPage
				visible={visible}
				onClose={(prop) => PopupVisibleChange(prop)}
				id={changeID.current}
				changePost={setChangePost}
			/>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-around",
					alignItems: "center",
					marginTop: 27,
				}}
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
					style={{ alignItems: "flex-start", margin: 16 }}
					onPress={() => setSortType(!sortType)}
				>
					<FontAwesome
						name={sortType ? "sort-amount-asc" : "sort-amount-desc"}
						size={24}
						color={theme.textColor}
					/>
				</TouchableOpacity>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={isLoading} onRefresh={FetchPosts} />
				}
				ref={scrollViewRef}
			>
				{addPost ? (
					<Animated.View
						style={{ transform: [{ translateY: interpolatedTranslateY }] }}
					>
						<MenuInputBlock
							id={nextId}
							endOfPrev={endOfPrev}
							title={title}
							titleFunc={setTitle}
							dishes={dishes}
							dishesFunc={setDishes}
							dateStart={dateStart}
							dateStartFunc={setDateStart}
							dateEnd={dateEnd}
							dateEndFunc={setDateEnd}
						/>
					</Animated.View>
				) : null}
				{items.map((item) => (
					<View key={item.id}>
						<TouchableOpacity
							onLongPress={() =>
								ifUserAdmin ? ChangePostPress(item.id) : null
							}
							activeOpacity={1}
						>
							<Week
								title={item.title}
								dishes={item.dishes}
								dateStart={item.dateStart}
								dateEnd={item.dateEnd}
								id={item.id}
							/>
						</TouchableOpacity>
					</View>
				))}
			</ScrollView>

			<View>
				{ifUserAdmin ? (
					<TouchableOpacity
						style={[
							styles.PostButton,
							{
								bottom: 20,
							},
						]}
						onPress={() => {
							AddNewPost();
						}}
					>
						{addPost ? (
							<Entypo name="cross" size={50} color={theme.backgroundColor} />
						) : (
							<FontAwesome5
								name="plus"
								size={35}
								color={theme.backgroundColor}
							/>
						)}
					</TouchableOpacity>
				) : null}
				<Animated.View
					style={{ transform: [{ translateX: interpolatedTranslateX }] }}
				>
					<TouchableOpacity
						style={[
							styles.PostButton,
							{
								bottom: 120,
							},
						]}
						onPress={() => {
							Save();
						}}
					>
						<FontAwesome5
							name="check"
							size={35}
							color={theme.backgroundColor}
						/>
					</TouchableOpacity>
				</Animated.View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
	},
	modalContainer: {
		flex: 1,
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
	search: {
		width: "75%",
		borderWidth: 1,
		borderColor: "#3333",
		borderRadius: 20,
		height: 40,
		flexDirection: "row",
		alignItems: "center",
	},
	deleteButton: {
		zIndex: 1,
		position: "absolute",
		marginTop: 16,
		right: 15,
	},
});
