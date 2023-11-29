import React, { useContext, useEffect, useRef, useState } from "react";
import {
	StyleSheet,
	View,
	Dimensions,
	TouchableOpacity,
	Text,
	SafeAreaView,
	Modal,
	Animated,
	Easing,
} from "react-native";

import { Ionicons, Octicons } from "@expo/vector-icons";
import themeContext from "./themeContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const BottomSheet = ({ visible, close, func }) => {
	const names = ["Название", "Калории", "Белки", "Жиры", "Углеводы", "Цена"];
	const [currentSort, setCurrentSort] = useState("Название");
	const [typeOfCurrSort, setTypeOfCurrSort] = useState(0);
	const theme = useContext(themeContext);
	const translateY = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		ResizeBox(visible ? 1 : 0);
	}, [visible]);

	function ResizeBox(to) {
		to === 1 && close(true);
		Animated.timing(translateY, {
			toValue: to,
			useNativeDriver: true,
			duration: 130,
			easing: Easing.elastic(1.1),
		}).start(() => to === 0 && close(false));
	}

	const interpolatedTranslateY = translateY.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -SCREEN_HEIGHT / 2.5],
	});

	function getParams(name, index) {
		return (
			<TouchableOpacity key={index} style={styles.block} onPress={() => setSorting(name)}>
				<Text style={[styles.text, { color: theme.textColor }]}>{name}</Text>
				{currentSort === name ? (
					<Octicons  name={typeOfCurrSort ? "sort-asc" : "sort-desc"} size={30} color="#83E144" />
				) : null}
			</TouchableOpacity>
		);
	}

	function setSorting(name) {
		setSortingFunc(name);

		function setSortingFunc(name) {
			if (currentSort === name) {
                if (typeOfCurrSort === 1) {
                    setTypeOfCurrSort(0);
                    func(name, 0);
                    return;
                }
                setTypeOfCurrSort(1);
                func(name, 1);
				return;
			}
			setCurrentSort(name);
            setTypeOfCurrSort(0);
            func(name, 0);
		}
	}

	return (
		<Modal transparent visible={visible}>
			<SafeAreaView
				style={{ flex: 1, justifyContent: "center" }}
				onTouchStart={() => ResizeBox(0)}
			></SafeAreaView>
			<Animated.View
				style={[
					styles.bottomSheetContainer,
					{
						transform: [{ translateY: interpolatedTranslateY }],
						backgroundColor: theme.backgroundColor,
					},
				]}
			>
				<TouchableOpacity
					onPress={() => ResizeBox(0)}
					style={{
						width: 40,
						height: 40,
                        marginTop: 10,
                        marginLeft: 10,
						alignItems: "flex-end",
						justifyContent: "flex-end",
					}}
				>
					<Ionicons name="close" size={32} color={theme.textColor} />
				</TouchableOpacity>

				<View style={styles.page}>
					{names.map((item, index) => {
						return getParams(item, index);
					})}
				</View>
			</Animated.View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	bottomSheetContainer: {
		height: SCREEN_HEIGHT,
		width: "100%",
		position: "absolute",
		top: SCREEN_HEIGHT,
		borderRadius: 50,
	},
	page: {
		flex: 1,
		margin: 15,
		flexDirection: "column",
		marginTop: -5,
	},
	block: {
		alignItems: "center",
		height: 45,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	text: {
        marginLeft: 10,
        marginTop: 10,
		fontSize: 18,
		fontFamily: "stolzl",
	},
	line: {
		width: 75,
		height: 4,
		backgroundColor: "grey",
		alignSelf: "center",
		marginTop: 15,
	},
});

export default BottomSheet;
