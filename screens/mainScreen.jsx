import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  RefreshControl
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";
import { Post } from "../components/post";

export default function MainScreen({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [items, setItems] = React.useState([]);


  const FetchPosts = () => {
    setIsLoading(true);
    axios
    .get('https://6515c9e609e3260018c924d0.mockapi.io/Article')
    .then(({ data }) => {
      setItems(data);
    })
    .catch(err => {
      console.log(err);
      alert('Ошибка при получении статей');
    }).finally(() => {
      setIsLoading(false);
    });
  }

React.useEffect( FetchPosts, []);

  if (isLoading) {
    return <View 
      style={{
        flex: 1,
        justifyContent :'center',
        alignItems: 'center'
      }}>
      <ActivityIndicator size="large"/>
      <Text style={{ marginTop:15, fontWeight: 300}}>Загрузка</Text>
    </View>
  }

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ alignItems: "flex-start", margin: 16, marginTop: 25 }}
          onPress={navigation.openDrawer}
        >
          <FontAwesome name="bars" size={28} color="black" />
        </TouchableOpacity>
        <FlatList 
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={FetchPosts}/>}
          data={items}
          renderItem={({item}) => ( 
            <TouchableOpacity onPress={() => navigation.navigate('FullPost', {id: item.id, title: item.title, createdAt: item.createdAt})}>
              <Post title={item.title} imageUrl={item.imageUrl} createdAt={item.createdAt}/>
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
