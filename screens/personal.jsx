import React, { useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Button,
} from "react-native";
import { Octicons, Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../firebase.config";
import themeContext from "../components/themeContext";

export default function Settings({ navigation }) {
  const theme = useContext(themeContext);
  return (
    <View style={[styles.page, { backgroundColor: theme.backgroundColor }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ alignItems: "flex-start", margin: 16, marginTop: 25 }}
          onPress={navigation.openDrawer}
        >
          <Octicons name="three-bars" size={28} color={theme.textColor} />
        </TouchableOpacity>
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
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
