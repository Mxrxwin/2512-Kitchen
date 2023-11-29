import React, { useState, useRef, useContext } from "react";
import {
	View,
	StyleSheet,
	Modal,
	SafeAreaView,
	Text,
	Animated,
	Easing,
	TouchableOpacity,
} from "react-native";
import { Octicons, Entypo } from "@expo/vector-icons";
import { DeleteImage, PickImage, DeleteDish } from "./photoUploadFunc";
import themeContext from "./themeContext";

export const PopupMenu = ({
	setImage,
	currentIndex,
	setFiles,
	optionsType,
    navigation,
    dishId
}) => {
	const theme = useContext(themeContext);
	const [visible, setVisible] = useState(false);
	const scale = useRef(new Animated.Value(0)).current;
	const options =
		optionsType === "delete"
			? [
					{
						title: "Добавить фото",
						icon: "plus",
						action: () => PickImage(setImage),
					},
					{
						title: "Удалить фото",
						icon: "trash",
						action: () => DeleteImage(currentIndex, setFiles),
					},
			  ]
			: [
					{
						title: "Изменить",
						icon: "paintbrush",
						action: () => navigation.navigate(("ChangePost"), {dishId: dishId})
					},
					{
						title: "Удалить",
						icon: "trash",
						action: () => (DeleteDish(dishId), navigation.navigate("Home")),
					},
			  ];

	function ResizeBox(to) {
		to === 1 && setVisible(true);
		Animated.timing(scale, {
			toValue: to,
			useNativeDriver: true,
			duration: 130,
			easing: Easing.elastic(1.3),
		}).start(() => to === 0 && setVisible(false));
	}

	return (
		<View style={{ flex: 1 }}>
			<TouchableOpacity onPress={() => ResizeBox(1)}>
				<Entypo name="dots-three-vertical" size={24} color="white" />
			</TouchableOpacity>
			<Modal transparent visible={visible}>
				<SafeAreaView style={{ flex: 1 }} onTouchStart={() => ResizeBox(0)}>
					<Animated.View
						style={[
							styles.popup,
							{
								transform: [{ scale }],
								backgroundColor: theme.backgroundColor,
							},
						]}
					>
						{options.map((op, index) => (
							<TouchableOpacity
								style={styles.option}
								key={index}
								onPress={op.action}
							>
								<Octicons name={op.icon} size={28} color={theme.textColor} />
								<View style={styles.optionText}>
									<Text
										style={{ color: theme.textColor, fontFamily: "stolzl" }}
									>
										{op.title}
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</Animated.View>
				</SafeAreaView>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	page: {
		flex: 1,
	},
	popup: {
		borderRadius: 15,
		borderColor: "#4444",
		borderBottomWidth: 3,
		paddingHorizontal: 10,
		position: "absolute",
		right: 10,
	},
	option: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 7,
		borderBottomColor: "#ccc",
	},
	optionText: {
		justifyContent: "flex-start",
		marginHorizontal: 12,
	},
});
