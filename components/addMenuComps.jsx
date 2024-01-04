import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import themeContext from "./themeContext";
import { Octicons } from "@expo/vector-icons";

export function MenuInputBlock({
	id,
	title,
	titleFunc,
	dishes,
	dishesFunc,
	dateStart,
	dateStartFunc,
	dateEnd,
	dateEndFunc,
}) {
	const weekday = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
	const theme = useContext(themeContext);

	function SetDishesFunc(text, index) {
		const newDate = [...dishes];
		newDate[index] = text;
		dishesFunc(newDate);
	}

	function inputTemplate(
		setFunc,
		placeholder,
		width,
		marginHorizontal,
		value,
		index
	) {
		return (
			<TextInput
				style={[
					styles.input,
					{
						marginHorizontal: marginHorizontal,
						width: width,
						backgroundColor: theme.searchColor,
						color: theme.textColor,
					},
				]}
				value={value}
				placeholder={placeholder}
				autoCapitalize="sentences"
				placeholderTextColor={theme.searchPlaceholderColor}
				onChangeText={(text) => setFunc(text, index)}
			></TextInput>
		);
	}

	return (
		<View style={styles.page}>
			<View
				style={{ flexDirection: "row", alignItems: "center", marginTop: -13 }}
			>
				<Octicons name="dot-fill" size={24} color="#83E144" />
				<Text style={[styles.PostTitle, { color: theme.textColor }]}>
					Неделя {id}
				</Text>
				{inputTemplate(titleFunc, "Заголовок", "60%", 10, title)}
			</View>
			<View style={[styles.PostDetails, { color: theme.textColor }]}>
				{weekday.map((element, index) => (
					<View
						key={index}
						style={{ flexDirection: "row", alignItems: "center" }}
					>
						<Text
							style={[styles.PostData, { color: theme.textColor, width: "8%" }]}
						>
							{element}
						</Text>
						<Text style={{ fontSize: 16, color: theme.textColor }}>—</Text>
						{inputTemplate(
							SetDishesFunc,
							"Блюдо",
							"60%",
							10,
							dishes[index],
							index
						)}
					</View>
				))}
			</View>
			<View
				style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}
			>
				{inputTemplate(dateStartFunc, "Дата начала", "25%", 2, dateStart)}
				<Text
					style={{
						fontSize: 16,
						fontFamily: "stolzl_light",
						color: theme.textColor,
					}}
				>
					—
				</Text>
				{inputTemplate(dateEndFunc, "Дата конца", "25%", 4, dateEnd)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.1)",
	},
	input: {
		height: 35,
		borderWidth: 1,
		padding: 8,
		borderColor: "#3333",
		borderRadius: 20,
		backgroundColor: "#fff",
		fontFamily: "stolzl",
		marginVertical: 3,
	},
	PostView: {
		flexDirection: "column",
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.1)",
		height: 250,
	},
	PostTitle: {
		fontSize: 15,
		fontFamily: "stolzl",
		marginStart: 10,
	},
	PostDetails: {
		marginTop: 10,
		flexDirection: "column",
	},
	PostData: {
		fontSize: 16,
		fontFamily: "stolzl",
		marginEnd: 10,
	},
	PostDate: {
		fontSize: 16,
		fontFamily: "stolzl_light",
		marginEnd: 10,
	},
});
