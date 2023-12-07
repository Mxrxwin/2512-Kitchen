import React, { useContext, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import themeContext from "./themeContext";
import { Ionicons } from "@expo/vector-icons";
import { AutoSizeText, ResizeTextMode  } from "react-native-auto-size-text";
import { CheckUserAdmin } from "./authFunctions";

export const User = ({ item, currentUID }) => {
	const { uid, email, photoURL, createdAt, displayName } = item;
  const [ifAdmin, setIfAdmin] = useState(false);
  CheckUserAdmin(uid, setIfAdmin);
	const defaultPictureURL =
		"https://firebasestorage.googleapis.com/v0/b/fir-kitchen-39a69.appspot.com/o/Photos%2F2519237903.jpg?alt=media&token=33c4fac3-eda1-4fe3-9929-ad2b50d9a046";
	const theme = useContext(themeContext);

	return (
		<View style={styles.PostView}>
			<Image
				style={styles.PostImage}
				source={{ uri: photoURL === null ? defaultPictureURL : photoURL }}
			/>
			<View style={[styles.PostDetails, { color: theme.textColor }]}>
				{currentUID === uid ? (
					<Ionicons
						style={{ marginEnd: 5 }}
						name="person"
						size={26}
						color="#83E144"
					/>
				) : null}
        		{ifAdmin ? (
					<Ionicons
						style={{ marginEnd: 5 }}
						name="star"
						size={26}
						color="#E1ED00"
					/>
				) : null}
				<AutoSizeText
					adjustsFontSizeToFit={true}
					numberOfLines={1}
          fontSize={16}
          mode={ResizeTextMode.max_lines}
					style={[styles.PostData,{flex: 1, color: theme.textColor, marginEnd: 5}]}
				>
					{email}
				</AutoSizeText>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	PostView: {
		flexDirection: "row",
		flex: 1,
		borderBottomWidth: 1,
		borderBottomColor: "#3333",
	},
	PostImage: {
		height: 50,
		width: 50,
		borderRadius: 999,
		margin: 15,
	},
	PostDetails: {
		flexDirection: "row",
		alignItems: "center",
    flex: 1
	},
	PostData: {
		fontSize: 16,
		fontFamily: "stolzl",
	},
});
