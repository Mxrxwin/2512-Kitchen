import React, { useContext, useState, useEffect } from "react";
import {
	Text,
	TextInput,
	View,
	TouchableOpacity,
	Keyboard,
	KeyboardEvent,
	StyleSheet,
	Image,
	Dimensions,
	KeyboardAvoidingView,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import themeContext from "../components/themeContext";
import {
	useSafeAreaFrame,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { PickMediaImage, SaveMediaRecond, UpdateMediaRecond } from "../components/photoUploadFunc";
import DateTimePicker from "@react-native-community/datetimepicker";

const Wwidth = Dimensions.get("window").width;

export default function AddMedia({ navigation, route }) {
	const { item } = route.params;
	const theme = useContext(themeContext);
	const defaultPicture =
		"https://firebasestorage.googleapis.com/v0/b/fir-kitchen-39a69.appspot.com/o/Photos%2F1699136727177.jpeg?alt=media&token=ab83587d-d62a-4a68-a4e2-55d28efadcd4";
	const [pictureData, setPictureData] = useState({
		height: item === null ? 1300 : item.height,
		width: item === null ? 1300 : item.width,
		downloadURL: item === null ? defaultPicture : item.picture,
	});
	const [text, setText] = useState(item === null ? "" : item.text);
	const [date, setDate] = useState(item === null ? new Date() : new Date(new Date(item.createdAt).toISOString()));
	const [mode, setMode] = useState("date");
	const [show, setShow] = useState(false);

	const insets = useSafeAreaInsets();
	const frame = useSafeAreaFrame();
	const [availableHeight, setAvailableHeight] = useState(
		frame.height - insets.bottom
	);

	function GetDay(dateProp) {
		var date = dateProp.getDate();
		var month = dateProp.getMonth() + 1;
		var year = dateProp.getFullYear();
		var hours = dateProp.getHours();
		var mins = dateProp.getMinutes().toLocaleString();
		if (mins.length === 1) {
			mins = "0" + mins;
		}
		return date + "." + month + "." + year + " " + hours + ":" + mins;
	}

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setDate(currentDate);
		if (mode === "date") {
			setMode("time");
		} else {
			setMode("date");
		}
		setShow(false);
	};

	function Submit() {
		if (text === "" || pictureData.downloadURL === defaultPicture) {
			alert("Ну сделай красиво");
			return;
		}
		const data = {
			createdAt: date.getTime(),
			height: pictureData.height,
			width: pictureData.width,
			text,
			picture: pictureData.downloadURL,
		};
		if (item === null) {
			SaveMediaRecond(data);
		} else {
			UpdateMediaRecond(data);
		}
		navigation.goBack();
	}

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			(e) => {
				setAvailableHeight(frame.height - insets.top - insets.bottom);
			}
		);
		return () => {
			keyboardDidShowListener.remove();
		};
	}, []);

	function GetMarginButton() {
		const avHeight =
			availableHeight -
			(Wwidth * pictureData.height) / pictureData.width -
			120 -
			70;
		if (avHeight < 15) {
			return {
				marginTop: 20,
				marginBottom: 20,
			};
		}
		return {
			marginTop: avHeight - 10,
		};
	}

	return (
		<View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
			<View style={{ flex: 1 }}>
				{show && (
					<DateTimePicker
						testID="dateTimePicker"
						value={date}
						mode={mode}
						is24Hour={true}
						onChange={onChange}
					/>
				)}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						position: "absolute",
						zIndex: 1,
					}}
				>
					<TouchableOpacity
						style={{ padding: 20, marginTop: 10 }}
						onPress={() => navigation.goBack()}
					>
						<AntDesign name="arrowleft" size={35} color="white" />
					</TouchableOpacity>
				</View>
				<ScrollView style={{ flex: 1 }}>
					<TouchableOpacity
						onPress={() => PickMediaImage(setPictureData, setDate)}
						activeOpacity={1}
					>
						<Image
							source={{ uri: pictureData.downloadURL }}
							style={{
								width: Wwidth,
								aspectRatio: pictureData.width / pictureData.height,
							}}
						/>
					</TouchableOpacity>
					<View
						style={[
							styles.input,
							{
								backgroundColor: theme.searchColor,
								marginTop: 20,
								marginHorizontal: 20,
							},
						]}
					>
						<TextInput
							style={{
								fontFamily: "stolzl",
								width: "90%",
								color: theme.textColor,
							}}
							value={text}
							onChangeText={setText}
							placeholder="Заголовок   "
							autoCapitalize="sentences"
							placeholderTextColor={theme.searchPlaceholderColor}
						></TextInput>
						<AntDesign
							name={"close"}
							size={20}
							color="#aaa"
							style={{ marginHorizontal: 10 }}
							onPress={() => setText("")}
						/>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginHorizontal: 20,
						}}
					>
						<View
							style={[
								styles.input,
								{
									backgroundColor: theme.searchColor,
									marginTop: 20,
									width: "82%",
								},
							]}
						>
							<Text
								style={[
									styles.dateText,
									{ color: theme.searchPlaceholderColor },
								]}
							>
								{GetDay(date)}
							</Text>
						</View>
						<TouchableOpacity
							style={styles.calendarButton}
							onPress={() => setShow(true)}
						>
							<Ionicons name="calendar-outline" size={22} color="white" />
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						style={[
							styles.button,
							GetMarginButton(),
							{ backgroundColor: "#83E144" },
						]}
						onPress={() => Submit()}
					>
						<Text style={[styles.buttonText, { color: "white" }]}>Принять</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		height: 45,
		borderWidth: 1,
		borderColor: "#3333",
		borderRadius: 10,
		padding: 10,
		backgroundColor: "#fff",
		flexDirection: "row",
		fontFamily: "stolzl",
		marginTop: 10,
	},
	calendarButton: {
		justifyContent: "center",
		backgroundColor: "#83E144",
		borderRadius: 10,
		marginTop: 20,
		height: 45,
		width: 45,
		alignItems: "center",
	},
	dateText: {
		alignSelf: "center",
		fontFamily: "stolzl",
	},
	button: {
		borderRadius: 10,
		height: 50,
		width: "60%",
		padding: 10,
		borderWidth: 2,
		borderColor: "#83E144",
		alignSelf: "center",
	},
	buttonText: {
		alignSelf: "center",
		fontSize: 20,
		fontFamily: "stolzl",
	},
});
