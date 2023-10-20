import { useContext } from "react";
import { StyleSheet } from "react-native";
import { Image, Text, View } from "react-native";
import themeContext from "./themeContext";
import { Octicons } from '@expo/vector-icons';

export const Week = ({ title, dishes, date, id }) => {
<<<<<<< HEAD
  const weekday = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]
=======
  
>>>>>>> 87a1ff0c78b38eddd0c99b2c0b69c2be25a9fd9b
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
<<<<<<< HEAD
            <View style={{flexDirection: 'row'}}>
              <Text key={index} style={[styles.PostData, { color: theme.textColor, width: '6%'}]}>{weekday[index]}</Text>
              <Text style={[styles.PostData, { color: theme.textColor }]}>—  {element}</Text>
            </View>
=======
            <Text key={index} style={[styles.PostData, { color: theme.textColor }]}>— {element}</Text>
>>>>>>> 87a1ff0c78b38eddd0c99b2c0b69c2be25a9fd9b
          ))}
      </View>
      <View style={{marginTop: 10}}>
        <Text style={[styles.PostData, { color: theme.textColor }]}>
            {" "}
            {new Date(date).toLocaleDateString()}{" "}
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
    marginStart: 10
  },
  PostDetails: {
    marginTop: 10,
    flexDirection: "column",
  },
  PostData: {
    fontSize: 14,
    fontFamily: "stolzl",
<<<<<<< HEAD
    marginEnd: 10
=======
    
>>>>>>> 87a1ff0c78b38eddd0c99b2c0b69c2be25a9fd9b
  },
});
