import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  RefreshControl,
  FlatList
} from "react-native";
import { Octicons , Ionicons, FontAwesome  } from "@expo/vector-icons";
import axios from "axios";
import { TextInput } from "react-native-gesture-handler";
import { Week } from "../components/week";
import themeContext from "../components/themeContext";
import { Loading } from "../components/loading";

export default function MainScreen({ navigation }) {
  const API_DATA = "https://6515c9e609e3260018c924d0.mockapi.io/menu";
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState(false);
  const theme = useContext(themeContext);

  const FetchPosts = () => {
    setIsLoading(true);
    axios  
      .get(API_DATA)
      .then(({ data }) => {
        setItems(data);
        setFilteredItems(data);
      })
      .catch((err) => {
        console.log(err);
        alert("Ошибка при получении статей");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    sortType ? items.sort((a, b) => a.id - b.id) : items.sort((a, b) => b.id - a.id);
    
  }, [items, sortType])

  const contains = ({ title }, query) => {
    const lowerCaseTitle = title.toLowerCase();
    return lowerCaseTitle.includes(query);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formatedQuery = query.toLowerCase();
    const filteredData = filteredItems.filter((item) =>
      contains(item, formatedQuery)
    );
    setItems(filteredData);
  };

  React.useEffect(FetchPosts, []);

  if (isLoading) {
    return (
      <Loading/>
    );
  }


  return (
    <View style={[styles.page, {backgroundColor: theme.backgroundColor}]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 25 }}
        >
          <TouchableOpacity
            style={{ alignItems: "flex-start", margin: 16 }}
            onPress={navigation.openDrawer}
          >
            <Octicons name="three-bars" size={28} color={theme.textColor} />
          </TouchableOpacity>
          <View style={[styles.search, {backgroundColor: theme.searchColor}]}>
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
              style={{ fontFamily: "stolzl",color: theme.textColor}}
              value={searchQuery}
              onChangeText={(query) => handleSearch(query)}
            />
          </View>
          <TouchableOpacity
            style={{ alignItems: "flex-start", margin: 16 }}
            onPress={() => (setSortType(!sortType))}
          >
            <FontAwesome name={sortType ? "sort-amount-asc" : "sort-amount-desc"} size={24} color={theme.textColor} />
          </TouchableOpacity>
        </View>

        <FlatList
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={FetchPosts} />
          }
          showsVerticalScrollIndicator={false}
          data={items}
          renderItem={({ item }) => (
              <Week
                title={item.title}
                dishes={item.dishes}
                dateStart={item.dateStart}
                dateEnd={item.dateEnd}
                id={item.id}
              />
          )}/>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
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
  postImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginRight: 20,
  },
  postText: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "stolzl",
  },
  postDescription: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "200",
    alignItems: "center",
    position: "absolute",
    padding: 20,
    bottom: 0,
  },
});
