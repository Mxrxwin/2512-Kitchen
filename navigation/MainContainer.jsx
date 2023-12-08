import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";

import CustomDrawer from "./CustomDrawer";
import themeContext from "../components/themeContext";

import MainScreen from "../screens/mainScreen";
import Account from "../screens/account";
import FullPostScreen  from "../screens/FullPost";
import Personal from "../screens/personal";
import ChangePersonal from "../screens/ChangePersonal";
import MenuScreen from "../screens/menuScreen";
import StatisticScreen from "../screens/statisticScreen";
import AddPost from "../screens/AddPost";
import ChangePost from "../screens/ChangePost";
import UsersScreen from "../screens/UsersScreen";
import UnselfPersonal from "../screens/unselfPersonal";

import { useEffect, useState, useContext } from "react";
import userContext from "../components/userContext";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const InsideLayoutLogin = createStackNavigator();
const InsidePersonalLayout = createStackNavigator();

const loadFonts = async () => {
  await Font.loadAsync({
    stolzl: require("../assets/fonts/stolzl_regular.otf"),
    stolzl_light: require("../assets/fonts/stolzl_light.otf")
  });
};

function InsideStackPersonal() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Personal"
        component={Personal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePersonal"
        component={ChangePersonal}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function InsideStackLogin() {
  const user = useContext(userContext);
  return (
    <InsideLayoutLogin.Navigator>
      {user 
      ? <InsideLayoutLogin.Screen name="LogedIn" component={InsideStackPersonal} options={{headerShown: false}}/> 
      : <InsideLayoutLogin.Screen name="LogIn" component={Account} options={{headerShown: false}}/>}
    </InsideLayoutLogin.Navigator>
  );
}

function InsidePersonalLayoutStack() {
  return (
    <InsidePersonalLayout.Navigator>
      <InsidePersonalLayout.Screen name="AllUsers" component={UsersScreen} options={{headerShown: false}}/> 
      <InsidePersonalLayout.Screen name="CurrUser" component={UnselfPersonal} options={{headerShown: false}}/>
    </InsidePersonalLayout.Navigator>
  );
}

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
      <Stack.Screen
        name="AddPost"
        component={AddPost}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePost"
        component={ChangePost}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CurrUser"
        component={UnselfPersonal}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MyDrawer() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const theme = useContext(themeContext);

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
      drawerContent={(props) => <CustomDrawer {...props} navigation={props.navigation}/>}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "#83E144",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: theme.textColor,
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
        component={InsideStackLogin}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Меню"
        component={MenuScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Статистика"
        component={StatisticScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="md-stats-chart-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Пользователи"
        component={InsidePersonalLayoutStack}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
        }}
      /> 
    </Drawer.Navigator>
  );
}

export default MyDrawer;
