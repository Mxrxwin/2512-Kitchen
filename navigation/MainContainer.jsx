import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";

import CustomDrawer from "./CustomDrawer";

import MainScreen from "../screens/mainScreen";
import Account from "../screens/account";
import Settings from "../screens/settings";
import { FullPostScreen } from "../screens/FullPost";

import { useEffect, useState } from "react";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const loadFonts = async () => {
  await Font.loadAsync({
    stolzl: require("../assets/fonts/stolzl_regular.otf"),
  });
};

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FullPost"
        component={FullPostScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MyDrawer() {
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    const loadFontAsync = async () => {
      await loadFonts();
      setFontLoaded(true);
    };

    loadFontAsync();
  }, []);

  if (!fontLoaded) {
    return null; // Ждем загрузки шрифта, чтобы избежать ошибок
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "#83E144",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: {
          marginLeft: -20,
          fontFamily: "stolzl",
        },
      }}
    >
      <Drawer.Screen
        name="Главная страница"
        component={MyStack}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Профиль"
        component={Account}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Настройки"
        component={Settings}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default MyDrawer;
