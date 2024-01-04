import React, { useContext, useEffect, useState } from "react";
import {
	BackHandler,
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	Image,
	ScrollView,
} from "react-native";
import { Octicons, AntDesign, Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH } from "../firebase.config";
import themeContext from "../components/themeContext";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { SetAdmin } from "../components/authFunctions";

export default function UnselfPersonal({ route, navigation }) {
  const { user, ifSAdmin } = route.params;
	const theme = useContext(themeContext);
	const { uid, email, photoURL, createdAt, displayName, isAdmin } = user;
  const [userAdmin, setUserAdmin] = useState(isAdmin);
	const defaultPictureURL =
		"https://firebasestorage.googleapis.com/v0/b/fir-kitchen-39a69.appspot.com/o/UserPhotos%2FdefaultPicture.jpg?alt=media&token=25175d34-a3cc-4e1b-b28b-db9ee06fbbdd";

	const getTime = (unix) => {
		const date = new Date(parseInt(unix));
		return date.toLocaleString();
	};

  const setUserStatus= (uid, prop) => {
    setUserAdmin(prop);
    SetAdmin(uid, prop);
  }

	return (
		<View style={[styles.page, { backgroundColor: theme.backgroundColor }]}>
			<ScrollView contentContainerStyle={{ flex: 1 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "flex-start",
						marginTop: 25,
					}}
				>
					<View style={{ zIndex: 2, width: "20%" }}>
						<TouchableOpacity style={{ padding: 16 }}>
							<AntDesign
								name="arrowleft"
								size={35}
								color={theme.textColor}
								onPress={() => navigation.goBack()}
							/>
						</TouchableOpacity>
					</View>
          {ifSAdmin ? 
					<TouchableOpacity
						style={{ alignItems: "flex-start", padding: 16 }}
						onPress={() => setUserStatus(uid, !userAdmin)}
					>
						<Ionicons name="star" size={28} color={userAdmin ? "#E1ED00" : theme.setAdminColor} />
					</TouchableOpacity>
          : null}
				</View>
				<View style={styles.mainBlock}>
					<Image
						style={styles.image}
						source={{ uri: photoURL === null ? defaultPictureURL : photoURL }}
					></Image>
					<Text style={[styles.mainText, { color: theme.textColor }]}>
						{displayName === null ? "username" : displayName}
					</Text>
					<Text style={[styles.descText, { color: theme.textColor }]}>
						{email}
					</Text>
					<Text style={[styles.descText, { color: theme.textColor }]}>
						{uid}
					</Text>
					<Text style={[styles.descText, { color: theme.textColor }]}>
						created: {getTime(createdAt)}
					</Text>
				</View>
				<View
					style={{ alignItems: "center", flex: 1, justifyContent: "flex-end" }}
				></View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: "#fff",
	},
	mainBlock: {
		alignItems: "center",
	},
	mainText: {
		fontSize: 16,
		fontFamily: "stolzl",
		marginVertical: 5,
	},
	descText: {
		fontSize: 14,
		fontFamily: "stolzl_light",
		marginVertical: 5,
	},
	image: {
		height: 200,
		width: 200,
		borderRadius: 999,
	},
	extiButton: {
		flexDirection: "row",
		backgroundColor: "#83E144",
		alignItems: "center",
		justifyContent: "center",
		width: "80%",
		height: 40,
		marginBottom: 30,
		borderRadius: 10,
	},
	buttonText: {
		fontFamily: "stolzl",
		color: "white",
		fontSize: 16,
	},
});
