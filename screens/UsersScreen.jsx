import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
  TextInput,
} from "react-native";
import { Octicons, Ionicons } from "@expo/vector-icons";
import themeContext from "../components/themeContext";
import { Loading } from "../components/loading";
import { FlatList } from "react-native-gesture-handler";
import { listAllUsers, CheckUserSAdmin } from "../components/authFunctions";
import { getAuth } from "firebase/auth";
import { User } from "../components/user";

export default function UsersScreen({ navigation }) {
  const [ifSAdmin, setIfSAdmin] = useState(false);
  const currentUser = getAuth().currentUser;
	CheckUserSAdmin(currentUser, setIfSAdmin);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([])
  const [filterUsers, setFilterUsers] = useState([])
  const theme = useContext(themeContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredKeys, setFilteredKeys] = useState([]);

  const contains = (user, query) => {
    const lowerCaseTitle = user.email.toLowerCase();
    return lowerCaseTitle.includes(query);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formatedQuery = query.toLowerCase();
		const filteredData = filterUsers.filter((item) =>
			contains(item, formatedQuery)
		);
    setUsers(filteredData);
  };

  const FetchPosts = () => {
    setUsers([]);
    setFilterUsers([]);
    listAllUsers(setUsers);
    listAllUsers(setFilterUsers);
  };

  React.useEffect(FetchPosts, []);

  if (filterUsers.length === 0) {
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
            style={{ alignItems: "flex-start", padding: 16 }}
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
              placeholder="Search by mail       "
              placeholderTextColor={theme.searchPlaceholderColor}
              clearButtonMode="always"
              autoCapitalize="none"
              style={{ fontFamily: "stolzl", color: theme.textColor }}
              value={searchQuery}
              onChangeText={(query) => handleSearch(query)}
            />
          </View>
        </View>
        <FlatList
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={FetchPosts} />
          }
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={currentUser === null ? null : <User item={currentUser} currentUID={currentUser.uid}/>}
          data={users}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("CurrUser", { user: item, ifSAdmin: ifSAdmin })}>
              {currentUser === null ? 
                <User item={item} currentUID={null}/> 
              : currentUser.uid !== item.uid ? <User item={item} currentUID={currentUser.uid}/> : null }
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
    flexDirection: "column",
  },
  search: {
    width: "80%",
    borderWidth: 1,
    marginEnd: 20,
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
