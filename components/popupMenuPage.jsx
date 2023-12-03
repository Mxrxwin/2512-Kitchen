import React, { useRef, useContext, useEffect } from "react";
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
import { Octicons } from "@expo/vector-icons";
import themeContext from "./themeContext";

export const PopupMenuPage = ({ visible, onClose, id, changePost}) => {
	const theme = useContext(themeContext);
	const scale = useRef(new Animated.Value(0)).current;
	const options = [
		{
			title: "Изменить неделю",
			icon: "paintbrush",
			action: () => changePost(id),
		},
	];

	useEffect(() => {
		ResizeBox(visible ? 1 : 0)
	}, [visible])

	function ResizeBox(to) {
		to === 1 && onClose(true);
		Animated.timing(scale, {
			toValue: to,
			useNativeDriver: true,
			duration: 130,
			easing: Easing.elastic(1.3),
		}).start(() => to === 0 && onClose(false));
	}

	

	return (
			<Modal transparent visible={visible}>
				<SafeAreaView style={{ flex: 1, justifyContent: 'center'}} onTouchStart={() => ResizeBox(0)}>
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
	);
};

const styles = StyleSheet.create({
	page: {
		flex: 1,
	},
	popup: {
		borderRadius: 15,
		borderColor: "#4444",
		borderBottomWidth: 2,
		paddingHorizontal: 10,
		alignSelf: 'center',
		right: 10,
		height: 70,
		width: 200,
		justifyContent: 'center',
		alignItems: 'center',
	},
	option: {
		width: '100%',
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
