import React from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Animated,
} from "react-native";
import axios from "axios";
import { Loading } from "../components/loading";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { MotiView, useDynamicAnimation } from "moti";

export default FullPostScreen = ({ route, navigation }) => {
  const [yValue, setYValue] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const { id, title, text } = route.params;

  const animation = useDynamicAnimation(() => {
    return {
      width: "100%",
      height: 300,
    };
  });

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
    <ImageBackground style={{ flex: 1, width: '100%', height: 450}} source={{ uri: data.imageUrl }}>
      <ScrollView
        style={{ flex: 1 }}
        onScroll={(e) => {
          if (e.nativeEvent.contentOffset.y.toFixed(0) > 30) {
            animation.animateTo({
              width: "100%",
              height: yValue > 250 ? 60 : 300 - yValue,
            });
          } else {
            animation.animateTo({
              width: "100%",
              height: 300,
            });
          }
          setYValue(e.nativeEvent.contentOffset.y.toFixed(0));
        }}
      >
        <TouchableOpacity style={{ padding: 20 }}>
          <AntDesign
            name="arrowleft"
            size={35}
            color="white"
            onPress={() => navigation.navigate("Home")}
          />
        </TouchableOpacity>
        <MotiView  style={{ width: "100%", height: 300 }}>

        </MotiView>
        <View style={{backgroundColor: '#fff', borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
          <Text style={styles.PostTitle}>{title}</Text>
          <Text style={styles.PostText}>{text}</Text>
          <Text style={styles.PostDescription}>
            {new Date(data.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
      <MotiView
        from={{ translateY: -80 }}
        animate={{ translateY: yValue > 380 ? 0 : -80 }}
        transition={{ type: "timing", duration: "300" }}
        style={{
          width: "100%",
          height: 80,
          backgroundColor: "#fff",
          position: "absolute",
          top: 0,
          elevation: 6,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity style={{ padding: 20, marginTop: 10 }}>
          <AntDesign
            name="arrowleft"
            size={35}
            color="black"
            onPress={() => navigation.navigate("Home")}
          />
        </TouchableOpacity>
        <MotiView
          from={{ translateX: -60 }}
          animate={{ translateX: yValue > 380 ? 0 : -50 }}
          transition={{ type: "timing", duration: "300" }}
          style={{ marginTop: 10 }}
        >
          <Text style={{ marginTop: 10, fontSize: 24, fontFamily: "stolzl" }}>
            {title}
          </Text>
        </MotiView>
      </MotiView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  PostImage: {
    width: "100%",
    height: 300,
  },
  PostText: {
    padding: 20,
    fontSize: 18,
    bottom: 20,
    fontFamily: 'stolzl_light',
  },
  PostTitle: {
    alignSelf: 'center',
    fontSize: 30,
    fontFamily: 'stolzl',
    padding: 10
  },
  PostDescription: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'stolzl',
    alignSelf: "flex-start",
    position: "absolute",
    padding: 20,
    bottom: 0,
  },
});
