import React, { useContext, useEffect, useState, useRef } from "react";
import {
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	View,
	RefreshControl,
	FlatList,
	Image,
	Dimensions,
} from "react-native";
import { SimpleLineIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import themeContext from "../components/themeContext";
import { Loading } from "../components/loading";
import { listenToMedia } from "../components/photoUploadFunc";
import userContext from "../components/userContext";
import { CheckUserAdmin } from "../components/authFunctions";
import BottomSheet from "../components/bottomSheet";
import { MediaPost } from "../components/mediaPost";
import { getAuth } from "firebase/auth";

export default function MediaScnreen({ navigation }) {
	const [isLoading, setIsLoading] = useState(false);
	const [items, setItems] = useState([]);
	const itemLength = useRef(0);
	const [filteredItems, setFilteredItems] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const theme = useContext(themeContext);

	const [ifAdmin, setIfAdmin] = useState(false);
	CheckUserAdmin(getAuth().currentUser, setIfAdmin);
	const [darker, setDarker] = useState(false);
	const [showSort, setShowSort] = useState(false);
	const [sortType, setSortType] = useState(["Название", 0]);

	function FetchPosts() {
		setItems([]);
		setFilteredItems([]);
		listenToMedia(setItems);
		listenToMedia(setFilteredItems);
	}

	const contains = ({ text }, query) => {
		const lowerCaseTitle = text.toLowerCase();
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

	useEffect(() => {
		FetchPosts();
	}, []);

	if (filteredItems.length === 0) {
		return <Loading />;
	}

	return (
		<View style={[styles.page, { backgroundColor: theme.backgroundColor }]}>
			<SafeAreaView style={{ flex: 1 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-around",
						alignItems: "center",
						marginTop: 25,
					}}
				>
					<TouchableOpacity
						style={{ alignItems: "flex-start", padding: 16 }}
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
							placeholder="Search        "
							placeholderTextColor={theme.searchPlaceholderColor}
							clearButtonMode="always"
							autoCapitalize="none"
							style={{ fontFamily: "stolzl", color: theme.textColor }}
							value={searchQuery}
							onChangeText={(query) => handleSearch(query)}
						/>
					</View>
				</View>
				<ScrollView
					refreshControl={
						<RefreshControl refreshing={isLoading} onRefresh={FetchPosts} />
					}
				>
					<View
						style={{
							flexWrap: "wrap",
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							marginTop: 10,
						}}
					>
						{items.map((item, index) => (
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("CurrMedia", {
										itemData: items,
										pressedItem: item,
										pressedIndex: index,
									})
								}
								key={index}
							>
								<Image
									source={{ uri: item.picture }}
									style={{
										height: Dimensions.get("screen").width / 4 - 2,
										aspectRatio: 1,
										marginBottom: 2,
									}}
									resizeMode="cover"
								/>
							</TouchableOpacity>
						))}
						{Array.from(
							{ length: items.length % 4 === 0 ? 0 : 4 - (items.length % 4) },
							(_, index) => (
								(
									<View
										key={index}
										style={{
											height: Dimensions.get("screen").width / 4 - 2,
											aspectRatio: 1,
											marginBottom: 2,
										}}
									/>
								)
							)
						)}
					</View>
				</ScrollView>
				{ifAdmin ? (
					<TouchableOpacity
						style={styles.addPostButton}
						onPress={() => {
							navigation.navigate("AddMedia", {item: null});
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
		width: "80%",
		borderWidth: 1,
		marginEnd: 20,
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
