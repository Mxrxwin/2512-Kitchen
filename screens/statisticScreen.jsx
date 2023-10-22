import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  RefreshControl
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import axios from "axios";
import themeContext from "../components/themeContext";
import { Loading } from "../components/loading";
import { FlatList } from "react-native-gesture-handler";

export default function StatisticScreen({ navigation }) {
  const API_DATA = "https://6515c9e609e3260018c924d0.mockapi.io/menu";
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);
  const [statistics, setStatistics] = useState({});
  const [keys, setKeys] = useState([]);

  const FetchDishes = (dishes) => {
    setStatistics((prevStatistics) => {
      const updatedStatistics = { ...prevStatistics };

      dishes.forEach((element) => {
        if (updatedStatistics[element]) {
          updatedStatistics[element] += 1;
        } else {
          updatedStatistics[element] = 1;
        }
      });
      setStatistics(updatedStatistics);
    });
  };

  const FetchPosts = () => {
    setIsLoading(true);
    axios
      .get(API_DATA)
      .then(({ data }) => {
        setStatistics({});
        data.forEach((element) => {
          FetchDishes(element.dishes);
        });
      })
      .catch((err) => {
        console.log(err);
        alert("Ошибка при получении статей");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(FetchPosts, []);

  React.useEffect(() => {
    setKeys(
      Object.keys(statistics).sort((a, b) => statistics[b] - statistics[a])
    );
  }, [statistics]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={[styles.page, { backgroundColor: theme.backgroundColor }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 25 }}
        >
          <TouchableOpacity
            style={{ alignItems: "flex-start", margin: 16 }}
            onPress={navigation.openDrawer}
          >
            <Octicons name="three-bars" size={28} color={theme.textColor} />
          </TouchableOpacity>
        </View>
        <FlatList
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={FetchPosts} />
            }
            showsVerticalScrollIndicator={false}
            data={keys}
            renderItem={({item}) => (
              <Text style={styles.postText} key={item}>
                {item}: {statistics[item]}
              </Text>
          )}/>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column'
  },
  search: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#3333",
    borderRadius: 20,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "stolzl",
    padding: 10
  }
});
