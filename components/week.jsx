import { useContext } from "react";
import { StyleSheet } from "react-native";
import { Image, Text, View } from "react-native";
import themeContext from "./themeContext";

export const Week = ({ title, dishes, date, id }) => {
  
  const theme = useContext(themeContext);

  return (
    <View style={styles.PostView}>
      <Text style={[styles.PostTitle, { color: theme.textColor }]}>
        Неделя {id} ({title}){" "}
      </Text>
      <View style={[styles.PostDetails, { color: theme.textColor }]}>
          {dishes.map((element, index) => (
            <Text key={index} style={[styles.PostData, { color: theme.textColor }]}>— {element}</Text>
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
    marginRight: 65,
    fontFamily: "stolzl",
  },
  PostDetails: {
    marginTop: 10,
    flexDirection: "column",
  },
  PostData: {
    fontSize: 14,
    fontFamily: "stolzl",
    
  },
});
