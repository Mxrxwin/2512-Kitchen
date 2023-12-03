import React, { useState, useContext, useEffect } from "react";
import {
	View,
	StyleSheet,
	ImageBackground,
	Text,
	TouchableOpacity,
	Image,
} from "react-native";
import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { EventRegister } from "react-native-event-listeners";
import themeContext, {
	getThemePreference,
	saveThemePreference,
} from "../components/themeContext";
import Constants from "expo-constants";
import { getAuth } from "firebase/auth";
import { CheckUserAdmin } from "../components/authFunctions";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";

export default CustomDrawer = (props) => {
	const navigation = useNavigation();
	const [darkMode, setDarkMode] = useState(false);
	getThemePreference(setDarkMode);
	const theme = useContext(themeContext);
	const userData = getAuth();
	const { photoURL, displayName } =
		userData.currentUser === null
			? { undefined, undefined }
			: userData.currentUser;
	const [ifAdmin, setIfAdmin] = useState(false);
	let toggle = [0, 0];
	CheckUserAdmin(userData.currentUser, setIfAdmin);
	const defaultPictureURL =
		"https://firebasestorage.googleapis.com/v0/b/fir-kitchen-39a69.appspot.com/o/Photos%2F2519237903.jpg?alt=media&token=33c4fac3-eda1-4fe3-9929-ad2b50d9a046";

	const pan = Gesture.Pan()
		.runOnJS(true)
		.onBegin((e) => {
			toggle = [e.absoluteX, e.absoluteY];
			SwitchTheme();
		});


	const SwitchTheme = () => {
		setDarkMode(!darkMode);
		saveThemePreference(!darkMode);
		EventRegister.emit("ChangeTheme", [!darkMode, toggle]);
	};

	return (
		<View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
			<DrawerContentScrollView {...props}>
				<View
					style={{
						backgroundColor: "green",
						height: Constants.statusBarHeightr,
						marginTop: -Constants.statusBarHeight - 5,
					}}
				></View>
				<ImageBackground
					source={
						darkMode
							? require("../assets/images/dark-menu-bg.jpg")
							: require("../assets/images/menu-bg.jpg")
					}
					style={{
						padding: 10,
						width: 340,
						height: 195,
					}}
				>
					<TouchableOpacity
						style={{ height: 140, width: 100 }}
						activeOpacity={1}
						onPress={() => navigation.navigate("Профиль")}
					>
						<Image
							style={{
								height: 100,
								width: 100,
								borderRadius: 999,
								marginTop: 40,
							}}
							source={{
								uri:
									photoURL === undefined || photoURL === null
										? defaultPictureURL
										: photoURL,
							}}
						></Image>
					</TouchableOpacity>
					<View
						style={{
							marginTop: 12,
							marginStart: 4,
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						{ifAdmin ? (
							<MaterialCommunityIcons
								name="crown-outline"
								size={28}
								color="#E1ED00"
							/>
						) : null}
						<AutoSizeText
							style={{
								fontFamily: "stolzl",
								marginStart: ifAdmin ? 11 : 0,
								color: theme.textColor,
							}}
							fontSize={22}
							width={220}
							numberOfLines={1}
							mode={ResizeTextMode.max_lines}
						>
							{displayName === undefined || displayName === null
								? "Username"
								: displayName}
						</AutoSizeText>
					</View>
				</ImageBackground>
				<View
					style={{
						borderBottomWidth: 1,
						borderBlockColor: "#ccc",
						opacity: 0.3,
					}}
				></View>
				<View style={{ flex: 1, paddingTop: 10 }}>
					<DrawerItemList {...props} />
				</View>
			</DrawerContentScrollView>
			<View>
				<View style={styles.footTextPanel}>
					<TouchableOpacity
						style={{ flexDirection: "row", alignItems: "center", width: "90%" }}
					>
						<Ionicons
							name="share-social-outline"
							size={24}
							color={theme.textColor}
						/>
						<Text
							style={{
								fontSize: 14,
								fontFamily: "stolzl",
								color: theme.textColor,
								marginStart: 10,
							}}
						>
							Contact Us
						</Text>
					</TouchableOpacity>

					<GestureDetector gesture={pan}>
						<Ionicons
							name={darkMode ? "sunny-outline" : "moon-outline"}
							size={30}
							color={theme.textColor}
						/>
					</GestureDetector>
				</View>
				<Text style={styles.verText}>v1.1.0</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	drawerContent: {
		backgroundColor: "#83E144",
	},
	footTextPanel: {
		flexDirection: "row",
		padding: 20,
		borderTopColor: "#ccc",
		borderTopWidth: 1,
	},
	verText: {
		position: 'absolute',
		bottom: 2,
		marginStart: 5,
		fontSize: 10,
		fontFamily: 'stolzl',
		color: 'grey'
	}
});
