import React, { useContext, useState} from "react";
import { View, TextInput, StyleSheet } from "react-native";
import themeContext from "./themeContext";

export function GetIngrContent(countIngr, setIngredients, ingredients) {
	let inrgContent = [];
	if (countIngr < ingredients.length) {
		setIngredients(ingredients.slice(0, countIngr))
	}
	for (let index = 0; index < countIngr; index++) {
		const pair = [
			index,
			<IngredientInput
				id={index + 1}
				setFunc={setIngredients}
				func={ingredients}
				countIngred={countIngr}
			/>,
		];
		inrgContent.push(pair);
	}
	return inrgContent;

	function IngredientInput(id) {
		const Data = Object.values(id);
		const idData = Data[0];
		const setFunc = Data[1];
		const func = Data[2];
		const countIngr = Data[3];
		let matchesData = ["", "", ""];
		const regexPattern = /([^:]+):\s(.+)/;
		if (func.length != 0 && (idData <= func.length) && func[idData - 1].match(regexPattern) !== null) {
			matchesData = func[idData - 1].match(regexPattern);
		}
		const [matches, setMatches] = useState(matchesData);
		const theme = useContext(themeContext);
		let ingrTemplate = [];
		for (let index = 0; index < countIngr; index++) {
			ingrTemplate.push("");
		} 
	
		
		const SetIngrFunction = (text, keyOrValue) => {
			let newData;
			const newMatches = [...matches];
			if (func.length !== 0) {
				newData = func;
				for (let index = func.length; index < countIngr; index++) {
					newData.push("");
				}
			} else {
				newData = ingrTemplate;
			}
			if (keyOrValue == 0) {
				newMatches[1] = text; 
				newData[idData - 1] = (text + ": " + matches[2]);
			} else {
				newMatches[2] = text; 
				newData[idData - 1] = (matches[1] + ": " + text);
			}
			setFunc(newData);
			setMatches(newMatches);
		}
		
		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<TextInput
					style={[
						styles.IngrInput,
						{
							backgroundColor: theme.searchColor,
							color: theme.textColor,
							width: "67%",
						},
					]}
					value={matches[1]}
					placeholder={"Ингредиент " + Data[0]}
					autoCapitalize='sentences'
					placeholderTextColor={theme.searchPlaceholderColor}
					onChangeText={(text) => SetIngrFunction(text, 0)}
				></TextInput>
				<TextInput
					style={[
						styles.IngrInput,
						{
							backgroundColor: theme.searchColor,
							color: theme.textColor,
							width: "30%",
						},
					]}
					value={matches[2]}
					placeholder="Количество"
					autoCapitalize="none"
					placeholderTextColor={theme.searchPlaceholderColor}
					onChangeText={(text) => SetIngrFunction(text, 1)}
				></TextInput>
			</View>
		);


}
}

export function CPFCPInput(placeholder, id, setFunc, func) {
	const theme = useContext(themeContext);

	const handleInputChange = (text) => {
		const newCPFCP = [...func]; 
		newCPFCP[id] = text; 
		setFunc(newCPFCP); 
	  };

	return (
		<TextInput
			style={[
				styles.CPFCPInput,
				{
					backgroundColor: theme.searchColor,
					color: theme.textColor,
				},
			]}
			value={func[id]}
			placeholder={placeholder}
			autoCapitalize="none"
			placeholderTextColor={theme.searchPlaceholderColor}
			onChangeText={(text) => (handleInputChange(text))}
		></TextInput>
	);
}



const styles = StyleSheet.create({
	IngrInput: {
		marginVertical: 4,
		height: 45,
		borderWidth: 1,
		borderColor: "#3333",
		borderRadius: 10,
		padding: 10,
		backgroundColor: "#fff",
		fontFamily: "stolzl",
	},
	CPFCPInput: {
		marginVertical: 4,
		height: 45,
		borderWidth: 1,
		borderColor: "#3333",
		borderRadius: 10,
		padding: 10,
		backgroundColor: "#fff",
		fontFamily: "stolzl",
		width: "18%",
	},
});
