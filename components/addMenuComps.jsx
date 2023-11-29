import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import themeContext from "./themeContext";
import { Octicons } from "@expo/vector-icons";

export function MenuInputBlock(id) {
	const dataId = id.id;
	const weekday = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
	const theme = useContext(themeContext);

	const title = id.title;
	const setTitle = id.titleFunc;
	const dishes = id.dishes;
	const setDishes = id.dishesFunc;
	const dateStart = id.dateStart;
	const setDateStart = id.dateStartFunc;
	const dateEnd = id.dateEnd;
	const setDateEnd = id.dateEndFunc;

	let time = ["01.01.70", "01.01.70"];
	if (id.endOfPrev !== undefined && dateStart === "") {
		time = GetTime(id.endOfPrev);
	}	

    function GetTime(time) {
        const endOfPrev = time.split(".");
        const inputDate = new Date('20' + endOfPrev[2], endOfPrev[1] - 1, endOfPrev[0]);
        const DateUnix = Math.floor(inputDate / 1000);

        const timeToStart = (DateUnix + 24*60*60);
        const timeToEnd = DateUnix + 24*60*60*7;
        
        const timeToStartFormat = GetTimeToFormat(timeToStart);
        const timeToEndFormat = GetTimeToFormat(timeToEnd);
		setDateStart(timeToStartFormat);
		setDateEnd(timeToEndFormat);
    }

    function GetTimeToFormat(time) {
        var date = new Date(time * 1000);

        var year = date.getFullYear().toString().slice(2,4);
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');

        var outputDateStr = day + '.' + month + '.' + year;
        return outputDateStr;
    }

    function SetDishesFunc(text, index) {
        const newDate = [...dishes];
        newDate[index] = text;
        setDishes(newDate);
    }

    function inputTemplate(setFunc, placeholder, width, marginHorizontal, value, index) {
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
            autoCapitalize='sentences'
            placeholderTextColor={theme.searchPlaceholderColor}
            onChangeText={(text) => setFunc(text, index)}
        ></TextInput>
        )
		
    }

	return (
		<View style={ styles.page}>
			<View style={{ flexDirection: "row", alignItems: 'center', marginTop: -13}}>
				<Octicons name="dot-fill" size={24} color="#83E144" />
				<Text style={[styles.PostTitle, { color: theme.textColor }]}>
					Неделя {dataId} 
				</Text>
				{inputTemplate(setTitle, "Заголовок", "60%", 10, title)}
			</View>
			<View style={[styles.PostDetails, { color: theme.textColor }]}>
				{weekday.map((element, index) => (
					<View key={index} style={{ flexDirection: "row", alignItems: 'center'}}>
						<Text
							style={[styles.PostData, { color: theme.textColor, width: "7%" }]}
						>
							{element} 
						</Text>
                        <Text style={{fontSize: 16, color: theme.textColor}}>—</Text>
						{inputTemplate(SetDishesFunc, "Блюдо", "60%", 10, dishes[index], index)}
					</View>
				))}
			</View>
			<View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
                {inputTemplate(setDateStart, "Дата начала", "25%", 2, dateStart)}
                <Text style={{fontSize: 16, fontFamily: "stolzl_light", color: theme.textColor}}>—</Text>
                {inputTemplate(setDateEnd, "Дата конца",  "25%", 4, dateEnd)}
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
        marginVertical: 3
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
