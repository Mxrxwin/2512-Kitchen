import React, { useContext } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import themeContext from "./themeContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getAuth } from "firebase/auth";
import { GetUserByUID } from "./authFunctions";

export const Comment = ({ item, navigation, currentUID, ifSAdmin}) => {
	const { UID, previewURL, text } = item;
	const defaultPictureURL =
		"https://firebasestorage.googleapis.com/v0/b/fir-kitchen-39a69.appspot.com/o/UserPhotos%2FdefaultPicture.jpg?alt=media&token=25175d34-a3cc-4e1b-b28b-db9ee06fbbdd";
	const theme = useContext(themeContext);

	const Navigate = async () => {
		if (UID === currentUID) {
			navigation.navigate("Профиль");
			return;
		} else {
			const user = await GetUserByUID(UID);
			navigation.navigate("CurrUser", { user: user[0], ifSAdmin: ifSAdmin });
			return;
		}
	}

	return (
		<View style={styles.PostView}>
			<TouchableOpacity style={{flex: 1}} onPress={() => Navigate()}>
				<Image
					style={styles.PostImage}
					source={{ uri: previewURL === null ? defaultPictureURL : previewURL }}
				/>
			</TouchableOpacity>
			<Text style={[styles.text, {color: theme.textColor}]}>
				{text}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	PostView: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		marginBottom: 15
	},
	PostImage: {
		height: 50,
		width: 50,
		borderRadius: 999,
		marginHorizontal: 15,
		marginTop: 4,
		alignSelf: 'flex-start'
	},
	text: {
		width: "75%",
		fontSize: 16,
		fontFamily: "stolzl",
	},
});
