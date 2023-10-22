import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  RefreshControl,
  TextInput,
} from "react-native";
import { Octicons, FontAwesome, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import themeContext from "../components/themeContext";
import { Loading } from "../components/loading";
import { FlatList } from "react-native-gesture-handler";

export default function StatisticScreen({ navigation }) {
  const API_DATA = "https://6515c9e609e3260018c924d0.mockapi.io/menu";
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);
  const [statistics, setStatistics] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [keys, setKeys] = useState([]);
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [sortType, setSortType] = useState(0);
  const valuesToExclude = ["Данные неизвестны", "Нихуя", "Отсутствовали"];
  const sortIcons = [
    "sort-amount-desc",
    "sort-amount-asc",
    "sort-alpha-asc",
    "sort-alpha-desc",
  ];

  const contains = (title, query) => {
    const lowerCaseTitle = title.toLowerCase();
    return lowerCaseTitle.includes(query);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formatedQuery = query.toLowerCase();
    const filteredData = filteredKeys.filter((item) =>
      contains(item, formatedQuery)
    );
    switch (sortType) {
      case 0:
        setKeys(filteredData.sort((a, b) => statistics[b] - statistics[a]));
        break;
      case 1:
        setKeys(filteredData.sort((a, b) => statistics[a] - statistics[b]));
        break;
      case 2:
        setKeys(filteredData.sort((a, b) => a.localeCompare(b)));
        break;
      case 3:
        setKeys(filteredData.sort((a, b) => b.localeCompare(a)));
        break;
      default:
        break;
    }
  };

  const FetchDishes = (dishes) => {
    setStatistics((prevStatistics) => {
      const updatedStatistics = { ...prevStatistics };

      dishes.forEach((element) => {
        if (!valuesToExclude.includes(element)) {
          if (updatedStatistics[element]) {
            updatedStatistics[element] += 1;
          } else {
            updatedStatistics[element] = 1;
          }
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

  const setSorting = () => {
    switch (sortType) {
      case 0:
        setKeys(
          Object.keys(statistics).sort((a, b) => statistics[b] - statistics[a])
        );
        break;
      case 1:
        setKeys(
          Object.keys(statistics).sort((a, b) => statistics[a] - statistics[b])
        );
        break;
      case 2:
        setKeys(Object.keys(statistics).sort((a, b) => a.localeCompare(b)));
        break;
      case 3:
        setKeys(Object.keys(statistics).sort((a, b) => b.localeCompare(a)));
        break;
      default:
        break;
    }
    setFilteredKeys(Object.keys(statistics));
  };

  React.useEffect(() => {
    setSorting();
  }, [statistics, sortType]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={[styles.page, { backgroundColor: theme.backgroundColor }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "flex-start", margin: 16 }}
            onPress={navigation.openDrawer}
          >
            <Octicons name="three-bars" size={28} color={theme.textColor} />
          </TouchableOpacity>
          <View style={[styles.search, { backgroundColor: theme.searchColor }]}>
            <Ionicons
              style={{ padding: 5 }}
              name="search"
              size={20}
              color={theme.searchPlaceholderColor}
            />
            <TextInput
              placeholder="Search   "
              placeholderTextColor={theme.searchPlaceholderColor}
              clearButtonMode="always"
              autoCapitalize="none"
              style={{ fontFamily: "stolzl", color: theme.textColor }}
              value={searchQuery}
              onChangeText={(query) => handleSearch(query)}
            />
          </View>
          <TouchableOpacity
            style={{ alignItems: "flex-start", margin: 16 }}
            onPress={() => setSortType(sortType < 3 ? sortType + 1 : 0)}
          >
            <FontAwesome
              name={sortIcons[sortType]}
              size={24}
              color={theme.textColor}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={FetchPosts} />
          }
          showsVerticalScrollIndicator={false}
          data={keys}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Octicons name="dot-fill" size={24} color="#83E144" />
              <Text
                style={[styles.postText, { color: theme.textColor }]}
                key={item}
              >
                {item}: {statistics[item]}
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: "column",
  },
  search: {
    width: "75%",
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
    padding: 15,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#3333",
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
});
