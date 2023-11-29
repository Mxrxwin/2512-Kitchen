import React, { useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  BackHandler 
} from "react-native";
import { Loading } from "../components/loading";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useDynamicAnimation } from "moti";
import themeContext from "../components/themeContext";
import { PictureScroll } from "../components/picture";
import { FetchDish, FetchImages } from "../components/photoUploadFunc";
import TopAnimatedHeader from "../components/topAnimHeader";
import userContext from "../components/userContext";
import { CheckUserAdmin } from "../components/authFunctions";

export default FullPostScreen = ({ route, navigation }) => {
  const [yValue, setYValue] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [CPFCP, setCPFCP] = React.useState([]);
  const [ingredients, setIngredients] = React.useState([]);
  const { id } = route.params;
  const theme = useContext(themeContext);
	const user = useContext(userContext);
	const [ifUserAdmin, setIfUserAdmin] = React.useState(false);
  
  React.useEffect(() => {
    if (user !== null) {
			CheckUserAdmin(user, setIfUserAdmin);
		} else {
      setIfUserAdmin(false);
    }
  }, [user])

  
  const animation = useDynamicAnimation(() => {
    return {
      width: "100%",
      height: 300,
    };
  });


    React.useEffect(() => {
      navigation.setOptions({
        id
      });
      FetchData(id);

      let hasNavigated;
      const handleBackButton = () => {
        if (!hasNavigated) {
          navigation.navigate("Home");
          hasNavigated = true;
          return true;
        }
        return false;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      return () => {
        backHandler.remove(); 
      };
    }, [])

    async function FetchData(id) {
      const data = await FetchDish(id);
      setImages(await FetchImages(id));
      setData(data[0]);
      setCPFCP(data[0].CPFCP);
      setIngredients(data[0].Ingredients);
    }


    if (ingredients.length === 0) {
      return <Loading />;
    }

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
          <View style={{zIndex: 2 , width: '20%'}}>

            <TouchableOpacity style={{ padding: 20}}>
              <AntDesign
                name="arrowleft"
                size={35}
                color="white"
                onPress={() => navigation.navigate("Home")}
              />
            </TouchableOpacity>
          </View>
          
          <View style={{ position: "absolute", zIndex: 1}}>
            <PictureScroll 
              pictures={images} deletePosibitity={false} changePosibility={ifUserAdmin} navigation={navigation} dishId={id}

            />
          </View>

          <View style={{ width: "100%", height: 300 }}></View>

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
              {ingredients.map((item, index) => (
                <View key={index}>
                  <Text style={[styles.Ingredients, {color: theme.textColor}]}>
                    {item}

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
        <TopAnimatedHeader navigation={navigation} yValue={yValue} title={data.title}/>
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
