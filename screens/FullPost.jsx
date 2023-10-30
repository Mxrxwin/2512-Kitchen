import React, { useContext } from "react";
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
import themeContext from "../components/themeContext";
import { PictureScroll } from "../components/picture";

export default FullPostScreen = ({ route, navigation }) => {
  const [yValue, setYValue] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [CPFCP, setCPFCP] = React.useState([]);
  const [ingredients, setIngredients] = React.useState({});
  const [ingredientsKey, setIngredientsKey] = React.useState([]);
  const { id, title } = route.params;
  const theme = useContext(themeContext);
  const routeToPictures = "../assets/images/catalog/";

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
        setCPFCP(data.CPFCP);
        setIngredients(data.Ingredients);
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

  React.useEffect(() => {
    setIngredientsKey(Object.keys(ingredients));
  }, [ingredients]);

  return (
    <View style={{ flex: 1, width: "100%", height: 450 }}>
      <View style={{ flex: 1, zIndex: 2 }}>
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
          <View style={{zIndex: 2}}>
            <TouchableOpacity style={{ padding: 20}}>
              <AntDesign
                name="arrowleft"
                size={35}
                color="white"
                onPress={() => navigation.navigate("Home")}
              />
            </TouchableOpacity>
          </View>
          
          <View style={{ position: "absolute", zIndex: 1 }}>
            <PictureScroll
              pictures={[
                ["https://i.ibb.co/FgGG4Hy/photo-2022-11-15-22-14-05.jpg"],
                ["https://s8d5.turboimg.net/t1/95061123_2512.jpg"],
              ]}
            />
          </View>

          <MotiView style={{ width: "100%", height: 300 }}></MotiView>
          <View
            style={{
              backgroundColor: theme.backgroundColor,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              zIndex: 2,
            }}
          >
            <Text style={[styles.PostTitle, { color: theme.textColor }]}>
              {data.title}
            </Text>
            <Text style={[styles.PostText, { color: theme.textColor }]}>
              {data.recipe}
              {data.recipe}
            </Text>
            <View style={{ marginBottom: 30 }}>
              <Text
                style={[styles.IngredientsTitle, { color: theme.textColor }]}
              >
                Ингредиенты:{" "}
              </Text>
              {ingredientsKey.map((item, index) => (
                <View key={index}>
                  <Text style={styles.Ingredients}>
                    {item} : {ingredients[item]}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.PostPropsContainer}>
              {CPFCP.map((item, index) => (
                <View style={styles.PostProps} key={index}>
                  <Text
                    style={[styles.PostPropsTitle, { color: theme.textColor }]}
                  >
                    {"КБЖУ₽"[index]}
                  </Text>
                  <Text
                    style={[styles.PostPropsText, { color: theme.textColor }]}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <MotiView
          from={{ translateY: -80 }}
          animate={{ translateY: yValue > 380 ? 0 : -80 }}
          transition={{ type: "timing", duration: "300" }}
          style={{
            width: "100%",
            height: 80,
            position: "absolute",
            top: 0,
            elevation: 6,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.headerColor,
          }}
        >
          <TouchableOpacity style={{ padding: 20, marginTop: 10 }}>
            <AntDesign
              name="arrowleft"
              size={35}
              color={theme.textColor}
              onPress={() => navigation.navigate("Home")}
            />
          </TouchableOpacity>
          <MotiView
            from={{ translateX: -60 }}
            animate={{ translateX: yValue > 380 ? 0 : -50 }}
            transition={{ type: "timing", duration: "300" }}
            style={{ marginTop: 10 }}
          >
            <Text
              style={{
                marginTop: 10,
                fontSize: 24,
                fontFamily: "stolzl",
                color: theme.textColor,
              }}
            >
              {title}
            </Text>
          </MotiView>
        </MotiView>
      </View>
    </View>
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
    fontFamily: "stolzl_light",
  },
  PostPropsContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    marginBottom: 40,
  },
  PostProps: {
    padding: 10,
    bottom: 20,
    alignItems: "center",
  },
  PostPropsText: {
    fontFamily: "stolzl_light",
    fontSize: 22,
  },
  PostPropsTitle: {
    fontFamily: "stolzl",
    fontSize: 26,
  },
  PostTitle: {
    alignSelf: "center",
    fontSize: 30,
    fontFamily: "stolzl",
    padding: 10,
  },
  IngredientsTitle: {
    fontSize: 26,
    fontFamily: "stolzl",
    padding: 20,
  },
  Ingredients: {
    fontSize: 18,
    fontFamily: "stolzl_light",
    marginStart: 20,
    marginBottom: 10,
  },
});
