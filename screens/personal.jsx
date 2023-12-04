import React, { useContext, useEffect, useState } from "react";
import {
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  ScrollView
} from "react-native";
import { Octicons, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { FIREBASE_AUTH } from "../firebase.config";
import themeContext from "../components/themeContext";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

export default function Personal({ navigation }) {
  const theme = useContext(themeContext);
  const [userData, setUserData] = useState(getAuth().currentUser);
  const [name, setNewName]= useState(userData.displayName);
  const [photo, setNewPhoto]= useState(userData.photoURL);
  const { email, uid, metadata, photoURL } = userData;
  console.log(userData.metadata.createdAt);
  const defaultPictureURL = "https://firebasestorage.googleapis.com/v0/b/fir-kitchen-39a69.appspot.com/o/Photos%2F2519237903.jpg?alt=media&token=33c4fac3-eda1-4fe3-9929-ad2b50d9a046";
  
  useFocusEffect(
    React.useCallback(() => {
      setNewName(userData.displayName);
      setNewPhoto(userData.photoURL);
    })
  );

  const getTime = (unix) => {
    const date = new Date(parseInt(unix));
    return date.toLocaleString();
  }

  useEffect(() => {
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
  })

  

  return (
    <View style={[styles.page, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView 
        contentContainerStyle={{flex: 1}} >
        <View
            style={{
              flexDirection: "row",
              justifyContent: 'space-between',
              alignItems: "flex-start",
              marginTop: 25,
            }}
          >
            <TouchableOpacity
              style={{ alignItems: "flex-start", margin: 16 }}
              onPress={navigation.openDrawer}
            >
              <SimpleLineIcons name="menu" size={24} color={theme.textColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: "flex-start", margin: 16 }}
              onPress={() => navigation.navigate("ChangePersonal")}
            >
              <Octicons name="paintbrush" size={24} color={theme.textColor} />
            </TouchableOpacity>
        </View>
        <View style={styles.mainBlock}>
          {console.log('here1')}
          <Image style={styles.image} source={{ uri: (photo === null ? defaultPictureURL : photo)}}></Image>
          <Text style={[styles.mainText, {color: theme.textColor}]}>{name === null ? "username" : name}</Text>
          <Text style={[styles.descText, {color: theme.textColor}]}>{email}</Text>
          <Text style={[styles.descText, {color: theme.textColor}]}>{uid}</Text>
          <Text style={[styles.descText, {color: theme.textColor}]}>created: {getTime(metadata.createdAt)}</Text>
        </View>
        <View
          style={{ alignItems: "center", flex: 1, justifyContent: "flex-end" }}
        >
          <TouchableOpacity
            style={styles.extiButton}
            onPress={() => {
              FIREBASE_AUTH.signOut();
            }}
          >
            <Ionicons name="exit-outline" size={28} color={"white"} />
            <Text style={styles.buttonText}> Выход </Text>
          </TouchableOpacity>
        </View>
      
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainBlock: {
    alignItems: 'center',
  },
  mainText: {
    fontSize: 16,
    fontFamily: 'stolzl',
    marginVertical: 5
  },
  descText: {
    fontSize: 14,
    fontFamily: 'stolzl_light',
    marginVertical: 5
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 999,
  },
  extiButton: {
    flexDirection: "row",
    backgroundColor: "#83E144",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 40,
    marginBottom: 30,
    borderRadius: 10
  },
  buttonText: {
    fontFamily: "stolzl", 
    color: "white",
    fontSize: 16 
  },
});
