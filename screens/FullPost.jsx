import React from "react";
import { View, Text, ImageBackground } from "react-native";
import axios from "axios";
import { Loading } from "../components/loading";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from '@expo/vector-icons';

export const FullPostScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const { id, title } = route.params;

  React.useEffect(() => {
    navigation.setOptions({
      title,
    });
    axios
      .get("https://6515c9e609e3260018c924d0.mockapi.io/Article/" + id)
      .then(({ data }) => {
        setData(data);
      })
      .catch((err) => {
        console.log(err);
        alert("Ошибка при получении статей");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <View>
        <Loading />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground style={styles.PostImage} source={{ uri: data.imageUrl }}>
        <TouchableOpacity style={{padding: 20,}}>
            <AntDesign name="arrowleft" size={35} color='white' onPress={() => navigation.navigate("Home")} />
        </TouchableOpacity>
      </ImageBackground>
      <Text style={styles.PostText}>{data.title}</Text>
      <Text style={styles.PostDescription}>
        {new Date(data.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  PostImage: {
    width: "100%",
    height: 300
  },
  PostText: {
    padding: 20,
    fontSize: 18,
    lineHeight: 24,
  },
  PostDescription: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "200",
    alignItems: "center",
    position: "absolute",
    padding: 20,
    bottom: 0,
  },
});
