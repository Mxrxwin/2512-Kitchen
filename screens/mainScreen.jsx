import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  RefreshControl,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";
import { Post } from "../components/post";
import filter from "lodash.filter";

const API_DATA = "https://6515c9e609e3260018c924d0.mockapi.io/Article";

export default function MainScreen({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [filteredItems, setFilteredItems] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

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

  const contains = ({ title }, query) => {
    const lowerCaseTitle = title.toLowerCase();
    return lowerCaseTitle.includes(query);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formatedQuery = query.toLowerCase();
    const filteredData = filteredItems.filter((item) => contains(item, formatedQuery));
    setItems(filteredData);
  };

  React.useEffect(FetchPosts, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 15, fontWeight: 300 }}>Загрузка</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 25 }}
        >
          <TouchableOpacity
            style={{ alignItems: "flex-start", margin: 16 }}
            onPress={navigation.openDrawer}
          >
            <FontAwesome name="bars" size={28} color="black" />
          </TouchableOpacity>
          <View style={styles.search}>
            <Ionicons
              style={{ padding: 5 }}
              name="search"
              size={20}
              color="#3333"
            />
            <TextInput
              placeholder="Search   "
              clearButtonMode="always"
              autoCapitalize="none"
              style={{ fontFamily: "stolzl" }}
              value={searchQuery}
              onChangeText={(query) => handleSearch(query)}
            />
          </View>
        </View>

        <FlatList
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={FetchPosts} />
          }
          data={items}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("FullPost", {
                  id: item.id,
                  title: item.title,
                  createdAt: item.createdAt,
                })
              }
            >
              <Post
                title={item.title}
                imageUrl={item.imageUrl}
                createdAt={item.createdAt}
              />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
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
