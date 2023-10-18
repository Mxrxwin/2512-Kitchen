import React, {useState, useContext} from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../components/themeContext";


export default CustomDrawer = (props) => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useContext(themeContext);

  const SwitchTheme = () => {
    setDarkMode(!darkMode);
    EventRegister.emit("ChangeTheme", !darkMode);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor}}>
      <DrawerContentScrollView {...props}>
        <ImageBackground
          source={darkMode ? require("../assets/images/dark-menu-bg.jpg") : require("../assets/images/menu-bg.jpg")}
          style={{ padding: 80, width: 340, height: 175 }}
        />
        <View style={{ flex: 1, paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.footTextPanel}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", width: '90%' }}
        >
          <Ionicons name="share-social-outline" size={24} color={theme.textColor} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "stolzl",
              color: theme.textColor,
              marginStart: 10,
            }}
          >
            Contact Us
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => SwitchTheme(!darkMode)}>
          <Ionicons name= {darkMode ? 'sunny-outline' : "moon-outline"} size={30} color={theme.textColor} />
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
    flexDirection: "row",
    padding: 20,
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
});
