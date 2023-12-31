import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";
import themeContext from "./themeContext";
import { Octicons } from '@expo/vector-icons';

export const Week = ({ title, dishes, dateStart, dateEnd,id }) => {
  const weekday = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
  const theme = useContext(themeContext);

  return (
    <View style={styles.PostView}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Octicons name="dot-fill" size={24} color="#83E144" />
        <Text style={[styles.PostTitle, { color: theme.textColor }]}>
          Неделя {id} ({title}){" "}
        </Text>
      </View>
      <View style={[styles.PostDetails, { color: theme.textColor }]}>
          {dishes.map((element, index) => (
            <View key={index} style={{flexDirection: 'row'}}>
              <Text style={[styles.PostData, { color: theme.textColor, width: "8%"}]}>{weekday[index]}</Text>
              <Text style={[styles.PostData, { color: theme.textColor }]}>—  {element}</Text>
            </View>
          ))}
      </View>
      <View style={{marginTop: 10}}>
        <Text style={[styles.PostDate, { color: theme.textColor }]}>
            {dateStart} - {dateEnd}
          </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  PostView: {
    flexDirection: "column",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
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
  },
  PostDate: {
    fontSize: 16,
    fontFamily: "stolzl_light",
  },
});
