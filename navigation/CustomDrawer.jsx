import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

export default CustomDrawer = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <ImageBackground
          source={require("../assets/images/menu-bg.jpg")}
          style={{ padding: 80, width: 340, height: 175 }}
        />
        <View style={{ flex: 1, paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.footTextPanel}>
        <TouchableOpacity style={{flexDirection: "row",alignItems: "center",}}>
          <Ionicons name="share-social-outline" size={24} color="#333" />
          <Text style={{ fontSize: 14, fontFamily: "stolzl", color: "#333", marginStart: 10}}>
            Contact Us
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: "#83E144",
  },
  footTextPanel: {
    padding: 20,
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
});
